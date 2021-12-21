// Application ---------------------------------------------------------------

// Application description for the OpenAPI specification.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");
import AbstractApplication from "./generator/AbstractApplication";
import AbstractModel from "./generator/AbstractModel";
import {parameterPath, parameterQuery, parameterRef, requestBodyRef, responseRef} from "./generator/Helpers";

// Internal Modules ----------------------------------------------------------

import {
    BAD_REQUEST, CATEGORY_ID, CREATED, DATE_FROM, DATE_TO,
    FACILITY_ID, FORBIDDEN, LIMIT, MATCH_ACTIVE, MATCH_NAME,
    MATCH_SCOPE, NOT_FOUND, OFFSET, OK, REQUIRE_ADMIN,
    REQUIRE_ANY, REQUIRE_REGULAR, REQUIRE_SUPERUSER, SECTION_ID,
    WITH_CATEGORIES, WITH_DAILIES, WITH_FACILITY, WITH_SECTIONS
} from "./Constants";
import Facility from "./Facility";

// Application Object --------------------------------------------------------

class Application extends AbstractApplication {

    // Public Members --------------------------------------------------------

    public info(): ob.InfoObjectBuilder {
        const builder = new ob.InfoObjectBuilder("CityTeam Stats Entry Application", "1.0.0")
            .contact(contact())
            .description("Supports daily statistics gathering and reporting for a CityTeam Facility")
            .license(license())
        ;
        return builder;
    }

    public models(): AbstractModel[] {
        return [
            Facility,
        ];
    }

    public parameters(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder();

        // Path Parameters
        builder
            .parameter(CATEGORY_ID, parameterPath(CATEGORY_ID, "ID of the specified Category"))
            .parameter(DATE_FROM, parameterPath(DATE_FROM, "From date to select relevant information"))
            .parameter(DATE_TO, parameterPath(DATE_TO, "To date to select relevant information"))
            .parameter(FACILITY_ID, parameterPath(FACILITY_ID, "ID of the specified Facility"))
            .parameter(SECTION_ID, parameterPath(SECTION_ID, "ID of the specified Section"))
        ;

        // Query Parameters (Includes)
        builder
            .parameter(WITH_CATEGORIES, parameterQuery(WITH_CATEGORIES, "Include child Categories", true))
            .parameter(WITH_DAILIES, parameterQuery(WITH_DAILIES, "Include child Dailies", true))
            .parameter(WITH_FACILITY, parameterQuery(WITH_FACILITY, "Include parent Facility", true))
            .parameter(WITH_SECTIONS, parameterQuery(WITH_SECTIONS, "Include child Sections"))
        ;

        // Query Parameters (Matches)
        builder
            .parameter(MATCH_ACTIVE, parameterQuery(MATCH_ACTIVE, "Match only active objects", true))
            .parameter(MATCH_NAME, parameterQuery(MATCH_NAME, "Wildcard match on name segment", false))
            .parameter(MATCH_SCOPE, parameterQuery(MATCH_SCOPE, "Exact match on scope value"))
        ;

        // Query Parameters (Pagination)
        builder
            .parameter(LIMIT, parameterQuery(LIMIT, "Maximum number of rows returned (default is usually 25)", false))
            .parameter(OFFSET, parameterQuery(OFFSET, "Zero-relative offset to the first returned row (default is 0)", false))
        ;

        return builder;
    }

    public tags(): ob.TagsObject {
        const tags: ob.TagsObject = {};
        // Permission constraints on operations
        tags[REQUIRE_ADMIN] = new ob.TagObjectBuilder(REQUIRE_ADMIN)
            .description("Requires 'admin' permission on the associated Facility")
            .build();
        tags[REQUIRE_ANY] = new ob.TagObjectBuilder(REQUIRE_ANY)
            .description("Requires logged in user")
            .build();
        tags[REQUIRE_REGULAR] = new ob.TagObjectBuilder(REQUIRE_REGULAR)
            .description("Requires 'regular' permission on the associated Facility")
            .build();
        tags[REQUIRE_SUPERUSER] = new ob.TagObjectBuilder(REQUIRE_SUPERUSER)
            .description("Requires 'superuser' permission")
            .build();
        return tags;
    }

}

export default new Application();

// Specialized AbstractModel -------------------------------------------------

/**
 * Add some additional methods local to this application.
 */
export abstract class LocalModel extends AbstractModel {

    // ***** OperationObjectBuilder Generators *****

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to return all model objects that match the specified criteria.
     */
    public abstract operationAll(): ob.OperationObjectBuilder;

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to return the specified model object by ID.
     */
    public abstract operationFind(): ob.OperationObjectBuilder;

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to insert a new model, and return the inserted model with ID.
     */
    public abstract operationInsert(): ob.OperationObjectBuilder;

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to remove an existing model, and return the removed model.
     */
    public abstract operationRemove(): ob.OperationObjectBuilder;

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to update an existing model, and return the updated model.
     */
    public abstract operationUpdate(): ob.OperationObjectBuilder;

    // ***** ParametersObjectBuilder Generators *****

    /**
     * Generate a ParametersObjectBuilder for query parameters that
     * cause parent and/or child objects to be included in the response.
     *
     * The default implementation returns an empty builder.
     */
    public parametersIncludes(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder();
        return builder;
    }

    /**
     * Generate a ParametersObjectBuilder for query parameters that
     * are used to match database information to be returned.
     *
     * The default implementation returns an empty builder.
     */
    public parametersMatches(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder();
        return builder;
    }

    /**
     * Generate a ParametersObjectBuilder for query parameters that
     * specify pagination configuration.
     *
     * The default implementation returns the standard parameters
     * defined for this purpose.
     */
    public parametersPaginations(): ob.ParametersObjectBuilder {
        return parametersPaginations();
    }

}


// Public Functions ----------------------------------------------------------

// ***** OperationObjectBuilder Helpers *****

/**
 * Generate an OperationObjectBuilder for the "all" operation.
 */
export function operationAll(model: string, tag: string | null,
                             includes: ob.ParametersObjectBuilder | null,
                             matches: ob.ParametersObjectBuilder | null)
    : ob.OperationObjectBuilder {
    const models = pluralize(model);
    const builder = new ob.OperationObjectBuilder()
        .description(`Return all matching ${models}`)
        .parameters(parametersPaginations().build())
        .parameters(includes ? includes.build() : {})
        .parameters(matches ? matches.build() : {})
        .response(FORBIDDEN, responseRef(FORBIDDEN))
        .response(OK, responseRef(models))
        .summary(`The requested ${models}`)
    ;
    if (tag) {
        builder.tag(tag);
    }
    return builder;
}

 /**
 * Generate an OperationObjectBuilder for a "children" operation.
 */
export function operationChildren(parentModel: string, childModel: string,
                                  tag: string | null,
                                  includes: ob.ParametersObjectBuilder | null,
                                  matches: ob.ParametersObjectBuilder | null)
: ob.OperationObjectBuilder {
    const childModels = pluralize(childModel);
    const builder = new ob.OperationObjectBuilder()
        .description(`Return matching ${childModels} of this ${parentModel}`)
        .parameters(includes ? includes.build() : {})
        .parameters(matches ? matches.build() : {})
        .response(FORBIDDEN, responseRef(FORBIDDEN))
        .response(NOT_FOUND, responseRef(NOT_FOUND))
        .response(OK, responseRef(childModels))
        .summary(`The requested ${childModels}`)
    ;
    if (tag) {
        builder.tag(tag);
    }
    return builder;
}

/**
 * Generate an OperationObjectBuilder for the "find" operation.
 */
export function operationFind(model: string, tag: string | null,
                              includes: ob.ParametersObjectBuilder | null)
: ob.OperationObjectBuilder {
    const builder = new ob.OperationObjectBuilder()
        .description(`Find the specified ${model} by ID`)
        .parameters(includes ? includes.build() : {})
        .response(FORBIDDEN, responseRef(FORBIDDEN))
        .response(NOT_FOUND, responseRef(NOT_FOUND))
        .response(OK, responseRef(model))
        .summary(`The specified ${model}`)
    ;
    if (tag) {
        builder.tag(tag);
    }
    return builder;
}

/**
 * Generate an OperationObjectBuilder for the "insert" operation.
 */
export function operationInsert(model: string, tag: string | null)
: ob.OperationObjectBuilder {
    const builder = new ob.OperationObjectBuilder()
        .description(`Insert and return the specified ${model}`)
        .requestBody(requestBodyRef(model))
        .response(BAD_REQUEST, responseRef(BAD_REQUEST))
        .response(CREATED, responseRef(model))
        .response(FORBIDDEN, responseRef(FORBIDDEN))
        .summary(`The inserted ${model}`)
    ;
    if (tag) {
        builder.tag(tag);
    }
    return builder;
}

/**
 * Generate an OperationObjectBuilder for the "remove" operation.
 */
export function operationRemove(model: string, tag: string | null)
: ob.OperationObjectBuilder {
    const builder = new ob.OperationObjectBuilder()
        .description(`Remove and return the specified ${model}`)
        .response(FORBIDDEN, responseRef(FORBIDDEN))
        .response(NOT_FOUND, responseRef(NOT_FOUND))
        .response(OK, responseRef(model))
        .summary(`The removed ${model}`)
    ;
    if (tag) {
        builder.tag(tag);
    }
    return builder;
}

/**
 * Generate an OperationObjectBuilder for the "update" operation.
 */
export function operationUpdate(model: string, tag: string | null)
: ob.OperationObjectBuilder {
    const builder = new ob.OperationObjectBuilder()
        .description(`Update and return the specified ${model}`)
        .requestBody(requestBodyRef(model))
        .summary(`The updated ${model}`)
        // TODO - response entries
        .summary(`The updated ${model}`)
    ;
    if (tag) {
        builder.tag(tag);
    }
    return builder;
}

// ***** ParametersObjectBuilder Helpers *****

/**
 * Generate a ParametersObjectBuilder for query parameters that
 * specify pagination configuration.
 *
 * The default implementation returns the standard parameters
 * defined for this purpose.
 */
export function parametersPaginations(): ob.ParametersObjectBuilder {
    const builder = new ob.ParametersObjectBuilder();
    builder
        .parameter(LIMIT, parameterRef(LIMIT))
        .parameter(OFFSET, parameterRef(OFFSET))
    ;
    return builder;
}

// ***** Reference Helpers *****

// ***** SchemaObjectBuilder Helpers *****

/**
 * Generate a SchemaObjectBuilder for the "active" property of the specified model.
 *
 * @param model                         Name of the specified model
 * @param nullable                      Is this object nullable? [true]
 */
export function schemaActive(model: string, nullable = true): ob.SchemaObjectBuilder {
    const builder = new ob.SchemaObjectBuilder(
        "boolean",
        `Is this ${model} active?`,
        nullable
    );
    return builder;
}

/**
 * Generate a SchemaObjectBuilder for the "id" property of the specified model.
 *
 * @param model                         Name of the specified model
 * @param nullable                      Is this object nullable? [true]
 */
export function schemaId(model: string, nullable = true): ob.SchemaObjectBuilder {
    const builder = new ob.SchemaObjectBuilder(
        "integer",
        `Primary key for this ${model}`,
        nullable,
    );
    return builder;
}

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

