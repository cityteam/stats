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

    useEffect(() => {

        // Calculate the Categories we will be reporting over
        let theCategories: Category[] = [];
        if (props.section.categories) {
            if (props.active) {
                props.section.categories.forEach(category => {
                    if (category.active) {
                        theCategories.push(category);
                    }
                });
            } else {
                theCategories = props.section.categories;
            }
        }
        setCategories(theCategories);

        // Report our configuration information
        logger.info({
            context: "MonthlyReportSection.useEffect",
            active: props.active,
            dateFrom: props.dateFrom,
            dateTo: props.dateTo,
            section: Abridgers.SECTION(props.section),
            categories: Abridgers.CATEGORIES(theCategories)
        });

    }, [props.active, props.dateFrom, props.dateTo, props.section]);

    // Return a list of the individual dates we will be reporting on
    const reportedDates = (): string[] => {
        const results: string[] = [];
        for (let reportedDate = props.dateFrom; reportedDate <= props.dateTo; reportedDate = incrementDate(reportedDate, 1)) {
            results.push(reportedDate);
        }
        return results;
    }

    // Return a list of the totals to report for all categories
    const reportedTotals = (): number[] => {
        const totals: number[] = [];
        for (let i = 0; i < categories.length; i++) {
            totals.push(0);
        }
        props.summaries.forEach(summary => {
            if ((summary.sectionId === props.section.id)
                && (summary.date >= props.dateFrom)
                && (summary.date <= props.dateTo)) {
                for (let i = 0; i < categories.length; i++) {
                    const value = summary.values[categories[i].id];
                    if (value) {
                        totals[i] += Number(value);
                    }
                }
            }
        });
        return totals;
    }

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
                            <td className="text-center" key={3000 + (dateIndex * 100) + valueIndex + 1}>
                                {listValue(reportedValue)}
                            </td>
                        ))}
                    </tr>
                ))}
                <tr className="table-dark">
                    <td className="text-center" key={99000}>
                        TOTALS
                    </td>
                    {reportedTotals().map((reportedTotal, totalIndex) => (
                        <td className="text-center" key={99000 + totalIndex + 1}>
                            {reportedTotal}
                        </td>
                    ))}
                </tr>
                </tbody>
            </Table>

        </Container>
    )

}

export default MonthlyReportSection;
