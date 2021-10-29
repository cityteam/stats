// FacilityServices ----------------------------------------------------------

// Services implementation for Facility models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseParentServices from "./BaseParentServices";
import CategoryServices from "./CategoryServices";
import Category from "../models/Category";
import Facility from "../models/Facility";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";
import {NotFound} from "../util/HttpErrors";
import StandardCategories from "../util/StandardCategories.json";

// Public Classes ------------------------------------------------------------

class FacilityServices extends BaseParentServices<Facility> {

    constructor () {
        super(Facility, SortOrder.FACILITIES, [
            "active",
            "address1",
            "address2",
            "city",
            "email",
            "phone",
            "scope",
            "state",
            "zipCode",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    public async categories(facilityId: number, query?: any): Promise<Category[]> {
        const facility = await this.read("FacilityServices.categories", facilityId);
        const options: FindOptions = CategoryServices.appendMatchOptions({
            order: SortOrder.CATEGORIES,
        }, query);
        return await facility.$get("categories", options);
    }

    public async exact(name: string, query?: any): Promise<Facility> {
        const options: FindOptions = this.appendIncludeOptions({
            where: { name: name }
        }, query);
        const result = await Facility.findOne(options);
        if (result) {
            return result;
        } else {
            throw new NotFound(
                `name: Missing Facility '${name}'`,
                "FacilityServices.exact");
        }
    }

    // Populate Categories for this Facility (MUST have none first)
    public async populate(facilityId: number): Promise<Category[]> {
        StandardCategories.forEach(standardCategory => {
            // @ts-ignore
            standardCategory.facilityId = facilityId;
        });
        const results = await Category.bulkCreate(StandardCategories as Category[]);
        return results;
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withCategories                 Include child Categories
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
        if (include.length > 0) {
            options.include = include;
        };
        return options;
    }

    /**
     * Support match query parameters:
     * * active                         Select active Facilities
     * * name={wildcard}                Select Facilities with name matching {wildcard}
     * * scope={scope}                  Select Facilities with scope equalling {scope}
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
        if (query.name) {
            where.name = { [Op.iLike]: `%${query.name}'`};
        }
        if (query.scope) {
            where.scope = query.scope;
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }
}

export default new FacilityServices();
