// User ----------------------------------------------------------------------

// A user who may be authenticated to, and use the features of, this application.

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import RefreshToken from "./RefreshToken";
import {toAccessTokens, toRefreshTokens} from "../util/ToModelTypes";

// Public Objects ------------------------------------------------------------

export const USERS_BASE = "/users";

class User {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;

        this.active = (data.active !== undefined) ? data.active : true;
        this.name = data.name ? data.name : null;
        this.password = data.password ? data.password : null;
        this.scope = data.scope ? data.scope : null;
        this.username = data.username ? data.username : null;

        this.accessTokens = data.accessTokens ? toAccessTokens(data.accessTokens) : [];
        this.refreshTokens = data.refreshTokens ? toRefreshTokens(data.refreshTokens) : [];

    }

    id!: number;

    active?: boolean;
    name!: string;
    password?: string;
    scope!: string;
    username!: string;

    accessTokens: AccessToken[];
    refreshTokens: RefreshToken[];

}

export default User;
