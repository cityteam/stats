// SectionEntries ------------------------------------------------------------

// Encapsulates display and input fields for the Categories associated with
// a specified Section.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import Category from "../../models/Category";
import Section from "../../models/Section";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    narrow: boolean;                    // Show narrow presentation? [false]
    section: Section;                   // Section (with nested Categories)
}

// Component Details ---------------------------------------------------------

const SectionEntries = (props: Props) => {

    const [categories] = useState<Category[]>
        (props.section.categories ? props.section.categories : []);

    useEffect(() => {
        logger.debug({
            context: "SectionEntries.useEffect",
            narrow: props.narrow,
            section: Abridgers.SECTION(props.section),
        })
    }, [props.narrow, props.section]);

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
                <tr className="table-dark">
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
                    key={1000 + (rowIndex * 100)}
                >
                    {(props.narrow) ? (
                        <td key={1000 + (rowIndex * 100) + 1}>
                            {category.slug}
                        </td>
                    ) : (
                        <>
                        <td key={1000 + (rowIndex * 100) + 11}>
                            {category.service}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 12}>
                            {category.description}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 13}>
                            {category.notes}
                        </td>
                        </>
                    )}
                    <td key={1000 + (rowIndex * 100) + 99}>
                        <input type="text"/> {/* TODO - need to point somewhere! */}
                    </td>
                </tr>
            ))}
            </tbody>

        </Table>

    )

}

export default SectionEntries;
