// useFetchSections --------------------------------------------------------

// Custom hook to fetch Section objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import FacilityContext from "../components/facilities/FacilityContext";
import LoginContext from "../components/login/LoginContext";
import Section, {SECTIONS_BASE} from "../models/Section";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";
import {toSections} from "../util/ToModelTypes";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Sections? [false]
    currentPage?: number;               // One-relative current page number [1]
    ordinal?: number;                   // Select Sections with matching ordinal [none]
    pageSize?: number;                  // Number of entries per page [100]
    withCategories?: boolean;           // Include child Categories? [false]
    withFacility?: boolean;             // Include parent Facility? [false]
}

export interface State {
    sections: Section[];                // Fetched Sections
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
}

// Hook Details --------------------------------------------------------------

const useFetchSections = (props: Props): State => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [sections, setSections] = useState<Section[]>([]);

    useEffect(() => {

        const fetchSections = async () => {

            setError(null);
            setLoading(true);
            let theSections: Section[] = [];

            const limit = props.pageSize ? props.pageSize : 100;
            const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
            const parameters = {
                active: props.active ? "" : undefined,
                limit: limit,
                offset: offset,
                ordinal: props.ordinal ? props.ordinal : undefined,
                withCategories: props.withCategories ? "" : undefined,
                withFacility: props.withFacility ? "" : undefined,
            }
            const url = SECTIONS_BASE
                + `/${facilityContext.facility.id}`
                + `${queryParameters(parameters)}`;

            try {
                if (loginContext.data.loggedIn && (facilityContext.facility.id > 0)) {
                    const allSections = toSections((await Api.get(url)).data);
                    allSections.forEach(allSection => {
                        if (loginContext.validateFacility(facilityContext.facility, allSection.scope)) {
                            if (allSection.categories && (allSection.categories.length > 1)) {
                                allSection.categories = Sorters.CATEGORIES(allSection.categories);
                            }
                            theSections.push(allSection);
                        }
                    });
                    logger.info({
                        context: "useFetchSections.fetchSections",
                        url: url,
                        sections: Abridgers.SECTIONS(theSections),
                    });
                } else {
                    logger.info({
                        context: "useFetchSections.fetchSections",
                        msg: "Skipped fetching Sections",
                        loggedIn: loginContext.data.loggedIn,
                        url: url,
                    })
                }
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchSections.fetchSections", error, {
                    loggedIn: loginContext.data.loggedIn,
                    url: url,
                });
            }

            setLoading(false);
            setSections(theSections);

        }

        fetchSections();

    }, [facilityContext, loginContext,
        props.active, props.currentPage, props.ordinal,
        props.pageSize, props.withCategories, props.withFacility]);

    return {
        sections: sections,
        error: error ? error : null,
        loading: loading,
    }

}

export default useFetchSections;
