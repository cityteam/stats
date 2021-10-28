// Detail --------------------------------------------------------------------

// Detailed statistic recorded on a certain Date, for a specifid Category
// (and therefore Facility).

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import {toCategory} from "../util/ToModelTypes";

// Public Objects ------------------------------------------------------------

class Detail {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;

        this.categoryId = data.categoryId ? data.categoryId : -1;
        this.date = data.date ? data.date : new Date();
        this.notes = data.notes ? data.notes : null;
        this.value = data.value ? data.value : 0;

        this.category = data.category ? toCategory(data.category) : undefined;

    }

    id!: number;

    categoryId!: number;
    date!: Date;
    notes?: string;
    value!: number;

    category?: Category;

}

export default Detail;
