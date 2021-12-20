// Application ---------------------------------------------------------------

// Application specific generators for an OpenAPI specification.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
import {AbstractApplication, AbstractModel} from "./Generator";

// Internal Modules ----------------------------------------------------------

import Facility from "./Facility";

// Public Objects ------------------------------------------------------------

class Application extends AbstractApplication {

    // Public Members --------------------------------------------------------

    public info(): ob.InfoObject {
        const builder = new ob.InfoObjectBuilder("CityTeam Stats Entry Application", "1.0.0")
            .contact(contact())
            .description("Supports daily statistics gathering and reporting for a CityTeam Facility")
            .license(license())
        ;
        return builder.build();
    }

    public models(): AbstractModel[] {
        return [
            Facility,
        ];
    }

    public parameters(): ob.ParametersObject {
        const parameters: ob.ParametersObject = {};
        // TODO
        return parameters;
    }

}

export default new Application();

// Private Objects ---------------------------------------------------------

function contact(): ob.ContactObject {
    return new ob.ContactObjectBuilder()
        .email("craigmcc@gmail.com")
        .name("Craig McClanahan")
        .build();
}

function license(): ob.LicenseObject {
    return new ob.LicenseObjectBuilder("Apache-2.0")
        .url("https://apache.org/licenses/LICENSE-2.0")
        .build();
}

