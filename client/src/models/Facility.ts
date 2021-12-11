// Facility ------------------------------------------------------------------

// A CityTeam Facility that manages statistics with this application.

// Internal Modules ----------------------------------------------------------

import FacilityData from "./FacilityData";
import Section from "./Section";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const FACILITIES_BASE = "/facilities";

class Facility extends FacilityData {

    constructor (data: any = {}) {

        super(data);

        this.sections = data.sections ? ToModel.SECTIONS(data.sections) : undefined;

    }

    sections?: Section[];

}

export default Facility;
