// Generator -----------------------------------------------------------------

// Assemble and return the entire OpenAPI definition (as a JSON string) for
// this entire application.  For performance reasons, it is cached the first
// time that it is built, since it cannot be changed without recompiling.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Public Objects ------------------------------------------------------------

let OPEN_API = "";

/**
 * Generate the OpenAPI document for the specified application.
 *
 * @param application                   // Detailed characteristics of this application
 */
export default function generate(application: AbstractApplication): string {
    if (OPEN_API === "") {
        const builder = new ob.OpenApiObjectBuilder(application.info())
                .components(application.components())
            ;
        OPEN_API = builder.asJson();
    }
    return OPEN_API;
}

// Shared Types and Abstract Implementations =================================

// Public Classes ------------------------------------------------------------

/**
 * Generic support for generating an entire OpenApi specification.
 */
export abstract class AbstractApplication {

    /**
     * Generate an ob.InfoObject for this application.
     */
    public abstract info(): ob.InfoObject;

    /**
     * Generate an ob.ComponentsObject for this application.
     *
     * The default implementation uses the parameters(),
     * requestBodies(), responses(), and schemas() methods
     * from the concrete implementation.
     */
    public components(): ob.ComponentsObject {
        const builder = new ob.ComponentsObjectBuilder()
            .parameters(this.parameters())
            .requestBodies(this.requestBodies())
            .responses(this.responses())
            .schemas(this.schemas())
        ;
        return builder.build();
    }

    /**
     * Return a list of the model implementations for this application.
     */
    public abstract models(): AbstractModel[];

    /**
     * Return an ob.ParametersObject containing generated parameters
     * for this application.
     */
    public abstract parameters(): ob.ParametersObject;

    /**
     * Return an ob.RequestBodiesObject containing generated request bodies
     * for this application.
     *
     * The default implementation iterates through the requestBody() methods
     * for each defined model.
     */
    public requestBodies(): ob.RequestBodiesObject {
        const requestBodies: ob.RequestBodiesObject = {};
        for (const model of this.models()) {
            requestBodies[model.name()] = model.requestBody();
        }
        return requestBodies;
    }

    /**
     * Return an ob.ResponsesObject containing generated responses
     * for this application.
     *
     * The default implementation iterates through the responses() methods
     * for each defined model.
     * // TODO - responses for HTTP errors
     */
    public responses(): ob.ResponsesObject {
        const responses: ob.ResponsesObject = {};
        for (const model of this.models()) {
            responses[model.name()] = model.response();
            responses[pluralize(model.name())] = model.responses();
        }
        return responses;
    }

    /**
     * Return an ob.SchemasObject containing generated ob.SchemaObject
     * instances for all model implementations for this application.
     *
     * The default implementation returns the result of calling schema()
     * and schemas() for each model implementation returned by models().
     */
    public schemas(): ob.SchemasObject {
        const schemas: ob.SchemasObject = {};
        this.models().forEach(model => {
            schemas[model.name()] = model.schema();
            schemas[pluralize(model.name())] = model.schemas();
        })
        return schemas;
    }

}

/**
 * Generic support for generating CRUD model OpenApi documentation.
 */
export abstract class AbstractModel {

    // For convenience, a Model implementation SHOULD have a public
    // static NAME field containing the singular name of this Model.
    //public static NAME: string;

    /**
     * Return the singular capitalized name for instances of this model.
     */
    public abstract name(): string;

    /**
     * Return an ob.RequestBodyObject for instances of this model.
     *
     * The default implementation constructs one based on
     * a content type of application/json and a schema reference
     * to this model.
     */
    public requestBody(): ob.RequestBodyObject {
        const builder = new ob.RequestBodyObjectBuilder()
            .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
                .schema(schemaRef(this.name()))
                .build())
            .required(true)
        ;
        return builder.build();
    }

    /**
     * Return an ob.ResponseObject for instances of this model
     * that return a single object.
     *
     * The default implementation constructs one based on
     * a content type of application/json and a schema reference
     * to singular schema for this model.
     */
    public response(): ob.ResponseObject {
        const builder = new ob.ResponseObjectBuilder(`The specified ${this.name()}`)
            .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
                .schema(schemaRef(this.name()))
                .build())
        ;
        return builder.build();
    }

    /**
     * Return an ob.ResponseObject for instances of this model
     * that return an array of objects.
     *
     * The default implementation constructs one based on
     * a content type of application/json and a schema reference
     * to the plural schema for this model.
     */
    public responses(): ob.ResponseObject {
        const builder = new ob.ResponseObjectBuilder(`The specified ${this.name()}`)
            .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
                .schema(schemaRef(pluralize(this.name())))
                .build())
        ;
        return builder.build();
    }


    /**
     * Return an ob.SchemaObject for this model.
     */
    public abstract schema(): ob.SchemaObject;

    /**
     * Return an ob.SchemaObject for an array of this model.
     * Default implementation simply pluralizes the name and indicates
     * that the result is an array.
     */
    public schemas(): ob.SchemaObject {
        return new ob.SchemaObjectBuilder()
            .items(schemaRef(this.name()))
            .type("array")
            .build();
    }


}

// Public Constants ----------------------------------------------------------

export const APPLICATION_JSON = "application/json";

// Public Functions ----------------------------------------------------------

/**
 * Return an ob.SchemaObject for the "active" property of the specified model.
 *
 * @param name                          Name of the specified model
 * @param nullable                      Is this object nullable? [true]
 */
export function activeSchema(name: string, nullable = true): ob.SchemaObject {
    return new ob.SchemaObjectBuilder(
        "boolean",
        `Is this ${name} active?`,
        nullable
    ).build();
}

/**
 * Return an ob.SchemaObject for the "id" property of the specified model.
 *
 * @param name                          Name of the specified model
 * @param nullable                      Is this object nullable? [true]
 */
export function idSchema(name: string, nullable = true): ob.SchemaObject {
    return new ob.SchemaObjectBuilder(
        "integer",
        `Primary key for this ${name}`,
        nullable,
    ).build();
}

/**
 * Return an ob.ReferenceObject for the schema of the specified model.
 *
 * @param name                          Name of the specified model
 */
export function schemaRef(name: string): ob.ReferenceObject {
    return new ob.ReferenceObjectBuilder(`#/components/schemas/${name}`)
        .build();
}

