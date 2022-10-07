// HelpView ------------------------------------------------------------------

// Help pages view.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import HelpAdminCategories from "./HelpAdminCategories";
import HelpAdminFacilities from "./HelpAdminFacilities";
import HelpAdminOverview from "./HelpAdminOverview";
import HelpAdminSections from "./HelpAdminSections";
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
    ];

    const ALL_ADMIN_SELECTIONS: Selection[] = [
        { name: "Overview", component: HelpAdminOverview },
        { name: "Manage Facilities", component: HelpAdminFacilities },
        { name: "Manage Sections", component: HelpAdminSections },
        { name: "Manage Categories", component: HelpAdminCategories },
    ];

    const [selection, setSelection] = useState<Selection>({
        name: "Welcome",
        component: HelpWelcome,
    });

    let Component = selection.component;

    return(
        <Container fluid="md" id="HelpView">
            <Row>
                <Col className="bg-light col-3">

                    <div><strong>All Users</strong></div>
                    {ALL_USERS_SELECTIONS.map(selection => (
                        <li onClick={() => setSelection(selection)}>
                            {selection.name}
                        </li>
                    )) }

                    <div><strong>Admin Users</strong></div>
                    {ALL_ADMIN_SELECTIONS.map(selection => (
                        <li onClick={() => setSelection(selection)}>
                            {selection.name}
                        </li>
                    )) }

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
