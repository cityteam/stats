// App -----------------------------------------------------------------------

// Overall implementation of the entire client application.

// External Modules ----------------------------------------------------------

import React from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/cjs/NavDropdown";
import NavItem from "react-bootstrap/NavItem";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Internal Modules ----------------------------------------------------------

import FacilitiesView from "./components/facilities/FacilitiesView";
import HomeView from "./components/general/HomeView";
import LoggedInUser from "./components/login/LoggedInUser";
import UsersView from "./components/users/UsersView";
import {FacilityContextProvider} from "./components/facilities/FacilityContext";
import FacilitySelector from "./components/facilities/FacilitySelector";
import {LoginContextProvider} from "./components/login/LoginContext";

function App() {
  return (
      <>
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
                              <img
                                  alt="CityTeam Logo"
                                  height={66}
                                  src="/CityTeamDarkBlue.png"
                                  width={160}
                              />
                          </Navbar.Brand>
                          <Navbar.Toggle aria-controls="basic-navbar-brand"/>
                          <Navbar.Collapse id="basic-navbar-brand">
                              <Nav className="mr-auto">
                                  <LinkContainer to="/">
                                      <NavItem className="nav-link">Home</NavItem>
                                  </LinkContainer>
                                  <LinkContainer to="/entry">
                                      <NavItem className="nav-link">Entry</NavItem>
                                  </LinkContainer>
                                  <NavDropdown id="reports" title="Reports">
                                      <LinkContainer to="/report-month">
                                          <NavDropdown.Item>Monthly Details</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/report-year">
                                          <NavDropdown.Item>Yearly Summary</NavDropdown.Item>
                                      </LinkContainer>
                                  </NavDropdown>
                                  <NavDropdown id="admin" title="Admin">
                                      <LinkContainer to="/admin-database">
                                          <NavDropdown.Item>Backup Database</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/admin-categories">
                                          <NavDropdown.Item>Categories</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/admin-facilities">
                                          <NavDropdown.Item>Facilities</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/admin-users">
                                          <NavDropdown.Item>Users</NavDropdown.Item>
                                      </LinkContainer>
                                  </NavDropdown>
                              </Nav>
                          </Navbar.Collapse>
                          <LoggedInUser/>
                          <span className="mr-4"/>
                          <FacilitySelector/>
                      </Navbar>
                      <Switch>
{/*
                          <Route exact path="/admin-categories">
                              <CategoriesView/>
                          </Route>
*/}
{/*
                          <Route exact path="/admin-database">
                              <DatabaseView/>
                          </Route>
*/}
{/*
                          <Route exact path="/entry">
                              <EntryView/>
                          </Route>
*/}
                          <Route exact path="/admin-facilities">
                              <FacilitiesView/>
                          </Route>
                          <Route exact path="/admin-users">
                              <UsersView/>
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
