// useFetchFacilities --------------------------------------------------------

// Custom hook to fetch Facility objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import LoginContext from "../components/login/LoginContext";
import Facility, {FACILITIES_BASE} from "../models/Facility";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Facilities? [false]
    currentPage?: number;               // One-relative current page number [1]
    pageSize?: number;                  // Number of entries per page [25]
    name?: string;                      // Select Facilities matching pattern [none]
    withCategories?: boolean;           // Include child Checkins? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    facilities: Facility[];             // Fetched Facilities
}

// Hook Details --------------------------------------------------------------

const useFetchFacilities = (props: Props): State => {

    const loginContext = useContext(LoginContext);

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [facilities, setFacilities] = useState<Facility[]>([]);

    useEffect(() => {

        const fetchFacilities = async () => {

            setError(null);
            setLoading(true);
            let theFacilities: Facility[] = [];

            const limit = props.pageSize ? props.pageSize : 25;
            const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
            const parameters = {
                active: props.active ? "" : undefined,
                limit: limit,
                offset: offset,
                name: props.name ? props.name : undefined,
                withCategories: props.withCategories ? "" : undefined,
            };


            try {
                if (loginContext.data.loggedIn) {
                    theFacilities = (await Api.get(FACILITIES_BASE
                        + `${queryParameters(parameters)}`)).data;
                    theFacilities.forEach(theFacility => {
                        if (theFacility.categories && (theFacility.categories.length > 0)) {
                            theFacility.categories = Sorters.CATEGORIES(theFacility.categories);
                        }
                    });
                }
                logger.debug({
                    context: "useFetchFacilities.fetchFacilities",
                    parameters: parameters,
                    facilities: Abridgers.FACILITIES(theFacilities),
                });

            } catch (error) {
                setError(error as Error);
                ReportError("useFetchFacilities.fetchFacilities", error, {
                    parameters: parameters,
                })
            }

            setLoading(false);
            setFacilities(theFacilities);

        }

        fetchFacilities();

    }, [props.active, props.currentPage, props.pageSize, props.name,
        props.withCategories, loginContext.data.loggedIn]);

    return {
        error: error ? error : null,
        loading: loading,
        facilities: facilities,
    }

}

export default useFetchFacilities;
