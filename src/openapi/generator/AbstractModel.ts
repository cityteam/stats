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

// Public Objects ------------------------------------------------------------

/**
 * Abstract base class describing a particular application data model.
 */
export abstract class AbstractModel {

    /**
     * Return the API path to the collection endpoint for the specified
     * children of the specified model.
     *
     * @param child                     The child model
     *
     * The default implementation returns
     * `${this.apiDetail(this.apiPathId())}/${child.names().toLowerCase()}`
     */
    public apiChildren(child: AbstractModel) {
        return `${this.apiDetail()}/${child.names().toLowerCase()}`;
    }

    /**
     * Return the API path to the collection endpoint for this model.
     *
     * The default implementation returns
     * `${this.apiPrefix()}/${this.names())}`
     */
    public apiCollection(): string {
        return `${this.apiPrefix()}/${this.names().toLowerCase()}`;
    }

    /**
     * Return the API path to the detail endpoint for the specified model.
     *
     * The default implementation returns
     * `${this.apiPrefix()}/${pluralize(this.names())}/{${this.apiPathId()}}`
     */
    public apiDetail(): string {
        return `${this.apiCollection()}/{${this.apiPathId()}}`;
    }

    /**
     * Return the name of the ID parameter for detail paths.
     *
     * The default implementation returns "id".
     */
    public apiPathId(): string {
        return "id";
    }

    /**
     * Return the API prefix (starting with a slash) for all API paths for this
     * application's APIs for this model.
     *
     * The default implementation returns "/api".
     */
    public apiPrefix(): string {
        return "/api";
    }

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
     * Generate a configured OperationObjectBuilder that describes a request
     * to return all model objects that match the specified criteria
     */
    public abstract operationAll(): ob.OperationObjectBuilder;

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
    public operationAllBuilder(tag: string | null,
                               includes: ob.ParametersObjectBuilder | null,
                               matches: ob.ParametersObjectBuilder | null)
        : ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            .description(`Return all matching ${this.names()}`)
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

    // TODO - operationChildren(child) ???

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
    public operationChildrenBuilder(model: AbstractModel, tag: string | null,
                                    includes: ob.ParametersObjectBuilder | null,
                                    matches: ob.ParametersObjectBuilder | null)
        : ob.OperationObjectBuilder {
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
     * Generate a configured OperationObjectBuilder that describes a request
     * to return the specified model object by ID.
     */
    public abstract operationFind(): ob.OperationObjectBuilder;

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to return the specified model object by ID.
     *
     * The default implementation returns a generic operation builder.
     *
     * @param tag                       Optional tag for this operation
     * @param includes                  Optional builder for include query parameters
     */
    public operationFindBuilder(tag: string | null,
                                includes: ob.ParametersObjectBuilder | null)
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
        if (tag) {
            builder.tag(tag);
        }
        return builder;
    }

    /**
     * Generate a configured OperationObjectBuilder that describes a request
     * to insert a new model, and return the inserted model with ID.
     */
    public abstract operationInsert(): ob.OperationObjectBuilder;

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to insert a new model, and return the inserted model with ID.
     *
     * The default implementation returns a generic operation builder.
     *
     * @param tag                       Optional tag for this operation
     */
    public operationInsertBuilder(tag: string | null): ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            .description(`Insert and return the specified ${this.name()}`)
            .requestBody(requestBodyRef(`${this.name()}`))
            .response(CREATED, responseRef(`${this.name()}`))
            .response(BAD_REQUEST, responseRef(BAD_REQUEST))
            .response(UNAUTHORIZED, responseRef(UNAUTHORIZED))
            .response(FORBIDDEN, responseRef(FORBIDDEN))
            .summary(`The inserted ${this.name()}`)
        ;
        if (tag) {
            builder.tag(tag);
        }
        return builder;
    }

    /**
     * Generate a configured OperationObjectBuilder that describes a request
     * to remove an existing model, and return the removed model.
     */
    public abstract operationRemove(): ob.OperationObjectBuilder;

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to remove an existing model, and return the removed model.
     *
     * The default implementation returns a generic builder.
     *
     * @param tag                       Optional tag for this operation
     */
    public operationRemoveBuilder(tag: string | null): ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            .description(`Remove and return the specified ${this.name()}`)
            .response(OK, responseRef(`${this.name()}`))
            .response(UNAUTHORIZED, responseRef(UNAUTHORIZED))
            .response(FORBIDDEN, responseRef(FORBIDDEN))
            .response(NOT_FOUND, responseRef(NOT_FOUND))
            .summary(`The removed ${this.name()}`)
        ;
        if (tag) {
            builder.tag(tag);
        }
        return builder;
    }

    /**
     * Generate a configured OperationObjectBuilder that describes a request
     * to update an existing model, and return the updated model.
     */
    public abstract operationUpdate(): ob.OperationObjectBuilder;

    /**
     * Generate an OperationObjectBuilder that describes a request
     * to update an existing model, and return the updated model.
     *
     * The default implementation returns a generic builder.
     *
     * @param tag                       Optional tag for this operation
     */
    public operationUpdateBuilder(tag: string | null): ob.OperationObjectBuilder {
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
        if (tag) {
            builder.tag(tag);
        }
        return builder;
    }

    /**
     * Generate a ParametersObjectBuilder for query parameters that
     * specify inclusion of parent and/or children for retrieval of this model.
     *
     * The default implementation returns an empty builder
     */
    public parametersIncludes(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder()
        ;
        return builder;
    }

    /**
     * Generate a ParametersObjectBuilder for query parameters that
     * specify match conditions for retrieval of this model.
     *
     * The default implementation returns an empty builder
     */
    public parametersMatches(): ob.ParametersObjectBuilder {
        const builder = new ob.ParametersObjectBuilder()
        ;
        return builder;
    }

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
     * Generate a PathItemObjectBuilder for the "collection" path
     * for this model.
     *
     * The default implementation will return a builder configured
     * with a GET for operationAll() and a POST for operationInsert()
     */
    public pathCollection(): ob.PathItemObjectBuilder {
        const builder = new ob.PathItemObjectBuilder()
            .description(`Collection operations for ${this.names()}`)
            .get(this.operationAll().build())
            .post(this.operationInsert().build())
        ;
        return builder;
    }

    /**
     * Generate a PathItemObjectBuilder for the "detail" path
     * for this model.
     *
     * The default implementation will return a builder configured
     * with a GET for operationFind(), a DELETE for operationRemove(),
     * and a PUT for operationUpdate()
     */
    public pathDetail(): ob.PathItemObjectBuilder {
        const builder = new ob.PathItemObjectBuilder()
                .description(`Detail operations for this ${this.name()}`)
                .get(this.operationFind().build())
                .delete(this.operationRemove().build())
                .put(this.operationUpdate().build())
        ;
        return builder;
    }

    // TODO - path(s) for children???

    /**
     * Generate a PathsObjectBuilder for all of the paths for this model.
     *
     * The default implementation will return the results of pathCollection()
     * and pathDetail().
     */
    public paths(): ob.PathsObjectBuilder {
        const builder = new ob.PathsObjectBuilder()
            .path(this.apiCollection(), this.pathCollection().build())
            .path(this.apiDetail(), this.pathDetail().build())
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
