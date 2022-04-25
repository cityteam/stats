// ToModel -------------------------------------------------------------------

// Convert arbitrary objects or arrays to the specified Model objects.

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Category from "../models/Category";
import Facility from "../models/Facility";
import RefreshToken from "../models/RefreshToken";
import Section from "../models/Section";
import Summary from "../models/Summary";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKEN = (value: any): AccessToken => {
    return new AccessToken(value);
}

export const ACCESS_TOKENS = (values: any[]): AccessToken[] => {
    const results: AccessToken[] = [];
    values.forEach(value => {
        results.push(new AccessToken(value));
    });
    return results;
}

export const CATEGORY = (value: any): Category => {
    return new Category(value);
}

export const CATEGORIES = (values: any[]): Category[] => {
    const results: Category[] = [];
    values.forEach(value => {
        results.push(new Category(value));
    });
    return results;
}

export const FACILITY = (value: any): Facility => {
    return new Facility(value);
}

export const FACILITIES = (values: any[]): Facility[] => {
    const results: Facility[] = [];
    values.forEach(value => {
        results.push(new Facility(value));
    });
    return results;
}

export const REFRESH_TOKEN = (value: any): RefreshToken => {
    return new RefreshToken(value);
}

export const REFRESH_TOKENS = (values: any[]): RefreshToken[] => {
    const results: RefreshToken[] = [];
    values.forEach(value => {
        results.push(new RefreshToken(value));
    });
    return results;
}

export const SECTION = (value: any): Section => {
    return new Section(value);
}

export const SECTIONS = (values: any[]): Section[] => {
    const results: Section[] = [];
    values.forEach(value => {
        results.push(new Section(value));
    });
    return results;
}

export const SUMMARY = (value: any): Summary => {
    return new Summary(value);
}

export const SUMMARIES = (values: any[]): Summary[] => {
    const results: Summary[] = [];
    values.forEach(value => {
        results.push(new Summary(value));
    });
    return results;
}

export const USER = (value: any): User => {
    return new User(value);
}

export const USERS = (values: any[]): User[] => {
    const results: User[] = [];
    values.forEach(value => {
        results.push(new User(value));
    });
    return results;
}

