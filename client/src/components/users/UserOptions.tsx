// UserOptions ---------------------------------------------------------------

// List Users that match search criteria, offering callbacks for adding,
// editing, and removing Users.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import CheckBox from "../general/CheckBox";
import FetchingProgress from "../general/FetchingProgress";
import {HandleAction, HandleBoolean, HandleUser, Scope} from "../../types";
import useFetchUsers from "../../hooks/useFetchUsers";
import User from "../../models/User";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a User [not allowed]
    handleEdit?: HandleUser;            // Handle request to select a User [not allowed]
}

// Component Details ---------------------------------------------------------

const UserOptions = (props: Props) => {

    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [availables, setAvailables] = useState<User[]>([]);

    const fetchUsers = useFetchUsers({
        active: active,
        alertPopup: false,
    });

    useEffect(() => {

        logger.debug({
            context: "UserList.useEffect",
            active: active,
        });

        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        if (isSuperuser) {
            setAvailables(fetchUsers.users);
        } else {
            setAvailables([]);
        }

    }, [loginContext,
        active,
        fetchUsers.users]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleEdit: HandleUser = (theUser) => {
        if (props.handleEdit) {
            props.handleEdit(theUser);
        }
    }

    return (
        <Container fluid id="UserOptions">

            <FetchingProgress
                error={fetchUsers.error}
                loading={fetchUsers.loading}
                message="Fetching selected Users"
            />

            <Row className="mb-3 ml-1 mr-1">
                <Col className="text-left">
                    <span><strong>Manage Users</strong></span>
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        id="activeOnly"
                        initialValue={active}
                        label="Active Users Only?"
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
                        <th scope="col">Username</th>
                        <th scope="col">Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Scope</th>
                    </tr>
                    </thead>

                    <tbody>
                    {availables.map((user, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={props.handleEdit ? (() => handleEdit(user)) : undefined}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {user.username}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {user.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(user.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {user.scope}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>


        </Container>
    )

}

export default UserOptions;
