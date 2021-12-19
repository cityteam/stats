// FacilityOptions -----------------------------------------------------------

// List Facilities that match search criteria, offering callbacks for adding,
// editing, and removing Facilities.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import FacilityContext from "./FacilityContext";
import CheckBox from "../general/CheckBox";
import LoadingProgress from "../general/LoadingProgress";
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

const FacilityOptions = (props: Props) => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [availables, setAvailables] = useState<Facility[]>([]);

    const fetchFacilities = useFetchFacilities({
        active: active,
        alertPopup: false,
    });

    useEffect(() => {

        logger.debug({
            context: "FacilityOptions.useEffect"
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
        <Container fluid id="FacilityOptions">

            <LoadingProgress
                error={fetchFacilities.error}
                loading={fetchFacilities.loading}
                title="Selected Facilities"
            />

            <Row className="mb-3 ml-1 mr-1">
                <Col className="text-left">
                    <span><strong>Manage Facilities</strong></span>
                </Col>
            </Row>

            <Row className="mb-3 ml-1 mr-1">
                <Col className="text-left">
                    <CheckBox
                        handleChange={handleActive}
                        id="activeOnly"
                        initialValue={active}
                        label="Active Facilities Only?"
                    />
                </Col>
                <Col className="text-right">
                    <Button
                        disabled={!props.handleAdd}
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

        </Container>
    )

}

export default FacilityOptions;
