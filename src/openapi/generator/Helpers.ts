// Helpers -------------------------------------------------------------------

// Shared constants and helpers for OpenAPI documentation generation.

// External Modules ---------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Public Constants ---------------------------------------------------------

// ***** General Constants *****

export const APPLICATION_JSON = "application/json";
export const ERROR = "Error";
export const INTEGER = "Integer";
export const LIMIT = "limit";
export const OFFSET = "offset";
export const NUMBER = "Number";
export const STRING = "String";

// ***** HTTP Response Codes *****

export const OK = "200";
export const CREATED = "201";
export const BAD_REQUEST = "400";
export const UNAUTHORIZED = "401";
export const FORBIDDEN = "403";
export const NOT_FOUND = "404";
export const NOT_UNIQUE = "409";
export const SERVER_ERROR = "500";

// Public Functions ---------------------------------------------------------

// ***** ParameterObject Helpers *****

/**
 * Generate a ParameterObject for the specified path parameter.
 *
 * @param name                          Name of the specified parameter
 * @param description                   Description of the specified parameter
 * @param type                          Parameter type (STRING | INTEGER | NUMBER) [STRING]
 */
export function parameterPath(name: string,
                              description: string,
                              type: string = STRING): ob.ParameterObject {
    const builder = new ob.ParameterObjectBuilder("path",
        name === "name" ? "namePath" : name) // TODO - not generic!!!
        .description(description)
        .required(true)
        .schema(schemaRef(type))
    ;
    return builder.build();
}

/**
 * Generate a ParameterObject for the specified query parameter.
 *
 * @param name                          Name of the specified parameter
 * @param description                   Description of the specified parameter
 * @param allowEmptyValue               Is an empty value allowed? [false]
 * @param type                          Parameter type (STRING | INTEGER | NUMBER) [STRING]
 */
export function parameterQuery(name: string, description: string,
                               allowEmptyValue: boolean = false,
                               type: string = STRING) {
    const builder = new ob.ParameterObjectBuilder("query", name)
        .description(description)
        .required(false)
        .schema(schemaRef(type))
    ;
    return builder.build();
}

// ***** ResponseObjectBuilder Helpers *****

/**
 * Generate a ResponseObjectBuilder for the specified error description.
 *
 * @param description                   Description of this error
 */
export function responseError(description: string): ob.ResponseObjectBuilder {
    const builder = new ob.ResponseObjectBuilder(description)
        .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .schema(schemaRef(ERROR))
            .build())
    ;
    return builder;

}

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
 * Generate a SchemaObjectBuilder for an array of child models
 *
 * @param child                         Name of the child model
 * @param description                   Description for this object
 * @param nullable                      Is this object nullable? [true]
 */
export function schemaChildren(child: string, description: string, nullable: boolean = true): ob.SchemaObjectBuilder {
    const childrenRef = schemaRef(pluralize(child));
    const builder = new ob.SchemaObjectBuilder(
        "object",
        description,
        nullable
    );
    // TODO - how to embed childrenRef
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

/**
 * Generate a SchemaObjectBuilder for a parent model.
 *
 * @param parent                        Name of the parent model
 * @param description                   Description for this object
 * @param nullable                      Is this object nullable? [true]
 */
export function schemaParent(parent: string, description: string, nullable: boolean = true): ob.SchemaObjectBuilder {
    const parentRef = schemaRef(parent);
    const builder = new ob.SchemaObjectBuilder(
        "object",
        description,
        nullable
    );
    // TODO - how to embed parentRef
    return builder;
}

// ***** Reference Helpers *****

/**
 * Generate a ReferenceObject for the specified parameter.
 *
 * @param name                          Name of the specified parameter
 */
export function parameterRef(name: string): ob.ReferenceObject {
    return new ob.ReferenceObjectBuilder(`#/components/parameters/${name}`)
        .build();
}

/**
 * Generate a ReferenceObject for the specified request body.
 *
 * @param name                          Name of the specified request body
 */
export function requestBodyRef(name: string): ob.ReferenceObject {
    return new ob.ReferenceObjectBuilder(`#/components/requestBodies/${name}`)
        .build();
}

/**
 * Generate a ReferenceObject for the specified response.
 *
 * @param name                          Name of the specified response
 */
export function responseRef(name: string): ob.ReferenceObject {
    return new ob.ReferenceObjectBuilder(`#/components/responses/${name}`)
        .build();
}


/**
 * Generate a ReferenceObject for the schema of the specified model.
 *
 * @param name                          Name of the specified model
 */
export function schemaRef(name: string): ob.ReferenceObject {
    return new ob.ReferenceObjectBuilder(`#/components/schemas/${name}`)
        .build();
}
