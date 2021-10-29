// CategoriesView -------------------------------------------------------------

// Top-level view for managing Category objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import CategoryForm from "./CategoryForm";
import CategoriesList from "./CategoriesList";
import FacilityContext from "../facilities/FacilityContext";
import LoginContext from "../login/LoginContext";
import {HandleCategory, OnAction, Scope} from "../../types";
import useMutateCategory from "../../hooks/useMutateCategory";
import Category from "../../models/Category";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const CategoriesView = () => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [category, setCategory] = useState<Category | null>(null);

    const mutateCategory = useMutateCategory({});

    useEffect(() => {

        logger.debug({
            context: "CategoriesView.useEffect",
        });

        const isAdmin = loginContext.validateFacility(facilityContext.facility, Scope.ADMIN);
        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isAdmin || isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isAdmin || isSuperuser);

    }, [facilityContext.facility, loginContext]);

    const handleAdd: OnAction = () => {
        setCategory(new Category({
            active: true,
            description: null,
            facilityId: facilityContext.facility.id,
            notes: null,
            ordinal: 0,
            service: null,
            scope: null,
            slug: null,
            type: "Detail",
        }));
    }

    const handleInsert: HandleCategory = async (theCategory) => {
        /*const inserted = */await mutateCategory.insert(theCategory);
        setCategory(null);
    }

    const handleRemove: HandleCategory = async (theCategory) => {
        /*const removed = */await mutateCategory.remove(theCategory);
        setCategory(null);
    }

    const handleSelect: HandleCategory = (theCategory) => {
        setCategory(theCategory);
    }

    const handleUpdate: HandleCategory = async (theCategory) => {
        /*const updated = */await mutateCategory.update(theCategory);
        setCategory(null);
    }

    return (
        <Container fluid id="CategoriesView">

            {/* List View */}
            {(!category) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            <span><strong>Select or Create Categories for Facility&nbsp;</strong></span>
                            <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                        </Col>
                    </Row>

                    <Row className="mb-3 ml-1 mr-1">
                        <CategoriesList
                            canInsert={canInsert}
                            canRemove={canRemove}
                            canUpdate={canUpdate}
                            handleAdd={handleAdd}
                            handleSelect={handleSelect}
                        />
                    </Row>

                </>
            ) : null }

            {/* Detail View */}
            {(category) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            {(category.id > 0) ? (
                                <span><strong>Edit Existing</strong></span>
                            ) : (
                                <span><strong>Add New</strong></span>
                            )}
                            <span><strong>&nbsp;Category for Facility&nbsp;</strong></span>
                            <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                onClick={() => setCategory(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <Row className="mb-3 ml-1 mr-1">
                        <CategoryForm
                            autoFocus={true}
                            canRemove={canRemove}
                            canSave={canInsert || canUpdate}
                            handleInsert={handleInsert}
                            handleRemove={handleRemove}
                            handleUpdate={handleUpdate}
                            category={category}
                        />
                    </Row>

                </>
            ) : null }

        </Container>

    )

}

export default CategoriesView;
