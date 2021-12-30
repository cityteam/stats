// Summary -------------------------------------------------------------------

// OpenAPI definition of a Summary model.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    DATE, DATE_FROM, DATE_TO, FACILITY_ID,
    MATCH_ACTIVE, MATCH_SECTION_IDS,
    REQUIRE_REGULAR, SECTION_ID, VALUES
} from "./Constants";

// Public Objects ------------------------------------------------------------

class Summary extends ob.AbstractModel {

    public NAME = "Summary";

    public apiDailies(): string {
        return `${super.apiCollection()}/{${FACILITY_ID}}/dailies/{${DATE_FROM}}/{${DATE_TO}}`;
    }

    public apiMonthlies(): string {
        return `${super.apiCollection()}/{${FACILITY_ID}}/monthlies/{${DATE_FROM}}/{${DATE_TO}}`;
    }

    public apiReadWrite(): string {
        return `${super.apiCollection()}/{${FACILITY_ID}}/{${SECTION_ID}}/{${DATE}}`
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

    public operationDailies(): ob.OperationObjectBuilder {
        return super.operationAllBuilder(REQUIRE_REGULAR, null, null);
    }

    public operationFind(): ob.OperationObjectBuilder {
        return new ob.OperationObjectBuilder(); // Not used
    }

    public operationInsert(): ob.OperationObjectBuilder {
        return new ob.OperationObjectBuilder(); // Not used
    }

    public operationMonthlies(): ob.OperationObjectBuilder {
        return super.operationAllBuilder(REQUIRE_REGULAR, null, null);
    }

    public operationRead(): ob.OperationObjectBuilder {
        return super.operationFindBuilder(REQUIRE_REGULAR, null)
            .description(`Retrieve the specified ${this.name()}`)
            .summary(`The specified ${this.name()}`);
    }

    public operationRemove(): ob.OperationObjectBuilder {
        return new ob.OperationObjectBuilder(); // Not used
    }

    public operationUpdate(): ob.OperationObjectBuilder {
        return new ob.OperationObjectBuilder(); // Not used
    }

    public operationWrite(): ob.OperationObjectBuilder {
        return super.operationInsertBuilder(REQUIRE_REGULAR)
            .description(`Insert or update the specified ${this.name()}`)
            .summary(`The new or updated ${this.name()}`);
    }

    public pathDailies(): ob.PathItemObjectBuilder {
        const builder = new ob.PathItemObjectBuilder()
            .description(`Retrieve daily ${this.names()}`)
            .get(this.operationDailies().build())
            .parameter(ob.parameterRef(FACILITY_ID))
            .parameter(ob.parameterRef(DATE_FROM))
            .parameter(ob.parameterRef(DATE_TO))
            .parameter(ob.parameterRef(MATCH_ACTIVE))
            .parameter(ob.parameterRef(MATCH_SECTION_IDS))
        ;
        return builder;
    }

    public pathMonthlies(): ob.PathItemObjectBuilder {
        const builder = new ob.PathItemObjectBuilder()
            .description(`Retrieve monthly ${this.names()}`)
            .get(this.operationMonthlies().build())
            .parameter(ob.parameterRef(FACILITY_ID))
            .parameter(ob.parameterRef(DATE_FROM))
            .parameter(ob.parameterRef(DATE_TO))
            .parameter(ob.parameterRef(MATCH_ACTIVE))
            .parameter(ob.parameterRef(MATCH_SECTION_IDS))
        ;
        return builder;
    }

    public pathReadWrite(): ob.PathItemObjectBuilder {
        const builder = new ob.PathItemObjectBuilder()
            .description(`Retrieve daily ${this.name()}`)
            .get(this.operationRead().build())
            .parameter(ob.parameterRef(FACILITY_ID))
            .parameter(ob.parameterRef(SECTION_ID))
            .parameter(ob.parameterRef(DATE))
            .post(this.operationWrite().build())
        ;
        return builder;
    }

    public paths(): ob.PathsObjectBuilder {
        const builder = new ob.PathsObjectBuilder()
                .path(this.apiDailies(), this.pathDailies().build())
                .path(this.apiMonthlies(), this.pathMonthlies().build())
                .path(this.apiReadWrite(), this.pathReadWrite().build())
        ;
        return builder;
    }

    public schema(): ob.SchemaObjectBuilder {
        const builder = new ob.SchemaObjectBuilder(
            "object",
            "A set of statistics collected or reported for a particular " +
            "Section, on a particular date."
        )
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
