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
import MonthSelector from "../general/MonthSelector";
import {HandleMonth} from "../../types";
import useFetchSections from "../../hooks/useFetchSections";
import useFetchSummaries from "../../hooks/useFetchSummaries";
import Section from "../../models/Section";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {endDate, startDate, todayMonth} from "../../util/Months";

// Component Details ---------------------------------------------------------

const MonthlyReport = () => {

    const facilityContext = useContext(FacilityContext);

    const [activeCategories] = useState<boolean>(false);
    const [activeSections] = useState<boolean>(false);
    const [summariesMonth, setSummariesMonth] = useState<string>(todayMonth());

    const fetchSections = useFetchSections({
        withCategories: true,
    });
    const fetchSummaries = useFetchSummaries({
        dateFrom: startDate(summariesMonth),
        dateTo: endDate(summariesMonth),
    });

    useEffect(() => {
        logger.info({
            context: "MonthlyReport.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
            summariesCount: fetchSummaries.summaries.length,
        });
    }, [facilityContext.facility,
        fetchSummaries.summaries]);

    const handleMonth: HandleMonth = (theMonth) => {
        logger.debug({
            context: "MonthlyReport.handleMonth",
            summariesMonth: theMonth,
        });
        setSummariesMonth(theMonth);
    }

    const reportedSections = (): Section[] => {
        if (activeSections) {
            return fetchSections.sections;
        } else {
            const results: Section[] = [];
            fetchSections.sections.forEach(section => {
                if (section.active) {
                    results.push(section);
                }
            });
            return results;
        }
    }

    return (
        <Container fluid id="MonthlyReport">

            {/* Title and Summaries Month Selector are always visible */}
            <Row className="mb-4 ml-1 mr-1">
                <Col className="text-left">
                    <span><strong>Monthly Report for Facility:&nbsp;</strong></span>
                    <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                </Col>
                <Col className="col-5 text-right">
                    <MonthSelector
                        autoFocus
                        handleMonth={handleMonth}
                        label="Monthly Report For Month:"
                        required
                        value={summariesMonth}
                    />
                </Col>
            </Row>

            <Tabs
                className="mb-3"
                mountOnEnter={true}
                transition={false}
                unmountOnExit={true}
            >

                {reportedSections().map((section, tabIndex) => (
                    <Tab
                        eventKey={section.id}
                        title={section.slug}
                    >
                        <MonthlyReportSection
                            active={activeCategories}
                            dateFrom={startDate(summariesMonth)}
                            dateTo={endDate(summariesMonth)}
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
