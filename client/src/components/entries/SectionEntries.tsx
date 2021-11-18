// SectionEntries ------------------------------------------------------------

// Encapsulates display and input fields for the Categories associated with
// a specified Section.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import {Formik,FormikValues} from "formik";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import useFetchSummary from "../../hooks/useFetchSummary";
import useMutateSummary from "../../hooks/useMutateSummary";
import Category from "../../models/Category";
import Section from "../../models/Section";
import Summary from "../../models/Summary";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    date: string;                       // Date for entries
    narrow: boolean;                    // Show narrow presentation? [false]
    section: Section;                   // Section (with nested Categories)
}

// Component Details ---------------------------------------------------------

const PREFIX = "value_";
type VALUES = {
    [name: string]: number | null;
}

const SectionEntries = (props: Props) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [initialValues, setInitialValues] = useState<VALUES>({});

    const fetchSummary = useFetchSummary({
        date: props.date,
        section: props.section,
    });
    const mutateSummary = useMutateSummary({});

    useEffect(() => {
        const theCategories: Category[] = [];
        const theInitialValues: VALUES = {};
        if (props.section.categories) {
            props.section.categories.forEach(category => {
                if (category.active) {
                    theCategories.push(category);
                    theInitialValues[calculateName(category)] = getValue(fetchSummary.summary, category);
                }
            });
        }
        logger.info({
            context: "SectionEntries.useEffect",
            narrow: props.narrow,
            section: Abridgers.SECTION(props.section),
            summary: fetchSummary.summary,
            categories: Abridgers.CATEGORIES(theCategories),
            initialValues: theInitialValues,
        });
        setCategories(theCategories);
        setInitialValues(theInitialValues);
    }, [props.date, props.narrow, props.section,
        fetchSummary.summary]);

    // Calculate the field name for the value associated with this Category
    const calculateName = (category: Category): string => {
        return PREFIX + category.id;
    }

    // Return the value (if present) for this Category from this Summary
    const getValue = (summary: Summary, category: Category): number | null => {
        if (summary.values[category.id]) {
            return summary.values[category.id];
        } else {
            return null;
        }
    }

    // Submit an updated Summary to the server
    const handleSubmit = async (values: FormikValues): Promise<void> => {
        const summary = new Summary({
            date: props.date,
            sectionId: props.section.id,
            values: {}
        });
        categories.forEach(category => {
            summary.values[category.id] = values[calculateName(category)];
        });
        logger.info({
            context: "SectionEntries.handleSubmit",
            summary: summary,
        });
        await mutateSummary.write(summary);
    }

    // @ts-ignore
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >

            {( {
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                isValid,
                touched,
                values
            }) => (

                <form
                    id={`Section_${props.section.id}_Form`}
                    onSubmit={handleSubmit}
                >

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
                            <label htmlFor={calculateName(category)}>{category.slug}</label>
                        </td>
                    ) : (
                        <>
                        <td key={(1000 + props.section.ordinal) + (rowIndex * 100) + 11}>
                            <label htmlFor={calculateName(category)}>{category.service}</label>
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
                            id={calculateName(category)}
                            inputMode="numeric"
                            name={calculateName(category)}
                            pattern="[0-9]*"
                            type="number"
                            // value={values[${calculateName(category)]} TODO!!!
                        />
                    </td>
                </tr>
            ))}
            </tbody>

        </Table>

        </form>

        )}

        </Formik>
    )

}

export default SectionEntries;
