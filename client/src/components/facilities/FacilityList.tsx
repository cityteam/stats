// FacilityList -----------------------------------------------------------

// List Facilities that match search criteria, offering callbacks for adding,
// editing, and removing Facilities.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {AddButton, CheckBox} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import FacilityContext from "./FacilityContext";
import FetchingProgress from "../general/FetchingProgress";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleBoolean, HandleFacility, Scope} from "../../types";
import Facility from "../../models/Facility";
import useFetchFacilities from "../../hooks/useFetchFacilities";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Facility [not allowed]
    handleEdit?: HandleFacility;        // Handle request to select a Facility [not allowed]
}

// Component Details ---------------------------------------------------------

const FacilityList = (props: Props) => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [availables, setAvailables] = useState<Facility[]>([]);

    const fetchFacilities = useFetchFacilities({
        active: active,
        alertPopup: false,
    });

    const canAdd = loginContext.data.loggedIn && props.handleAdd;

    useEffect(() => {

        logger.debug({
            context: "FacilityList.useEffect"
        });

        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        if (isSuperuser) {
            setAvailables(fetchFacilities.facilities);
        } else {
            setAvailables(facilityContext.facilities);
        }

    }, [facilityContext.facilities, fetchFacilities.facilities, loginContext]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleEdit: HandleFacility = (theFacility) => {
        if (props.handleEdit) {
            props.handleEdit(theFacility);
        }
    }

    return (
        <Container fluid id="FacilityList">

            <FetchingProgress
                error={fetchFacilities.error}
                loading={fetchFacilities.loading}
                message="Fetching selected Facilities"
            />

            <Row className="mb-3 ms-1 me-1">
                <Col className="text-center">
                    <span><strong>Manage Facilities</strong></span>
                </Col>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <Col className="text-start">
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Facilities Only?"
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
                        <th scope="col">Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">City</th>
                        <th scope="col">State</th>
                        <th scope="col">Scope</th>
                    </tr>
                    </thead>

                    <tbody>
                    {availables.map((facility, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={props.handleEdit ? (() => handleEdit(facility)) : undefined}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {facility.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {listValue(facility.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {facility.city}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {facility.state}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {facility.scope}
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

export default FacilityList;
