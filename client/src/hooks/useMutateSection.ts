// useMutateSection ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Section.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleSection} from "../types";
import Api from "../clients/Api";
import FacilityContext from "../components/facilities/FacilityContext";
import Section, {SECTIONS_BASE} from "../models/Section";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: HandleSection;              // Function to insert a new Section
    remove: HandleSection;              // Function to remove an existing Section
    update: HandleSection;              // Function to update an existing Section
}

// Component Details ---------------------------------------------------------

const useMutateSection = (props: Props): State => {

    const facilityContext = useContext(FacilityContext);

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateSection.useEffect",
        });
    });

    const insert: HandleSection = async (theSection): Promise<Section> => {

        let inserted = new Section();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(SECTIONS_BASE
                + `/${facilityContext.facility.id}`, theSection)).data;
            logger.debug({
                context: "useMutateSection.insert",
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: Abridgers.SECTION(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSection.insert", error, {
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: theSection,
            });
        }

        setExecuting(false);
        return inserted;

    }

    const remove: HandleSection = async (theSection): Promise<Section> => {

        let removed = new Section();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(SECTIONS_BASE
                + `/${facilityContext.facility.id}/${theSection.id}`)).data;
            logger.debug({
                context: "useMutateSection.remove",
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: Abridgers.SECTION(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSection.remove", error, {
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: theSection,
            });
        }

        setExecuting(false);
        return removed;

    }

    const update: HandleSection = async (theSection): Promise<Section> => {

        let updated = new Section();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(SECTIONS_BASE
                + `/${facilityContext.facility.id}/${theSection.id}`, theSection)).data;
            logger.debug({
                context: "useMutateSection.update",
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: Abridgers.SECTION(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSection.update", error, {
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: theSection,
            })
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

export default useMutateSection;
