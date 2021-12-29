// DatabaseServices ----------------------------------------------------------

// Database administrative services.

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import logger from "../util/ServerLogger";

// Public Objects ------------------------------------------------------------

const PURGE_BEFORE_MS = 24 * 60 * 60 * 1000; // 24 hours (in milliseconds)

class DatabaseServices {

    /**
     * Purge access_tokens and refresh_tokens that have been expired
     * for long enough to no longer be needed.
     */
    public async purge(): Promise<object> {

        const purgeBefore = new Date((new Date().getTime()) - PURGE_BEFORE_MS);
        const accessTokensPurged = await AccessToken.destroy({
            where: { expires: { [Op.lte]: purgeBefore }}
        });
        const refreshTokensPurged = await RefreshToken.destroy({
            where: { expires: { [Op.lte]: purgeBefore }}
        });

        const results = {
            purgeBefore: purgeBefore.toLocaleString(),
            accessTokensPurged: accessTokensPurged,
            refreshTokensPurged: refreshTokensPurged,
        }
        logger.info({
            context: "DatabaseServices.purge",
            results: results,
        })
        return results;

    }

}

export default new DatabaseServices();
