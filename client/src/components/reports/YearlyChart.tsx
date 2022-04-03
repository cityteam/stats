// YearlyChart ---------------------------------------------------------------

// Yearly chart (with monthly totals).  Each Section will have its own tab,
// with a chart containing the Category totals for each month.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

// Internal Modules ----------------------------------------------------------

import YearlyChartSection from "./YearlyChartSection";
import FacilityContext from "../facilities/FacilityContext";
import CheckBox from "../general/CheckBox";
import FetchingProgress from "../general/FetchingProgress";
import MonthSelector from "../general/MonthSelector";
import {HandleBoolean, HandleMonth} from "../../types";
import useFetchSections from "../../hooks/useFetchSections";
import useFetchSummaries from "../../hooks/useFetchSummaries";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {decrementMonth, endDate, incrementMonth, startDate, todayMonth} from "../../util/Months";

// Component Details ---------------------------------------------------------

const YearlyChart = () => {

    // Calculate starting month of the desired fiscal year
    const START_MONTH = "09";       // September
    const yearStartMonth = (): string => {
        let theMonth = todayMonth();
        while (theMonth.substr(5, 2) !== START_MONTH) {
            theMonth = decrementMonth(theMonth, 1);
        }
        return theMonth;
    }

    const facilityContext = useContext(FacilityContext);

    const [active, setActive] = useState<boolean>(true);
    const [bar, setBar] = useState<boolean>(true);
    const [dateFrom, setDateFrom] = useState<string>("2021-07-04");
    const [dateTo, setDateTo] = useState<string>("2021-07-04");
    const [labels, setLabels] = useState<string[]>([]); // Column headings
    const [month, setMonth] = useState<string>(yearStartMonth());
    const [months, setMonths] = useState<string[]>([]); // Month values

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
        monthlies: true,
    });

    useEffect(() => {

        setDateFrom(startDate(month));
        setDateTo(endDate(incrementMonth(month, 11)));

        logger.debug({
            context: "YearlyChart.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
            active: active,
            month: month,
        });

        const theLabels: string[] = [];
        const theMonths: string[] = [];
        let theMonth = month;
        for (let i = 0; i < 12; i++) {
            theLabels.push(theMonth);
            theMonths.push(theMonth);
            theMonth = incrementMonth(theMonth, 1);
        }
        setLabels(theLabels);
        setMonths(theMonths);

    }, [facilityContext.facility,
        active, month,
        fetchSections.sections, fetchSummaries.summaries]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleBar: HandleBoolean = (theBar) => {
        setBar(theBar);
    }

    const handleMonth: HandleMonth = (theMonth) => {
        logger.debug({
            context: "MonthlyReport.handleMonth",
            summariesMonth: theMonth,
        });
        setMonth(theMonth);
    }

    return (
        <Container fluid id="YearlyChart">

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
                    <span><strong>Yearly Chart for Facility:&nbsp;</strong></span>
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
                        label="Starting Month:"
                        required
                        value={month}
                    />
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleBar}
                        label="Bar Chart?"
                        name="barChart"
                        value={bar}
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
                        //id={`YR-S${section.id}-Tab`}
                        key={`YR-S${section.id}-Tab`}
                        title={section.slug}
                    >
                        <YearlyChartSection
                            active={active}
                            bar={bar}
                            labels={labels}
                            months={months}
                            section={section}
                            summaries={fetchSummaries.summaries}
                        />
                    </Tab>
                ))}

            </Tabs>

        </Container>
    )

}

export default YearlyChart;
