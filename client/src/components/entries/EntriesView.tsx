// EntriesView ---------------------------------------------------------------

// Top-level view for entry of daily statistics for all Categories associated
// with a specific Facility, for a specific Date.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import EntriesSection from "./EntriesSection";
import FacilityContext from "../facilities/FacilityContext";
import CheckBox from "../general/CheckBox";
import DateSelector from "../general/DateSelector";
import useFetchSections from "../../hooks/useFetchSections";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {todayDate} from "../../util/Dates";
import {HandleBoolean, HandleDate} from "../../types";

// Component Details --------------------------------------------------------

const EntriesView = () => {

    const facilityContext = useContext(FacilityContext);

    const [active, setActive] = useState<boolean>(true);
    const [date, setDate] = useState<string>(todayDate());

    const fetchSections = useFetchSections({
        active: active,
        withCategories: true,
    });

    useEffect(() => {
        logger.debug({
            context: "EntriesView.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
            active: active,
            date: date,
        });
    }, [facilityContext.facility,
        active, date,
        fetchSections.sections]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleDate: HandleDate = (theDate) => {
        logger.debug({
            context: "EntriesView.handleDate",
            date: theDate,
        });
        setDate(theDate);
    }

    return (
        <Container fluid id="EntriesView">

            {/* Title and Entries Date Selector are always visible */}
            <Row className="mb-4 ml-1 mr-1">
                <Col className="text-left">
                    <span><strong>Entries for Facility:&nbsp;</strong></span>
                    <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        id="activeOnly"
                        initialValue={active}
                        label="Active Sections/Categories Only?"
                    />
                </Col>
                <Col className="col-5 text-right">
                    <DateSelector
                        actionLabel="Go"
                        autoFocus
                        handleDate={handleDate}
                        label="Entries For Date:"
                        required
                        value={date}
                    />
                </Col>
            </Row>

            <Row className="ml-1 mr-1">
                {fetchSections.sections.map((section, rowIndex) => (
                    <Col
                        id={`EV-S${section.id}-Col`}
                        key={`EV-S${section.id}-Col`}
                    >
                        <EntriesSection
                            active={active}
                            date={date}
                            section={section}
                        />
                    </Col>
                ))}
            </Row>

        </Container>
    )

}

export default EntriesView;
