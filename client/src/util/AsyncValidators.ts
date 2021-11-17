// AsyncValidators -----------------------------------------------------------

// Custom (to this application) validation methods that must interact with
// the server asynchronously to perform their validations.  In all cases,
// a "true" return value indicates that the proposed value is valid, while
// "false" means it is not.  If a field is required, that must be validated
// separately.

// The methods defined here should correspond (in name and parameters) to
// the similar ones in the server side AsynchValidators set, because they
// perform the same semantic functions.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import Category, {CATEGORIES_BASE} from "../models/Category";
import Facility, {FACILITIES_BASE} from "../models/Facility";
import Section, {SECTIONS_BASE} from "../models/Section";
import User, {USERS_BASE} from "../models/User";
import {queryParameters} from "./QueryParameters";

// Public Objects ------------------------------------------------------------

export const validateCategoryOrdinalUnique = async (facility: Facility, category: Category): Promise<boolean> => {
    if (category && category.ordinal) {
        try {
            const result = (await Api.get(CATEGORIES_BASE
                + `/${facility.id}/${category.sectionId}/exact/${category.ordinal}`)).data;
            return (result.id === category.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateFacilityNameUnique = async (facility: Facility): Promise<boolean> => {
    if (facility && facility.name) {
        try {
            const result = (await Api.get(FACILITIES_BASE
                + `/exact/${facility.name}`)).data;
            return (result.id === facility.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateFacilityScopeUnique = async (facility: Facility): Promise<boolean> => {
    if (facility && facility.scope) {
        try {
            const parameters = {
                scope: facility.scope,
            }
            const results = (await Api.get(FACILITIES_BASE
                + `${queryParameters(parameters)}`)).data;
            return (results.length === 0) || (results[0].id === facility.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateSectionOrdinalUnique = async (section: Section): Promise<boolean> => {
    if (section && section.ordinal) {
        try {
            const result = (await Api.get(SECTIONS_BASE
                + `/${section.facilityId}/exact/${section.ordinal}`)).data;
            return (result.id === section.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateUserUsernameUnique = async (user: User): Promise<boolean> => {
    if (user && user.username) {
        try {
            const result = (await Api.get(USERS_BASE
                + `/exact/${user.username}`)).data;
            return (result.id === user.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}
