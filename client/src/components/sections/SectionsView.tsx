// SectionsView -------------------------------------------------------------

// Top-level view for managing Section objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import SectionForm from "./SectionForm";
import SectionsList from "./SectionsList";
import FacilityContext from "../facilities/FacilityContext";
import LoginContext from "../login/LoginContext";
import {HandleSection, OnAction, Scope} from "../../types";
import useMutateSection from "../../hooks/useMutateSection";
import Section from "../../models/Section";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const SectionsView = () => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [section, setSection] = useState<Section | null>(null);

    const mutateSection = useMutateSection({});

    useEffect(() => {

        logger.debug({
            context: "SectionsView.useEffect",
        });

        const isAdmin = loginContext.validateFacility(facilityContext.facility, Scope.ADMIN);
        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isAdmin || isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isAdmin || isSuperuser);

    }, [facilityContext.facility, loginContext]);

    const handleAdd: OnAction = () => {
        setSection(new Section({
            active: true,
            facilityId: facilityContext.facility.id,
            notes: null,
            ordinal: 0,
            scope: "regular",
            slug: null,
            title: null,
        }));
    }

    const handleInsert: HandleSection = async (theSection) => {
        /*const inserted = */await mutateSection.insert(theSection);
        setSection(null);
    }

    const handleRemove: HandleSection = async (theSection) => {
        /*const removed = */await mutateSection.remove(theSection);
        setSection(null);
    }

    const handleSelect: HandleSection = (theSection) => {
        setSection(theSection);
    }

    const handleUpdate: HandleSection = async (theSection) => {
        /*const updated = */await mutateSection.update(theSection);
        setSection(null);
    }

    return (
        <Container fluid id="SectionsView">

            {/* List View */}
            {(!section) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            <span><strong>Select or Create Sections for Facility&nbsp;</strong></span>
                            <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                        </Col>
                    </Row>

                    <Row className="mb-3 ml-1 mr-1">
                        <SectionsList
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
            {(section) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            {(section.id > 0) ? (
                                <span><strong>Edit Existing</strong></span>
                            ) : (
                                <span><strong>Add New</strong></span>
                            )}
                            <span><strong>&nbsp;Section for Facility&nbsp;</strong></span>
                            <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                onClick={() => setSection(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <Row className="mb-3 ml-1 mr-1">
                        <SectionForm
                            autoFocus={true}
                            canRemove={canRemove}
                            canSave={canInsert || canUpdate}
                            handleInsert={handleInsert}
                            handleRemove={handleRemove}
                            handleUpdate={handleUpdate}
                            section={section}
                        />
                    </Row>

                </>
            ) : null }

        </Container>

    )

}

export default SectionsView;
