// Section -------------------------------------------------------------------

// OpenAPI definition of a Section model.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
import AbstractModel from "./generator/AbstractModel";
import {parameterRef, schemaActive, schemaChildren, schemaId, schemaParent, schemaRef} from "./generator/Helpers";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    ACTIVE, CATEGORIES, FACILITY, FACILITY_ID, ID,
    MATCH_ACTIVE, NOTES, ORDINAL,
    REQUIRE_ADMIN, REQUIRE_REGULAR, REQUIRE_SUPERUSER,
    SCOPE, SECTION_ID, SLUG, TITLE,
    WITH_CATEGORIES, WITH_DAILIES, WITH_FACILITY,
} from "./Constants";
import Facility from "./Facility";
import Category from "./Category";

// Public Objects ------------------------------------------------------------

class Section extends AbstractModel {

    public NAME = "Section";

    public apiCollection(): string {
        return super.apiCollection() + `/{${FACILITY_ID}}`;
    }

    public apiPathId(): string {
        return SECTION_ID;
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
        return super.operationFindBuilder(REQUIRE_REGULAR, this.parametersIncludes());
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
            .parameter(WITH_CATEGORIES, parameterRef(WITH_CATEGORIES))
            .parameter(WITH_DAILIES, parameterRef(WITH_DAILIES))
            .parameter(WITH_FACILITY, parameterRef(WITH_FACILITY))
        ;
        return builder;
    }

    public parametersMatches(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder()
            .parameter(MATCH_ACTIVE, parameterRef(MATCH_ACTIVE))
        ;
        return builder;
    }

    public paths(): ob.PathsObjectBuilder {
        const builder = new ob.PathsObjectBuilder()
                .path(this.apiCollection(), this.pathCollection()
                    .parameter(parameterRef(Facility.apiPathId()))
                    .build())
                .path(this.apiDetail(), this.pathDetail()
                    .parameter(parameterRef(Facility.apiPathId()))
                    .parameter(parameterRef(this.apiPathId()))
                    .build())
                .path(this.apiExact(ORDINAL), this.pathExact(REQUIRE_REGULAR, ORDINAL)
                    .parameter(parameterRef(Facility.apiPathId()))
                    .build())
            // TODO - categories children thing
            // TODO - dailies children thing
        ;
        return builder;
    }

    public schema(): ob.SchemaObjectBuilder {
        const builder = new ob.SchemaObjectBuilder(
            "object",
            "A grouping of Categories that are entered or reported together.  " +
            "The 'categories' and 'facility' properties will ONLY be present if they " +
            "have been explicitly included with 'withCategories' or 'withFacility' " +
            "query parameters."
        )
            .property(ID, schemaId(this.name()).build())
            .property(ACTIVE, schemaActive(this.name()).build())
/*
            .property(CATEGORIES, schemaChildren(Category.name(),
                "Child Categories (if included)",
                true). build())
*/
            .property(CATEGORIES, schemaRef(Category.names()))
/*
            .property(FACILITY, schemaParent(Facility.name(),
                   "Parent Facility (if included)",
                   true).build())
*/
            .property(FACILITY, schemaRef(Facility.name()))
            .property(FACILITY_ID, new ob.SchemaObjectBuilder(
                "integer",
                "ID of the Facility to which this Section belongs",
                false).build())
            .property(NOTES, new ob.SchemaObjectBuilder(
                "string",
                "Miscellaneous notes about this Section",
                true).build())
            .property(ORDINAL, new ob.SchemaObjectBuilder(
                "integer",
                "Sort order specifier for Sections belonging to its Facility",
                false).build())
            .property(SCOPE, new ob.SchemaObjectBuilder(
                "string",
                "Permission scope suffix required to access this Section",
                false).build())
            .property(SLUG, new ob.SchemaObjectBuilder(
                "string",
                "Short title used to describe this Section",
                false).build())
            .property(TITLE, new ob.SchemaObjectBuilder(
                "string",
                "Long title used to describe this Section (not currently used)",
                false).build())
        ;
        return builder;
    }

}

export default new Section();
