// Generator -----------------------------------------------------------------

// Return a completely configured OpenAPI document value as a string.
// This value is NOT cached internally, but the caller should likely cache it
// since it won't change while the application is running.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";

// Internal Modules ----------------------------------------------------------

import AbstractApplication from "./AbstractApplication";

// Public Functions ----------------------------------------------------------

/**
 * Generate and return the OpenAPI document.
 *
 * @param application                   Concrete application description
 * @param asYaml                        Return as Yaml? [Json formatted]
 */
export function generator(application: AbstractApplication, asYaml: boolean = false): string {
    const builder = new ob.OpenApiObjectBuilder(application.info().build())
        .components(application.components().build())
        // TODO - pathItems
        // TODO - anything else that is missing
    ;
    application.tags(builder);
    return asYaml ? builder.asYaml() : builder.asJson();
}

export default generator;
