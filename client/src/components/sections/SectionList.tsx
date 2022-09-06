// SectionList ------------------------------------------------------------

// List Sections that match search criteria, offering callbacks for adding,
// editing, and removing Sections.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import FacilityContext from "../facilities/FacilityContext";
import CheckBox from "../general/CheckBox";
import FetchingProgress from "../general/FetchingProgress";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleBoolean, HandleSection} from "../../types";
import useFetchSections from "../../hooks/useFetchSections";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Section [not allowed]
    handleEdit?: HandleSection;         // Handle request to edit a Section [not allowed]
}

// Component Details ---------------------------------------------------------

const SectionList = (props: Props) => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);

    const fetchSections = useFetchSections({
        active: active,
        alertPopup: false,
    });

    useEffect(() => {
        logger.debug({
            context: "SectionList.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
            active: active,
        });
    }, [facilityContext.facility, facilityContext.facility.id,
        loginContext.data.loggedIn,
        active,
        fetchSections.sections]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleEdit: HandleSection = (theSection) => {
        if (props.handleEdit) {
            props.handleEdit(theSection);
        }
    }

    return (
        <Container fluid id="SectionList">

            <FetchingProgress
                error={fetchSections.error}
                loading={fetchSections.loading}
                message="Fetching selected Sections"
            />

            <Row className="mb-3 ms-1 me-1">
                <Col className="text-start">
                    <span><strong>Manage Sections for Facility:&nbsp;</strong></span>
                    <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                </Col>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Sections Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col className="text-end">
                    <Button
                        disabled={!props.handleAdd}
                        onClick={props.handleAdd}
                        size="sm"
                        variant="primary"
                    >Add</Button>
                </Col>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <Table
                    bordered={true}
                    hover={true}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-secondary">
                        <th scope="col">Ordinal</th>
                        <th scope="col">Active</th>
                        <th scope="col">Title</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Slug</th>
                        <th scope="col">Scope</th>
                    </tr>
                    </thead>

                    <tbody>
                    {fetchSections.sections.map((section, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={props.handleEdit ? (() => handleEdit(section)) : undefined}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {section.ordinal}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {listValue(section.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {section.title}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {section.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {section.slug}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 6}>
                                {section.scope}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <Col className="text-end">
                    <Button
                        disabled={!props.handleAdd}
                        onClick={props.handleAdd}
                        size="sm"
                        variant="primary"
                    >Add</Button>
                </Col>
            </Row>

        </Container>
    )

}

export default SectionList;
