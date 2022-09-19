// HelpEnteringData --------------------------------------------------------

// Entering Data help page.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const HelpEnteringData = () => {

    return (
        <Container fluid>
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
                    <img src="/helptext/entering-first.png"
                         style={{border: "1px solid"}}
                         alt="Entering Data Form"/>
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
                    into <em>Sections</em>, each of which includes
                    one or more <em>Categories</em> of statistics
                    that you can enter.
                    Only the <em>Sections</em> you are authorized
                    to enter information for will be shown.
                </p>
                <h3>Enter numbers for the relevant Categories</h3>
                <p>
                    Enter the values for the <em>Categories</em> you
                    are responsible for.  If there was no information
                    for a particular <em>Category</em> on this date,
                    leave that field blank.
                </p>
                <p>
                    After entering numbers for Breakfasts and Lunches,
                    your screen might look like this:
                </p>
                <p>
                    <img src="/helptext/entering-second.png"
                         style={{border: "1px solid"}}
                         alt="Values Entered but not yet Saved"/>
                </p>
                <h3>Save your work!</h3>
                <p>
                    Note that the <strong>Save</strong> button for the
                    Meals Provided section is now active.  Click or touch
                    the <strong>Save</strong> button to cause the values
                    for this <em>Section</em> to be recorded.
                </p>
                <p>
                    If you need to correct a mistake, just go back to the
                    field you need to change, correct the value, and then
                    click or touch the <strong>Save</strong> button again.
                </p>
            </Row>
        </Container>
    )

}

export default HelpEnteringData;
