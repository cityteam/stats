// MonthlyReport -------------------------------------------------------------

// Monthly report (with daily totals).  There will be a separate tab for each
// defined Section, with dates as rows and Categories as columns.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

// Internal Modules ----------------------------------------------------------

import MonthlyReportSection from "./MonthlyReportSection";
import FacilityContext from "../facilities/FacilityContext";
import CheckBox from "../general/CheckBox";
import MonthSelector from "../general/MonthSelector";
import {HandleBoolean, HandleMonth} from "../../types";
import useFetchSections from "../../hooks/useFetchSections";
import useFetchSummaries from "../../hooks/useFetchSummaries";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {endDate, startDate, todayMonth} from "../../util/Months";

// Component Details ---------------------------------------------------------

const MonthlyReport = () => {

    const facilityContext = useContext(FacilityContext);

    const [active, setActive] = useState<boolean>(false);
    const [dateFrom, setDateFrom] = useState<string>("2021-07-04");
    const [dateTo, setDateTo] = useState<string>("2021-07-04");
    const [month, setMonth] = useState<string>(todayMonth());

    const fetchSections = useFetchSections({
        active: active,
        withCategories: true,
    });
    const fetchSummaries = useFetchSummaries({
        active: active,
        dateFrom: dateFrom,
        dateTo: dateTo,
    });

    useEffect(() => {

        setDateFrom(startDate(month));
        setDateTo(endDate(month));

        logger.info({
            context: "MonthlyReport.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
            active: active,
            month: month,
            //sections: Abridgers.SECTIONS(fetchSections.sections),
            //summaries: Abridgers.SUMMARIES(fetchSummaries.summaries),
        });

    }, [facilityContext.facility,
        active, month,
        fetchSections.sections, fetchSummaries.summaries]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleMonth: HandleMonth = (theMonth) => {
        logger.info({
            context: "MonthlyReport.handleMonth",
            summariesMonth: theMonth,
        });
        setMonth(theMonth);
    }

    return (
        <Container fluid id="MonthlyReport">

            <Row className="mb-4 ml-1 mr-1">
                <Col className="text-left">
                    <span><strong>Monthly Report for Facility:&nbsp;</strong></span>
                    <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        id="activeOnly"
                        initialValue={active}
                        label="Active Sections and Categories Only?"
                    />
                </Col>
                <Col className="col-5 text-right">
                    <MonthSelector
                        autoFocus
                        handleMonth={handleMonth}
                        label="Monthly Report For Month:"
                        required
                        value={month}
                    />
                </Col>
            </Row>

            <Tabs
                className="mb-3"
                mountOnEnter={true}
                transition={false}
                unmountOnExit={true}
            >

                {fetchSections.sections.map((section, tabIndex) => (
                    <Tab
                        eventKey={section.id}
                        title={section.slug}
                    >
                        <MonthlyReportSection
                            active={active}
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            section={section}
                            summaries={fetchSummaries.summaries}
                        />
                    </Tab>
                ))}

            </Tabs>

        </Container>
    )

}

export default MonthlyReport;
