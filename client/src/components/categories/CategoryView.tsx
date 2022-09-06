// CategoryView -----------------------------------------------------------

// Top-level view for managing Category objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import CategoryDetails from "./CategoryForm";
import CategoryList from "./CategoryList";
import FacilityContext from "../facilities/FacilityContext";
import MutatingProgress from "../general/MutatingProgress";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleCategory, HandleSection, Scope} from "../../types";
import useMutateCategory from "../../hooks/useMutateCategory";
import Category from "../../models/Category";
import Section from "../../models/Section";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
}

const CategoryView = () => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [category, setCategory] = useState<Category>(new Category());
    const [message, setMessage] = useState<string>("");
    const [section, setSection] = useState<Section>(new Section());
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateCategory = useMutateCategory({
        alertPopup: false,
        section: section,
    });

    useEffect(() => {

        logger.debug({
            context: "CategoryView.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
            section: Abridgers.SECTION(section),
            category: Abridgers.CATEGORY(category),
            view: view.toString(),
        });

        const isAdmin = loginContext.validateFacility(facilityContext.facility, Scope.ADMIN);
        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isAdmin || isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isAdmin || isSuperuser);

    }, [facilityContext.facility, loginContext, loginContext.data.loggedIn,
        category, section, view]);

    // Create an empty Category to be added
    const handleAdd: HandleAction = () => {
        const theCategory = new Category({
            accumulated: true,
            active: true,
//            description: null,
            notes: null,
            ordinal: 0,
            sectionId: section.id,
            service: null,
            slug: null,
        });
        logger.debug({
            context: "CategoryView.handleAdd",
            category: category,
        });
        setCategory(theCategory);
        setView(View.DETAILS);
    }

    // Handle returning to the previous view
    const handleBack: HandleAction = () => {
        setView(View.OPTIONS);
    }

    // Handle selection of a Category to edit details
    const handleEdit: HandleCategory = (theCategory) => {
        logger.debug({
            context: "CategoryView.handleEdit",
            category: Abridgers.CATEGORY(theCategory),
        })
        setCategory(theCategory);
        setView(View.DETAILS);
    }

    // Handle insert of a new Category
    const handleInsert: HandleCategory = async (theCategory) => {
        setMessage(`Inserting Category '${theCategory.service}'`);
        const inserted = await mutateCategory.insert(theCategory);
        logger.debug({
            context: "CategoryView.handleInsert",
            category: Abridgers.CATEGORY(inserted),
        });
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Category
    const handleRemove: HandleCategory = async (theCategory) => {
        setMessage(`Removing Category '${theCategory.service}'`);
        const removed = await mutateCategory.remove(theCategory);
        logger.debug({
            context: "CategoryView.handleRemove",
            category: Abridgers.CATEGORY(removed),
        });
        setView(View.OPTIONS);
    }

    // Handle request to select a specific Section
    const handleSection: HandleSection = (theSection) => {
        logger.debug({
            context: "CategoryView.handleSection",
            section: Abridgers.SECTION(theSection),
        });
        setSection(theSection);
    }

    // Handle update of an existing Category
    const handleUpdate: HandleCategory = async (theCategory) => {
        setMessage(`Updating Category '${theCategory.service}'`);
        const updated = await mutateCategory.update(theCategory);
        logger.debug({
            context: "CategoryView.handleUpdate",
            category: Abridgers.CATEGORY(updated),
        });
        setView(View.OPTIONS);
    }

    return (
        <>

            <MutatingProgress
                error={mutateCategory.error}
                executing={mutateCategory.executing}
                message={message}
            />

            {(view === View.DETAILS) ? (
                <CategoryDetails
                    autoFocus
                    category={category}
                    handleBack={handleBack}
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    section={section}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <CategoryList
                    handleAdd={canInsert ? handleAdd : undefined}
                    handleEdit={canUpdate ? handleEdit : undefined}
                    handleSection={handleSection}
                />
            ) : null }

        </>
    )

}

export default CategoryView;
