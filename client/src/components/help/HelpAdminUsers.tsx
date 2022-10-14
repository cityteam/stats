// HelpAdminUsers ---------------------------------------------------------

// Admin Users help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import HelpSidebar from "./HelpSidebar";

// Internal Modules ---------------------------------------------------------

import Callout from "../general/Callout";

// Component Details --------------------------------------------------------

const HelpAdminUsers = () => {

    return (
        <Container fluid="md" id="HelpAdminUsers">
            <Row>
                <Col className="col-3">
                    <HelpSidebar/>
                </Col>
                <Col>
                    <Row className="text-center">
                <span className="text-info"><strong>
                    Manage Users
                </strong></span>
                        <hr/>
                    </Row>
                    <Row>

                        <h3>Introduction</h3>
                        <p>
                            A <strong>User</strong> is an individual (or group
                            of individuals) that are authorized to log in to this
                            application, and enter statisics or review reports
                            and charts.  Each <strong>User</strong> will be marked
                            as an administrative user or a regular user.  For
                            regular users, they will also be marked for which&nbsp;
                            <strong>Sections</strong> they are authorized to use.
                        </p>

                        <h3>List View</h3>
                        <p>
                            If you are an administrative user for one or more&nbsp;
                            <strong>Facilities</strong>, when you select the&nbsp;
                            <em>Admin</em> -&gt; <em>Users</em> view, you will see a
                            list of all defined <strong>Users</strong>&nbsp;
                            for the currently selected <strong>Facility</strong>,
                            sorted by their log in usernames.
                        </p>
                        <p>
                            <Image
                                alt="Users List"
                                fluid
                                src="/helptext/users-first.png"
                                style={{border: "1px solid"}}
                            />
                        </p>

                        <h3>Details View</h3>
                        <p>
                            If you are the superuser user, or an administrator for the
                            currently selected <strong>Facility</strong>, you will be
                            able to add new <strong>Users</strong> (by clicking on
                            the <em>Add</em> button), or edit an existing one (by
                            clicking anywhere on the row for that <strong>User</strong>).
                        </p>
                        <p>
                            <Image
                                alt="User Details"
                                fluid
                                src="/helptext/users-second.png"
                                style={{border: "1px solid"}}
                            />
                        </p>
                        <p>
                            The <em>Back Arrow</em> in the upper left corner
                            will return you to the List View without making
                            any changes.
                        </p>

                        <h3>Field Definitions</h3>
                        <Table
                            bordered
                            className="mt-2 ms-3 mr-3"
                            size="sm"
                            striped
                        >
                            <thead>
                            <tr className="table-secondary">
                                <th>Field Name</th>
                                <th>Required</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Name</td>
                                <td>Yes</td>
                                <td>Name of the individual or group represented by this <strong>User</strong>.</td>
                            </tr>
                            <tr>
                                <td>Username</td>
                                <td>Yes</td>
                                <td>Log in username for this <strong>User</strong>.  Must be globally unique.</td>
                            </tr>
                            <tr>
                                <td>Password</td>
                                <td>No</td>
                                <td>
                                    Log in password for this <strong>User</strong>.  Must be specified
                                    when you add a new <strong>User</strong>.  Only specify it on an
                                    existing <strong>User</strong> if you wish to change it.
                                </td>
                            </tr>
                            <tr>
                                <td>Scope</td>
                                <td>No</td>
                                <td>
                                    The permissions for this <strong>User</strong>.  This value
                                    is calculated based on the Permissions and Sections shown below.
                                </td>
                            </tr>
                            <tr>
                                <td>Log Detail Level</td>
                                <td>Yes</td>
                                <td>
                                    A value that controls the amount of detail
                                    that will be included in the application logs
                                    for this <strong>User's</strong> activity.
                                    This will generally only be used by an application
                                    developer when identifying possible problems,
                                    so leave it set to "Info" for most cases.
                                </td>
                            </tr>
                            <tr>
                                <td>Active</td>
                                <td>Yes</td>
                                <td>
                                    Flag indicating whether this <strong>User</strong> is
                                    active (allowed to log in) or not.</td>
                            </tr>
                            </tbody>
                        </Table>

                        <p>
                            For each <strong>Facility</strong> you are an administrator for,
                            select one of the following general permissions:
                        </p>
                        <ul>
                            <li>
                                <strong>admin</strong> - Can enter data, view reports
                                and charts, and perform all administrative functions,
                                as well as access all <strong>Sections</strong>.
                            </li>
                            <li>
                                <strong>regular</strong> - Can enter data, or view
                                reports and charts, for only the <strong>Sections</strong>&nbsp;
                                they are authorized to access.
                            </li>
                        </ul>
                        <p>
                            <Callout title="Be Careful!" variant="warning">
                                If you do not check at least one of these permissions,
                                you will lose the ability to manage this <strong>User</strong>.
                            </Callout>
                        </p>
                        <p>
                            Separately, select the <strong>Sections</strong> that this&nbsp;
                            <strong>User</strong> will be able to access when entering
                            data, or viewing reports and charts.  Administrators
                            automatically get to access all <strong>Sections</strong>.
                        </p>
                        <p>
                            These selections will be used to compose the <strong>Scope</strong>&nbsp;
                            value, which controls what that <strong>User</strong> will be able to
                            do the next time they log in.
                        </p>

                    </Row>
                </Col>
            </Row>
        </Container>
    )

}

export default HelpAdminUsers;
