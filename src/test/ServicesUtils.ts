// ServicesUtils -------------------------------------------------------------

// Utilities supporting functional tests of {Model}Services classes.

// External Modules ----------------------------------------------------------

import {PasswordTokenRequest} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import BaseUtils, {OPTIONS} from "./BaseUtils"
import Category from "../models/Category";
import Facility from "../models/Facility";
import Section from "../models/Section";
import User from "../models/User";
import OAuthOrchestrator from "../oauth/OAuthOrchestrator";
import {NotFound} from "../util/HttpErrors";

// Public Objects -----------------------------------------------------------

export class ServicesUtils extends BaseUtils {

    // Public Members --------------------------------------------------------

    /**
     * Generate and return credentials ("Bearer " and an access token) for the
     * specified username.
     *
     * @param username                  Username for which to generate credentials
     *
     * @throws NotFound                 If no such user exists
     */
    public async credentials(username: string): Promise<string> {
        const previous = this.credentialsCache.get(username);
        if (previous) {
            return previous;
        }
        const user = await this.lookupUser(username);
        const request: PasswordTokenRequest = {
            grant_type: "password",
            password: user.username, // For tests, we hashed the username as the password
            scope: user.scope,
            username: user.username,
        }
        const response = await OAuthOrchestrator.token(request);
        const result = `Bearer ${response.access_token}`;
        this.credentialsCache.set(username, result);
        return result;
    }

    /**
     * Trigger loading of database data, and clean up any local storage
     * as needed.
     *
     * @param options                   Flags to select tables to be loaded
     */
    public async loadData(options: Partial<OPTIONS>): Promise<void> {
        await super.loadData(options);
        this.credentialsCache.clear();
    }

    /**
     * Look up and return the specified Category from the database.
     *
     * @param section                   Section this Category belongs to
     * @param ordinal                   Ordinal of the requested Category
     *
     * @throws NotFound                 If no such Section exists
     */
    public async lookupCategory(section: Section, ordinal: number): Promise<Category> {
        const result = await Category.findOne({
            where: {
                sectionId: section.id,
                ordinal: ordinal,
            }
        });
        if (result) {
            return result;
        } else {
            throw new NotFound(`ordinal: Missing Category ${ordinal}`);
        }
    }

    /**
     * Look up and return the specified Facility from the database.
     *
     * @param name                      Name of the requested Facility
     *
     * @throws NotFound                 If no such Facility exists
     */
    public async lookupFacility(name: string): Promise<Facility> {
        const result = await Facility.findOne({
            where: { name: name }
        });
        if (result) {
            return result;
        } else {
            throw new NotFound(`name: Missing Facility '${name}'`);
        }
    }

    /**
     * Look up and return the specified Section from the database.
     *
     * @param facility                  Facility this Section belongs to
     * @param ordinal                   Ordinal of the requested Section
     *
     * @throws NotFound                 If no such Section exists
     */
    public async lookupSection(facility: Facility, ordinal: number): Promise<Section> {
        const result = await Section.findOne({
            where: {
                facilityId: facility.id,
                ordinal: ordinal,
            }
        });
        if (result) {
            return result;
        } else {
            throw new NotFound(`ordinal: Missing Section ${ordinal}`);
        }
    }

    /**
     * Look up and return the specified User from the database.
     *
     * @param username                  Username of the requested User
     *
     * @throws NotFound                 If no such User exists
     */
    public async lookupUser(username: string): Promise<User> {
        const result = await User.findOne({
            where: { username: username }
        });
        if (result) {
            return result;
        } else {
            throw new NotFound(`username: Missing User '${username}'`);
        }
    }

    // Private Members -------------------------------------------------------

    /**
     * Cache of previously assigned credentials, keyed by username
     */
    private credentialsCache = new Map<string, string>();

}

export default ServicesUtils;
