// CategoryList -------------------------------------------------------------

// List Categories that match search criteria, offering callbacks for adding,
// editing, and removing Categories.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {AddButton, CheckBox} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import FacilityContext from "../facilities/FacilityContext";
import FetchingProgress from "../general/FetchingProgress";
import LoginContext from "../login/LoginContext";
import SectionSelector from "../sections/SectionSelector";
import {HandleAction, HandleBoolean, HandleCategory, HandleSection} from "../../types";
import useFetchCategories from "../../hooks/useFetchCategories";
import Section from "../../models/Section";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Category [not allowed]
    handleEdit?: HandleCategory;        // Handle request to edit a Category [not allowed]
    handleSection: HandleSection;       // Handle request to select a Section
}

// Component Details ---------------------------------------------------------

const CategoryList = (props: Props) => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [section, setSection] = useState<Section>(new Section());

    const fetchCategories = useFetchCategories({
        active: active,
        alertPopup: false,
        section: section,
    });

    const canAdd = loginContext.data.loggedIn && props.handleAdd;

    useEffect(() => {
        logger.debug({
            context: "CategoryList.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
            section: Abridgers.SECTION(section),
            active: active,
        });
    }, [facilityContext.facility, facilityContext.facility.id,
        loginContext.data.loggedIn,
        active, section,
        fetchCategories.categories]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleEdit: HandleCategory = (theCategory) => {
        if (props.handleEdit) {
            props.handleEdit(theCategory);
        }
    }

    const handleSection: HandleSection = (theSection) => {
        logger.debug({
            context: "CategoryList.handleSection",
            section: Abridgers.SECTION(theSection),
        })
        setSection(theSection);
        props.handleSection(theSection);
    }

    return (
        <Container fluid id="CategoryList">

            <FetchingProgress
                error={fetchCategories.error}
                loading={fetchCategories.loading}
                message="Fetching selected Categories"
            />

            <Row className="mb-3 ms-1 me-1">
                <Col className="text-center">
                    <span><strong>Manage Categories for Facility:&nbsp;</strong></span>
                    <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                </Col>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <Col className="col-6">
                    <SectionSelector
                        active={active}
                        handleSection={handleSection}
                        label="Categories for Section:"
                    />
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Categories Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col className="text-end">
                    <AddButton
                        disabled={!canAdd}
                        handleAdd={props.handleAdd ? props.handleAdd : undefined}
                        testId="add0"
                    />
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
{/*
                        <th scope="col">Accumulated</th>
*/}
                        <th scope="col">Service</th>
{/*
                        <th scope="col">Description</th>
*/}
                        <th scope="col">Notes</th>
                        <th scope="col">Slug</th>
                    </tr>
                    </thead>

                    <tbody>
                    {fetchCategories.categories.map((category, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={props.handleEdit ? (() => handleEdit(category)) : undefined}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {category.ordinal}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {listValue(category.active)}
                            </td>
{/*
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(category.accumulated)}
                            </td>
*/}
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {category.service}
                            </td>
{/*
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {category.description}
                            </td>
*/}
                            <td key={1000 + (rowIndex * 100) + 6}>
                                {category.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 7}>
                                {category.slug}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <Col className="text-end">
                    <AddButton
                        disabled={!canAdd}
                        handleAdd={props.handleAdd ? props.handleAdd : undefined}
                        testId="add1"
                    />
                </Col>
            </Row>

        </Container>
    )

}

export default CategoryList;
