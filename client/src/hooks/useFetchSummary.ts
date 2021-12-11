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
import * as ToModel from "../util/ToModel";
import {HandleAction} from "../types";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    date: string;                       // Date for which to retrieve Summaries
    section: Section;                   // Section for which to retrieve Summaries
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    refresh: HandleAction;              // Function to trigger a refresh
    summary: Summary;                   // Fetched Summary
}

// Hook Details --------------------------------------------------------------

const useFetchSummary = (props: Props): State => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
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
                    theSummary = ToModel.SUMMARY((await Api.get(url)).data);
                    logger.info({
                        context: "useFetchSummary.fetchSummary",
                        refresh: refresh,
                        url: url,
                        summary: theSummary,
                    });
                } else {
                    logger.info({
                        context: "useFetchSummary.fetchSummary",
                        msg: "Skipped fetching Summary",
                        loggedIn: loginContext.data.loggedIn,
                        refresh: refresh,
                        url: url,
                    });
                }
                setSummary(theSummary);
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchSummary.fetchSummary", error, {
                    loggedIn: loginContext.data.loggedIn,
                    refresh: refresh,
                    url: url,
                }, alertPopup);
            }

            setLoading(false);
            setRefresh(false);
            setSummary(theSummary);

        }

        fetchSummary();

    }, [facilityContext.facility, loginContext.data.loggedIn,
        props.date, props.section,
        alertPopup, refresh]);

    const handleRefresh: HandleAction = () => {
        setRefresh(true);
    }

    return {
        error: error ? error : null,
        loading: loading,
        refresh: handleRefresh,
        summary: summary,
    }

}

export default useFetchSummary;

