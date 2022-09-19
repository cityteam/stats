// HelpView ------------------------------------------------------------------

// Help pages view.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import HelpEnteringData from "./HelpEnteringData";
import HelpGettingStarted from "./HelpGettingStarted";
import HelpLoggingIn from "./HelpLoggingIn";
import HelpWelcome from "./HelpWelcome";

// Component Details ---------------------------------------------------------

const HelpView = () => {

    type Selection = {
        name: string;
        component: React.FunctionComponent;
    }

    const ALL_USERS_SELECTIONS: Selection[] = [
        { name: "Getting Started", component: HelpGettingStarted},
        { name: "Logging In", component: HelpLoggingIn},
        { name: "Entering Data", component: HelpEnteringData},
    ]

    const [selection, setSelection] = useState<Selection>({
        name: "Welcome",
        component: HelpWelcome,
    });

/*
    const ADMIN_USERS_SECTIONS = [
        "Admin Concepts",
        "Manage Users",
        "Manage Facilities",
        "Manage Sections",
        "Manage Categories",
    ];
*/

    let Component = selection.component;

    return(
        <Container fluid id="HelpView">
            <Row>
                <Col className="bg-light col-2">

                    <div><strong>All Users</strong></div>
                    {ALL_USERS_SELECTIONS.map(selection => (
                        <li onClick={() => setSelection(selection)}>
                            {selection.name}
                        </li>
                    )) }

                    <div><strong>Admin Users</strong></div>
{/*
                    {ADMIN_USERS_SECTIONS.map(section => (
                        <li onClick={() => setSection(section)}>
                            {section}
                        </li>
                    )) }
*/}
                    <div><strong>Reports and Graphs</strong></div>
                </Col>
                <Col>
                    <Component/>
                </Col>
            </Row>
        </Container>
    )

}

export default HelpView;
