// Category ------------------------------------------------------------------

// Statistical category for statistics related to a particular Facility.

// Internal Modules ----------------------------------------------------------

import CategoryData from "./CategoryData";
import Detail from "./Detail";
import Section from "./Section";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const CATEGORIES_BASE = "/categories";

class Category extends CategoryData {

    constructor(data: any = {}) {

        super(data);

        this.details = data.details ? ToModel.DETAILS(data.details) : undefined;
        this.section = data.section ? ToModel.SECTION(data.section) : undefined;

    }

    details?: Detail[];
    section?: Section;

}

export default Category;
