// Api -----------------------------------------------------------------------

// Basic infrastructure for Axios interactions with the API routes of the
// application server, rooted at "/api".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

// TODO - need LoginContext for auth stuff
//import {LOGIN_DATA} from "../components/contexts/LoginContext";

// Public Objects ------------------------------------------------------------

const Api: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

/*
Api.interceptors.request.use(function (config) {
    if (LOGIN_DATA.accessToken) {
        config.headers["Authorization"] = `Bearer ${LOGIN_DATA.accessToken}`;
    }
    if (LOGIN_DATA.username) {
        config.headers["X-CT-Username"] = LOGIN_DATA.username;
    }
    return config;
})
*/

export default Api;
