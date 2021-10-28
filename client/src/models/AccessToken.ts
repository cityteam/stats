// AccessToken ---------------------------------------------------------------

// An access token that has been granted to a particular User.

// Internal Modules ----------------------------------------------------------

import Facility from "./Facility";
import {toFacility} from "../util/ToModelTypes";

// Public Objects ------------------------------------------------------------

class AccessToken {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;

        this.expires = data.expires ? data.expires : null;
        this.scope = data.scope ? data.scope : null;
        this.token = data.token ? data.token : null;
        this.userId = data.userId ? data.userId : null;

        this.facility = data.facility ? toFacility(data.facility) : undefined;

    }

    id!: number;

    expires!: string;
    scope!: string;
    token!: string;
    userId!: number;

    facility?: Facility;

}

export default AccessToken;
