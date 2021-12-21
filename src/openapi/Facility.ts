// Facility ------------------------------------------------------------------

// OpenAPI definition of a Facility model.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
import AbstractModel from "./generator/AbstractModel";
import {parameterRef, schemaActive, schemaId} from "./generator/Helpers";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    ACTIVE, ADDRESS1, ADDRESS2, CITY, EMAIL, ID,
    MATCH_ACTIVE, MATCH_NAME, MATCH_SCOPE,
    SCOPE, STATE, WITH_SECTIONS, ZIPCODE
} from "./Constants";

// Public Objects ------------------------------------------------------------

class Facility extends AbstractModel {

    public NAME = "Facility";

    public name(): string {
        return this.NAME;
    }

    public names(): string {
        return pluralize(this.NAME);
    }

    public parametersIncludes(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder()
            .parameter(WITH_SECTIONS, parameterRef(WITH_SECTIONS))
        ;
        return builder;
    }

    public parametersMatches(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder()
            .parameter(MATCH_ACTIVE, parameterRef(MATCH_ACTIVE))
            .parameter(MATCH_NAME, parameterRef(MATCH_NAME))
            .parameter(MATCH_SCOPE, parameterRef(MATCH_SCOPE))
        ;
        return builder;
    }

    public schema(): ob.SchemaObjectBuilder {
        const builder = new ob.SchemaObjectBuilder()
            .property(ID, schemaId(this.name()).build())
            .property(ACTIVE, schemaActive(this.name()).build())
            .property(ADDRESS1, new ob.SchemaObjectBuilder(
                "string",
                "First line of the Facility address",
                true).build())
            .property(ADDRESS2, new ob.SchemaObjectBuilder(
                "string",
                "Second line of the Facility address",
                true).build())
            .property(CITY, new ob.SchemaObjectBuilder(
                "string",
                "City of Facility address",
                true).build())
            .property(EMAIL, new ob.SchemaObjectBuilder(
                "string",
                "Email address of this Facility",
                true).build())
            .property(SCOPE, new ob.SchemaObjectBuilder(
                "string",
                "OAuth scope prefix required to access this Facility",
                false).build())
            // TODO - SECTIONS
            .property(STATE, new ob.SchemaObjectBuilder(
                "string",
                "State abbreviation of the Facility address",
                true).build())
            .property(ZIPCODE, new ob.SchemaObjectBuilder(
                "string",
                "Zip code of the Facility address",
                true).build())
        ;
        return builder;
    }

}

export default new Facility();
