// useMutateCategory ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Category.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessCategory} from "../types";
import Api from "../clients/Api";
import FacilityContext from "../components/facilities/FacilityContext";
import Category, {CATEGORIES_BASE} from "../models/Category";
import Section from "../models/Section";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    section: Section;                   // Section for which to mutate Categories
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: ProcessCategory;            // Function to insert a new Category
    remove: ProcessCategory;            // Function to remove an existing Category
    update: ProcessCategory;            // Function to update an existing Category
}

// Component Details ---------------------------------------------------------

const useMutateCategory = (props: Props): State => {

    const facilityContext = useContext(FacilityContext);

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateCategory.useEffect",
            section: Abridgers.SECTION(props.section),
        });
    });

    const insert: ProcessCategory = async (theCategory) => {

        setError(null);
        setExecuting(true);

        let inserted = new Category();
        const url = CATEGORIES_BASE
            + `/${facilityContext.facility.id}/${props.section.id}`;

        try {
            inserted = ToModel.CATEGORY((await Api.post(url, theCategory)).data);
            logger.debug({
                context: "useMutateCategory.insert",
                url: url,
                category: Abridgers.CATEGORY(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateCategory.insert", error, {
                url: url,
                category: theCategory,
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessCategory = async (theCategory) => {

        setError(null);
        setExecuting(true);

        let removed = new Category();
        const url = CATEGORIES_BASE
            + `/${facilityContext.facility.id}/${props.section.id}/${theCategory.id}`;

        try {
            removed = ToModel.CATEGORY((await Api.delete(url)).data);
            logger.debug({
                context: "useMutateCategory.remove",
                url: url,
                category: Abridgers.CATEGORY(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateCategory.remove", error, {
                url: url,
                category: theCategory,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessCategory = async (theCategory) => {

        setError(null);
        setExecuting(true);

        let updated = new Category();
        const url = CATEGORIES_BASE
            + `/${facilityContext.facility.id}/${props.section.id}/${theCategory.id}`;

        try {
            updated = ToModel.CATEGORY((await Api.put(url, theCategory)).data);
            logger.debug({
                context: "useMutateCategory.update",
                url: url,
                category: Abridgers.CATEGORY(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateCategory.update", error, {
                url: url,
                category: theCategory,
            }, alertPopup);
        }

        setExecuting(false);
        return updated;

    }

    return {
        error: error,
        executing: executing,
        insert: insert,
        remove: remove,
        update: update,
    };

}

export default useMutateCategory;
