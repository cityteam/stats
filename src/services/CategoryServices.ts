// CategoryServices ----------------------------------------------------------

// Services implementation for Category models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseChildServices from "./BaseChildServices";
import Category from "../models/Category";
import Detail from "../models/Detail";
import Facility from "../models/Facility";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";

// Public Classes ------------------------------------------------------------

class CategoryServices extends BaseChildServices<Category, Facility> {

    constructor () {
        super(Facility, Category, SortOrder.FACILITIES, [
            "active",
            "description",
            "facilityId",
            "notes",
            "ordinal",
            "service",
            "scope",
            "slug",
            "type",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withDetails                    Include child Details
     * * withFacility                   Include owning Facility
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withDetails) {
            include.push(Detail);
        }
        if ("" === query.withFacility) {
            include.push(Facility);
        }
        if (include.length > 0) {
            options.include = include;
        };
        return options;
    }

    /**
     * Support match query parameters:
     * * active                         Select active Categories
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = this.appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        const where: any = options.where ? options.where : {};
        if ("" === query.active) {
            where.active = true
        }
        return options;
    }

}

export default new CategoryServices();
