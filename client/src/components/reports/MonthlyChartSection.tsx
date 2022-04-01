// MonthlyChartSection ------------------------------------------------------

// Monthly chart for a specific Section.

// External Modules ----------------------------------------------------------

import React, {CSSProperties, useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import FacilityContext from "../facilities/FacilityContext";
import EChart, {EChartsOption} from "../general/EChart";
import Category from "../../models/Category";
import Section from "../../models/Section";
import Summary from "../../models/Summary";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {incrementDate} from "../../util/Dates";

// Incoming Properties -------------------------------------------------------

export interface Props {
    active?: boolean;                   // Report active Categories only? [false]
    dateFrom: string;                   // Earliest date to report
    dateTo: string;                     // Latest date to report
    section: Section;                   // Section (with nested Categories) to report
    summaries: Summary[];               // Consolidated summaries to draw data from
}

// Component Details ---------------------------------------------------------

const MonthlyChartSection = (props: Props) => {

    const facilityContext = useContext(FacilityContext);

    const [option, setOption] = useState<EChartsOption>({});

    useEffect(() => {

        logger.debug({
            context: "MonthlyChartSection.useEffect",
            active: props.active,
            dateFrom: props.dateFrom,
            dateTo: props.dateTo,
            section: Abridgers.SECTION(props.section),
        });

        // Calculate the Categories we will be reporting
        const theCategories: Category[] = [];
        if (props.section.categories) {
            props.section.categories.forEach(category => {
                if (props.active && category.active) {
                    theCategories.push(category);
                } else if (!props.active) {
                    theCategories.push(category);
                }
            });
        }
        const theCategoryNames: string[] = [];
        theCategories.forEach(category => {
            theCategoryNames.push(category.slug);
        });

        // Calculate the set of dates we will be reporting
        const theDates: string[] = [];
        for (let theDate = props.dateFrom; theDate <= props.dateTo; theDate = incrementDate(theDate, 1)) {
            theDates.push(theDate);
        }

        // Prepare the data two-dimensional array.  First dimension is for
        // each reported Category, and second dimension is for each reported
        // date for that Category
        const allResults: (number | string)[][] = [[]];
        theCategories.forEach((category, ci) => {
            const categoryResults: number | string[] = [];
            for (let dateIndex = 0; dateIndex < theDates.length; dateIndex++) {
                categoryResults.push("'-'"); // ECharts empty data marker
            }
            allResults.push(categoryResults);
        });

        // Scan the provided summaries, and update the results arrays for
        // data that is actually present (i.e. not null)
        props.summaries.forEach(summary => {
            const dateIndex = calculateDateIndex(summary.date, theDates);
            if ((dateIndex >= 0) && (summary.sectionId === props.section.id)) {
                for (const [key, value] of Object.entries(summary.values)) {
                    const categoryIndex = calculateCategoryIndex(Number(key), theCategories);
                    if (categoryIndex >= 0) {
                        if (value) {
                            allResults[categoryIndex][dateIndex] = value;
                        }
                    }
                }
            }
        })

        // Assemble the array of series information we will be presenting
        const theSeries: object[] = [];
        theCategoryNames.forEach((categoryName, categoryIndex) => {
            theSeries.push({
                data: allResults[categoryIndex],
                name: categoryName,
                smooth: true,
                //stack: "byDate",
                type: "line",
            });
        });

        // Configure and save the Apache ECharts option for rendering this chart
        const title = `${props.section.slug} for ${facilityContext.facility.name} (${props.dateFrom} - ${props.dateTo})`;
        const theOption: EChartsOption = {
            legend: {
                data: theCategoryNames,
            },
            series: theSeries,
            title: {
                text: title,
            },
            toolbox: {
                feature: {
                    saveAsImage: {
                        name: title,
                    },
                },
            },
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                alignTicks: true,
                axisLabel: {
                    rotate: 90,
                },
                data: theDates,
            },
            yAxis: {},
        }
        logger.debug({
            context: "MonthlyChartSection.option",
            option: theOption,
        })
        setOption(theOption);

    }, [facilityContext.facility, props.active, props.dateFrom, props.dateTo,
        props.section, props.summaries]);

    /**
     * Calculate the index of which series element the specified Category will be
     * reported in.  Returns -1 if the specified category is not reported.
     */
    const calculateCategoryIndex = (categoryId: number, inCategories: Category[]): number => {
        let theIndex = -1;
        inCategories.forEach((category, index) => {
            if (category.id === categoryId) {
                theIndex = index;
            }
        });
        return theIndex;
    }

    /**
     * Calculate the index of which data value the specified date will be
     * reported in.  Returns -1 if the specified date is not reported.
     */
    const calculateDateIndex = (date: string, inDates: string[]): number => {
        let theIndex = -1;
        inDates.forEach((inDate, index) => {
            if (date === inDate) {
                theIndex = index;
            }
        });
        return theIndex;
    }

    const style: CSSProperties = {
        height: "700px",
    };

    return (
        <Container
            fluid
            id={`MGS-S${props.section.id}-Container`}
            key={`MGS-S${props.section.id}-Container`}
        >
            <Row className="ms-1 me-1 mb-3">
                <EChart
                    option={option}
                    style={style}
                    theme="light"
                />
            </Row>
        </Container>
    )

}

export default MonthlyChartSection;
