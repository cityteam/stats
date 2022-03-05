// App -----------------------------------------------------------------------

// Overall implementation of the entire client application.

// External Modules ----------------------------------------------------------

import React from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/cjs/NavDropdown";
import NavItem from "react-bootstrap/NavItem";
import {isMobile, useMobileOrientation} from "react-device-detect";
import ReactNotification from "react-notifications-component";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-notifications-component/dist/theme.css";

// Internal Modules ----------------------------------------------------------

import CategorySegment from "./components/categories/CategorySegment";
import EntriesView from "./components/entries/EntriesView";
import FacilitySegment from "./components/facilities/FacilitySegment";
import HomeView from "./components/general/HomeView";
import LoggedInUser from "./components/login/LoggedInUser";
import ConfigurationReport from "./components/reports/ConfigurationReport";
import MonthlyReport from "./components/reports/MonthlyReport";
import YearlyReport from "./components/reports/YearlyReport";
import SectionSegment from "./components/sections/SectionSegment";
import UserSegment from "./components/users/UserSegment";
import {FacilityContextProvider} from "./components/facilities/FacilityContext";
import FacilitySelector from "./components/facilities/FacilitySelector";
import {LoginContextProvider} from "./components/login/LoginContext";
import logger from "./util/ClientLogger";

function App() {

    const {isLandscape} = useMobileOrientation();
    logger.info({
        context: "App.index",
        isLandscape: isLandscape,
        isMobile: isMobile,
        userAgent: window.navigator.userAgent,
    });

    return (
      <>
          <ReactNotification/>
          <LoginContextProvider>
              <FacilityContextProvider>
                  <Router>
                      <Navbar
                          bg="warning"
                          className="mb-3"
                          expand="lg"
                          sticky="top"
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
                          {(isLandscape) ? (
                              <>
                                  <Navbar.Toggle aria-controls="basic-navbar-brand"/>
                                  <Navbar.Collapse id="basic-navbar-brand">
                                      <Nav className="mr-auto">
                                          <LinkContainer to="/">
                                              <NavItem className="nav-link">Home</NavItem>
                                          </LinkContainer>
                                          <LinkContainer to="/entries">
                                              <NavItem className="nav-link">Entries</NavItem>
                                          </LinkContainer>
                                          <NavDropdown id="reports" title="Reports">
                                              <LinkContainer to="/report-month">
                                                  <NavDropdown.Item>Monthly Summary</NavDropdown.Item>
                                              </LinkContainer>
                                              <LinkContainer to="/report-year">
                                                  <NavDropdown.Item>Yearly Summary</NavDropdown.Item>
                                              </LinkContainer>
                                              <LinkContainer to="/report-configuration">
                                                  <NavDropdown.Item>Configuration Report</NavDropdown.Item>
                                              </LinkContainer>
                                          </NavDropdown>
                                          <NavDropdown id="admin" title="Admin">
                                              <LinkContainer to="/admin-categories">
                                                  <NavDropdown.Item>Categories</NavDropdown.Item>
                                              </LinkContainer>
                                              <LinkContainer to="/admin-facilities">
                                                  <NavDropdown.Item>Facilities</NavDropdown.Item>
                                              </LinkContainer>
                                              <LinkContainer to="/admin-sections">
                                                  <NavDropdown.Item>Sections</NavDropdown.Item>
                                              </LinkContainer>
                                              <LinkContainer to="/admin-users">
                                                  <NavDropdown.Item>Users</NavDropdown.Item>
                                              </LinkContainer>
                                          </NavDropdown>
                                      </Nav>
                                  </Navbar.Collapse>
                              </>
                          ) : (
                              <>
                                  <LinkContainer to="/">
                                      <NavItem className="nav-link">Home</NavItem>
                                  </LinkContainer>
                                  <LinkContainer to="/entries">
                                      <NavItem className="nav-link">Entries</NavItem>
                                  </LinkContainer>
                              </>
                          ) }
                          <LoggedInUser/>
                          <span className="mr-2"/>
                          <FacilitySelector/>
                      </Navbar>
                      <Switch>
                          <Route exact path="/admin-categories">
                              <CategorySegment/>
                          </Route>
                          <Route exact path="/entries">
                              <EntriesView/>
                          </Route>
                          <Route exact path="/admin-facilities">
                              <FacilitySegment/>
                          </Route>
                          <Route exact path="/admin-sections">
                              <SectionSegment/>
                          </Route>
                          <Route exact path="/admin-users">
                              <UserSegment/>
                          </Route>
                          <Route exact path="/report-configuration">
                              <ConfigurationReport/>
                          </Route>
                          <Route exact path="/report-month">
                              <MonthlyReport/>
                          </Route>
                          <Route exact path="/report-year">
                              <YearlyReport/>
                          </Route>
                          <Route path="/">
                              <HomeView/>
                          </Route>

                      </Switch>
                  </Router>
              </FacilityContextProvider>
          </LoginContextProvider>
      </>
  );
}

export default App;
