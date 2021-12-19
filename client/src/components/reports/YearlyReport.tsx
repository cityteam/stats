// YearlyReport --------------------------------------------------------------

// Yearly report (with monthly totals).  Categories (subtitled by their Section)
// will be rows, and months of the selected year will be columns.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import YearlyReportSection from "./YearlyReportSection";
import FacilityContext from "../facilities/FacilityContext";
import CheckBox from "../general/CheckBox";
import MonthSelector from "../general/MonthSelector";
import {HandleBoolean, HandleMonth} from "../../types";
import useFetchSections from "../../hooks/useFetchSections";
import useFetchSummaries from "../../hooks/useFetchSummaries";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {decrementMonth, endDate, incrementMonth, startDate, todayMonth} from "../../util/Months";

// Component Details ---------------------------------------------------------

const YearlyReport = () => {

    // Calculate starting month of the desired fiscal year
    const START_MONTH = "09";       // September
    const yearStartMonth = (): string => {
        let month = todayMonth();
        while (month.substr(5, 2) !== START_MONTH) {
            month = decrementMonth(month, 1);
        }
        return month;
    }

    const facilityContext = useContext(FacilityContext);

    const [active, setActive] = useState<boolean>(true);
    const [dateFrom, setDateFrom] = useState<string>("2021-07-04");
    const [dateTo, setDateTo] = useState<string>("2021-07-04");
    const [labels, setLabels] = useState<string[]>([]); // Column headings
    const [month, setMonth] = useState<string>(yearStartMonth());
    const [months, setMonths] = useState<string[]>([]); // Month values

    const fetchSections = useFetchSections({
        active: active,
        withCategories: true,
    });
    const fetchSummaries = useFetchSummaries({
        active: active,
        dateFrom: dateFrom,
        dateTo: dateTo,
        monthlies: true,
    });

    useEffect(() => {

        setDateFrom(startDate(month));
        setDateTo(endDate(incrementMonth(month, 11)));

        logger.debug({
            context: "YearlyReport.useEffect",
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

    const handleMonth: HandleMonth = (theMonth) => {
        logger.debug({
            context: "MonthlyReport.handleMonth",
            summariesMonth: theMonth,
        });
        setMonth(theMonth);
    }

    return (
        <Container fluid id="YearlyReport">

            <Row className="mb-4 ml-1 mr-1">
                <Col className="text-left">
                    <span><strong>Yearly Report for Facility:&nbsp;</strong></span>
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
                    <MonthSelector
                        actionLabel="Go"
                        autoFocus
                        handleMonth={handleMonth}
                        label="Starting Month:"
                        required
                        value={month}
                    />
                </Col>
            </Row>

            {fetchSections.sections.map((section, sectionIndex) => (
                <Row className="mb-1 ml-1 mr-1"
                     //id={`YR-S${section.id}-Row`}
                     key={`YR-S${section.id}-Row`}
                >
                    <YearlyReportSection
                        active={active}
                        labels={labels}
                        months={months}
                        section={section}
                        summaries={fetchSummaries.summaries}
                    />
                </Row>
            ))}

        </Container>
    )

}

export default YearlyReport;
