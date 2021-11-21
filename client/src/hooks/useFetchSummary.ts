// useFetchSummary -----------------------------------------------------------

// Custom hook to fetch the Summary object that corresponds to input properties.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";

import FacilityContext from "../components/facilities/FacilityContext";
import LoginContext from "../components/login/LoginContext";
import Section from "../models/Section";
import Summary, {SUMMARIES_BASE} from "../models/Summary";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import {toSummary} from "../util/ToModelTypes";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    date: string;                       // Date for which to retrieve Summaries
    section: Section;                   // Section for which to retrieve Summaries
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    summary: Summary;                   // Fetched Summary
}

// Hook Details --------------------------------------------------------------

const useFetchSummary = (props: Props): State => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [summary, setSummary] = useState<Summary>(new Summary());

    useEffect(() => {

        const fetchSummary = async () => {

            setError(null);
            setLoading(true);
            let theSummary = new Summary({
                date: props.date,
                sectionId: props.section.id,
                values: {},
            });

            const url = SUMMARIES_BASE
                + `/${facilityContext.facility.id}/${props.section.id}/${props.date}`;

            try {
                if (loginContext.data.loggedIn && (facilityContext.facility.id > 0) && (props.section.id > 0)) {
                    theSummary = toSummary((await Api.get(url)).data);
                    logger.info({
                        context: "useFetchSummary.fetchSummary",
                        url: url,
                        summary: theSummary,
                    });
                } else {
                    logger.info({
                        context: "useFetchSummary.fetchSummary",
                        msg: "Skipped fetching Summary",
                        loggedIn: loginContext.data.loggedIn,
                        url: url,
                    });
                }
                setSummary(theSummary);
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchSummary.fetchSummary", error, {
                    loggedIn: loginContext.data.loggedIn,
                    url: url,
                });
            }

            setLoading(false);
            setSummary(theSummary);

        }

        fetchSummary();

    }, [facilityContext.facility, loginContext.data.loggedIn,
        props.date, props.section]);

    return {
        error: error ? error : null,
        loading: loading,
        summary: summary,
    }

}

export default useFetchSummary;

