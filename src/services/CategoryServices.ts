// CategoryServices ----------------------------------------------------------

// Services implementation for Category models.

// External Modules ----------------------------------------------------------

import {FindOptions} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseChildServices from "./BaseChildServices";
import Category from "../models/Category";
import Section from "../models/Section";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";
import SectionServices from "./SectionServices";
import {NotFound} from "../util/HttpErrors";

// Public Classes ------------------------------------------------------------

class CategoryServices extends BaseChildServices<Category, Section> {

    constructor () {
        super(Section, Category, SortOrder.CATEGORIES, [
            "accumulated",
            "active",
            "description",
            "notes",
            "ordinal",
            "sectionId",
            "service",
            "slug",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    public async exact(facilityId: number, sectionId: number, ordinal: number, query?: any): Promise<Category> {
        const section = await SectionServices.read("CategoryServices.exact", facilityId, sectionId);
        const options: FindOptions = this.appendIncludeOptions({
            where: { ordinal: ordinal }
        }, query);
        const results = await section.$get("categories", options);
        if (results.length !== 1) {
            throw new NotFound(
                `ordinal: Missing Category ${ordinal}`,
                "CategoryServices.exact"
            );
        }
        return results[0];
    }


    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withSection                    Include owning Section
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withSection) {
            include.push(Section);
        }
        if (include.length > 0) {
            options.include = include;
        }
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
        if (query.ordinal) {
            where.ordinal = Number(query.ordinal);
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new CategoryServices();
