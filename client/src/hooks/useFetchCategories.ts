// useFetchCategories --------------------------------------------------------

// Custom hook to fetch Category objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import FacilityContext from "../components/facilities/FacilityContext";
import Category, {CATEGORIES_BASE} from "../models/Category";
import Section from "../models/Section";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import {toCategories} from "../util/ToModelTypes";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Categories? [false]
    currentPage?: number;               // One-relative current page number [1]
    ordinal?: number;                   // Select Categories with matching ordinal [none]
    pageSize?: number;                  // Number of entries per page [100]
    section: Section;                   // Section for which to fetch Categories
    withSection?: boolean;              // Include parent Section? [false]
}

export interface State {
    categories: Category[];             // Fetched Categories
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
}

// Hook Details --------------------------------------------------------------

const useFetchCategories = (props: Props): State => {

    const facilityContext = useContext(FacilityContext);

    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchCategories = async () => {

            setError(null);
            setLoading(true);
            let theCategories: Category[] = [];

            const limit = props.pageSize ? props.pageSize : 100;
            const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
            const parameters = {
                active: props.active ? "" : undefined,
                limit: limit,
                offset: offset,
                ordinal: props.ordinal ? props.ordinal : undefined,
                withSection: props.withSection ? "" : undefined,
            }

            try {
                if ((facilityContext.facility.id > 0) && (props.section.id > 0)) {
                    theCategories = toCategories((await Api.get(CATEGORIES_BASE
                        + `/${facilityContext.facility.id}/${props.section.id}${queryParameters(parameters)}`))
                        .data);
                    logger.debug({
                        context: "useFetchCategories.fetchCategories",
                        facility: Abridgers.FACILITY(facilityContext.facility),
                        parameters: parameters,
                        categories: Abridgers.CATEGORIES(theCategories),
                    });
                }
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchCategories.fetchCategories", error, {
                    facility: Abridgers.FACILITY(facilityContext.facility),
                    section: Abridgers.SECTION(props.section),
                    ...parameters,
                });
            }

            setLoading(false);
            setCategories(theCategories);

        }

        fetchCategories();

    }, [facilityContext.facility, props.active, props.currentPage,
            props.ordinal, props.pageSize, props.section, props.withSection]);

    return {
        categories: categories,
        error: error ? error : null,
        loading: loading,
    }

}

export default useFetchCategories;