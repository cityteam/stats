// HelpWelcome --------------------------------------------------------

// Welcome help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const HelpWelcome = () => {

    return (
        <Container fluid>
            <Row className="text-center">
                <span className="text-info"><strong>
                    Welcome
                </strong></span>
                <hr/>
            </Row>
            <Row>
                <p>
                    <a href="https://cityteam.org" target="_blank">CityTeam</a>&nbsp;
                    offers programs for outreacth to, and support of, homeless
                    communities, as well as recovery from addiction, in several
                    US cities.  See their website for more information.
                </p>
                <p>
                    This application is designed to assist staff at CityTeam
                    facilities in recording daily statistics that will be
                    reported (typically on a monthly basis) to the home office.
                    The set of statistics being gathered is based on the
                    standard information the home office wants to receive,
                    but can be customized on a per-Facility basis based on the
                    individual needs and desires of each Facility.
                </p>
            </Row>
        </Container>
    )

}

export default HelpWelcome;
