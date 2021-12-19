// useFetchSummaries ---------------------------------------------------------

// Custom hook to fetch an array of Summaries that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";

import FacilityContext from "../components/facilities/FacilityContext";
import LoginContext from "../components/login/LoginContext";
import Summary, {SUMMARIES_BASE} from "../models/Summary";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";
import {queryParameters} from "../util/QueryParameters";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Sections? [false]
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    dateFrom: string;                   // Earliest date for which to retrieve Summaries
    dateTo: string;                     // Latest date for which to retrieve Summaries
    monthlies?: boolean;                // Monthly summaries, not daily? [false]
    sectionIds?: number[];              // List of Section IDs to retrieve (all sections)
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    summaries: Summary[];               // Fetched Summaries
}

// Hook Details --------------------------------------------------------------

const useFetchSummaries = (props: Props): State => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [summaries, setSummaries] = useState<Summary[]>([]);

    useEffect(() => {

        const fetchSummaries = async () => {

            setError(null);
            setLoading(true);
            let theSummaries: Summary[] = [];

            const parameters: any = {
                active: props.active ? "" : undefined,
            }
            if (props.sectionIds && (props.sectionIds.length > 0)) {
                const ids: string[] = [];
                props.sectionIds.forEach(sectionId => {
                    ids.push("" + sectionId);
                })
                parameters.sectionIds = ids.join(",");
            }
            const which = props.monthlies ? "monthlies" : "dailies";
            const url = SUMMARIES_BASE
                + `/${facilityContext.facility.id}/${which}`
                + `/${props.dateFrom}/${props.dateTo}`
                + `${queryParameters(parameters)}`;

            try {
                if (loginContext.data.loggedIn && (facilityContext.facility.id > 0)) {
                    theSummaries = ToModel.SUMMARIES((await Api.get(url)).data);
                    logger.debug({
                        context: "useFetchSummaries.fetchSummaries",
                        url: url,
                        summaries: Abridgers.SUMMARIES(theSummaries),
                    });
                } else {
                    logger.debug({
                        context: "useFetchSummaries.fetchSummaries",
                        msg: "Skipped fetching Summaries",
                        loggedIn: loginContext.data.loggedIn,
                        url: url,
                    });
                }
                setSummaries(theSummaries);
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchSummaries.fetchSummaries", error, {
                    loggedIn: loginContext.data.loggedIn,
                    url: url,
                }, alertPopup);
            }

            setLoading(false);
            setSummaries(theSummaries);

        }

        fetchSummaries();

    }, [facilityContext, loginContext,
        props.active, props.dateFrom, props.dateTo, props.monthlies, props.sectionIds,
        alertPopup]);

    return {
        error: error ? error : null,
        loading: loading,
        summaries: summaries,
    }

}

export default useFetchSummaries;
