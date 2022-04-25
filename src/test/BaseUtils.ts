// BaseUtils -----------------------------------------------------------------

// Base utilities for functional tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as SeedData from "./SeedData";
import AccessToken from "../models/AccessToken";
import Database from "../models/Database";
import Facility from "../models/Facility";
import RefreshToken from "../models/RefreshToken";
import Section from "../models/Section";
import User from "../models/User";
import {clearMapping} from "../oauth/OAuthMiddleware";
import {hashPassword} from "../oauth/OAuthUtils";

// Public Objects ------------------------------------------------------------

export type OPTIONS = {
    withAccessTokens: boolean,
    withFacilities: boolean,
    withRefreshTokens: boolean,
    withSections: boolean,
    withUsers: boolean,
}

// Base Utilities for Functional Tests ---------------------------------------

export abstract class BaseUtils {

    /**
     * Erase current database, then load test data for the tables selected
     * in the options parameter.
     *
     * @param options                   Flags to select tables to be loaded
     */
    public async loadData(options: Partial<OPTIONS>): Promise<void> {

        // WARNING - Database.sync({force: true}) blows up on dailies table.
        // WARNING - Apparently it does not like the array fields, and errors
        // WARNING - with "number[] not found" or something.  This workaround
        // WARNING - just cleans out the data, but you MUST have run all the
        // WARNING - migrations on the stats_test (or whatever) DB to get the
        // WARNING - table structures created in the first place.
        await Database.truncate({ cascade: true });

        // Clear any previous OAuth mapping for Library id -> scope
        clearMapping();

        // Load users (and related access and refresh tokens) if requested
        if (options.withUsers) {
            await loadUsers(SeedData.USERS);
            const userSuperuser = await User.findOne({
                where: { username: SeedData.USER_USERNAME_SUPERUSER }
            });
            if (userSuperuser) {
                if (options.withAccessTokens) {
                    await loadAccessTokens(userSuperuser, SeedData.ACCESS_TOKENS_SUPERUSER);
                }
                if (options.withRefreshTokens) {
                    await loadRefreshTokens(userSuperuser, SeedData.REFRESH_TOKENS_SUPERUSER);
                }
            }
        }

        // If facilities are not requested, nothing else will be loaded
        let facilities: Facility[] = [];
        if (options.withFacilities) {
            facilities = await loadFacilities(SeedData.FACILITIES);
            if (options.withSections) {
                facilities.forEach(facility => {
                    const sections = loadSections(facility, SeedData.SECTIONS);
                });
            }
        } else {
            return;
        }

    }

}

export default BaseUtils;

// Private Objects -----------------------------------------------------------

const hashedPassword = async (password: string | undefined): Promise<string> => {
    return hashPassword(password ? password : "");
}

const loadAccessTokens
    = async (user: User, accessTokens: Partial<AccessToken>[]): Promise<AccessToken[]> => {
    accessTokens.forEach(accessToken => {
        accessToken.userId = user.id;
    });
    let results: AccessToken[] = [];
    try {
        // @ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        results = await AccessToken.bulkCreate(accessTokens);
        return results;
    } catch (error) {
        console.info(`  Reloading AccessTokens for User '${user.username}' ERROR`, error);
        throw error;
    }
}

const loadFacilities
    = async (facilities: Partial<Facility>[]): Promise<Facility[]> =>
{
    let results: Facility[] = [];
    try {
        // @ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        results = await Facility.bulkCreate(facilities);
    } catch (error) {
        console.info("  Reloading Facilities ERROR", error);
        throw error;
    }
    return results;
}

const loadRefreshTokens
    = async (user: User, refreshTokens: Partial<RefreshToken>[]): Promise<RefreshToken[]> => {
    refreshTokens.forEach(refreshToken => {
        refreshToken.userId = user.id;
    });
    let results: RefreshToken[] = [];
    try {
        // @ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        results = await RefreshToken.bulkCreate(refreshTokens);
        return results;
    } catch (error) {
        console.info(`  Reloading RefreshTokens for User '${user.username}' ERROR`, error);
        throw error;
    }
}

const loadSections = async (facility: Facility, sections: Partial<Section>[]): Promise<Section[]> => {
    sections.forEach(section => {
        section.facilityId = facility.id;
    });
    // @ts-ignore NOTE - did Typescript get tougher about Partial<M>?
    return await Section.bulkCreate(sections);
}

const loadUsers = async (users: Partial<User>[]): Promise<User[]> => {
    // For tests, the unhashed password is the same as the username
    const promises = users.map(user => hashedPassword(user.username));
    const hashedPasswords: string[] = await Promise.all(promises);
    for(let i = 0; i < users.length; i++) {
        users[i].password = hashedPasswords[i];
    }
    try {
        // @ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        return User.bulkCreate(users);
    } catch (error) {
        console.info("  Reloading Users ERROR", error);
        throw error;
    }
}

