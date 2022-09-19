// HelpAdminFacilities -------------------------------------------------------

// Admin Facilities help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const HelpAdminFacilities = () => {

    return (
        <Container fluid>
            <Row className="text-center">
                <span className="text-info"><strong>
                    Manage Facilities
                </strong></span>
                <hr/>
            </Row>
            <Row>

                <h3>Introduction</h3>
                <p>
                    A <strong>Facility</strong> is a physical CityTeam location,
                    for which statistics entry is desired.  Individual users will
                    be authorized to enter data for the various&nbsp;
                    <strong>Sections</strong> and <strong>Categories</strong> for
                    each <strong>Facility</strong>, as described on the
                    <em>Manage Users</em> page.
                </p>

                <h3>List View</h3>
                <p>
                    When you select the <em>Admin</em> -&gt; <em>Facilities</em> view,
                    you will see a list of all defined <strong>Facilities</strong> (if
                    you are the superuser user), or just the&nbsp;
                    <strong>Facilities</strong> you are authorized to access.  For
                    security reasons, only the superuser user can actually add, edit,
                    or remove <strong>Facilities</strong>.
                </p>
                <p>
                    <img src="/helptext/facilities-first.png"
                         style={{border: "1px solid"}}
                         alt="Facilities List"/>
                </p>
                <p>
                    The database has been preloaded with information about all
                    current CityTeam <strong>Facilities</strong>, so you should
                    normally not need to make any changes.
                </p>

                <h3>Details View</h3>
                <p>
                    If you are the superuser user, you can add a new&nbsp;
                    <strong>Facility</strong> by clicking one of the&nbsp;
                    <em>Add</em> buttons, or edit an existing one by
                    clicking anywhere on it's row.  It will look like this:
                </p>
                <p>
                    <img src="/helptext/facilities-second.png"
                         style={{border: "1px solid"}}
                         alt="Facility Details"/>
                </p>
                <p>
                    The <em>Back Arrow</em> in the upper left corner
                    will return you to the List View without making
                    any changes.
                </p>

                <h3>Field Definitions</h3>
                <Table
                    bordered
                    className="mt-2 ms-3 me-3"
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
                        <td>Formal name of this Facility.  Must be globally unique.</td>
                    </tr>
                    <tr>
                        <td>Scope</td>
                        <td>Yes</td>
                        <td>
                            Prefix for permission scopes for this Facility.
                            See the Manage Users page for more information.
                        </td>
                    </tr>
                    <tr>
                        <td>Address 1</td>
                        <td>No</td>
                        <td>First line of street address.</td>
                    </tr>
                    <tr>
                        <td>Address 2</td>
                        <td>No</td>
                        <td>Second line of street address.</td>
                    </tr>
                    <tr>
                        <td>City</td>
                        <td>No</td>
                        <td>City name of street address.</td>
                    </tr>
                    <tr>
                        <td>State</td>
                        <td>No</td>
                        <td>State abbreviation of street address.</td>
                    </tr>
                    <tr>
                        <td>Zip Code</td>
                        <td>No</td>
                        <td>Zip code of street address.</td>
                    </tr>
                    <tr>
                        <td>Email Address</td>
                        <td>No</td>
                        <td>Contact email address of this Facility.</td>
                    </tr>
                    <tr>
                        <td>Phone Number</td>
                        <td>No</td>
                        <td>Phone number of this Facility (including area code).</td>
                    </tr>
                    <tr>
                        <td>Active</td>
                        <td>Yes</td>
                        <td>Flag indicating whether this Facility is active or not.</td>
                    </tr>
                    </tbody>
                </Table>

            </Row>
        </Container>
    )

}

export default HelpAdminFacilities;
