// HelpReports ---------------------------------------------------------------

// Reports help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import HelpSidebar from "./HelpSidebar";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const HelpReports = () => {

    return (
        <Container fluid="md" id="HelpReports">
            <Row>
                <Col className="col-3">
                    <HelpSidebar/>
                </Col>
                <Col>
                    <Row className="text-center">
                        <span className="text-info"><strong>
                            Reports
                        </strong></span>
                        <hr/>
                    </Row>
                    <Row>

                        <h3>Introduction</h3>
                        <p>
                            The following reports are available under the <em>Reports</em>&nbsp;
                            menu option.  In each case, if you are not an administrator for the
                            currently selected <strong>Facility</strong>, you will only see
                            information for <strong>Sections</strong> that you are authorized
                            to enter or view information for.
                        </p>
                        <p>
                            To avoid displaying sensitive information, the example images
                            shown below are test data, instead of anything related to an
                            actual CityTeam <strong>Facility</strong>.
                        </p>

                        <h3>Monthly Summary</h3>
                        <p>
                            Summarizes the per-<strong>Category</strong> entered data
                            for each <strong>Section</strong> you are authorized to view,
                            for each day of the specified month.  There will be a tab
                            for each such <strong>Section</strong>, so you can view
                            them individually.
                        </p>
                        <p>
                            You can customize the information being displayed with the
                            following options:
                        </p>
                        <ul>
                            <li>
                                <em>Active Sections/Categories Only</em> - Display
                                only <strong>Sections</strong> and <strong>Categories</strong>&nbsp;
                                that the administrator has marked as being active.
                            </li>
                            <li>
                                <em>Report For Month</em> - Display information for
                                each date in the selected month.  By default, it is
                                assumed you want information for the current month.
                            </li>
                        </ul>
                        <p>
                            <Image
                                alt="Monthly Summary"
                                fluid
                                src="/helptext/monthly-report.png"
                                style={{border: "1px solid"}}
                            />
                        </p>

                        <h3>Yearly Summary</h3>
                        <p>
                            Summarizes the per-<strong>Section</strong> entered data
                            for each <strong>Section</strong> you are authorized to view,
                            for each of the twelve months starting with the one you
                            have specified.
                        </p>
                        <p>
                            You can customize the information being displayed with the
                            following options:
                        </p>
                        <ul>
                            <li>
                                <em>Active Sections/Categories Only</em> - Display
                                only <strong>Sections</strong> and <strong>Categories</strong>&nbsp;
                                that the administrator has marked as being active.
                            </li>
                            <li>
                                <em>Starting Month</em> - Display information for
                                the twelve months beginning with the selected month.
                                By default, it is assumed you want information for
                                the current fiscal year.
                            </li>
                        </ul>
                        <p>
                            <Image
                                alt="Yearly Summary"
                                fluid
                                src="/helptext/yearly-report.png"
                                style={{border: "1px solid"}}
                            />
                        </p>

                        <h3>Configuration Report</h3>
                        <p>
                            For administrators, this report summarizes all of the
                            defined <strong>Sections</strong> and <strong>Categories</strong>&nbsp;
                            so that you can see everything that has been configured.
                        </p>
                        <p>
                            <Image
                                alt="Yearly Summary"
                                fluid
                                src="/helptext/configuration-report.png"
                                style={{border: "1px solid"}}
                            />
                        </p>

                    </Row>
                </Col>
            </Row>
        </Container>
    )

}

export default HelpReports;
