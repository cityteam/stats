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
import Pagination from "../general/Pagination";
import SearchBar from "../general/SearchBar";
import {HandleBoolean, HandleCategory, HandleValue, OnAction} from "../../types";
import useFetchCategories from "../../hooks/useFetchCategories";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    canInsert: boolean;                 // Can this user add Categories?
    canRemove: boolean;                 // Can this user remove Categories?
    canUpdate: boolean;                 // Can this user update Categories?
    handleAdd: OnAction;                // Handle request to add a Category
    handleSelect: HandleCategory;       // Handle request to select a Category
}

// Component Details ---------------------------------------------------------

const CategoriesList = (props: Props) => {

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [searchText, setSearchText] = useState<string>("");

    const fetchCategories = useFetchCategories({
        active: active,
        currentPage: currentPage,
        ordinal: (searchText.length > 0) ? Number(searchText) : undefined,
        pageSize: pageSize,
    });

    useEffect(() => {

        logger.debug({
            context: "CategoriesList.useEffect"
        });

    }, [fetchCategories.categories]);

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
        <Container fluid id="CategoriesList">

            <Row className="mb-3 ml-1 mr-1">
                <Col className="col-6">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        label="Search For Categories:"
                        placeholder="Search by all or part of ordinal"
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
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(fetchCategories.categories.length === 0) ||
                        (fetchCategories.categories.length < pageSize)}
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
                        <th scope="col">Type</th>
                        <th scope="col">Service</th>
                        <th scope="col">Description</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Slug</th>
                    </tr>
                    </thead>

                    <tbody>
                    {fetchCategories.categories.map((category, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={() => props.handleSelect(category)}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {category.ordinal}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {listValue(category.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {category.type}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {category.service}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {category.description}
                            </td>
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

        </Container>
    )

}

export default CategoriesList;
