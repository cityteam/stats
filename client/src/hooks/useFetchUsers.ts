// useFetchUsers -------------------------------------------------------------

// Custom hook to fetch User objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {Scope} from "../types";
import Api from "../clients/Api";
import FacilityContext from "../components/facilities/FacilityContext";
import LoginContext from "../components/login/LoginContext";
import User, {USERS_BASE} from "../models/User";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";
import * as ToModel from "../util/ToModel";
import {FACILITIES_BASE} from "../models/Facility";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Users? [false]
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    currentPage?: number;               // One-relative current page number [1]
    pageSize?: number;                  // Number of entries per page [25]
    username?: string;                  // Select Users matching pattern [none]
    withAccessTokens?: boolean;         // Include child AccessTokens? [false]
    withRefreshTokens?: boolean;        // Include nested RefreshTokens? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    users: User[];                      // Fetched Users
}

// Hook Details --------------------------------------------------------------

const useFetchUsers = (props: Props): State => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {

        const fetchUsers = async () => {

            setError(null);
            setLoading(true);
            let theUsers: User[] = [];

            const limit = props.pageSize ? props.pageSize : 25;
            const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
            const parameters = {
                active: props.active ? "" : undefined,
                limit: limit,
                offset: offset,
                username: props.username ? props.username : undefined,
                withAccessTokens: props.withAccessTokens ? "" : undefined,
                withRefreshTokens: props.withRefreshTokens ? "" : undefined,
            };
            let url = "";

            try {
                if (loginContext.data.loggedIn) {
                    const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
                    const isAdmin = loginContext.validateFacility(facilityContext.facility, Scope.ADMIN);
                    if (isSuperuser) {
                        url = `${USERS_BASE}${queryParameters(parameters)}`;
                    } else if (isAdmin) {
                        url = `${FACILITIES_BASE}/${facilityContext.facility.id}/users${queryParameters(parameters)}`;
                    }
                    if (url !== "") {
                        theUsers = ToModel.USERS((await Api.get(url)).data);
                        theUsers.forEach(theUser => {
                            if (theUser.accessTokens && (theUser.accessTokens.length > 0)) {
                                theUser.accessTokens = Sorters.ACCESS_TOKENS(theUser.accessTokens);
                            }
                            if (theUser.refreshTokens && (theUser.refreshTokens.length > 0)) {
                                theUser.refreshTokens = Sorters.REFRESH_TOKENS(theUser.refreshTokens);
                            }
                            logger.debug({
                                context: "useFetchUsers.fetchUsers",
                                url: url,
                                users: Abridgers.USERS(theUsers),
                            });
                        });
                    }
                }
            } catch (anError) {
                setError(anError as Error);
                ReportError("useFetchUsers.fetchUsers", anError, {
                    url: url,
                }, alertPopup);
            }

            setLoading(false);
            setUsers(theUsers);

        }

        fetchUsers();

    }, [props.active, props.currentPage, props.pageSize,
        props.username, props.withAccessTokens, props.withRefreshTokens,
        alertPopup,
        facilityContext.facility, loginContext, loginContext.data.loggedIn]);

    return {
        error: error ? error : null,
        loading: loading,
        users: users,
    };

}

export default useFetchUsers;
