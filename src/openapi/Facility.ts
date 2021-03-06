// Facility ------------------------------------------------------------------

// OpenAPI definition of a Facility model.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    ACTIVE, ADDRESS1, ADDRESS2, CITY,
    EMAIL, FACILITY_ID, ID,
    MATCH_ACTIVE, MATCH_NAME, MATCH_SCOPE,
    NAME_PATH,
    REQUIRE_ADMIN, REQUIRE_ANY, REQUIRE_REGULAR, REQUIRE_SUPERUSER,
    SCOPE, SECTIONS, STATE, WITH_SECTIONS, ZIPCODE
} from "./Constants";
import Section from "./Section";

// Public Objects ------------------------------------------------------------

class Facility extends ob.AbstractModel {

    public NAME = "Facility";

    public apiPathId(): string {
        return FACILITY_ID;
    }

    public name(): string {
        return this.NAME;
    }

    public names(): string {
        return pluralize(this.NAME);
    }

    public operationAll(): ob.OperationObjectBuilder {
        return super.operationAllBuilder(REQUIRE_ANY,
            this.parametersIncludes(), this.parametersMatches());
    }

    public operationAllSections(): ob.OperationObjectBuilder {
        return super.operationChildren(Section, REQUIRE_REGULAR);
    }

    public operationExact(): ob.OperationObjectBuilder {
        return super.operationExactBuilder(REQUIRE_REGULAR,
            this.parametersIncludes());
    }

    public operationFind(): ob.OperationObjectBuilder {
        return super.operationFindBuilder(REQUIRE_REGULAR, this.parametersIncludes());
    }

    public operationInsert(): ob.OperationObjectBuilder {
        return super.operationInsertBuilder(REQUIRE_SUPERUSER);
    }

    public operationRemove(): ob.OperationObjectBuilder {
        return super.operationRemoveBuilder(REQUIRE_SUPERUSER);
    }

    public operationUpdate(): ob.OperationObjectBuilder {
        return super.operationUpdateBuilder(REQUIRE_ADMIN);
    }

    public parametersIncludes(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder()
            .parameter(WITH_SECTIONS, ob.parameterRef(WITH_SECTIONS))
        ;
        return builder;
    }

    public parametersMatches(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder()
            .parameter(MATCH_ACTIVE, ob.parameterRef(MATCH_ACTIVE))
            .parameter(MATCH_NAME, ob.parameterRef(MATCH_NAME))
            .parameter(MATCH_SCOPE, ob.parameterRef(MATCH_SCOPE))
        ;
        return builder;
    }

    public paths(): ob.PathsObjectBuilder {
        const builder = new ob.PathsObjectBuilder()
            .path(this.apiCollection(), this.pathCollection().build())
            .path(this.apiDetail(), this.pathDetail()
                .parameter(ob.parameterRef(this.apiPathId()))
                .build())
            .path(this.apiExact(NAME_PATH), this.pathExact(REQUIRE_REGULAR, NAME_PATH)
                .build())
            .path(this.apiChildren(Section),
                this.pathChildren(Section, REQUIRE_REGULAR)
                    .parameter(ob.parameterRef(this.apiPathId()))
                    .build())
        ;
        return builder;
    }

    public schema(): ob.SchemaObjectBuilder {
        const builder = new ob.SchemaObjectBuilder(
            "object",
            "An individual CityTeam Facility for which statistics are " +
            "entered and reported.  The 'sections' property will ONLY be present " +
            "if it was explicitly included with a 'withSections' query parameter."
        )
            .property(ID, ob.schemaId(this.name()).build())
            .property(ACTIVE, ob.schemaActive(this.name()).build())
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
            .property(SECTIONS, ob.schemaRef(Section.names()))
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
