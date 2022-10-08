// HelpLoggingIn --------------------------------------------------------

// Logging In help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import HelpSidebar from "./HelpSidebar";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const HelpLoggingIn = () => {

    return (
        <Container fluid="md" id="HelpLoggingIn">
            <Row>
                <Col className="col-3">
                    <HelpSidebar/>
                </Col>
                <Col>
                    <Row className="text-center">
                <span className="text-info"><strong>
                    Logging In
                </strong></span>
                        <hr/>
                    </Row>
                    <Row>
                        <p>
                            Each time you wish to start using the application,
                            click or touch the&nbsp;
                            <img src="/helptext/button-login-top.png" alt="Log In"/>
                            &nbsp;button at the top of the screen.
                        </p>
                        <p><img src="/helptext/login.png" alt="Login Form"/></p>
                        <p>
                            Enter your username and password, then click the&nbsp;
                            <em>Log In</em> button in the form.  If your credentials
                            are correct, you will be welcomed to the Home Page of
                            this application.
                        </p>
                        <p>
                            <img src="/helptext/loggedin.png"
                                 style={{border: "1px solid"}}
                                 alt="Logged In Screen"/>
                        </p>
                        <p>
                            The CityTeam Facility you are authorized to access will
                            be shown in the navigation bar.  If you are authorized
                            to access more than one Facility, this is a dropdown
                            from which you can select the Facility you wish to access.
                        </p>
                        <p>
                            When you are through using the application, click or touch
                            the <em>Log Out</em> button at the top of the screen.
                        </p>
                    </Row>
                </Col>
            </Row>
        </Container>
    )

}

export default HelpLoggingIn;
