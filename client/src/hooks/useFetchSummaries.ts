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
import {toSummaries} from "../util/ToModelTypes";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Sections? [false]
    dateFrom: string;                   // Earliest date for which to retrieve Summaries
    dateTo: string;                     // Latest date for which to retrieve Summaries
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

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [summaries, setSummaries] = useState<Summary[]>([]);

    useEffect(() => {

        const fetchSummaries = async () => {

            setError(null);
            setLoading(true);
            let theSummaries: Summary[] = [];

            let url = SUMMARIES_BASE
                + `/${facilityContext.facility.id}/all/${props.dateFrom}/${props.dateTo}`;
            if (props.sectionIds && (props.sectionIds.length > 0)) {
                const ids: string[] = [];
                props.sectionIds.forEach(sectionId => {
                    ids.push("" + sectionId);
                })
                url += "?sectionIds=" + ids.join(",");
            }

            try {
                if (loginContext.data.loggedIn && (facilityContext.facility.id > 0)) {
                    theSummaries = toSummaries((await Api.get(url)).data);
                    logger.info({
                        context: "useFetchSummaries.fetchSummaries",
                        facility: Abridgers.FACILITY(facilityContext.facility),
                        props: props,
                        url: url,
                        summariesCount: theSummaries.length,
                    });
                } else {
                    logger.info({
                        context: "useFetchSummaries.fetchSummaries",
                        msg: "Skipped fetching Summaries",
                        facility: Abridgers.FACILITY(facilityContext.facility),
                        props: props,
                        url: url,
                        loggedIn: loginContext.data.loggedIn,
                    });
                }
                setSummaries(theSummaries);
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchSummaries.fetchSummaries", error, {
                    facility: Abridgers.FACILITY(facilityContext.facility),
                    props: props,
                    url: url,
                });
            }

            setLoading(false);
            setSummaries(theSummaries);

        }

        fetchSummaries();

    }, [facilityContext.facility, facilityContext.facility.id,
        loginContext.data.loggedIn,
        props, props.active, props.dateFrom, props.dateTo, props.sectionIds]);

    return {
        error: error ? error : null,
        loading: loading,
        summaries: summaries,
    }

}

export default useFetchSummaries;
