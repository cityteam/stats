// HelpEnteringData --------------------------------------------------------

// Entering Data help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import HelpSidebar from "./HelpSidebar";

// Internal Modules ---------------------------------------------------------

import Callout from "../general/Callout";

// Component Details --------------------------------------------------------

const HelpEnteringData = () => {

    return (
        <Container fluid="md" id="HelpEnteringData">
            <Row>
                <Col className="col-3">
                    <HelpSidebar/>
                </Col>
                <Col>
                    <Row className="text-center">
                <span className="text-info"><strong>
                    Entering Data
                </strong></span>
                        <hr/>
                    </Row>
                    <Row>
                        <h3>Select the <em>Entries</em> menu option</h3>
                        <p>
                            As the welcome screen indicates, click or touch the
                            <em>Entries</em> menu option at the top of the screen.
                            You will be directed to a data entry form like this:
                        </p>
                        <p>
                            <Image
                                alt="Entering Data Form"
                                fluid
                                src="/helptext/entering-first.png"
                                style={{border: "1px solid"}}
                            />
                        </p>
                        <h3>Make sure the <em>Entries for Date</em> value is correct</h3>
                        <p>
                            The first thing to do is to make sure that the date
                            shown for <em>Entries for Date</em> is correct.  The
                            system will assume you want to enter data for today,
                            but you can manually modify the date if you need to
                            correct information entered on some previous day.
                        </p>
                        <h3>What numbers can I enter?</h3>
                        <p>
                            The information you can enter is organized
                            into <strong>Sections</strong>, each of which includes
                            one or more <strong>Categories</strong> of statistics
                            that you can enter.
                            Only the <strong>Sections</strong> you are authorized
                            to enter information for will be shown.
                        </p>
                        <h3>Enter numbers for the relevant Categories</h3>
                        <p>
                            Enter the values for the <strong>Categories</strong> you
                            are responsible for.  If there was no information
                            for a particular <strong>Category</strong> on this date,
                            leave that field blank.
                        </p>
                        <p>
                            After entering numbers for Breakfasts and Lunches,
                            your screen might look like this:
                        </p>
                        <p>
                            <Image
                                alt="Entered but not yet Saved"
                                fluid
                                src="/helptext/entering-second.png"
                                style={{border: "1px solid"}}
                            />
                        </p>
                        <h3>Save your work!</h3>
                        <p>
                            Note that the <strong>Save</strong> button for the
                            Meals Provided section is now active.  Click or touch
                            the <strong>Save</strong> button to cause the values
                            for this <em>Section</em> to be recorded.
                        </p>
                        <Callout title="Correcting Errors" variant="info">
                            If you need to correct a mistake, just go back to the
                            field you need to change, correct the value, and then
                            click or touch the <strong>Save</strong> button again.
                        </Callout>
                    </Row>
                </Col>
            </Row>
        </Container>
    )

}

export default HelpEnteringData;
