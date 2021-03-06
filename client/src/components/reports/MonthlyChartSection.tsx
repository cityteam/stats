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
        const allResults: (number | null)[][] = [[]];
        theCategories.forEach((category, ci) => {
            const categoryResults: number | null[] = [];
            for (let di = 0; di < theDates.length; di++) {
                categoryResults.push(null); // Default to no data
            }
            allResults.push(categoryResults);
        });

        // Scan the provided summaries, and update the results arrays for
        // data that is actually present (i.e. not null)
        props.summaries.forEach(summary => {
            const di = dateIndex(summary.date, theDates);
            if ((di >= 0) && (summary.sectionId === props.section.id)) {
                for (const [key, value] of Object.entries(summary.values)) {
                    const ci = categoryIndex(Number(key), theCategories);
                    if (ci >= 0) {
                        if (value) {
                            allResults[ci][di] = value;
                        }
                    }
                }
            }
        });

        // Assemble the array of series information we will be presenting
        const theSeries: object[] = [];
        theCategoryNames.forEach((categoryName, ci) => {
            theSeries.push({
                data: allResults[ci],
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
    const categoryIndex = (categoryId: number, inCategories: Category[]): number => {
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
    const dateIndex = (date: string, inDates: string[]): number => {
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
            id={`MCS-S${props.section.id}-Container`}
            key={`MCS-S${props.section.id}-Container`}
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
