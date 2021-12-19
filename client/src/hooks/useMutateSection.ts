// useMutateSection ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Section.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessSection} from "../types";
import Api from "../clients/Api";
import FacilityContext from "../components/facilities/FacilityContext";
import Section, {SECTIONS_BASE} from "../models/Section";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: ProcessSection;             // Function to insert a new Section
    remove: ProcessSection;             // Function to remove an existing Section
    update: ProcessSection;             // Function to update an existing Section
}

// Component Details ---------------------------------------------------------

const useMutateSection = (props: Props = {}): State => {

    const facilityContext = useContext(FacilityContext);

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateSection.useEffect",
        });
    });

    const insert: ProcessSection = async (theSection) => {

        setError(null);
        setExecuting(true);

        let inserted = new Section();
        const url = SECTIONS_BASE
            + `/${facilityContext.facility.id}`;

        try {
            inserted = ToModel.SECTION((await Api.post(url, theSection)).data);
            logger.debug({
                context: "useMutateSection.insert",
                url: url,
                section: Abridgers.SECTION(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSection.insert", error, {
                url: url,
                section: theSection,
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessSection = async (theSection) => {

        setError(null);
        setExecuting(true);

        let removed = new Section();
        const url = SECTIONS_BASE
            + `/${facilityContext.facility.id}/${theSection.id}`;

        try {
            removed = ToModel.SECTION((await Api.delete(url)).data);
            logger.debug({
                context: "useMutateSection.remove",
                url: url,
                section: Abridgers.SECTION(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSection.remove", error, {
                url: url,
                section: theSection,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessSection = async (theSection) => {

        setError(null);
        setExecuting(true);

        let updated = new Section();
        const url = SECTIONS_BASE
            + `/${facilityContext.facility.id}/${theSection.id}`;

        try {
            updated = ToModel.SECTION((await Api.put(url, theSection)).data);
            logger.debug({
                context: "useMutateSection.update",
                url: url,
                section: Abridgers.SECTION(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSection.update", error, {
                url: url,
                section: theSection,
            }, alertPopup);
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
