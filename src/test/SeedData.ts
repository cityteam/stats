// SeedData ------------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Category from "../models/Category";
import Facility from "../models/Facility";
import RefreshToken from "../models/RefreshToken";
import Section from "../models/Section";
import User from "../models/User";

// Seed Data -----------------------------------------------------------------

// ----- AccessTokens --------------------------------------------------------

const ONE_DAY = 24 * 60 * 60 * 1000;    // One day (milliseconds)

export const ACCESS_TOKENS_SUPERUSER: Partial<AccessToken>[] = [
    {
        expires: new Date(new Date().getTime() + ONE_DAY),
        scope: "superuser",
        token: "superuser_access_1",
        // userId must be seeded
    },
    {
        expires: new Date(new Date().getTime() - ONE_DAY),
        scope: "superuser",
        token: "superuser_access_2",
        // userId must be seeded
    },
];

// ----- Categories ----------------------------------------------------------

export const CATEGORY_NAME_FIRST = "First Category";
export const CATEGORY_NAME_SECOND = "Second Category";
export const CATEGORY_NAME_THIRD = "Third Category";
export const CATEGORY_ORDINAL_FIRST = 100;
export const CATEGORY_ORDINAL_SECOND = 200;
export const CATEGORY_ORDINAL_THIRD = 300;

// Must fill in sectionId
export const CATEGORIES: Partial<Category>[] = [
    {
        active: true,
        ordinal: CATEGORY_ORDINAL_FIRST,
        service: `${CATEGORY_NAME_FIRST} Service`,
        slug: `${CATEGORY_NAME_FIRST} Slug`,
    },
    {
        active: false,
        ordinal: CATEGORY_ORDINAL_SECOND,
        service: `${CATEGORY_NAME_SECOND} Service`,
        slug: `${CATEGORY_NAME_SECOND} Slug`,
    },
    {
        active: true,
        ordinal: CATEGORY_ORDINAL_THIRD,
        service: `${CATEGORY_NAME_THIRD} Service`,
        slug: `${CATEGORY_NAME_THIRD} Slug`,
    },
];

// ----- Facilities ----------------------------------------------------------

export const FACILITY_NAME_FIRST = "First Facility"
export const FACILITY_NAME_SECOND = "Second Facility";
export const FACILITY_NAME_THIRD = "Third Facility";
export const FACILITY_SCOPE_FIRST = "first";
export const FACILITY_SCOPE_SECOND = "second";
export const FACILITY_SCOPE_THIRD = "third";

export const FACILITY_NAMES = [
    FACILITY_NAME_FIRST, FACILITY_NAME_SECOND, FACILITY_NAME_THIRD
];

export const FACILITIES: Partial<Facility>[] = [
    {
        name: FACILITY_NAME_FIRST,
        scope: FACILITY_SCOPE_FIRST,
    },
    {
        active: false,
        name: FACILITY_NAME_SECOND,
        scope: FACILITY_SCOPE_SECOND,
    },
    {
        name: FACILITY_NAME_THIRD,
        scope: FACILITY_SCOPE_THIRD,
    },
];

// ----- RefreshTokens -------------------------------------------------------

export const REFRESH_TOKENS_SUPERUSER: Partial<RefreshToken>[] = [
    {
        accessToken: "superuser_access_1",
        expires: new Date(new Date().getTime() + ONE_DAY),
        token: "superuser_refresh_1",
        // userId must be seeded
    },
    {
        accessToken: "superuser_access_2",
        expires: new Date(new Date().getTime() - ONE_DAY),
        token: "superuser_refresh_2",
        // userId must be seeded
    },
];

// ----- Sections ------------------------------------------------------------

export const SECTION_NAME_FIRST = "First Section";
export const SECTION_NAME_SECOND = "Second Section";
export const SECTION_NAME_THIRD = "Third Section";
export const SECTION_ORDINAL_FIRST = 1000;
export const SECTION_ORDINAL_SECOND = 2000;
export const SECTION_ORDINAL_THIRD = 3000;
export const SECTION_SCOPE_FIRST = "first";
export const SECTION_SCOPE_SECOND = "second";
export const SECTION_SCOPE_THIRD = "third";

// Must fill in facilityId
export const SECTIONS: Partial<Section>[] = [
    {
        active: true,
        ordinal: SECTION_ORDINAL_FIRST,
        scope: SECTION_SCOPE_FIRST,
        slug: `${SECTION_NAME_FIRST} Slug`,
        title: `${SECTION_NAME_FIRST} Title`,
    },
    {
        active: false,
        ordinal: SECTION_ORDINAL_SECOND,
        scope: SECTION_SCOPE_SECOND,
        slug: `${SECTION_NAME_SECOND} Slug`,
        title: `${SECTION_NAME_SECOND} Title`,
    },
    {
        active: true,
        ordinal: SECTION_ORDINAL_THIRD,
        scope: SECTION_SCOPE_THIRD,
        slug: `${SECTION_NAME_THIRD} Slug`,
        title: `${SECTION_NAME_THIRD} Title`,
    },
];

// ----- Users ---------------------------------------------------------------

export const USER_USERNAME_SUPERUSER = "superuser";
export const USER_USERNAME_FIRST_ADMIN = "firstadmin";
export const USER_USERNAME_FIRST_REGULAR = "firstregular";
export const USER_USERNAME_SECOND_ADMIN = "secondadmin";
export const USER_USERNAME_SECOND_REGULAR = "secondregular";

export const USERS: Partial<User>[] = [
    {
        active: true,
        name: "First Facility Admin",
        scope: "first:admin",
        username: USER_USERNAME_FIRST_ADMIN,
    },
    {
        active: true,
        name: "First Facility Regular",
        scope: "first:regular",
        username: USER_USERNAME_FIRST_REGULAR,
    },
    {
        active: false,
        name: "Second Facility Admin",
        scope: "second:admin",
        username: USER_USERNAME_SECOND_ADMIN,
    },
    {
        active: false,
        name: "Second Facility Regular",
        scope: "second:regular",
        username: USER_USERNAME_SECOND_REGULAR,
    },
    {
        active: true,
        name: "Superuser User",
        scope: "superuser",
        username: USER_USERNAME_SUPERUSER,
    }
];

