// useFetchFacilities --------------------------------------------------------

// Custom hook to fetch Facility objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import Facility, {FACILITIES_BASE} from "../models/Facility";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Facilities? [false]
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    currentPage?: number;               // One-relative current page number [1]
    pageSize?: number;                  // Number of entries per page [25]
    name?: string;                      // Select Facilities matching pattern [none]
    withSections?: boolean;             // Include child Sections? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    facilities: Facility[];             // Fetched Facilities
    loading: boolean;                   // Are we currently loading?
}

// Hook Details --------------------------------------------------------------

const useFetchFacilities = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

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
                withSections: props.withSections ? "" : undefined,
            };
            const url = FACILITIES_BASE
                + `${queryParameters(parameters)}`;

            try {
                theFacilities = ToModel.FACILITIES((await Api.get(url)).data);
                theFacilities.forEach(theFacility => {
                    if (theFacility.sections && (theFacility.sections.length > 0)) {
                        theFacility.sections = Sorters.SECTIONS(theFacility.sections);
                    }
                });
                logger.debug({
                    context: "useFetchFacilities.fetchFacilities",
                    url: url,
                    facilities: Abridgers.FACILITIES(theFacilities),
                });
            } catch (e) {
                setError(e as Error);
                ReportError("useFetchFacilities.fetchFacilities", e, {
                    url: url,
                }, alertPopup);
            }

            setLoading(false);
            setFacilities(theFacilities);

        }

        fetchFacilities();

    }, [props.active, props.currentPage,
        props.pageSize, props.name, props.withSections,
        alertPopup]);

    return {
        error: error ? error : null,
        facilities: facilities,
        loading: loading,
    }

}

export default useFetchFacilities;
