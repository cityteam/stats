// Summary -------------------------------------------------------------------

// OpenAPI definition of a Summary model.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
import AbstractModel from "./generator/AbstractModel";
import {parameterRef, schemaActive, schemaId} from "./generator/Helpers";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    DATE, DATE_FROM, DATE_TO, FACILITY_ID, SECTION_ID, VALUES
} from "./Constants";

// Public Objects ------------------------------------------------------------

class Summary extends AbstractModel {

    public NAME = "Summary";

    public apiRead(): string {
        return `${super.apiCollection()}/{${FACILITY_ID}}/{${SECTION_ID}}/{${DATE}}`
    }

    public apiWrite(): string {
        return this.apiRead();
    }

    public name(): string {
        return this.NAME;
    }

    public names(): string {
        return pluralize(this.NAME);
    }

    public operationAll(): ob.OperationObjectBuilder {
        return new ob.OperationObjectBuilder(); // Not used
    }

    public operationFind(): ob.OperationObjectBuilder {
        return new ob.OperationObjectBuilder(); // Not used
    }

    public operationInsert(): ob.OperationObjectBuilder {
        return new ob.OperationObjectBuilder(); // Not used
    }

    public operationRead(): ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            // TODO
        ;
        return builder;
    }

    public operationRemove(): ob.OperationObjectBuilder {
        return new ob.OperationObjectBuilder(); // Not used
    }

    public operationUpdate(): ob.OperationObjectBuilder {
        return new ob.OperationObjectBuilder(); // Not used
    }

    public operationWrite(): ob.OperationObjectBuilder {
        const builder = new ob.OperationObjectBuilder()
            // TODO
        ;
        return builder;
    }

    public pathRead(): ob.PathItemObjectBuilder {
        const builder = new ob.PathItemObjectBuilder()
            // TODO
        ;
        return builder;
    }

    public pathWrite(): ob.PathItemObjectBuilder {
        const builder = new ob.PathItemObjectBuilder()
            // TODO
        ;
        return builder;
    }

    public paths(): ob.PathsObjectBuilder {
        const builder = new ob.PathsObjectBuilder()
            // TODO
        ;
        return builder;
    }

    public schema(): ob.SchemaObjectBuilder {
        const builder = new ob.SchemaObjectBuilder()
            .property(DATE, new ob.SchemaObjectBuilder(
                "string",
                "Date for which these statistics were collected",
                false).build())
            .property(SECTION_ID, new ob.SchemaObjectBuilder(
                "integer",
                "ID of the Section to which this Summary belongs",
                false).build())
            .property(VALUES, new ob.SchemaObjectBuilder(
                "object",
                "Map of categoryId: number -> value: number | null",
                false).build())
        ;
        return builder;
    }

}

export default new Summary();
