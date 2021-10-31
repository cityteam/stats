// Sorters -------------------------------------------------------------------

// Utility functions to sort arrays of objects into the preferred order.

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Category from "../models/Category";
import Facility from "../models/Facility";
import RefreshToken from "../models/RefreshToken";
import Section from "../models/Section";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKENS = (accessTokens: AccessToken[]): AccessToken[] => {
    return accessTokens.sort(function (a, b) {
        if (a.expires > b.expires) {
            return 1;
        } else if (a.expires < b.expires) {
            return -1;
        } else {
            return 0;
        }
    })
}

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

export const REFRESH_TOKENS = (refreshTokens: RefreshToken[]): RefreshToken[] => {
    return refreshTokens.sort(function (a, b) {
        if (a.expires > b.expires) {
            return 1;
        } else if (a.expires < b.expires) {
            return -1;
        } else {
            return 0;
        }
    })
}

export const SECTIONS = (sections: Section[]): Section[] => {
    return sections.sort(function (a, b) {
        if (a.ordinal > b.ordinal) {
            return 1;
        } else if (a.ordinal < b.ordinal) {
            return -1;
        } else {
            return 0;
        }
    });
}

