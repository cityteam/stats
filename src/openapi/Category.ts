// Category ------------------------------------------------------------------

// OpenAPI definition of a Category model.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    ACCUMULATED, ACTIVE, CATEGORY_ID, DESCRIPTION, FACILITY_ID, ID,
    MATCH_ACTIVE, NOTES, ORDINAL,
    REQUIRE_ADMIN, REQUIRE_REGULAR, REQUIRE_SUPERUSER,
    SECTION, SECTION_ID, SERVICE, SLUG, WITH_SECTION
} from "./Constants";
import Facility from "./Facility";
import Section from "./Section";

// Public Objects ------------------------------------------------------------

class Category extends ob.AbstractModel {

    public NAME = "Category";

    public apiCollection(): string {
        return `${super.apiCollection()}/{${FACILITY_ID}}/{${SECTION_ID}}`;
    }

    public apiPathId(): string {
        return CATEGORY_ID;
    }

    public name(): string {
        return this.NAME;
    }

    public names(): string {
        return pluralize(this.NAME);
    }

    public operationAll(): ob.OperationObjectBuilder {
        return super.operationAllBuilder(REQUIRE_REGULAR,
            this.parametersIncludes(), this.parametersMatches());
    }

    public operationExact(): ob.OperationObjectBuilder {
        return super.operationExactBuilder(REQUIRE_REGULAR,
            this.parametersIncludes(), ORDINAL);
    }

    public operationFind(): ob.OperationObjectBuilder {
        return super.operationFindBuilder(REQUIRE_REGULAR,
            this.parametersIncludes());
    }

    public operationInsert(): ob.OperationObjectBuilder {
        return super.operationInsertBuilder(REQUIRE_ADMIN);
    }

    public operationRemove(): ob.OperationObjectBuilder {
        return super.operationRemoveBuilder(REQUIRE_SUPERUSER);
    }

    public operationUpdate(): ob.OperationObjectBuilder {
        return super.operationUpdateBuilder(REQUIRE_ADMIN);
    }

    public parametersIncludes(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder()
            .parameter(WITH_SECTION, ob.parameterRef(WITH_SECTION))
        ;
        return builder;
    }

    public parametersMatches(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder()
            .parameter(MATCH_ACTIVE, ob.parameterRef(MATCH_ACTIVE))
        ;
        return builder;
    }

    public paths(): ob.PathsObjectBuilder {
        const builder = new ob.PathsObjectBuilder()
            .path(this.apiCollection(), this.pathCollection()
                .parameter(ob.parameterRef(Facility.apiPathId()))
                .parameter(ob.parameterRef(Section.apiPathId()))
                .build())
            .path(this.apiDetail(), this.pathDetail()
                .parameter(ob.parameterRef(Facility.apiPathId()))
                .parameter(ob.parameterRef(Section.apiPathId()))
                .build())
            .path(this.apiExact(ORDINAL), this.pathExact(REQUIRE_REGULAR, ORDINAL)
                .parameter(ob.parameterRef(Facility.apiPathId()))
                .parameter(ob.parameterRef(Section.apiPathId()))
                .build())
        ;
        return builder;
    }

    public schema(): ob.SchemaObjectBuilder {
        const builder = new ob.SchemaObjectBuilder(
            "object",
            "An individual statistic that is entered or reported, as part of " +
            "a parent Section.  The 'section' property will ONLY be present if it has " +
            "been explicitly included with a 'withSection' query parameter."
        )
            .property(ACCUMULATED, new ob.SchemaObjectBuilder(
                "boolean",
                "Are totals for this Category accumulated? (not in use)",
                true).build())
            .property(ID, ob.schemaId(this.name()).build())
            .property(ACTIVE, ob.schemaActive(this.name()).build())
            .property(DESCRIPTION, new ob.SchemaObjectBuilder(
                "string",
                "Description of this Category (not in use)",
                true).build())
            .property(NOTES, new ob.SchemaObjectBuilder(
                "string",
                "Miscellaneous notes about this Category",
                true).build())
            .property(ORDINAL, new ob.SchemaObjectBuilder(
                "integer",
                "Sort order specifier for Categories belonging to its Section",
                false).build())
            .property(SECTION, ob.schemaRef(Section.name()))
            .property(SECTION_ID, new ob.SchemaObjectBuilder(
                "integer",
                "ID of the Section to which this Category belongs",
                false).build())
            .property(SERVICE, new ob.SchemaObjectBuilder(
                "string",
                "Service of this Category (not in use)",
                true).build())
            .property(SLUG, new ob.SchemaObjectBuilder(
                "string",
                "Short title used to describe this Category",
                false).build())
        ;
        return builder;
    }

}

export default new Category();
