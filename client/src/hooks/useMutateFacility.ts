// useMutateFacility ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Facility.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleFacility} from "../types";
import Api from "../clients/Api";
import Facility, {FACILITIES_BASE} from "../models/Facility";
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
    insert: HandleFacility;             // Function to insert a new Facility
    remove: HandleFacility;             // Function to remove an existing Facility
    update: HandleFacility;             // Function to update an existing Facility
}

// Component Details ---------------------------------------------------------

const useMutateFacility = (props: Props = {}): State => {

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.info({
            context: "useMutateFacility.useEffect",
        });
    });

    const insert: HandleFacility = async (theFacility): Promise<Facility> => {

        setError(null);
        setExecuting(true);

        let inserted = new Facility();
        const url = FACILITIES_BASE;

        try {
            inserted = ToModel.FACILITY((await Api.post(url, theFacility)).data);
            logger.info({
                context: "useMutateFacility.insert",
                url: url,
                facility: Abridgers.FACILITY(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateFacility.insert", error, {
                url: url,
                facility: theFacility,
            });
        }

        setExecuting(false);
        return inserted;

    }

    const remove: HandleFacility = async (theFacility): Promise<Facility> => {

        setError(null);
        setExecuting(true);

        let removed = new Facility();
        const url = FACILITIES_BASE + `/${theFacility.id}`;

        try {
            removed = ToModel.FACILITY((await Api.delete(url)).data);
            logger.info({
                context: "useMutateFacility.remove",
                url: url,
                facility: Abridgers.FACILITY(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateFcility.remove", error, {
                url: url,
                facility: theFacility,
            });
        }

        setExecuting(false);
        return removed;

    }

    const update: HandleFacility = async (theFacility): Promise<Facility> => {

        setError(null);
        setExecuting(true);

        let updated = new Facility();
        const url = FACILITIES_BASE + `/${theFacility.id}`;

        try {
            updated = ToModel.FACILITY((await Api.put(url, theFacility)).data);
            logger.info({
                context: "useMutateFacility.update",
                url: url,
                facility: Abridgers.FACILITY(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateFacility.update", error, {
                url: url,
                facility: theFacility,
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

export default useMutateFacility;
