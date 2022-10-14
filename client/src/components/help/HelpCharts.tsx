// HelpCharts ---------------------------------------------------------------

// Charts help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import HelpSidebar from "./HelpSidebar";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const HelpCharts = () => {

    return (
        <Container fluid="md" id="HelpCharts">
            <Row>
                <Col className="col-3">
                    <HelpSidebar/>
                </Col>
                <Col>
                    <Row className="text-center">
                        <span className="text-info"><strong>
                            Charts
                        </strong></span>
                        <hr/>
                    </Row>
                    <Row>

                        <h3>Introduction</h3>
                        <p>
                            The following charts are available uner the <em>Reports</em>&nbsp;
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

                        <h3>Monthly Chart</h3>
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
                                <em>Chart For Month</em> - Display information for
                                each date in the selected month.  By default, it is
                                assumed you want information for the current month.
                            </li>
                        </ul>
                        <p>
                            <Image
                                alt="Monthly Chart"
                                fluid
                                src="/helptext/monthly-chart.png"
                                style={{border: "1px solid"}}
                            />
                        </p>

                        <h3>Yearly Chart</h3>
                        <p>
                            Summarizes the per-<strong>Category</strong> entered data
                            for each <strong>Section</strong> you are authorized to view,
                            for each day of the specified month.  There will be a tab
                            for each of the twelve months starting with the one you
                            have specified.  Each <strong>Section</strong> will have
                            it's own tab so you can view them individually.
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
                            <li>
                                <em>Bar Chart</em> - Display the information as a
                                bar chart (bar for each <strong>Category</strong>),
                                or as a line chart (line for each&nbsp;
                                <strong>Category</strong>).
                            </li>
                        </ul>
                        <p>
                            <Image
                                alt="Yearly Chart"
                                fluid
                                src="/helptext/yearly-chart.png"
                                style={{border: "1px solid"}}
                            />
                        </p>

                    </Row>
                </Col>
            </Row>
        </Container>
    )

}

export default HelpCharts;
