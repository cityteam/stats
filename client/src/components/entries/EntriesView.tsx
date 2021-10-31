// EntriesView ---------------------------------------------------------------

// Top-level view for entry of daily statistics for all Categories associated
// with a specific Facility, for a specific Date.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import SectionEntries from "./SectionEntries";
import FacilityContext from "../facilities/FacilityContext";
import DateSelector from "../general/DateSelector";
import ValueSelector from "../general/ValueSelector";
import LoginContext from "../login/LoginContext";
import useFetchSections from "../../hooks/useFetchSections";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {todayDate} from "../../util/Dates";
import {HandleDate, HandleValue} from "../../types";

// Component Details --------------------------------------------------------

// Style Constants for choosing presentation
const SINGLE_COLUMN_NARROW = "Single Column Narrow";
const SINGLE_COLUMN_WIDE = "Single Column Wide";
const MULTI_COLUMN_NARROW = "Multiple Column Narrow";
const MULTI_COLUMN_WIDE = "Multiple Column Wide";

const STYLES: string[] = [
    SINGLE_COLUMN_NARROW,
    SINGLE_COLUMN_WIDE,
    MULTI_COLUMN_NARROW,
    MULTI_COLUMN_WIDE,
];

const EntriesView = () => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [entriesDate, setEntriesDate] = useState<string>(todayDate());
    const [style, setStyle] = useState<string>("");

    const fetchSections = useFetchSections({
        active: true,
        withCategories: true,
    });

    useEffect(() => {
        logger.debug({
            context: "EntriesView.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility)
        });
    }, [facilityContext.facility]);

    const handleDate: HandleDate = (theDate) => {
        logger.trace({
            context: "EntriesView.handleDate",
            entriesDate: theDate,
        });
        setEntriesDate(theDate);
    }

    const handleStyle: HandleValue = (theStyle) => {
        logger.trace({
            context: "EntriesView.handleStyle",
            style: theStyle,
        });
        setStyle(theStyle);
    }

    return (
        <Container fluid id="EntriesView">

            {/* Title and Entries Date Selector are always visible */}
            <Row className="mb-3 ml-1 mr-1">
                <Col className="text-left">
                    <span><strong>Data Entry for Facility&nbsp;</strong></span>
                    <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                </Col>
                <Col className="text-center">
                    <ValueSelector
                        handleValue={handleStyle}
                        header="(Select Style)"
                        label="Presentation Style:"
                        values={STYLES}
                    />
                </Col>
                <Col className="text-right">
                    <DateSelector
                        autoFocus
                        handleDate={handleDate}
                        label="Data Entries For:"
                        required
                        value={entriesDate}
                    />
                </Col>
            </Row>

            <Row className="ml-1 mr-1">
                {(style === SINGLE_COLUMN_NARROW) ? (
                    <>
                        {fetchSections.sections.map((section, rowIndex) => (
                            <SectionEntries narrow={true} section={section}/>
                        ))}
                    </>
                ) : null}

                {(style === SINGLE_COLUMN_WIDE) ? (
                    <>
                        {fetchSections.sections.map((section, rowIndex) => (
                            <SectionEntries narrow={false} section={section}/>
                        ))}
                    </>
                ) : null}

                {(style === MULTI_COLUMN_NARROW) ? (
                    <>
                        {fetchSections.sections.map((section, rowIndex) => (
                            <Col>
                                <SectionEntries narrow={true} section={section}/>
                            </Col>
                        ))}
                    </>
                ) : null}

                {(style === MULTI_COLUMN_WIDE) ? (
                    <>
                        {fetchSections.sections.map((section, rowIndex) => (
                            <Col>
                                <SectionEntries narrow={false} section={section}/>
                            </Col>
                        ))}
                    </>
                ) : null}
            </Row>

        </Container>
    )

}

export default EntriesView;
