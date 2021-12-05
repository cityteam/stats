// SummaryServices -----------------------------------------------------------

// Services implementation for Summary data transfer objects.  These are
// data transfer objects, so the available methods do not correspond to
// standard CRUD operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import DetailServices from "./DetailServices";
import SectionServices from "./SectionServices";
import Category from "../models/Category";
import Detail from "../models/Detail";
import Section from "../models/Section";
import Summary from "../models/Summary";
import {toDateObject} from "../util/Dates";
import {FindOptions, IncludeOptions, Op, WhereOptions} from "sequelize";

// Public Objects ------------------------------------------------------------

class SummaryServices {

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

        // Seed a summary object with this information
        const summary = new Summary({
            date: date,
            sectionId: sectionId,
        });
        const categoryIds: number[] = [];
        section.categories.forEach(category => {
            categoryIds.push(category.id);
            summary.values[category.id] = null;
        })

        // Retrieve and pass on any previously recorded values
        const details = await Detail.findAll({
            where: {
                categoryId: { [Op.in]: categoryIds },
                date: date,
            }
        });
        details.forEach(detail => {
            summary.values[detail.categoryId]
                = detail.value === null ? null : Number(detail.value);
        });

        // Return the completed summary
        return summary;

    }

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

        // Identify the section IDs we will be restricting our search for (if any)
        // Perform the query to select the required information
        const detailIncludeOptions: IncludeOptions = {
            model: Detail,
            where: {
                date: { [Op.between]: [dateFrom, dateTo] },
            }
        }
        const categoryIncludeOptions: IncludeOptions = {
            include: [detailIncludeOptions],
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
            include: [categoryIncludeOptions],
            where: sectionWhereOptions,
        };
        const sections = await Section.findAll(sectionFindOptions);

        // Produce a Summary for each date that has Categories with Details
        const summaries: Map<string, Summary> = new Map(); // Key = sectionId|date
        sections.forEach(section => {
            section.categories.forEach(category => {
                category.details.forEach(detail => {
                    const key = `${section.id}|${detail.date}`;
                    const existing = summaries.get(key);
                    const summary = existing ? existing : new Summary({
                        date: detail.date,
                        sectionId: section.id,
                    });
                    if (!existing) {
                        summaries.set(key, summary);
                    }
                    if (detail.value || (detail.value === 0)) {
                        summary.values[detail.categoryId] = detail.value;
                    }
                });
            });
        });

        // Return the accumulated results
        const results: Summary[] = [];
        for (const [key, value] of summaries.entries()) {
            if (Object.keys(value.values).length > 0) {
                results.push(value);

            }
        }
        return results.sort(function (a, b) {
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
     * Insert Detail objects to reflect the specified values for referenced
     * Categories belonging to our Section, replacing any previously
     * recorded values for those Categories.  Only Category IDs that are
     * validly children of our Section will be recorded -- anything else
     * will be silently ignored.
     *
     * @param facilityId                Facility ID that owns this Section
     * @param sectionId                 Section ID for which to store data
     * @param date                      Date for which to store data
     * @param summary                   Summary containing values to be recorded
     *
     * @returns Summary reflecting what was recorded
     */
    public async write(facilityId: number, sectionId: number, date: string, summary: Summary): Promise<Summary> {

        // Retrieve the specified Section and related Categories
        const section = await SectionServices.find(facilityId, sectionId, {
            withCategories: "",
        });
        const result = new Summary({
            sectionId: sectionId,
            date: date,
        });

        // Insert or update a Detail for each presented Category ID that is valid
        for (const [key, value] of Object.entries(summary.values)) {
            const categoryId = Number(key);
            if (this.included(categoryId, section.categories)) {
                const details = await DetailServices.all(categoryId, {
                    categoryId: categoryId,
                    date: date
                });
                if (details.length > 0) {
                    await DetailServices.update(categoryId, details[0].id, {
                        // @ts-ignore
                        value: (value || (value === 0)) ? value : null,
                    });
                } else {
                    await DetailServices.insert(categoryId, {
                        categoryId: categoryId,
                        date: toDateObject(date),
                        value: (value || (value === 0)) ? value : undefined,
                    })
                }
                result.values[categoryId] = value;
            }
        }
        return result;

    }

    // Private Methods -------------------------------------------------------

    // Is the specified Category ID in this list of Categories?
    private included(categoryId: number, categories: Category[]): boolean {
        let found = false;
        categories.forEach(category => {
            if (categoryId === category.id) {
                found = true;
            }
        });
        return found;
    }

}




export default new SummaryServices();
