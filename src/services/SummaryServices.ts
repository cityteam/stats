// SummaryServices -----------------------------------------------------------

// Services implementation for Summary data transfer objects.  These are
// data transfer objects, so the available methods do not correspond to
// standard CRUD operations.

// External Modules ----------------------------------------------------------

import {Dates} from "@craigmcc/shared-utils";

// Internal Modules ----------------------------------------------------------

import SectionServices from "./SectionServices";
import Category from "../models/Category";
import Daily from "../models/Daily";
import Section from "../models/Section";
import Summary from "../models/Summary";
import {FindOptions, IncludeOptions, Op, WhereOptions} from "sequelize";
import {NotFound} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

class SummaryServices {

    /**
     * Retrieve daily Summary rows that match the requested criteria.
     *
     * @param facilityId                Facility ID that owns these statistics
     * @param dateFrom                  Earliest date for which to return results
     * @param dateTo                    Latest date for which to return results
     * @param active                    Return only active Sections and Categories? [false]
     * @param sectionIds                Comma-delimited list of section IDs
     *                                  for which to return results [all sections]
     */
    public async dailies(facilityId: number, dateFrom: string, dateTo: string, active: boolean, sectionIds?: number[]): Promise<Summary[]> {

        // Retrieve the requested information
        const sections = await this.sections(facilityId, dateFrom, dateTo, active, sectionIds);

        // Convert the detailed information into Summaries
        const summaries: Summary[] = [];
        sections.forEach(section => {
            const categoriesMap = this.categoriesToMap(section.categories);
            section.dailies.forEach(daily => {
                const summary = this.dailyToSummary(daily.sectionId, daily.date, categoriesMap, daily);
                summaries.push(summary);
            })
        })

        // Sort and return the calculated Summaries
        return summaries.sort(function (a, b) {
            if (a.sectionId > b.sectionId) {
                return 1;
            } else if (a.sectionId < b.sectionId) {
                return -1;
            } else if (a.date > b.date) {
                return 1;
            } else if (a.date < b.date) {
                return -1;
            } else {
                return 0;
            }
        });

    }

    /**
     * Retrieve monthly Summary rows that match the requested criteria.  Dates in
     * the returned Summaries will arbitrarily be the first of that month
     *
     * @param facilityId                Facility ID that owns these statistics
     * @param dateFrom                  Earliest date for which to return results (should be BOM)
     * @param dateTo                    Latest date for which to return results (should be EOM)
     * @param active                    Return only active Sections and Categories? [false]
     * @param sectionIds                Comma-delimited list of section IDs
     *                                  for which to return results [all sections]
     */
    public async monthlies(facilityId: number, dateFrom: string, dateTo: string, active: boolean, sectionIds?: number[]): Promise<Summary[]> {

        // Retrieve the requested information
        const sections = await this.sections(facilityId, dateFrom, dateTo, active, sectionIds);

        // Merge the retrieved Dailies for each section into a single Summary per month
        const accumulateds: Map<string, Summary> = new Map(); // Key = sectionId|trimmedDate
        sections.forEach(section => {
            const categoriesMap = this.categoriesToMap(section.categories);
            section.dailies.forEach(daily => {
                // NOTE - somehow daily.date sometimes come in as a string
                let trimmedDate : string = "";
                if (typeof daily.date === "string") {
                    trimmedDate = `${(daily.date as string).substr(0, 7)}-01`;
                } else {
                    trimmedDate = Dates.fromObject(daily.date).substr(0, 7) + "-01";
                }
                const key = daily.sectionId + "|" + trimmedDate;
                let accumulated = accumulateds.get(key);
                if (!accumulated) {
                    accumulated = this.dailyToSummary(daily.sectionId, Dates.toObject(trimmedDate), categoriesMap, null);
                }
                // NOTE - increment values for each category
                for (let i = 0; i < daily.categoryIds.length; i++) {
                    const categoryId = daily.categoryIds[i];
                    let currentValue = accumulated.values[categoryId];
                    if (!currentValue) {
                        currentValue = 0;
                    }
                    if (daily.categoryValues[i]) {
                        // @ts-ignore
                        currentValue += Number(daily.categoryValues[i]);
                    }
                    accumulated.values[categoryId] = currentValue;
                }
                accumulateds.set(key, accumulated);
            })
        })

        // Sort and return the calculated Summaries
        const summaries = [...accumulateds.values()];
        return summaries.sort(function (a, b) {
            if (a.sectionId > b.sectionId) {
                return 1;
            } else if (a.sectionId < b.sectionId) {
                return -1;
            } else if (a.date > b.date) {
                return 1;
            } else if (a.date < b.date) {
                return -1;
            } else {
                return 0;
            }
        });

    }

    /**
     * Synthesize and return a Summary object for the specified parameters.
     * The returned "values" property will contain keys for all valid
     * Category IDs associated with this Section, along with any previously
     * recorded statistics for those Categories.  For any Category that has
     * never been recorded (for this date), a null value will be included.
     *
     * @param facilityId                Facility ID that owns this Section
     * @param sectionId                 Section ID for which to return data
     * @param date                      Date for which to return data
     */
    public async read(facilityId: number, sectionId: number, date: string): Promise<Summary> {

        // Retrieve the specified Section and related Categories
        const section = await SectionServices.find(facilityId, sectionId, {
            withCategories: "",
        });
        const categoriesMap = this.categoriesToMap(section.categories);

        // Read the corresponding Daily row (if there is one)
        const daily = await Daily.findOne({
            where: {
                date: date,
                sectionId: sectionId,
            }
        });

        // Convert to a Summary and return it
        return this.dailyToSummary(section.id, Dates.toObject(date), categoriesMap, daily);

    }

    /**
     * Insert or update the Daily object that records the specified information.
     *
     * @param facilityId                Facility ID that owns this Section
     * @param sectionId                 Section ID for which to store data
     * @param date                      Date for which to store data
     * @param summary                   Summary containing values to be recorded
     */
    public async write(facilityId: number, sectionId: number, date: string, summary: Summary): Promise<Summary> {

        // Retrieve the specified Section and related Categories
        const section = await SectionServices.find(facilityId, sectionId, {
            withCategories: "",
        });
        const categoriesMap = this.categoriesToMap(section.categories);

        // Read the corresponding Daily row (if there is one)
        let daily = await Daily.findOne({
            where: {
                date: date,
                sectionId: sectionId,
            }
        });

        // Insert a Daily (or replace the existing one) and return the recorded Summary
        const newDaily = this.summaryToDaily(sectionId, Dates.toObject(date), categoriesMap, summary);
        if (daily) {
            const results = await Daily.update(newDaily, {
//                logging: console.log,
                returning: true,
                where: {
                    date: daily.date,
                    sectionId: daily.sectionId,
                }
            });
            if (results[0] < 1) {
                throw new NotFound(
                    `daily: Missing update for date ${daily.date} and section ${daily.sectionId}`,
                    "SummaryServices.write"
                )
            }
            return this.dailyToSummary(daily.sectionId, daily.date, categoriesMap, results[1][0])
        } else {
            daily = await Daily.create(newDaily, {
//                logging: console.log,
            });
            return this.dailyToSummary(daily.sectionId, daily.date, categoriesMap, daily);
        }

    }

    // Private Methods -------------------------------------------------------

    /**
     * Return a Map of category ID to Category for the specified Categories
     *
     * @param categories[]              Categories to be mapped
     */
    private categoriesToMap(categories: Category[]): Map<number, Category> {
        const result = new Map<number, Category>();
        categories.forEach(category => {
            result.set(category.id, category);
        });
        return result;
    }

    /**
     * Convert the specified parameters into a Summary object.
     *
     * @param sectionId                 ID of the Section this information is for
     * @param date                      Date this information is for
     * @param categoriesMap             Map of category ID to Category
     * @param daily                     Daily being converted, or null if none
     */
    private dailyToSummary(sectionId: number, date: Date, categoriesMap: Map<number, Category>, daily: Daily | null): Summary {

        // NOTE - somehow date is coming in as a string sometimes
        const summary = new Summary({
            sectionId: sectionId,
            values: {},
        });
        if (typeof date === "string") {
            summary.date = date as string;
        } else {
            summary.date = Dates.fromObject(date);
        }

        if (daily) {
            for (let i = 0; i < daily.categoryIds.length; i++) {
                if (categoriesMap.has(daily.categoryIds[i])) {
                    summary.values[daily.categoryIds[i]] = daily.categoryValues[i];
                }
            }
        } else {
            for (const [key] of categoriesMap) {
                summary.values[key] = null;
            }
        }

        return summary;

    }

    /**
     * Return the requested Sections (with nested Categories and Details)
     * that match the specified criteria.
     *
     * @param facilityId                Facility ID that owns these statistics
     * @param dateFrom                  Earliest date for which to return results
     * @param dateTo                    Latest date for which to return results
     * @param active                    Return only active Sections and Categories? [false]
     * @param sectionIds                Comma-delimited list of section IDs
     *                                  for which to return results [all sections]
     */
    private async sections(facilityId: number, dateFrom: string, dateTo: string, active: boolean, sectionIds?: number[]): Promise<Section[]> {

        // Configure the criteria we will be using for this select
        const dailyIncludeOptions: IncludeOptions = {
            model: Daily,
            where: {
                date: { [Op.between]: [dateFrom, dateTo] },
            }
        }
        const categoryIncludeOptions: IncludeOptions = {
            model: Category,
        }
        if (active) {
            categoryIncludeOptions.where = {
                active: true,
            }
        }
        let sectionWhereOptions: WhereOptions = {
            facilityId: facilityId,
        }
        if (active) {
            sectionWhereOptions.active = true;
        }
        if (sectionIds) {
            sectionWhereOptions.id = { [Op.in]: sectionIds };
        }
        const sectionFindOptions: FindOptions = {
            include: [categoryIncludeOptions, dailyIncludeOptions],
            where: sectionWhereOptions,
        };

        // Perform the query to select the required information
        return Section.findAll(sectionFindOptions);

    }

    /**
     * Convert the specified parameters into a Daily object.
     *
     * @param summary                   Summary being converted
     * @param categoriesMap             Map of category ID to Category for valid Categories
     */
    private summaryToDaily(sectionId: number, date: Date, categoriesMap: Map<number, Category>, summary: Summary): Daily {
        // @ts-ignore
        const daily: Daily = {
            date: date,
            sectionId: sectionId,
            categoryIds: [],
            categoryValues: [],
        };
        for (const [key, value] of Object.entries(summary.values)) {
            const id = Number(key);
            if (categoriesMap.has(id)) {
                // @ts-ignore
                daily.categoryIds.push(id);
                // @ts-ignore
                daily.categoryValues.push(value);
            }
        }
        return daily;
    }

}

export default new SummaryServices();
