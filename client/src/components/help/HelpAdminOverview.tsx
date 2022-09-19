// HelpAdminOverview ---------------------------------------------------------

// Admin Overview help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const HelpAdminOverview = () => {

    return (
        <Container fluid>
            <Row className="text-center">
                <span className="text-info"><strong>
                    Admin Overview
                </strong></span>
                <hr/>
            </Row>
            <Row>

                <h3>Overview</h3>
                <p>
                    In addition to the operations that regular users can perform
                    (primarily data entry), administrative users can manage the
                    configuration data that controls what <strong>Sections</strong>,
                    <strong>Categories</strong>, and <strong>Users</strong> exist
                    for your current <strong>Facility</strong>, and (in particular)
                    which <strong>Sections</strong> are visible to which
                    <strong>Users</strong>.
                </p>
                <p>
                    All the available administrative pages are listed under the
                    <em>Admin</em> topic at the top of the screen.  The information
                    below describes the common techniques that can be used on each
                    of these pages to add new information, edit existing information,
                    or (in some cases) remove existing information.
                </p>

                <h3>Viewing Existing Information</h3>
                <p>
                    When you pick a particular <em>Admin</em> option, you will be
                    shown a page of any existing information (associated with the
                    currently selected CityTeam <strong>Facility</strong>) for
                    that topic.  We will use <strong>Sections</strong> as an example
                    here to illustrate the general style, but each type of information
                    will have it's own individual page that covers the details.
                </p>
                <p>
                    <img src="/helptext/overview-first.png"
                         style={{border: "1px solid"}}
                         alt="Sections List"/>
                </p>
                <p>
                    At the top of the page, you will typically see:
                    <ul>
                        <li>
                            <em>Filter Criteria</em> - you can limit what information
                            is displayed, sometimes with a search bar that displays
                            only rows where the name matches what you have typed, and
                            sometimes with a checkbox to select active things only.
                        </li>
                        <li>
                            <em>Pagination</em> - if there are potentially many
                            items on this list, they will be split into multiple
                            pages, and controls will let you move forwards and
                            backwards one page at a time.
                        </li>
                        <li>
                            <em>Add Button</em> - You can click or touch this button
                            (repeated at the bottom of the list for convenience)
                            to add a new item of this type.  If you are not allowed
                            to add new information, these buttons will be disabled.
                            If allowed, you will be taken to a page showing the
                            detailed fields for a new item, waiting for you to fill
                            in the form and then click or touch <em>Save</em>.
                        </li>
                    </ul>
                </p>

                <h3>Managing Item Details</h3>
                <p>
                    When you have clicked or touched on an existing row (or used
                    the <em>Add</em> button), you will see the current fields
                    for that item displayed, like this:
                </p>
                <p>
                    <img src="/helptext/overview-second.png"
                         style={{border: "1px solid"}}
                         alt="Sections List"/>
                </p>
                <p>
                    Below each field, you will see explanatory notes on what kind of
                    information goes in each field.  The detailed pages for each
                    information type will also describe error checks that will be
                    performed - for example, in nearly every case there is a "name"
                    or "ordinal" field that must be unique.
                </p>
                <p>
                    If you try to enter a value that violates any validation rules
                    (or try to leave a required field blank), the explanatory comment
                    will be replaced with an error message describing what is wrong,
                    as soon as you advance to the next field.  You must correct any
                    and all errors before you will be able to click or touch
                    <em>Save</em> in order to add a new item, or update an existing
                    item.
                </p>
                <p>
                    In some cases, you may be allowed to click <em>Remove</em> in
                    order to remove an existing item from the system.  This is
                    typically not a good thing to do, because it makes existing
                    information disappear, so you will be shown a confirmation
                    dialog to indicate that you really did intent to remove this
                    item.  In general, marking an existing item as inactive
                    is better.
                </p>

            </Row>
        </Container>
    )

}

export default HelpAdminOverview;
