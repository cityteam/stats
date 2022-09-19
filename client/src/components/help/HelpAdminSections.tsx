// HelpAdminSections ---------------------------------------------------------

// Admin Sections help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const HelpAdminSections = () => {

    return (
        <Container fluid>
            <Row className="text-center">
                <span className="text-info"><strong>
                    Manage Sections
                </strong></span>
                <hr/>
            </Row>
            <Row>

                <h3>Introduction</h3>
                <p>
                    A <strong>Section</strong> is a group of related&nbsp;
                    <strong>Categories</strong> for which daily statistics
                    will be gathered.  For example, a "Meals Provided"&nbsp;
                    <strong>Section</strong> might have "Breakfasts",
                    "Lunches", and "Dinners" as <strong>Categories</strong>&nbsp;
                    underneath it.
                </p>
                <p>
                    In the data entry section, and also in graphs and reports,&nbsp;
                    <strong>Sections</strong> will be listed in the order of their
                    "ordinal" values.  Thus, you can rearrange the ordering by
                    changing the ordinal value for one particular&nbsp;
                    <strong>Section</strong> to be between the values for two
                    other <strong>Sections</strong>.  When setting things up
                    initially, it is a good idea to separate the initial
                    ordinal values by a large amount (say, 1000).
                </p>

                <h3>List View</h3>
                <p>
                    When you select the <em>Admin</em> -&gt; <em>Sections</em> view,
                    you will see a list of all defined <strong>Sections</strong>&nbsp;
                    for the currently selected <strong>Facility</strong>, sorted by
                    their ordinal values.
                </p>
                <p>
                    <img src="/helptext/sections-first.png"
                         style={{border: "1px solid"}}
                         alt="Sections List"/>
                </p>

                <h3>Details View</h3>
                <p>
                    If you are the superuser user, or an administrator for the
                    currently selected <strong>Facility</strong>, you will be
                    able to add new <strong>Sections</strong> (by clicking on
                    the <em>Add</em> button), or edit an existing one (by
                    clicking anywhere on the row for that <strong>Section</strong>).
                </p>
                <p>
                    <img src="/helptext/sections-second.png"
                         style={{border: "1px solid"}}
                         alt="Sections List"/>
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
                        <td>Ordinal</td>
                        <td>Yes</td>
                        <td>Unique number that determines the sort order for Sections.</td>
                    </tr>
                    <tr>
                        <td>Title</td>
                        <td>Yes</td>
                        <td>OBSOLETE - NO LONGER USED</td>
                    </tr>
                    <tr>
                        <td>Notes</td>
                        <td>No</td>
                        <td>Any miscellaneous notes you want to make about this Section.</td>
                    </tr>
                    <tr>
                        <td>Slug</td>
                        <td>Yes</td>
                        <td>Title used on all pages, reports, and chart.</td>
                    </tr>
                    <tr>
                        <td>Scope</td>
                        <td>Yes</td>
                        <td>
                            Suffix for permission scopes for this Section.
                            All Sections with the same scope will be visible
                            to users who have the appropriate permission.
                            See the Manage Users page for more information.
                        </td>
                    </tr>
                    <tr>
                        <td>Active</td>
                        <td>Yes</td>
                        <td>Flag indicating whether this Section is active or not.</td>
                    </tr>
                    </tbody>
                </Table>

            </Row>
        </Container>
    )

}

export default HelpAdminSections;
