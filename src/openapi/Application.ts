// Application ---------------------------------------------------------------

// Application description for the OpenAPI specification.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
import AbstractApplication from "./generator/AbstractApplication";
import AbstractModel from "./generator/AbstractModel";
import {
    ERROR,
    INTEGER,
    parameterPath,
    parameterQuery,
    parameterRef,
    requestBodyRef,
    responseError,
    responseRef,
    STRING,
} from "./generator/Helpers";

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import {
    BAD_REQUEST, CATEGORY_ID, DATE, DATE_FROM, DATE_TO,
    FACILITY_ID, FORBIDDEN, LIMIT, MATCH_ACTIVE, MATCH_NAME,
    MATCH_SCOPE, NAME_PATH, NOT_FOUND, NOT_UNIQUE, OFFSET, OK, ORDINAL,
    REQUIRE_ADMIN, REQUIRE_ANY, REQUIRE_REGULAR, REQUIRE_SUPERUSER,
    SECTION_ID, SERVER_ERROR, UNAUTHORIZED,
    WITH_CATEGORIES, WITH_DAILIES, WITH_FACILITY, WITH_SECTIONS
} from "./Constants";
import Facility from "./Facility";
import Section from "./Section";
import Summary from "./Summary";

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
            Category,
            Facility,
            Section,
            Summary,
        ];
    }

    public parameters(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder();

        // Path Parameters
        builder
            .parameter(CATEGORY_ID, parameterPath(CATEGORY_ID, "ID of the specified Category", INTEGER))
            .parameter(DATE, parameterPath(DATE, "Date for which to retrieve or update information"))
            .parameter(DATE_FROM, parameterPath(DATE_FROM, "From date to select relevant information"))
            .parameter(DATE_TO, parameterPath(DATE_TO, "To date to select relevant information"))
            .parameter(FACILITY_ID, parameterPath(FACILITY_ID, "ID of the specified Facility", INTEGER))
            .parameter(NAME_PATH, parameterPath(NAME_PATH, "Exact name to match"))
            .parameter(ORDINAL, parameterPath(ORDINAL, "Exact sort order ordinal to match", INTEGER))
            .parameter(SECTION_ID, parameterPath(SECTION_ID, "ID of the specified Section", INTEGER))
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
            .parameter(LIMIT, parameterQuery(LIMIT, "Maximum number of rows returned (default is usually 25)", false, INTEGER))
            .parameter(OFFSET, parameterQuery(OFFSET, "Zero-relative offset to the first returned row (default is 0)", false, INTEGER))
        ;

        return builder;
    }

    public responses(): ob.ResponsesObjectBuilder {
        const builder = super.responses();
        // TODO - ResponsesObjectBuilder.response() is missing a "return this"
        builder.response(BAD_REQUEST, responseError("Error in request properties").build())
        builder.response(FORBIDDEN, responseError("Requested operation is not allowed").build())
        builder.response(NOT_FOUND, responseError("Requested item is not found").build())
        builder.response(NOT_UNIQUE, responseError("Requested item would violate uniqueness rules").build())
        builder.response(SERVER_ERROR, responseError("General server error has occurred").build())
        builder.response(UNAUTHORIZED, responseError("Missing or invalid access token").build())
        ;
        return builder;
    }

    public schemas(): ob.SchemasObjectBuilder {
        const builder = super.schemas()
            .schema(ERROR, schemaError().build())
            .schema(INTEGER, new ob.SchemaObjectBuilder("integer").build())
            .schema(STRING, new ob.SchemaObjectBuilder("string").build())
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

function schemaError(): ob.SchemaObjectBuilder {
    const builder = new ob.SchemaObjectBuilder()
        .property("context", new ob.SchemaObjectBuilder("string",
            "Error source location").build())
        .property("inner", new ob.SchemaObjectBuilder("object",
            "Nested error we are wrapping (if any)").build())
        .property("message", new ob.SchemaObjectBuilder("string",
            "Error message summary").build())
        .property("status", new ob.SchemaObjectBuilder("integer",
            "HTTP status code").build())
        .type("object")
    ;
    return builder;
}

