// AbstractModel -------------------------------------------------------------

// Abstract base class for the OpenAPI documentation generator methods for a
// particular application data model class.  Default behavior for some methods
// has been implemented, but can be overridden as desired by a concrete subclass.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    APPLICATION_JSON,
    BAD_REQUEST,
    CREATED,
    FORBIDDEN,
    LIMIT,
    NOT_FOUND,
    OFFSET,
    OK, parameterRef,
    requestBodyRef,
    responseRef,
    schemaRef,
    UNAUTHORIZED
} from "./Helpers";
import {parametersPaginations} from "../Application";

// Public Objects ------------------------------------------------------------

/**
 * Abstract base class describing a particular application data model.
 */
export abstract class AbstractModel {

    /**
     * Return the singular capitalized name for instances of this model.
     */
    public abstract name(): string;

    /**
     * Return the plural capitalized name for instance of this model.
     *
     * The default implementation uses pluralize() on the name() value.
     */
    public names(): string {
        return pluralize(this.name());
    }

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to return all model objects that match the specified criteria.
     *
     * The default implementation returns a generic operation builder.
     *
     * @param tag                       Optional tag for this operation
     * @param includes                  Optional builder for include query parameters
     * @param matches                   Optional builder for matches query parameters
     */
    public operationAll(tag: string | null,
                        includes: ob.ParametersObjectBuilder | null,
                        matches: ob.ParametersObjectBuilder | null)
        : ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            .description(`Return all matching ${this.names()}`)
            .parameters(parametersPaginations().build())
            .parameters(includes ? includes.build() : {})
            .parameters(matches ? matches.build() : {})
            .response(OK, responseRef(this.names()))
            .response(UNAUTHORIZED, responseRef(UNAUTHORIZED))
            .response(FORBIDDEN, responseRef(FORBIDDEN))
            .summary(`The requested ${this.names()}`)
        ;
        if (tag) {
            builder.tag(tag);
        }
        return builder;
    }

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to return all model objects of children of this parent model
     * that match the specified criteria.
     *
     * The default implementation returns a generic operation builder.
     *
     * @param model                     AbstractModel of the child model
     * @param tag                       Optional tag for this operation
     * @param includes                  Optional builder for include query parameters
     * @param matches                   Optional builder for matches query parameters
     */
    public operationChildren(model: AbstractModel, tag: string | null,
                             includes: ob.ParametersObjectBuilder | null,
                             matches: ob.ParametersObjectBuilder | null)
    :ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            .description(`Return matching ${model.names()} for this ${this.name()}`)
            .parameters(includes ? includes.build() : {})
            .parameters(matches ? matches.build() : {})
            .response(OK, responseRef(`${model.names()}`))
            .response(UNAUTHORIZED, responseRef(UNAUTHORIZED))
            .response(FORBIDDEN, responseRef(FORBIDDEN))
            .response(NOT_FOUND, responseRef(NOT_FOUND))
            .summary(`The requested ${model.names()}`)
        ;
        if (tag) {
            builder.tag(tag);
        }
        return builder;
    }

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to return the specified model object by ID.
     *
     * The default implementation returns a generic operation builder.
     *
     * @param tag                       Optional tag for this operation
     * @param includes                  Optional builder for include query parameters
     */
    public operationFind(tag: string | null, includes: ob.ParametersObjectBuilder | null)
    : ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            .description(`Find the specified ${this.name()} by ID`)
            .parameters(includes ? includes.build() : {})
            .response(OK, responseRef(`${this.name()}`))
            .response(UNAUTHORIZED, responseRef(UNAUTHORIZED))
            .response(FORBIDDEN, responseRef(FORBIDDEN))
            .response(NOT_FOUND, responseRef(NOT_FOUND))
            .summary(`The specified ${this.name()}`)
        ;
        return builder;
    }

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to insert a new model, and return the inserted model with ID.
     *
     * The default implementation returns a generic operation builder.
     *
     * @param tag                       Optional tag for this operation
     */
    public operationInsert(tag: string | null): ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            .description(`Insert and return the specified ${this.name()}`)
            .requestBody(requestBodyRef(`${this.name()}`))
            .response(CREATED, responseRef(`${this.name()}`))
            .response(BAD_REQUEST, responseRef(BAD_REQUEST))
            .response(UNAUTHORIZED, responseRef(UNAUTHORIZED))
            .response(FORBIDDEN, responseRef(FORBIDDEN))
            .summary(`The inserted ${this.name()}`)
        ;
        return builder;
    }

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to remove an existing model, and return the removed model.
     *
     * The default implementation returns a generic builder.
     *
     * @param tag                       Optional tag for this operation
     */
    public operationRemove(tag: string | null): ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            .description(`Remove and return the specified ${this.name()}`)
            .response(OK, responseRef(`${this.name()}`))
            .response(UNAUTHORIZED, responseRef(UNAUTHORIZED))
            .response(FORBIDDEN, responseRef(FORBIDDEN))
            .response(NOT_FOUND, responseRef(NOT_FOUND))
            .summary(`The removed ${this.name()}`)
        ;
        return builder;
    }

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to update an existing model, and return the updated model.
     *
     * The default implementation returns a generic builder.
     *
     * @param tag                       Optional tag for this operation
     */
    public operationUpdate(tag: string | null): ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            .description(`Update and return the specified ${this.name()}`)
            .requestBody(requestBodyRef(this.name()))
            .response(OK, responseRef(this.name()))
            .response(BAD_REQUEST, responseRef(BAD_REQUEST))
            .response(UNAUTHORIZED, responseRef(UNAUTHORIZED))
            .response(FORBIDDEN, responseRef(FORBIDDEN))
            .response(NOT_FOUND, responseRef(NOT_FOUND))
            .summary(`The updated ${this.name()}`)
        ;
        return builder;
    }

    // TODO - parametersIncludes

    // TODO - parametersMatches

    /**
     * Generate a ParametersObjectBuilder for query parameters that
     * specify pagination configuration.
     *
     * The default implementation returns LIMIT and OFFSET parameters
     */
    public parametersPagination(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder()
            .parameter(LIMIT, parameterRef(LIMIT))
            .parameter(OFFSET, parameterRef(OFFSET))
        ;
        return builder;
    }

    /**
     * Generate a RequestBodyObjectBuilder for instances of this model.
     *
     * The default implementation constructs one based on
     * a content type of application/json and a schema reference
     * to this model.
     */
    public requestBody(): ob.RequestBodyObjectBuilder {
        const builder = new ob.RequestBodyObjectBuilder()
            .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
                .schema(schemaRef(this.name()))
                .build())
            .required(true)
        ;
        return builder;
    }

    /**
     * Generate a ResponseObjectBuilder for instances of this model
     * that return a single object.
     *
     * The default implementation constructs one based on
     * a content type of application/json and a schema reference
     * to singular schema for this model.
     */
    public response(): ob.ResponseObjectBuilder {
        const builder = new ob.ResponseObjectBuilder(`The specified ${this.name()}`)
            .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
                .schema(schemaRef(this.name()))
                .build())
        ;
        return builder;
    }

    /**
     * Return an ob.ResponseObjectBuilder for instances of this model
     * that return an array of objects.
     *
     * The default implementation constructs one based on
     * a content type of application/json and a schema reference
     * to the plural schema for this model.
     */
    public responses(): ob.ResponseObjectBuilder {
        const builder = new ob.ResponseObjectBuilder(`The specified ${pluralize(this.name())}`)
            .content(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
                .schema(schemaRef(pluralize(this.name())))
                .build())
        ;
        return builder;
    }

    /**
     * Generate a SchemaObjectBuilder for this model.
     */
    public abstract schema(): ob.SchemaObjectBuilder;

    /**
     * Generate a SchemaObjectBuilder for an array of this model.
     *
     * The default implementation pluralizes the name and indicates
     * that the result is an array.
     */
    public schemas(): ob.SchemaObjectBuilder {
        return new ob.SchemaObjectBuilder()
            .items(schemaRef(this.name()))
            .type("array")
            ;
    }

}

export default AbstractModel;
