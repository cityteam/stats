// RefreshToken ---------------------------------------------------------------

// A refresh token that has been granted to a particular User.

// Internal Modules ----------------------------------------------------------

import Facility from "./Facility";
import {toFacility} from "../util/ToModelTypes";

// Public Objects ------------------------------------------------------------

class RefreshToken {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : null;

        this.accessToken = data.accessToken ? data.accessToken : null;
        this.expires = data.expires ? data.expires : null;
        this.token = data.token ? data.token : null;
        this.userId = data.userId ? data.userId : null;

        this.facility = data.facility ? toFacility(data.facility) : undefined;

    }

    id!: number;

    accessToken!: string;
    expires!: string;
    token!: string;
    userId!: number;

    facility?: Facility;

}

export default RefreshToken;
