// Category ------------------------------------------------------------------

// Statistical category for statistics related to a particular Facility.

// Internal Modules ----------------------------------------------------------

import CategoryData from "./CategoryData";
import Section from "./Section";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const CATEGORIES_BASE = "/categories";

class Category extends CategoryData {

    constructor(data: any = {}) {

        super(data);

        this.section = data.section ? ToModel.SECTION(data.section) : undefined;

    }

    section?: Section;

}

export default Category;
