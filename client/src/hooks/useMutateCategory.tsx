// useMutateCategory ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Category.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleCategory} from "../types";
import Api from "../clients/Api";
import FacilityContext from "../components/facilities/FacilityContext";
import Category, {CATEGORIES_BASE} from "../models/Category";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: HandleCategory;             // Function to insert a new Category
    remove: HandleCategory;             // Function to remove an existing Category
    update: HandleCategory;             // Function to update an existing Category
}

// Component Details ---------------------------------------------------------

const useMutateCategory = (props: Props): State => {

    const facilityContext = useContext(FacilityContext);

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateCategory.useEffect",
        });
    });

    const insert: HandleCategory = async (theCategory): Promise<Category> => {

        let inserted = new Category();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(CATEGORIES_BASE
                + `/${facilityContext.facility.id}`, theCategory)).data;
            logger.debug({
                context: "useMutateCategory.insert",
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: Abridgers.CATEGORY(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateCategory.insert", error, {
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: theCategory,
            });
        }

        setExecuting(false);
        return inserted;

    }

    const remove: HandleCategory = async (theCategory): Promise<Category> => {

        let removed = new Category();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(CATEGORIES_BASE
                + `/${facilityContext.facility.id}/${theCategory.id}`)).data;
            logger.debug({
                context: "useMutateCategory.remove",
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: Abridgers.CATEGORY(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateCategory.remove", error, {
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: theCategory,
            });
        }

        setExecuting(false);
        return removed;

    }

    const update: HandleCategory = async (theCategory): Promise<Category> => {

        let updated = new Category();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(CATEGORIES_BASE
                + `/${facilityContext.facility.id}/${theCategory.id}`, theCategory)).data;
            logger.debug({
                context: "useMutateCategory.update",
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: Abridgers.CATEGORY(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateCategory.update", error, {
                facility: Abridgers.FACILITY(facilityContext.facility),
                category: theCategory,
            })
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
