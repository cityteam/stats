// Abridgers -----------------------------------------------------------------

// Return abridged versions of model objects for use in log events.

// Internal Modules ----------------------------------------------------------

import Category from "../models/Category";
import Facility from "../models/Facility";
import Section from "../models/Section";
import Summary from "../models/Summary";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const ANY = (model: object): object => {
    if (model instanceof Category) {
        return CATEGORY(model);
    } else if (model instanceof Facility) {
        return FACILITY(model);
    } else if (model instanceof Section) {
        return SECTION(model);
    } else if (model instanceof User) {
        return USER(model);
    } else {
        return model;
    }

}

export const CATEGORY = (category: Category): object => {
    return {
        id: category.id,
        ordinal: category.ordinal,
        sectionId: category.sectionId,
        slug: category.slug,
    };
}

export const CATEGORIES = (categories: Category[]): object[] => {
    const results: object[] = [];
    categories.forEach(category => {
        results.push(CATEGORY(category));
    });
    return results;
}

export const FACILITY = (facility: Facility): object => {
    return {
        id: facility.id,
        name: facility.name,
    };
}

export const FACILITIES = (facilities: Facility[]): object[] => {
    const results: object[] = [];
    facilities.forEach(facility => {
        results.push(FACILITY(facility));
    });
    return results;
}

export const SECTION = (section: Section): object => {
    return {
        id: section.id,
        facilityId: section.facilityId,
        ordinal: section.ordinal,
        slug: section.slug,
    };
}

export const SECTIONS = (sections: Section[]): object[] => {
    const results: object[] = [];
    sections.forEach(section => {
        results.push(SECTION(section));
    });
    return results;
}

export const SUMMARY = (summary: Summary): object => {
    return {
        sectionId: summary.sectionId,
        date: summary.date,
        count: Object.keys(summary).length,
    }
}

export const SUMMARIES = (summaries: Summary[]): object[] => {
    const results: object[] = [];
    summaries.forEach(summary => {
        results.push(SUMMARY(summary));
    });
    return results;
}

export const USER = (user: User): object => {
    return {
        id: user.id,
        username: user.username,
    };
}

export const USERS = (users: User[]): object[] => {
    const results: object[] = [];
    users.forEach(user => {
        results.push(USER(user));
    });
    return results;
}
