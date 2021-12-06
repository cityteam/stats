// YearlyReportSection -------------------------------------------------------

// Yearly report for a specific Section.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import Category from "../../models/Category";
import Section from "../../models/Section";
import Summary from "../../models/Summary";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    active?: boolean;                   // Active categories only? [false]
    labels: string[];                   // Column labels for each month
    months: string[];                   // Months being reported
    section: Section;                   // Section (with nested Categories) to report
    summaries: Summary[];               // Summaries containing raw data
}

// Component Details ---------------------------------------------------------

type Row = {
    id: number;
    slug: string;
    total: number;
    values: number[];                   // One per month
}

const YearlyReportSection = (props: Props) => {

    const [rows, setRows] = useState<Row[]>([]);

    useEffect(() => {

        logger.info({
            context: "YearlyReportSection.useEffect",
            active: props.active,
            section: Abridgers.SECTION(props.section),
        });

        const calculateColIndex = (theMonth: string): number => {
            let theIndex: number = -1;
            props.months.forEach((month, index) => {
                if (theMonth === month) {
                    theIndex = index;
                }
            });
            return theIndex;
        }

        const calculateRowIndex = (categoryId: number, theRows: Row[]): number => {
            let theIndex: number = -1;
            theRows.forEach((row, index) => {
                if (categoryId === row.id) {
                    theIndex = index;
                }
            })
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

        // Prepare all Rows for population of detailed values
        const theRows: Row[] = [];
        theCategories.forEach(category => {
            const theRow: Row = {
                id: category.id,
                slug: category.slug ? category.slug : "Category " + category.id,
                total: 0,
                values: [],
            }
            props.months.forEach((month, monthIndex) => {
                theRow.values.push(0);
            });
            theRows.push(theRow);
        });

        // Fill in the detailed values from the specified Summaries
        props.summaries.forEach(summary => {
            if (summary.sectionId === props.section.id) {
                const colIndex = calculateColIndex(summary.date.substr(0, 7));
                if (colIndex >= 0) {
                    for (const [key, value] of Object.entries(summary.values)) {
                        if (value) {
                            const rowIndex = calculateRowIndex(Number(key), theRows);
                            if (rowIndex >= 0) {
                                theRows[rowIndex].values[colIndex] = value;
                                theRows[rowIndex].total += value;
                            }
                        }
                    }
                }
            }
        });

        // Save the computed information for rendering
        setRows(theRows);

    }, [props.active, props.labels, props.months, props.section, props.summaries]);

    return (
        <Table
            bordered={true}
            size="sm"
            striped={true}
        >

            <thead>
            <tr className="table-dark">
                <th className="text-center" colSpan={props.labels.length + 2}>
                    {props.section.slug}
                </th>
            </tr>
            <tr className="table-secondary">
                <th className="text-center">Category</th>
                {props.labels.map((label, labelIndex) => (
                    <th className="text-center" key={1000 + labelIndex}>{label}</th>
                ))}
                <th className="text-center">Totals</th>
            </tr>
            </thead>

            <tbody>
            {rows.map((row, rowIndex) => (
                <tr>
                    <td key={"S" + props.section.id + "-C" + row.id + "-S"}>
                        {row.slug}
                    </td>
                    {row.values.map((value, colIndex) => (
                        <td
                            className="text-center"
                            key={"S" + props.section.id + "-C" + row.id + "-V" + colIndex}
                        >
                            {value}
                        </td>
                    ))}
                    <td
                        className="text-center"
                        key={"S" + props.section.id + "-C" + row.id + "-T"}
                    >
                        {row.total}
                    </td>
                </tr>
            ))}
            </tbody>

        </Table>
    )

}

export default YearlyReportSection;
