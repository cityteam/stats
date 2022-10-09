// HelpSidebar ---------------------------------------------------------------

// Sidebar with navigation controls for help information.

// External Modules ----------------------------------------------------------

import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {NavLink} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

// Component Details ---------------------------------------------------------

const HelpSidebar = () => {

    type Selection = {
        name: string;
        to: string;
    }

    const ALL_USERS_SELECTIONS: Selection[] = [
        { name: "Getting Started",      to: "/help-getting-started" },
        { name: "Logging In",           to: "/help-logging-in" },
        { name: "Entering Data",        to: "/help-entering-data" },
    ];

    const ALL_ADMIN_SELECTIONS: Selection[] = [
        { name: "Overview",             to: "/help-admin-overview" },
        { name: "Manage Facilities",    to: "/help-admin-facilities" },
        { name: "Manage Sections",      to: "/help-admin-sections" },
        { name: "Manage Categories",    to: "/help-admin-categories" },
        { name: "Manage Users",         to: "/help-admin-users" },
    ];

    return (
        <Container className="bg-light  navbar navbar-nav" fluid id="helpSidebar">
            <Row>
                <div><strong>All Users:</strong></div>
            </Row>
            {ALL_USERS_SELECTIONS.map((selection) => (
                <NavLink className="nav-link" to={selection.to}>{selection.name}</NavLink>
            ))}
            <Row>
                <span>&nbsp;</span>
            </Row>
            <Row>
                <div><strong>Admin Users:</strong></div>
            </Row>
            {ALL_ADMIN_SELECTIONS.map((selection) => (
                <NavLink className="nav-link" to={selection.to}>{selection.name}</NavLink>
            ))}
        </Container>
    )

}

export default HelpSidebar;
