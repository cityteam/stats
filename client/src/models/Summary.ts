// Summary -------------------------------------------------------------------

// Summary of the detail values for all the Categories associated with a
// particular Section, on a particular date.  These are combined into a
// dynamically keyed "values" object, where the keys are the categoryId of
// that particular statistic, and the value is the statistic value for
// that categoryId, on that date.

// This is a synthetic data transfer object, not a Sequelize model.
// However, the combination of sectionId and date can be treated
// as a unique key.  Dates are recorded as YYYY-MM-DD strings.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {todayDate} from "../util/Dates";

// Public Objects ------------------------------------------------------------

export const SUMMARIES_BASE = "/summaries";

// Map of categoryId to value for a particular sectionId and date.
export type Values = {
    [categoryId: number]: number | null;
}

class Summary {

    constructor (data: any = {}) {
        this.date = data.date ? data.date : todayDate();
        this.sectionId = data.sectionId ? data.sectionId : -1;
        this.values = data.values ? data.values : {};
    }

    // Date for which these values have been accumulated (only relevant on read)
    date!: string;

    // Section ID for which these values have been accumulated (only relevant on read)
    sectionId!: number;

    // Map of categoryId to value for a sectionId and date (relevant on read and write)
    values!: Values;

}

export default Summary;
