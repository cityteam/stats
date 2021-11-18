// useMutateSummary ----------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Summary.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleSummary} from "../types";
import Api from "../clients/Api";
import FacilityContext from "../components/facilities/FacilityContext";
import Summary, {SUMMARIES_BASE} from "../models/Summary";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import {toSummary} from "../util/ToModelTypes";

// Incoming Properties an Outgoing State -------------------------------------

export interface Props {
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    write: HandleSummary;               // Function to write Summary to server
}

// Hook Details --------------------------------------------------------------

const useMutateSummary = (props: Props): State => {

    const facilityContext = useContext(FacilityContext);

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateSummary.useEffect",
        });
    })

    // Forward Summary containing values for the specified Section ID and date.
    const write: HandleSummary = async (theSummary): Promise<Summary> => {

        let result = new Summary();
        setError(null);
        setExecuting(true);

        try {
            result = toSummary((await Api.post(SUMMARIES_BASE +
                `/${facilityContext.facility.id}/${theSummary.sectionId}/${theSummary.date}`,
                theSummary)).data);
            logger.debug({
                context: "useMutateSummary.write",
                facility: Abridgers.FACILITY(facilityContext.facility),
                summary: result,
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSummary.write", error, {
                facility: Abridgers.FACILITY(facilityContext.facility),
                summary: theSummary,
            });
        }

        setExecuting(false);
        return result;

    }

    return {
        error: error,
        executing: executing,
        write: write,
    }

}

export default useMutateSummary;
