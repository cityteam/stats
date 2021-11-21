// useMutateUser -------------------------------------------------------------

// Custom hook to encapsulate mutation operations on a User.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleUser} from "../types";
import Api from "../clients/Api";
import User, {USERS_BASE} from "../models/User";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: HandleUser;                 // Function to insert a new User
    remove: HandleUser;                 // Function to remove an existing User
    update: HandleUser;                 // Function to update an existing User
}

// Component Details ---------------------------------------------------------

const useMutateUser = (props: Props = {}): State => {

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateUser.useEffect",
        });
    });

    const insert: HandleUser = async (theUser): Promise<User> => {

        setError(null);
        setExecuting(true);

        let inserted = new User();
        const url = USERS_BASE;

        try {
            inserted = ToModel.USER((await Api.post(url, theUser)).data);
            logger.info({
                context: "useMutateUser.insert",
                url: url,
                user: Abridgers.USER(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateUser.insert", error, {
                url: url,
                user: {
                    ...theUser,
                    password: "*REDACTED*",
                }
            });
        }

        setExecuting(false);
        return inserted;

    }

    const remove: HandleUser = async (theUser): Promise<User> => {

        setError(null);
        setExecuting(true);

        let removed = new User();
        const url = USERS_BASE + `/${theUser.id}`;

        try {
            removed = ToModel.USER((await Api.delete(url)).data);
            logger.info({
                context: "useMutateUser.remove",
                url: url,
                user: Abridgers.USER(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateUser.remove", error, {
                url: url,
                user: {
                    ...theUser,
                    password: theUser.password ? "*REDACTED*" : null,
                }
            });
        }

        setExecuting(false);
        return removed;

    }

    const update: HandleUser = async (theUser): Promise<User> => {

        setError(null);
        setExecuting(true);

        let updated = new User();
        const url = USERS_BASE + `/${theUser.id}`;

        try {
            updated = ToModel.USER((await Api.put(url, theUser)).data);
            logger.info({
                context: "useMutateUser.update",
                url: url,
                user: Abridgers.USER(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateUser.update", error, {
                url: url,
                user: {
                    ...theUser,
                    password: theUser.password ? "*REDACTED*" : null,
                }
            });
        }

        setExecuting(false);
        return updated;

    }

    return {
        error: error,
        executing: executing,
        insert: insert,
        remove: remove,
        update: update,
    };

}

export default useMutateUser;
