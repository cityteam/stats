// ToModelTypes --------------------------------------------------------------

// Convert arbitrary objects or arrays to the specified Model objects.

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Category from "../models/Category";
import Detail from "../models/Detail";
import Facility from "../models/Facility";
import RefreshToken from "../models/RefreshToken";
import Section from "../models/Section";
import Summary from "../models/Summary";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const toAccessToken = (value: any): AccessToken => {
    return new AccessToken(value);
}

export const toAccessTokens = (values: any[]): AccessToken[] => {
    const results: AccessToken[] = [];
    values.forEach(value => {
        results.push(new AccessToken(value));
    });
    return results;
}

export const toCategory = (value: any): Category => {
    return new Category(value);
}

export const toCategories = (values: any[]): Category[] => {
    const results: Category[] = [];
    values.forEach(value => {
        results.push(new Category(value));
    });
    return results;
}

export const toDetail = (value: any): Detail => {
    return new Detail(value);
}

export const toDetails = (values: any[]): Detail[] => {
    const results: Detail[] = [];
    values.forEach(value => {
        results.push(new Detail(value));
    });
    return results;
}

export const toFacility = (value: any): Facility => {
    return new Facility(value);
}

export const toFacilities = (values: any[]): Facility[] => {
    const results: Facility[] = [];
    values.forEach(value => {
        results.push(new Facility(value));
    });
    return results;
}

export const toRefreshToken = (value: any): RefreshToken => {
    return new RefreshToken(value);
}

export const toRefreshTokens = (values: any[]): RefreshToken[] => {
    const results: RefreshToken[] = [];
    values.forEach(value => {
        results.push(new RefreshToken(value));
    });
    return results;
}

export const toSection = (value: any): Section => {
    return new Section(value);
}

export const toSections = (values: any[]): Section[] => {
    const results: Section[] = [];
    values.forEach(value => {
        results.push(new Section(value));
    });
    return results;
}

export const toSummary = (value: any): Summary => {
    return new Summary(value);
}

export const toSummaries = (values: any[]): Summary[] => {
    const results: Summary[] = [];
    values.forEach(value => {
        results.push(new Summary(value));
    });
    return results;
}

export const toUser = (value: any): User => {
    return new User(value);
}

export const toUsers = (values: any[]): User[] => {
    const results: User[] = [];
    values.forEach(value => {
        results.push(new User(value));
    });
    return results;
}

