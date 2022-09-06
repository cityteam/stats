// SectionView ------------------------------------------------------------

// Top-level view for managing Section objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import SectionForm from "./SectionForm";
import SectionList from "./SectionList";
import FacilityContext from "../facilities/FacilityContext";
import MutatingProgress from "../general/MutatingProgress";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleSection, Scope} from "../../types";
import useMutateSection from "../../hooks/useMutateSection";
import Section from "../../models/Section";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
}

const SectionView = () => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [section, setSection] = useState<Section>(new Section());
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateSection = useMutateSection({
        alertPopup: false,
    });

    useEffect(() => {

        logger.debug({
            context: "SectionView.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
            section: Abridgers.SECTION(section),
            view: view.toString(),
        });

        const isAdmin = loginContext.validateFacility(facilityContext.facility, Scope.ADMIN);
        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isAdmin || isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isAdmin || isSuperuser);

    }, [facilityContext.facility, loginContext,
        section, view]);

    // Create an empty Section to be added
    const handleAdd: HandleAction = () => {
        const theSection = new Section({
            active: true,
            facilityId: facilityContext.facility.id,
            notes: null,
            ordinal: 0,
            scope: "regular",
            slug: null,
            title: null,
        });
        logger.debug({
            context: "SectionView.handleAdd",
            section: theSection,
        });
        setSection(theSection);
        setView(View.DETAILS);
    }

    // Handle returning to the previous view
    const handleBack: HandleAction = () => {
        setView(View.OPTIONS);
    }

    // Handle selection of a Section to edit details
    const handleEdit: HandleSection = (theSection) => {
        logger.debug({
            context: "SectionView.handleEdit",
            section: Abridgers.SECTION(theSection),
        });
        setSection(theSection);
        setView(View.DETAILS);
    }

    // Handle insert of a new Section
    const handleInsert: HandleSection = async (theSection) => {
        setMessage(`Inserting Section '${theSection.title}'`);
        const inserted = await mutateSection.insert(theSection);
        logger.debug({
            context: "SectionView.handleInsert",
            section: Abridgers.SECTION(inserted),
        });
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Section
    const handleRemove: HandleSection = async (theSection) => {
        setMessage(`Removing Section '${theSection.title}'`);
        const removed = await mutateSection.remove(theSection);
        logger.debug({
            context: "SectionView.handleRemove",
            section: Abridgers.SECTION(removed),
        });
        setView(View.OPTIONS);
    }

    // Handle update of an existing Section
    const handleUpdate: HandleSection = async (theSection) => {
        setMessage(`Updating Section '${theSection.title}'`);
        const updated = await mutateSection.update(theSection);
        logger.debug({
            context: "SectionView.handleUpdate",
            section: Abridgers.SECTION(updated),
        });
        setView(View.OPTIONS);
    }

    return (
        <>

            <MutatingProgress
                error={mutateSection.error}
                executing={mutateSection.executing}
                message={message}
            />

            {(view === View.DETAILS) ? (
                <SectionForm
                    autoFocus
                    handleBack={handleBack}
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    section={section}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <SectionList
                    handleAdd={canInsert ? handleAdd : undefined}
                    handleEdit={canUpdate ? handleEdit : undefined}
                />
            ) : null }

        </>
    )

}

export default SectionView;
