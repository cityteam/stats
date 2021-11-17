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
import Summary from "../models/Summary";
import {toDateObject} from "../util/Dates";

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
        section.categories.forEach(category => {
            summary.values[category.id] = null;
        })

        // Retrieve and pass on any previously recorded values
        section.categories.forEach(async category => {
            const details = await DetailServices.all(category.id, {
                date: date,
            });
            details.forEach(detail => {
                summary.values[category.id] = (detail.value === 0) ? null : detail.value;
            });
        });

        // Return the completed summary
        return summary;

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
     * @param summary                   Summary containing data to be recorded
     */
    public async write(facilityId: number, sectionId: number, date: string, summary: Summary): Promise<void> {

        // Retrieve the specified Section and related Categories
        const section = await SectionServices.find(facilityId, sectionId, {
            withCategories: "",
        });

        // Insert or update a Detail for each presented Category ID that is valid
        for (const [key, value] of Object.entries(summary.values)) {
            const categoryId = Number(key);
            if (this.included(categoryId, section.categories)) {
                const details = await DetailServices.all(categoryId, {
                    categoryId: categoryId,
                    date: summary.date
                });
                if (details.length > 0) {
                    await DetailServices.update(categoryId, details[0].id, {
                        // @ts-ignore
                        value: value ? value : 0,
                    });
                } else {
                    await DetailServices.insert(categoryId, {
                        categoryId: categoryId,
                        date: toDateObject(summary.date),
                        value: value ? value : 0,
                    })
                }
            }
        }

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
