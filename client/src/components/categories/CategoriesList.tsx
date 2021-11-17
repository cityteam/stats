// CategoriesList -------------------------------------------------------------

// List Categories that match search criteria, offering callbacks for adding,
// editing, and removing Categories.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import CheckBox from "../general/CheckBox";
import SectionSelector from "../sections/SectionSelector";
import {HandleBoolean, HandleCategory, HandleSection, OnAction} from "../../types";
import useFetchCategories from "../../hooks/useFetchCategories";
import Section from "../../models/Section";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    canInsert: boolean;                 // Can this user add Categories?
    canRemove: boolean;                 // Can this user remove Categories?
    canUpdate: boolean;                 // Can this user update Categories?
    handleAdd: OnAction;                // Handle request to add a Category
    handleCategory: HandleCategory;     // Handle request to select a Category
    handleSection: HandleSection;       // Handle request to select a Section
}

// Component Details ---------------------------------------------------------

const CategoriesList = (props: Props) => {

    const [active, setActive] = useState<boolean>(false);
    const [section, setSection] = useState<Section>(new Section());

    const fetchCategories = useFetchCategories({
        active: active,
        section: section,
    });

    useEffect(() => {
        logger.info({
            context: "CategoriesList.useEffect",
            section: Abridgers.SECTION(section),
        });
    }, [fetchCategories.categories, section]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleSection: HandleSection = (theSection) => {
        logger.info({
            context: "CategoriesList.handleSection",
            section: Abridgers.SECTION(theSection),
        })
        setSection(theSection);
        props.handleSection(theSection);
    }

    return (
        <Container fluid id="CategoriesList">

            <Row className="mb-3 ml-1 mr-1">
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
                        id="activeOnly"
                        initialValue={active}
                        label="Active Categories Only?"
                    />
                </Col>
                <Col className="text-right">
                    <Button
                        disabled={!props.canInsert}
                        onClick={props.handleAdd}
                        size="sm"
                        variant="primary"
                    >Add</Button>
                </Col>
            </Row>

            <Row className="ml-1 mr-1">
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
                        <th scope="col">Notes</th>
*/}
                        <th scope="col">Slug</th>
                    </tr>
                    </thead>

                    <tbody>
                    {fetchCategories.categories.map((category, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={() => props.handleCategory(category)}
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
                            <td key={1000 + (rowIndex * 100) + 6}>
                                {category.notes}
                            </td>
*/}
                            <td key={1000 + (rowIndex * 100) + 7}>
                                {category.slug}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

        </Container>
    )

}

export default CategoriesList;
