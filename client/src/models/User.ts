// User ----------------------------------------------------------------------

// A user who may be authenticated to, and use the features of, this application.

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import RefreshToken from "./RefreshToken";
import UserData from "./UserData";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const USERS_BASE = "/users";

class User extends UserData {

    constructor(data: any = {}) {

        super(data);

        this.accessTokens = data.accessTokens ? ToModel.ACCESS_TOKENS(data.accessTokens) : [];
        this.refreshTokens = data.refreshTokens ? ToModel.REFRESH_TOKENS(data.refreshTokens) : [];

    }

    accessTokens: AccessToken[];
    refreshTokens: RefreshToken[];

}

export default User;
