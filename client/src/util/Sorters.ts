// Sorters -------------------------------------------------------------------

// Utility functions to sort arrays of objects into the preferred order.

// Internal Modules ----------------------------------------------------------

import Category from "../models/Category";
import Facility from "../models/Facility";

// Public Objects ------------------------------------------------------------

export const CATEGORIES = (categories: Category[]): Category[] => {
    return categories.sort(function (a, b) {
        if (a.ordinal > b.ordinal) {
            return 1;
        } else if (a.ordinal < b.ordinal) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const FACILITIES = (facilities: Facility[]): Facility[] => {
    return facilities.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

