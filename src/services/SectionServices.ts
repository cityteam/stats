// SectionServices ----------------------------------------------------------

// Services implementation for Section models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseChildServices from "./BaseChildServices";
import CategoryServices from "./CategoryServices";
import FacilityServices from "./FacilityServices";
import Category from "../models/Category";
import Daily from "../models/Daily";
import Facility from "../models/Facility";
import Section from "../models/Section";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";
import {NotFound} from "../util/HttpErrors";

// Public Classes ------------------------------------------------------------

class SectionServices extends BaseChildServices<Section, Facility> {

    constructor () {
        super(Facility, Section, SortOrder.SECTIONS, [
            "active",
            "facilityId",
            "notes",
            "ordinal",
            "scope",
            "slug",
            "title",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    public async categories(facilityId: number, sectionId: number, query?: any): Promise<Category[]> {
        const facility = await FacilityServices.read("SectionServices.categories", facilityId);
        const section = await this.read("SectionServices.sections", facilityId, sectionId);
        const options: FindOptions = CategoryServices.appendMatchOptions({
            order: SortOrder.CATEGORIES,
        }, query);
        return await section.$get("categories", options);
    }

    public async exact(facilityId: number, ordinal: number, query?: any): Promise<Section> {
        const facility = await FacilityServices.read("SectionServices.exact", facilityId);
        const options: FindOptions = this.appendIncludeOptions({
            where: { ordinal : ordinal },
        });
        const results = await facility.$get("sections", options);
        if (results.length !== 1) {
            throw new NotFound(
                `ordinal: Missing Section ${ordinal}`,
                "SectionServices.exact",
            );
        }
        return results[0];
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withCategories                 Include child Categories
     * * withFacility                   Include owning Facility
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withCategories) {
            include.push(Category);
        }
        if ("" === query.withDailies) {
            include.push(Daily);
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
     * * active                         Select active Sections
     * * ordinal={ordinal}              Select Section with matching ordinal
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
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new SectionServices();
