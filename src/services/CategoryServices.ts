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
import FacilityServices from "./FacilityServices";
import {NotFound} from "../util/HttpErrors";
import DetailServices from "./DetailServices";

// Public Classes ------------------------------------------------------------

class CategoryServices extends BaseChildServices<Category, Facility> {

    constructor () {
        super(Facility, Category, SortOrder.CATEGORIES, [
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

    public async details(facilityId: number, categoryId: number, query?: any): Promise<Detail[]> {
        const facility = await FacilityServices.read("CategoryServices.details", facilityId);
        const category = await this.read("CategoryServices.details", facilityId, categoryId);
        const options: FindOptions = DetailServices.appendMatchOptions({
            order: SortOrder.DETAILS,
        }, query);
        return await category.$get("details", options);
    }

    public async exact(facilityId: number, ordinal: number, query?: any): Promise<Category> {
        const facility = await FacilityServices.read("CategoryServices.exact", facilityId);
        const options: FindOptions = this.appendIncludeOptions({
            where: { ordinal: ordinal }
        }, query);
        const results = await facility.$get("categories", options);
        if (results.length !== 1) {
            throw new NotFound(
                `ordinal: Missing Category '${ordinal}'`,
                "CategoryServices.exact"
            );
        }
        return results[0];
    }

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
     * * ordinal={ordinal}              Select Category with matching ordinal
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
        if ("" === query.ordinal) {
            where.ordinal = Number(query.ordinal);
        }
        return options;
    }

}

export default new CategoryServices();
