// DetailServices ------------------------------------------------------------

// Services implementation for Detail models.

// Internal Modules ----------------------------------------------------------

import BaseChildServices from "./BaseChildServices";
import Category from "../models/Category";
import Detail from "../models/Detail";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";
import {FindOptions} from "sequelize";

// Public Classes ------------------------------------------------------------

class DetailServices extends BaseChildServices<Detail, Category> {

    constructor () {
        super(Category, Detail, SortOrder.DETAILS, [
            "categoryId",
            "date",
            "notes",
            "value",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withCategory                   Include owning Category
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withCategory) {
            include.push(Category);
        }
        if (include.length > 0) {
            options.include = include;
        };
        return options;
    }

    /**
     * Support match query parameters:
     * * categoryId                     Select Details for the specified Category ID
     * * date                           Select Details for the specified date
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = this.appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        const where: any = options.where ? options.where : {};
        if (query.categoryId) {
            where.categoryId = Number(query.categoryId);
        }
        if (query.date) {
            where.date = query.date;
        }
        return options;
    }

}

export default new DetailServices();
