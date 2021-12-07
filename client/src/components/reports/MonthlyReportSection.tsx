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

// Incoming Properties -------------------------------------------------------

export interface Props {
    active?: boolean;                   // Report active Categories only? [false]
    dateFrom: string;                   // Earliest date to report
    dateTo: string;                     // Latest date to report
    section: Section;                   // Section (with nested Categories) to report
    summaries: Summary[];               // Consolidated summaries to draw data from
}

// Component Details ---------------------------------------------------------

type Row = {
    date: string;
    values: (number | null)[];          // One per Category
}

const MonthlyReportSection = (props: Props) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [rows, setRows] = useState<Row[]>([]);
    const [totals, setTotals] = useState<(number)[]>([]);

    useEffect(() => {

        logger.info({
            context: "MonthlyReportSection.useEffect",
            active: props.active,
            dateFrom: props.dateFrom,
            dateTo: props.dateTo,
            section: Abridgers.SECTION(props.section),
        });

        const calculateColIndex = (categoryId: number, categories: Category[]): number => {
            let theIndex = -1;
            categories.forEach((category, index) => {
                if (category.id === categoryId) {
                    theIndex = index;
                }
            });
            return theIndex;
        }

        const calculateRowIndex = (date: string, rows: Row[]): number => {
            let theIndex = -1;
            rows.forEach((row, index) => {
                if (row.date === date) {
                    theIndex = index;
                }
            });
            return theIndex;
        }

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

        // Prepare all Rows for population of detailed values
        const theRows: Row[] = [];
        for (let theDate = props.dateFrom; theDate <= props.dateTo; theDate = incrementDate(theDate, 1)) {
            const theRow: Row = {
                date: theDate,
                values: [],
            }
            theCategories.forEach(category => {
                theRow.values.push(null);
            });
            theRows.push(theRow);
        }
        const theTotals: (number)[] = [];
        theCategories.forEach(category => {
            theTotals.push(0);
        })

        // Fill in the detailed values from the specified Summaries
        props.summaries.forEach(summary => {
            if (summary.sectionId === props.section.id) {
                const rowIndex = calculateRowIndex(summary.date, theRows);
                if (rowIndex >= 0) {
                    for (const [key, value] of Object.entries(summary.values)) {
                        const colIndex = calculateColIndex(Number(key), theCategories);
                        if (colIndex >= 0) {
                            theRows[rowIndex].values[colIndex] = value;
                            if (value) {
                                theTotals[colIndex] += value;
                            }
                        }
                    }
                }
            }
        });

        // Save the computed information for rendering
        setRows(theRows);
        setTotals(theTotals);

    }, [props.active, props.dateFrom, props.dateTo,
        props.section, props.summaries]);

    return (
        <Container
            id={`MRS-S${props.section.id}-Container`}
            key={`MRS-S${props.section.id}-Container`}
        >
            <Table
                bordered={true}
                id={`MRS-S${props.section.id}-Table`}
                key={`MRS-S${props.section.id}-Table`}
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
                    <th className="text-center">Date</th>
                    {categories.map((category, ci) => (
                        <th
                            className="text-center"
                            id={`MRS-S${props.section.id}-C${ci}-th`}
                            key={`MRS-S${props.section.id}-C${ci}-th`}
                        >
                            {category.slug}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {rows.map((row, ri) => (
                    <tr className="table-default"
                        id={`MRS-S${props.section.id}-R${ri}-tr`}
                        key={`MRS-S${props.section.id}-R${ri}-tr`}
                    >
                        <td className="text-center"
                            id={`MRS-S${props.section.id}-R${ri}-td-date`}
                            key={`MRS-S${props.section.id}-R${ri}-td-date`}
                        >{row.date}</td>
                        {row.values.map((value, ci) => (
                            <td className="text-center"
                                id={`MRS-S${props.section.id}-R${ri}-C${ci}-td`}
                                key={`MRS-S${props.section.id}-R${ri}-C${ci}-td`}
                            >{value}</td>
                        ))}
                    </tr>
                ))}
                <tr className="table-dark">
                    <td className="text-center"
                        id={`MRS-S${props.section.id}-td-tot`}
                        key={`MRS-S${props.section.id}-td-tot`}
                    >TOTALS</td>
                    {totals.map((total, ci) => (
                        <td className="text-center"
                            id={`MRS-S${props.section.id}-C${ci}-td-tot`}
                            key={`MRS-S${props.section.id}-C${ci}-td-tot`}
                        >{total}</td>
                    ))}
                </tr>
                </tbody>
            </Table>

        </Container>
    )

}

export default MonthlyReportSection;
