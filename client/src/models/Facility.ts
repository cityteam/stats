// Facility ------------------------------------------------------------------

// A CityTeam Facility that manages statistics with this application.

// Internal Modules ----------------------------------------------------------

import Section from "../models/Section";
import {toSections} from "../util/ToModelTypes";

// Public Objects ------------------------------------------------------------

export const FACILITIES_BASE = "/facilities";

class Facility {

    constructor (data: any = {}) {

        this.id = data.id ? data.id : -1;

        this.active = (data.active !== undefined) ? data.active : true;
        this.address1 = data.address1 ? data.address1 : null;
        this.address2 = data.address2 ? data.address2 : null;
        this.city = data.city ? data.city : null;
        this.email = data.email ? data.email : null;
        this.name = data.name ? data.name : null;
        this.phone = data.phone ? data.phone : null;
        this.scope = data.scope ? data.scope : null;
        this.state = data.state ? data.state : null;
        this.zipCode = data.zipCode ? data.zipCode : null;

        this.sections = data.sections ? toSections(data.sections) : undefined;

    }

    id!: number;

    active!: boolean;
    address1?: string;
    address2?: string;
    city?: string;
    email?: string;
    name!: string;
    phone?: string;
    scope!: string;
    state?: string;
    zipCode?: string;

    sections?: Section[];

}

export default Facility;
