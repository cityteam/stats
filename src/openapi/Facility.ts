// Facility ------------------------------------------------------------------

// OpenAPI definition of a Facility model.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
import {AbstractModel, activeSchema, idSchema} from "./Generator";

// Internal Modules ----------------------------------------------------------

import {ACTIVE, ID} from "./Constants";

// Public Objects ------------------------------------------------------------

class Facility extends AbstractModel {

    public static NAME = "Facility";

    public name(): string {
        return Facility.NAME;
    }

    public schema(): ob.SchemaObject {
        return new ob.SchemaObjectBuilder()
            .property(ID, idSchema(this.name()))
            .property(ACTIVE, activeSchema(this.name()))
            // TODO - remaining properties
            .build();
    }

}

export default new Facility();
