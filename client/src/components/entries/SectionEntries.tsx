// SectionEntries ------------------------------------------------------------

// Encapsulates display and input fields for the Categories associated with
// a specified Section.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import useFetchSummary from "../../hooks/useFetchSummary";
import Category from "../../models/Category";
import Section from "../../models/Section";
//import Summary from "../../models/Summary";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    date: string;                       // Date for entries
    narrow: boolean;                    // Show narrow presentation? [false]
    section: Section;                   // Section (with nested Categories)
}

// Component Details ---------------------------------------------------------

const SectionEntries = (props: Props) => {

    const [categories, setCategories] = useState<Category[]>([]);

    const fetchSummary = useFetchSummary({
        date: props.date,
        section: props.section,
    });

    useEffect(() => {
        logger.info({
            context: "SectionEntries.useEffect",
            narrow: props.narrow,
            section: Abridgers.SECTION(props.section),
            summary: fetchSummary.summary,
        });
        const theCategories: Category[] = [];
        if (props.section.categories) {
            props.section.categories.forEach(category => {
                if (category.active) {
                    theCategories.push(category);
                }
            });
        }
        setCategories(theCategories);
    }, [props.date, props.narrow, props.section,
        fetchSummary.summary]);

    // @ts-ignore
    return (
        <Table
            bordered={true}
            hover={true}
            size="sm"
            striped={true}
        >

            <thead>
            {(props.narrow) ? (
                <>
                <tr className="table-warning">
                    <th className="text-center" colSpan={2}>
                        {props.section.slug}
                    </th>
                </tr>
                <tr>
                    <th>Statistic</th>
                    <th>Value</th>
                </tr>
                </>
            ) : (
                <>
                <tr className="table-dark">
                    <th className="text-center" colSpan={4}>
                        {props.section.title}
                    </th>
                </tr>
                <tr>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Notes</th>
                    <th>Value</th>
                </tr>
                </>
            )}
            </thead>

            <tbody>
            {categories.map((category, rowIndex) => (
                <tr
                    className="table-default"
                    key={(1000 + props.section.ordinal) + (rowIndex * 100)}
                >
                    {(props.narrow) ? (
                        <td key={(1000 + props.section.ordinal) + (rowIndex * 100) + 1}>
                            {category.slug}
                        </td>
                    ) : (
                        <>
                        <td key={(1000 + props.section.ordinal) + (rowIndex * 100) + 11}>
                            {category.service}
                        </td>
                        <td key={(1000 + props.section.ordinal) + (rowIndex * 100) + 12}>
                            {category.description}
                        </td>
                        <td key={(1000 + props.section.ordinal) + (rowIndex * 100) + 13}>
                            {category.notes}
                        </td>
                        </>
                    )}
                    <td key={(1000 + props.section.ordinal) + (rowIndex * 100) + 99}>
                        <input
                            inputMode="numeric"
                            pattern="[0-9]*"
                            type="number"/>
                            {/* TODO - need to point somewhere! */}
                    </td>
                </tr>
            ))}
            </tbody>

        </Table>

    )

}

export default SectionEntries;
