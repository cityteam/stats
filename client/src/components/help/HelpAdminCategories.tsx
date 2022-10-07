// HelpAdminCategories ---------------------------------------------------------

// Admin Categories help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const HelpAdminCategories = () => {

    return (
        <Container fluid>
            <Row className="text-center">
                <span className="text-info"><strong>
                    Manage Categories
                </strong></span>
                <hr/>
            </Row>
            <Row>

                <h3>Introduction</h3>
                <p>
                    A <strong>Category</strong> is an individual statistic
                    that a CityTeam <strong>Facility</strong> wishes to have
                    recorded on a daily basis.  <strong>Categories</strong> belong
                    to a <strong>Section</strong>, and all of the
                    <strong>Categories</strong> for a <strong>Section</strong>&nbsp;
                    are grouped together on the data entry screen.
                </p>
                <p>
                    In the data entry screen, and also in graphs and reports,&nbsp;
                    <strong>Categories</strong> will be listed in the order of their
                    "ordinal" values.  Thus, you can rearrange the ordering by
                    changing the ordinal value for one particular&nbsp;
                    <strong>Category</strong> to be between the values for two
                    other <strong>Categories</strong>.  When setting things up
                    initially, it is a good idea to separate the initial
                    ordinal values by a large amount (say, 1000).
                </p>

                <h3>List View</h3>
                <p>
                    When you select the <em>Admin</em> -&gt; <em>Categories</em> view,
                    you will see a list of all defined <strong>Categories</strong>&nbsp;
                    for the currently selected <strong>Facility</strong> and the
                    currently selected <strong>Section</strong>, sorted by
                    their ordinal values.
                </p>
                <p>
                    <Image
                        alt="Categories List"
                        fluid
                        src="/helptext/categories-first.png"
                        style={{border: "1px solid"}}
                    />
                </p>

                <h3>Details View</h3>
                <p>
                    If you are the superuser user, or an administrator for the
                    currently selected <strong>Facility</strong>, you will be
                    able to add new <strong>Categories</strong> (by clicking on
                    the <em>Add</em> button), or edit an existing one (by
                    clicking anywhere on the row for that <strong>Category</strong>).
                </p>
                <p>
                    <Image
                        alt="Category Details"
                        fluid
                        src="/helptext/categories-second.png"
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
                        <td>Ordinal</td>
                        <td>Yes</td>
                        <td>Unique number that determines the sort order for Categories.</td>
                    </tr>
                    <tr>
                        <td>Service</td>
                        <td>Yes</td>
                        <td>OBSOLETE - NO LONGER USED</td>
                    </tr>
                    <tr>
                        <td>Notes</td>
                        <td>No</td>
                        <td>Any miscellaneous notes you want to make about this Category.</td>
                    </tr>
                    <tr>
                        <td>Slug</td>
                        <td>Yes</td>
                        <td>Title used on all pages, reports, and charts.</td>
                    </tr>
                    <tr>
                        <td>Active</td>
                        <td>Yes</td>
                        <td>Flag indicating whether this Category is active or not.</td>
                    </tr>
                    </tbody>
                </Table>

            </Row>
        </Container>
    )

}

export default HelpAdminCategories;
