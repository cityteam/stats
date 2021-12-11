// useMutateSummary ----------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Summary.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessSummary} from "../types";
import Api from "../clients/Api";
import FacilityContext from "../components/facilities/FacilityContext";
import Summary, {SUMMARIES_BASE} from "../models/Summary";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties an Outgoing State -------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    write: ProcessSummary;              // Function to write Summary to server
}

// Hook Details --------------------------------------------------------------

const useMutateSummary = (props: Props = {}): State => {

    const facilityContext = useContext(FacilityContext);

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateSummary.useEffect",
        });
    })

    // Forward Summary containing values for the specified Section ID and date.
    const write: ProcessSummary = async (theSummary) => {

        setError(null);
        setExecuting(true);

        let result = new Summary();
        const url = SUMMARIES_BASE +
                `/${facilityContext.facility.id}/${theSummary.sectionId}`
                + `/${theSummary.date}`

        try {
            result = ToModel.SUMMARY((await Api.post(url, theSummary)).data);
            logger.info({
                context: "useMutateSummary.write",
                url: url,
                summary: result,
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSummary.write", error, {
                url: url,
                summary: theSummary,
            }, alertPopup);
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
