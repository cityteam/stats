// Section -------------------------------------------------------------------

// Report grouping section for statistics related to a particular Facility.

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import Facility from "./Facility";
import SectionData from "./SectionData";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const SECTIONS_BASE = "/sections";

class Section extends SectionData {

    constructor(data: any = {}) {

        super(data);

        this.categories = data.categories ? ToModel.CATEGORIES(data.categories) : [];
        this.facility = data.facility ? ToModel.FACILITY(data.facility) : undefined;

    }

    categories: Category[];
    facility?: Facility;

}

export default Section;
