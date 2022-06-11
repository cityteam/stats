// Navigation ----------------------------------------------------------------

// Top-level navigation menu, with support for react-router-dom@6.

// External Modules ----------------------------------------------------------

import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import {useMobileOrientation} from "react-device-detect";
import {NavLink, Outlet} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import FacilitySelector from "../facilities/FacilitySelector";
import LoggedInUser from "../login/LoggedInUser";

// Component Details ---------------------------------------------------------

function Navigation() {

    const {isLandscape} = useMobileOrientation();

    return (
        <>
            <Navbar
                //bg="primary"
                className="mb-3"
                collapseOnSelect
                sticky="top"
                style={{backgroundColor: "rgb(69,154,185)"}}
                variant="light"
            >

                <Navbar.Brand>
                    {(isLandscape) ? (
                        <>
                            <img
                                alt="CityTeam Logo"
                                height={64}
                                src="/CityTeamInitials64-nobg.png"
                                width={64}
                            />
                            <span>&nbsp;&nbsp;CityTeam Stats</span>
                        </>
                    ) : null }
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <NavLink className="nav-link" to="/">Home</NavLink>
                        <NavLink className="nav-link" to="/entries">Entries</NavLink>
                        {(isLandscape) ? (
                            <>
                                <NavDropdown id="Reports" title="Reports">
                                    <NavDropdown.Item>
                                        <NavLink className="nav-link" to="/report-month">Monthly Summary</NavLink>
                                        <NavLink className="nav-link" to="/report-year">Yearly Summary</NavLink>
                                        <NavLink className="nav-link" to="/report-configuration">Configuration Report</NavLink>
                                        <NavLink className="nav-link" to="/chart-month">Monthly Chart</NavLink>
                                        <NavLink className="nav-link" to="/chart-year">Yearly Chart</NavLink>
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown id="Admin" title="Admin">
                                    <NavDropdown.Item>
                                        <NavLink className="nav-link" to="/admin-categories">Categories</NavLink>
                                        <NavLink className="nav-link" to="/admin-facilities">Facilities</NavLink>
                                        <NavLink className="nav-link" to="/admin-sections">Sections</NavLink>
                                        <NavLink className="nav-link" to="/admin-users">Users</NavLink>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                            </>
                        ) }
                    </Nav>
                    <LoggedInUser/>
                    <span className="me-4"/>
                    <FacilitySelector/>
                    <span className="me-2"/>
                </Navbar.Collapse>

            </Navbar>
            <Outlet/>
        </>
    )
}

export default Navigation;
