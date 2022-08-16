// ExportView ----------------------------------------------------------------

// Support export of database data in CSV format files.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {CSVLink} from "react-csv";

// Internal Modules ----------------------------------------------------------

import FacilityContext from "../facilities/FacilityContext";
import FetchingProgress from "../general/FetchingProgress";
import MonthSelector from "../general/MonthSelector";
import useFetchSections from "../../hooks/useFetchSections";
import useFetchSummaries from "../../hooks/useFetchSummaries";
import Category from "../../models/Category";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {decrementMonth, endDate, incrementMonth, startDate, todayMonth} from "../../util/Months";
import {HandleMonth} from "../../types";

// Component Details ---------------------------------------------------------

// Individual entry for exporting details
class Detail {

    constructor(data: any = {}) {
        this.categoryId = data.categoryId ? data.categoryId : -1;
        this.date = data.date ? data.date : "";
        this.sectionId = data.sectionId ? data.sectionId : -1;
        this.value = data.value ? data.value : 0;
    }

    categoryId: number;
    date: string;
    sectionId: number;
    value: number;

}

const ExportView = () => {

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

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesFilename, setCategoriesFilename] = useState<string>("");
    const [dateFrom, setDateFrom] = useState<string>("2021-07-04");
    const [dateTo, setDateTo] = useState<string>("2021-07-04");
    const [details, setDetails] = useState<Detail[]>([]);
    const [detailsFilename, setDetailsFilename] = useState<string>("");
    const [month, setMonth] = useState<string>(yearStartMonth());
//    const [sectionIds, setSectionIds] = useState<number[]>([]);
    const [sectionsFilename, setSectionsFilename] = useState<string>("");

    const fetchSections = useFetchSections({
        alertPopup: false,
        withCategories: true,
    });
    const fetchSummaries = useFetchSummaries({
        alertPopup: false,
        dateFrom: dateFrom,
        dateTo: dateTo,
        monthlies: false,
//        sectionIds: sectionIds,
    });

    const CATEGORY_HEADERS = [
        "id",
        "active",
        "notes",
        "ordinal",
        "sectionId",
        "slug",
    ];
    const DETAIL_HEADERS = [
        "sectionId",
        "categoryId",
        "date",
        "value",
    ];
    const SECTION_HEADERS = [
        "id",
        "active",
        "facilityId",
        "notes",
        "ordinal",
        "scope",
        "slug",
    ];

    useEffect(() => {

        // Calculate the date range of desired Summaries
        const theDateFrom = startDate(month);
        const theDateTo = endDate(incrementMonth(month, 11));
        setDateFrom(theDateFrom);
        setDateTo(theDateTo);

        logger.info({
            context: "ExportView.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
            month: month,
            dateFrom: theDateFrom,
            dateTo: theDateTo,
        });

        // Calculate the default filenames for each export
        setCategoriesFilename(`${facilityContext.facility.scope}_stats_categories.csv`);
        setDetailsFilename(`${facilityContext.facility.scope}_stats_details_${theDateFrom}_${theDateTo}.csv`);
        setSectionsFilename(`${facilityContext.facility.scope}_stats_sections.csv`);

        // Extract the Categories to be exported
        const theCategories: Category[] = [];
        fetchSections.sections.forEach(section => {
            if (section.categories) {
                section.categories.forEach(category => {
                    theCategories.push(category);
                });
            }
        });
        setCategories(theCategories);

        // Extract the Details to be exported
        const theDetails: Detail[] = [];
        fetchSummaries.summaries.forEach(summary => {
            for (const [key, value] of Object.entries(summary.values)) {
                if (value) {
                    theDetails.push(new Detail({
                        categoryId: Number(key),
                        date: summary.date,
                        sectionId: summary.sectionId,
                        value: value,
                    }));
                }
            }
        });
        setDetails(theDetails);

    }, [facilityContext.facility,
        dateFrom, dateTo, month,
        fetchSections.sections, fetchSummaries.summaries]);

    const handleMonth: HandleMonth = (theMonth) => {
        logger.debug({
            context: "ExportView.handleMonth",
            summariesMonth: theMonth,
        });
        setMonth(theMonth);
    }

    return (
        <Container fluid id="ExportView">

            <FetchingProgress
                error={fetchSections.error}
                loading={fetchSections.loading}
                message="Fetcing selected Sections"
            />
            <FetchingProgress
                error={fetchSummaries.error}
                loading={fetchSummaries.loading}
                message="Fetching selected Summaries"
            />

            <Row className="mb-3 ms-1 me-1">
                <Col className="text-center">
                    <span><strong>Export CSV Data for Facility:&nbsp;</strong></span>
                    <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                </Col>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <hr/>
            </Row>

            <Row className="mb-4 ms-1 me-1">
                <Col className="text-center">
                    <CSVLink
                        className="btn btn-primary"
                        data={fetchSections.sections}
                        filename={sectionsFilename}
                        headers={SECTION_HEADERS}
                    >
                        Export Sections
                    </CSVLink>
                </Col>
                <Col className="text-center">
                    <CSVLink
                        className="btn btn-primary"
                        data={categories}
                        filename={categoriesFilename}
                        headers={CATEGORY_HEADERS}
                    >
                        Export Categories
                    </CSVLink>
                </Col>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <hr/>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <Col className="text-center">
                    <MonthSelector
                        autoFocus
                        handleMonth={handleMonth}
                        label="Starting Month:"
                        required
                        value={month}
                    />
                </Col>
                <Col className="text-center">
                    <CSVLink
                        className="btn btn-primary"
                        data={details}
                        filename={detailsFilename}
                        headers={DETAIL_HEADERS}
                    >
                        Export Details
                    </CSVLink>
                </Col>
            </Row>

        </Container>
    )

}

export default ExportView;
