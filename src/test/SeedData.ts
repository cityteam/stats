// SeedData ------------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Facility from "../models/Facility";
import RefreshToken from "../models/RefreshToken";
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

