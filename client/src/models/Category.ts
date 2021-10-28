// Category ------------------------------------------------------------------

// Statistical category for statistics related to a particular Facility.

// Internal Modules ----------------------------------------------------------

import Detail from "./Detail";
import Facility from "./Facility";
import {Type} from "../types";
import {toDetails, toFacility} from "../util/ToModelTypes";

// Public Objects ------------------------------------------------------------

class Category {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;

        this.active = (data.active !== undefined) ? data.active : true;
        this.facilityId = data.facilityId ? data.facilityId : -1;
        this.notes = data.notes ? data.notes : null;
        this.ordinal = data.ordinal ? data.ordinal : 0;
        this.service = data.service ? data.service : "";
        this.scope = data.scope ? data.scope : "";
        this.slug = data.slug ? data.slug : null;
        this.type = data.type ? data.type : Type.DETAIL;

        this.details = data.details ? toDetails(data.details) : undefined;
        this.facility = data.facility ? toFacility(data.facility) : undefined;

    }

    id!: number;

    active!: boolean;
    facilityId!: number;
    notes?: string;
    ordinal!: number;
    service!: string;
    scope?: string;
    slug?: string;
    type!: string;

    details?: Detail[];
    facility?: Facility;

}

export default Category;
