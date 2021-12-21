// AbstractApplication -------------------------------------------------------

// Abstract base class for the descriptor of an entire Application for which
// OpenAPI documentation is to be generated.  Default behavior for some methods
// has been implemented, but can be overridden as desired by a concrete subclass.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";

// Public Objects ------------------------------------------------------------

/**
 * Abstract base class describing the entire application.
 */
export abstract class AbstractApplication {

    /**
     * Generate a ComponentsObjectBuilder for this application.
     *
     * The default implementation uses the parameters(),
     * requestBodies(), responses(), and schemas() methods
     * from the concrete implementation.
     */
    public components(): ob.ComponentsObjectBuilder {
        const builder = new ob.ComponentsObjectBuilder()
            .parameters(this.parameters().build())
            .requestBodies(this.requestBodies().build())
            .responses(this.responses().build())
            .schemas(this.schemas().build())
        ;
        return builder;
    }

    /**
     * Generate an InfoObjectBuilder for this application.
     */
    public abstract info(): ob.InfoObjectBuilder;

    /**
     * Return a list of the model implementations for this application.
     */
    public abstract models(): AbstractModel[];

    /**
     * Generate a ParametersObjectBuilder containing required parameters
     * for this application.
     */
    public abstract parameters(): ob.ParametersObjectBuilder;

    /**
     * Generate a RequestBodiesObjectBuilder containing required request bodies
     * for this application.
     *
     * The default implementation iterates through the requestBody() methods
     * for each defined model.
     */
    public requestBodies(): ob.RequestBodiesObjectBuilder {
        const builder = new ob.RequestBodiesObjectBuilder();
        for (const model of this.models()) {
            builder.requestBody(model.name(), model.requestBody().build());
        }
        return builder;
    }

    /**
     * Return a ResponsesObjectBuilder containing required responses
     * for this application.
     *
     * The default implementation iterates through the response()
     * and responses() methods for each defined model.
     * // TODO - responses for HTTP errors
     */
    public responses(): ob.ResponsesObjectBuilder {
        const builder = new ob.ResponsesObjectBuilder();
        for (const model of this.models()) {
            builder.response(model.name(), model.response().build());
            builder.response(pluralize(model.name()), model.responses().build());
        }
        return builder;
    }

    /**
     * Generate a SchemasObjectBuilder containing generated SchemaObject
     * instances for all model implementations for this application.
     *
     * The default implementation returns the result of calling schema()
     * and schemas() for each model implementation returned by models().
     */
    public schemas(): ob.SchemasObjectBuilder {
        const builder = new ob.SchemasObjectBuilder();
        this.models().forEach(model => {
            builder.schema(model.name(), model.schema().build());
            builder.schema(pluralize(model.name()), model.schemas().build());
        })
        return builder;
    }

    /**
     * Append application specific tags to the specified OpenApiObjectBuilder.
     *
     * @param builder                   OpenApiObjectBuilder to append to
     */
    public tags(builder: ob.OpenApiObjectBuilder): void {
        ; // No changes
    }

}

export default AbstractApplication;
