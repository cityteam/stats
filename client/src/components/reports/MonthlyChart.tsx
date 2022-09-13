// MonthlyChart -------------------------------------------------------------

// Monthly line charts (for Categories).  There will be a separate tab for each
// defined Section, lines for each Category in that Section.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {CheckBox} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import MonthlyChartSection from "./MonthlyChartSection";
import FacilityContext from "../facilities/FacilityContext";
import FetchingProgress from "../general/FetchingProgress";
import MonthSelector from "../general/MonthSelector";
import {HandleBoolean, HandleMonth} from "../../types";
import useFetchSections from "../../hooks/useFetchSections";
import useFetchSummaries from "../../hooks/useFetchSummaries";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {endDate, startDate, todayMonth} from "../../util/Months";

// Component Details ---------------------------------------------------------

const MonthlyChart = () => {

    const facilityContext = useContext(FacilityContext);

    const [active, setActive] = useState<boolean>(true);
    const [dateFrom, setDateFrom] = useState<string>("2021-07-04");
    const [dateTo, setDateTo] = useState<string>("2021-07-04");
    const [month, setMonth] = useState<string>(todayMonth());

    const fetchSections = useFetchSections({
        active: active,
        alertPopup: false,
        withCategories: true,
    });
    const fetchSummaries = useFetchSummaries({
        active: active,
        alertPopup: false,
        dateFrom: dateFrom,
        dateTo: dateTo,
        monthlies: false,
    });

    useEffect(() => {

        setDateFrom(startDate(month));
        setDateTo(endDate(month));

        logger.debug({
            context: "MonthlyChart.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
            active: active,
            month: month,
        });

    }, [facilityContext.facility,
        active, month,
        fetchSections.sections, fetchSummaries.summaries]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleMonth: HandleMonth = (theMonth) => {
        logger.debug({
            context: "MonthlyGraph.handleMonth",
            summariesMonth: theMonth,
        });
        setMonth(theMonth);
    }

    return (
        <Container fluid id="MonthlyChart">

            <FetchingProgress
                error={fetchSections.error}
                loading={fetchSections.loading}
                message="Fetching selected Sections"
            />
            <FetchingProgress
                error={fetchSummaries.error}
                loading={fetchSummaries.loading}
                message="Fetching selected Summaries"
            />

            <Row className="mb-4 ms-1 me-1">
                <Col className="text-start">
                    <span><strong>Monthly Chart for Facility:&nbsp;</strong></span>
                    <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Sections/Categories Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col>
                    <MonthSelector
                        actionLabel="Go"
                        autoFocus
                        handleMonth={handleMonth}
                        label="Chart For Month:"
                        required
                        value={month}
                    />
                </Col>
                <Col className="text-end">
                    <span><strong>Report Date:&nbsp;</strong></span>
                    <span className="text-info">
                        <strong>{(new Date()).toLocaleString()}</strong>
                    </span>
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
                        //id={`MR-S${section.id}-Tab`}
                        key={`MR-S${section.id}-Tab`}
                        title={section.slug}
                    >
                        <MonthlyChartSection
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

export default MonthlyChart;
