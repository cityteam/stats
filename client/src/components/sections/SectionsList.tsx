// SectionsList -------------------------------------------------------------

// List Sections that match search criteria, offering callbacks for adding,
// editing, and removing Sections.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import CheckBox from "../general/CheckBox";
import Pagination from "../general/Pagination";
import SearchBar from "../general/SearchBar";
import {HandleBoolean, HandleSection, HandleValue, OnAction} from "../../types";
import useFetchSections from "../../hooks/useFetchSections";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    canInsert: boolean;                 // Can this user add Sections?
    canRemove: boolean;                 // Can this user remove Sections?
    canUpdate: boolean;                 // Can this user update Sections?
    handleAdd: OnAction;                // Handle request to add a Section
    handleSelect: HandleSection;        // Handle request to select a Section
}

// Component Details ---------------------------------------------------------

const SectionsList = (props: Props) => {

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [searchText, setSearchText] = useState<string>("");

    const fetchSections = useFetchSections({
        active: active,
        currentPage: currentPage,
        ordinal: (searchText.length > 0) ? Number(searchText) : undefined,
        pageSize: pageSize,
    });

    useEffect(() => {

        logger.debug({
            context: "SectionsList.useEffect"
        });

    }, [fetchSections.sections]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleChange: HandleValue = (theSearchText) => {
        setSearchText(theSearchText);
    }

    const onNext: OnAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const onPrevious: OnAction = () => {
        setCurrentPage(currentPage - 1);
    }

    return (
        <Container fluid id="SectionsList">

            <Row className="mb-3 ml-1 mr-1">
                <Col className="col-6">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        label="Search For Sections:"
                        placeholder="Search by all or part of ordinal"
                    />
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        id="activeOnly"
                        initialValue={active}
                        label="Active Sections Only?"
                    />
                </Col>
                <Col className="text-right">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(fetchSections.sections.length === 0) ||
                        (fetchSections.sections.length < pageSize)}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        variant="secondary"
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
                        <th scope="col">Title</th>
                        {/*<th scope="col">Notes</th>*/}
                        <th scope="col">Slug</th>
                        <th scope="col">Scope</th>
                    </tr>
                    </thead>

                    <tbody>
                    {fetchSections.sections.map((section, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={() => props.handleSelect(section)}
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
{/*
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {section.notes}
                            </td>
*/}
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

        </Container>
    )

}

export default SectionsList;
