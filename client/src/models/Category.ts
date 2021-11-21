// Category ------------------------------------------------------------------

// Statistical category for statistics related to a particular Facility.

// Internal Modules ----------------------------------------------------------

import Detail from "./Detail";
import Section from "./Section";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const CATEGORIES_BASE = "/categories";

class Category {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;

        this.accumulated = (data.accumulated !== undefined) ? data.accumulated : true;
        this.active = (data.active !== undefined) ? data.active : true;
        this.description = data.description ? data.description : null;
        this.notes = data.notes ? data.notes : null;
        this.ordinal = data.ordinal ? data.ordinal : 0;
        this.sectionId = data.sectionId ? data.sectionId : -1;
        this.service = data.service ? data.service : "";
        this.scope = data.scope ? data.scope : "";
        this.slug = data.slug ? data.slug : null;

        this.details = data.details ? ToModel.DETAILS(data.details) : undefined;
        this.section = data.section ? ToModel.SECTION(data.section) : undefined;

    }

    id!: number;

    accumulated!: boolean;
    active!: boolean;
    description?: string;
    facilityId!: number;
    notes?: string;
    ordinal!: number;
    sectionId!: number;
    service!: string;
    scope?: string;
    slug?: string;

    details?: Detail[];
    section?: Section;

}

export default Category;
