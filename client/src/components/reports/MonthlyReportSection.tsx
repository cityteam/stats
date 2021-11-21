// MonthlyReportSection ------------------------------------------------------

// Monthly report for a specific Section.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import Category from "../../models/Category";
import Section from "../../models/Section";
import Summary from "../../models/Summary";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {incrementDate} from "../../util/Dates";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    active?: boolean;                   // Report active Categories only? [false]
    dateFrom: string;                   // Earliest date to report
    dateTo: string;                     // Latest date to report
    section: Section;                   // Section (with nested Categories) to report
    summaries: Summary[];               // Consolidated summaries to draw data from
}

// Component Details ---------------------------------------------------------

const MonthlyReportSection = (props: Props) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [totals, setTotals] = useState<number[]>([]);

    useEffect(() => {

        // Calculate the Categories we will be reporting over
        let theCategories: Category[] = [];
        if ((props.active !== undefined) ? props.active : false) {
            theCategories = props.section.categories ? props.section.categories : [];
        } else if (props.section.categories) {
            props.section.categories.forEach(category => {
                if (category.active) {
                    theCategories.push(category);
                }
            });
        }
        setCategories(theCategories);

        // Initialize the totals accumulators we will need
        const theTotals: number[] = [];
        for(let i = 0; i < theCategories.length; i++) {
            theTotals.push(0);
        }
        setTotals(theTotals);

        logger.info({
            context: "MonthlyReportSection.useEffect",
            active: props.active,
            dateFrom: props.dateFrom,
            dateTo: props.dateTo,
            section: Abridgers.SECTION(props.section),
            categories: Abridgers.CATEGORIES(theCategories)
        });

    }, [props.active, props.dateFrom, props.dateTo, props.section]);

    // Return a list of the values to report for a specified date
    const reportedValues = (reportedDate: string): (number | null)[] => {
        const results: (number | null)[] = [];
        let foundSummary = new Summary();
        props.summaries.forEach(summary => {
            if ((summary.sectionId === props.section.id) && (summary.date === reportedDate)) {
                foundSummary = summary;
            };
        });
        if ((foundSummary.sectionId === props.section.id) && (foundSummary.date === reportedDate)) {
            for (let i = 0; i < categories.length; i++) {
                if (foundSummary.values[categories[i].id]) {
                    const value: number | null = foundSummary.values[categories[i].id];
                    results.push(value);
                    if (value) {
                        totals[i] += value;
                    }
                } else if (foundSummary.values[categories[i].id] === 0) {
                    results.push(0);
                } else {
                    results.push(null);
                }
            }
            return results;
        } else {
            for (let i = 0; i < categories.length; i++) {
                results.push(null);
            }
            return results;
        }
    }

    // Return a list of the individual dates we will be reporting on
    const reportedDates = (): string[] => {
        const results: string[] = [];
        for (let reportedDate = props.dateFrom; reportedDate <= props.dateTo; reportedDate = incrementDate(reportedDate, 1)) {
            results.push(reportedDate);
        }
        return results;
    }

    return (
        <Container id={"MonthlyReportSection" + props.section.id}>

            <Table
                bordered={true}
                size="sm"
                striped={true}
            >

                <thead>
                <tr className="table-dark">
                    <th
                        className="text-center"
                        colSpan={categories.length + 1}
                    >
                        {props.section.slug}
                    </th>
                </tr>
                <tr className="table-secondary">
                    <th className="text-center" scope="col">Date</th>
                    {categories.map((category, categoryIndex) => (
                        <th className="text-center" key={1000 + categoryIndex} scope="col">
                            {category.slug}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {reportedDates().map((reportedDate, dateIndex) => (
                    <tr className="table-default" key={2000 + dateIndex}>
                        <td className="text-center" key={3000 + (dateIndex * 100) + 0}>
                            {reportedDate}
                        </td>
                        {reportedValues(reportedDate).map((reportedValue, valueIndex) => (
                            <td key={3000 + (dateIndex * 100) + valueIndex + 1}>
                                {listValue(reportedValue)}
                            </td>
                        ))}
                    </tr>
                ))}
                <tr className="table-dark">
                    <td className="text-center" key={99000}>
                        TOTALS
                    </td>
                    {totals.map((total, totalIndex) => (
                        <td className="text-center" key={99000 + totalIndex + 1}>
                            {totals[totalIndex]}
                        </td>
                    ))}
                </tr>
                </tbody>
            </Table>

        </Container>
    )

}

export default MonthlyReportSection;
