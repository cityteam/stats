// Section -------------------------------------------------------------------

// Report grouping section for statistics related to a particular Facility.

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import Facility from "./Facility";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const SECTIONS_BASE = "/sections";

class Section {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;

        this.active = (data.active !== undefined) ? data.active : true;
        this.facilityId = data.facilityId ? data.facilityId : -1;
        this.notes = data.notes ? data.notes : null;
        this.ordinal = data.ordinal ? data.ordinal : 0;
        this.scope = data.scope ? data.scope : "";
        this.slug = data.slug ? data.slug : "";
        this.title = data.title ? data.title : "";

        this.categories = data.categories ? ToModel.CATEGORIES(data.categories) : undefined;
        this.facility = data.facility ? ToModel.FACILITY(data.facility) : undefined;

    }

    id!: number;

    active!: boolean;
    facilityId!: number;
    notes?: string;
    ordinal!: number;
    scope!: string;
    slug!: string;
    title!: string;

    categories?: Category[];
    facility?: Facility;

}

export default Section;
