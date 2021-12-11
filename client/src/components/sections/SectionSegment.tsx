// SectionSegment ------------------------------------------------------------

// Top-level view for managing Section objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import SectionDetails from "./SectionDetails";
import SectionOptions from "./SectionOptions";
import FacilityContext from "../facilities/FacilityContext";
import SavingProgress from "../general/SavingProgress";
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

const SectionSegment = () => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [section, setSection] = useState<Section>(new Section());
    const [title, setTitle] = useState<string>("");
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateSection = useMutateSection({
        alertPopup: false,
    });

    useEffect(() => {

        logger.info({
            context: "SectionSegment.useEffect",
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
        logger.info({
            context: "SectionSegment.handleAdd",
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
        logger.info({
            context: "SectionSegment.handleEdit",
            section: Abridgers.SECTION(theSection),
        });
        setSection(theSection);
        setView(View.DETAILS);
    }

    // Handle insert of a new Section
    const handleInsert: HandleSection = async (theSection) => {
        setTitle(theSection.title);
        const inserted = await mutateSection.insert(theSection);
        logger.info({
            context: "SectionSegment.handleInsert",
            section: Abridgers.SECTION(inserted),
        });
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Section
    const handleRemove: HandleSection = async (theSection) => {
        setTitle(theSection.title);
        const removed = await mutateSection.remove(theSection);
        logger.info({
            context: "SectionSegment.handleRemove",
            section: Abridgers.SECTION(removed),
        });
        setView(View.OPTIONS);
    }

    // Handle update of an existing Section
    const handleUpdate: HandleSection = async (theSection) => {
        setTitle(theSection.title);
        const updated = await mutateSection.update(theSection);
        logger.info({
            context: "SectionSegment.handleUpdate",
            section: Abridgers.SECTION(updated),
        });
        setView(View.OPTIONS);
    }

    return (
        <>

            <SavingProgress
                error={mutateSection.error}
                executing={mutateSection.executing}
                title={title}
            />

            {(view === View.DETAILS) ? (
                <SectionDetails
                    autoFocus
                    handleBack={handleBack}
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    section={section}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <SectionOptions
                    handleAdd={canInsert ? handleAdd : undefined}
                    handleEdit={canUpdate ? handleEdit : undefined}
                />
            ) : null }

        </>
    )

}

export default SectionSegment;
