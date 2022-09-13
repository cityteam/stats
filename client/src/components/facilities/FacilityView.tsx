// FacilityView -----------------------------------------------------------

// Top-level view for managing Facility objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import FacilityContext from "./FacilityContext";
import FacilityForm from "./FacilityForm";
import FacilityList from "./FacilityList";
import MutatingProgress from "../general/MutatingProgress";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleFacility, Scope} from "../../types";
import useMutateFacility from "../../hooks/useMutateFacility";
import Facility from "../../models/Facility";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
}

const FacilityView = () => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [facility, setFacility] = useState<Facility>(new Facility());
    const [message, setMessage] = useState<string>("");
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateFacility = useMutateFacility({
        alertPopup: false,
    });

    useEffect(() => {

        logger.info({
            context: "FacilityView.useEffect",
            facility: Abridgers.FACILITY(facility),
            view: view.toString(),
        });

        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isSuperuser);

    }, [loginContext, loginContext.data.loggedIn,
        facility, view]);

    // Create an empty Facility to be added
    const handleAdd: HandleAction = () => {
        const theFacility = new Facility({
            active: true,
            address1: null,
            address2: null,
            city: null,
            email: null,
            name: null,
            phone: null,
            scope: null,
            state: null,
            zipCode: null,
        });
        logger.info({
            context: "FacilityView.handleAdd",
            facility: theFacility,
        });
        setFacility(theFacility);
        setView(View.DETAILS);
    }

    // Handle selection of a Facility to edit details
    const handleEdit: HandleFacility = (theFacility) => {
        logger.info({
            context: "FacilityView.handleEdit",
            facility: Abridgers.FACILITY(theFacility),
        });
        setFacility(theFacility);
        setView(View.DETAILS);
    }

    // Handle insert of a new Facility
    const handleInsert: HandleFacility = async (theFacility) => {
        setMessage(`Inserting Facility '${theFacility.name}'`);
        const inserted = await mutateFacility.insert(theFacility);
        logger.info({
            context: "FacilityView.handleInsert",
            facility: Abridgers.FACILITY(inserted),
        });
        facilityContext.handleRefresh();
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Facility
    const handleRemove: HandleFacility = async (theFacility) => {
        setMessage(`Removing Facility '${theFacility.name}'`);
        const removed = await mutateFacility.remove(theFacility);
        logger.info({
            context: "FacilityView.handleRemove",
            facility: Abridgers.FACILITY(removed),
        });
        facilityContext.handleRefresh();
        setView(View.OPTIONS);
    }

    // Handle returning to the previous view
    const handleReturn: HandleAction = () => {
        setView(View.OPTIONS);
    }

    // Handle update of an existing Facility
    const handleUpdate: HandleFacility = async (theFacility) => {
        setMessage(`Updating Facility '${theFacility.name}'`);
        const updated = await mutateFacility.update(theFacility);
        logger.info({
            context: "FacilityView.handleUpdate",
            facility: Abridgers.FACILITY(updated),
        });
        facilityContext.handleRefresh();
        setView(View.OPTIONS);
    }

    return (

        <>

            <MutatingProgress
                error={mutateFacility.error}
                executing={mutateFacility.executing}
                message={message}
            />

            {(view === View.DETAILS) ? (
                <FacilityForm
                    facility={facility}
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleReturn={handleReturn}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <FacilityList
                    handleAdd={canInsert ? handleAdd: undefined}
                    handleEdit={canUpdate ? handleEdit : undefined}
                />
            ) : null }

        </>

    )

}

export default FacilityView;
