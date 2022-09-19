// HelpGettingStarted --------------------------------------------------------

// Getting Started help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const HelpGettingStarted = () => {

    return (
        <Container fluid>
            <Row className="text-center">
                <span className="text-info"><strong>
                    Getting Started
                </strong></span>
                <hr/>
            </Row>
            <Row>
                <p>
                    In order to begin using this application for the very first time,
                    you must locate it.  There are two basic alternatives:
                </p>
                <p>
                    If you are using an Amazon tablet (such as the Fire 7), or any
                    Android device that has access to the Amazon App Store:
                    <ul>
                        <li>Navigate to the Amazon App Store.</li>
                        <li>Search for an application named <strong>CityTeam
                            Daily Stats Entry Application</strong>.  The simplest
                            way to find this is to just search for "cityteam" as
                            all one word.
                        </li>
                        <li>
                            Install this application on your device.
                        </li>
                        <li>
                            Now, you can load it whenever needed, just like
                            any other application.
                        </li>
                    </ul>
                </p>
                <p>
                    If you are using any computer or device that has a web
                    browser:
                    <ul>
                        <li>
                            Navigate to <a href="https://cityteam-stats.herokuapp.com">
                                https://cityteam-stats.herokuapp.com
                            </a>.
                        </li>
                        <li>
                            For your convenience accessing the application later,
                            save this URL as a bookmark.
                        </li>
                    </ul>
                </p>
            </Row>
        </Container>
    )

}

export default HelpGettingStarted;
