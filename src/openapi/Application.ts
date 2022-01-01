// Application ---------------------------------------------------------------

// Application description for the OpenAPI specification.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import {
    BAD_REQUEST, CATEGORY_ID, DATE, DATE_FROM, DATE_TO,
    FACILITY_ID, FORBIDDEN, LIMIT, MATCH_ACTIVE, MATCH_NAME,
    MATCH_SCOPE, MATCH_SECTION_IDS, NAME_PATH,
    NOT_FOUND, NOT_UNIQUE, OFFSET, ORDINAL,
    REQUIRE_ADMIN, REQUIRE_ANY, REQUIRE_REGULAR, REQUIRE_SUPERUSER,
    SECTION_ID, SERVER_ERROR, UNAUTHORIZED,
    WITH_CATEGORIES, WITH_DAILIES, WITH_FACILITY, WITH_SECTIONS
} from "./Constants";
import Facility from "./Facility";
import Section from "./Section";
import Summary from "./Summary";

// Application Object --------------------------------------------------------

class Application extends ob.AbstractApplication {

    // Public Members --------------------------------------------------------

    public info(): ob.InfoObjectBuilder {
        const builder = new ob.InfoObjectBuilder("CityTeam Stats Entry Application", "1.0.0")
            .contact(contact())
            .description("Supports daily statistics gathering and reporting for a CityTeam Facility")
            .license(license())
        ;
        return builder;
    }

    public models(): ob.AbstractModel[] {
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
            .parameter(CATEGORY_ID, ob.parameterPath(CATEGORY_ID,
                "ID of the specified Category", ob.INTEGER))
            .parameter(DATE, ob.parameterPath(DATE,
                "Date for which to retrieve or update information"))
            .parameter(DATE_FROM, ob.parameterPath(DATE_FROM,
                "From date to select relevant information"))
            .parameter(DATE_TO, ob.parameterPath(DATE_TO,
                "To date to select relevant information"))
            .parameter(FACILITY_ID, ob.parameterPath(FACILITY_ID,
                "ID of the specified Facility", ob.INTEGER))
            .parameter(NAME_PATH, ob.parameterPath(NAME_PATH,
                "Exact name to match"))
            .parameter(ORDINAL, ob.parameterPath(ORDINAL,
                "Exact sort order ordinal to match", ob.INTEGER))
            .parameter(SECTION_ID, ob.parameterPath(SECTION_ID,
                "ID of the specified Section", ob.INTEGER))
        ;

        // Query Parameters (Includes)
        builder
            .parameter(WITH_CATEGORIES, ob.parameterQuery(WITH_CATEGORIES,
                "Include child Categories", true))
            .parameter(WITH_DAILIES, ob.parameterQuery(WITH_DAILIES,
                "Include child Dailies", true))
            .parameter(WITH_FACILITY, ob.parameterQuery(WITH_FACILITY,
                "Include parent Facility", true))
            .parameter(WITH_SECTIONS, ob.parameterQuery(WITH_SECTIONS,
                "Include child Sections"))
        ;

        // Query Parameters (Matches)
        builder
            .parameter(MATCH_ACTIVE, ob.parameterQuery(MATCH_ACTIVE,
                "Match only active objects (no value required)", true))
            .parameter(MATCH_NAME, ob.parameterQuery(MATCH_NAME,
                "Wildcard match on name segment", false))
            .parameter(MATCH_SCOPE, ob.parameterQuery(MATCH_SCOPE,
                "Exact match on scope value", false))
            .parameter(MATCH_SECTION_IDS, ob.parameterQuery(MATCH_SECTION_IDS,
                "Select data for a comma-separated list of Section IDs only", false))
        ;

        // Query Parameters (Pagination)
        builder
            .parameter(LIMIT, ob.parameterQuery(LIMIT,
                "Maximum number of rows returned (default is usually 25)", false, ob.INTEGER))
            .parameter(OFFSET,
                ob.parameterQuery(OFFSET, "Zero-relative offset to the first returned row (default is 0)", false, ob.INTEGER))
        ;

        return builder;
    }

    public responses(): ob.ResponsesObjectBuilder {
        const builder = super.responses();
        // NOTE - ResponsesObjectBuilder.response() is missing a "return this"
        builder.response(BAD_REQUEST, ob.responseError("Error in request properties").build())
        builder.response(FORBIDDEN, ob.responseError("Requested operation is not allowed").build())
        builder.response(NOT_FOUND, ob.responseError("Requested item is not found").build())
        builder.response(NOT_UNIQUE, ob.responseError("Requested item would violate uniqueness rules").build())
        builder.response(SERVER_ERROR, ob.responseError("General server error has occurred").build())
        builder.response(UNAUTHORIZED, ob.responseError("Missing or invalid access token").build())
        ;
        return builder;
    }

    public schemas(): ob.SchemasObjectBuilder {
        const builder = super.schemas()
            .schema(ob.ERROR, schemaError().build())
            .schema(ob.INTEGER, new ob.SchemaObjectBuilder("integer").build())
            .schema(ob.STRING, new ob.SchemaObjectBuilder("string").build())
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

