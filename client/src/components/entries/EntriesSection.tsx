// EntriesSection ------------------------------------------------------------

// Encapsulates display and input fields for the Categories associated with
// a specified Section.

// External Modules ----------------------------------------------------------

import {Formik,Form,FormikValues} from "formik";
import React, {ChangeEvent, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {store as notifications} from "react-notifications-component";

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
    active?: boolean;                   // Report active Categories only? [false]
    date: string;                       // Date for entries
    section: Section;                   // Section (with nested Categories)
}

// Component Details ---------------------------------------------------------

const PREFIX = "value_";
type VALUES = {
    [name: string]: string;
}

const EntriesSection = (props: Props) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [saveDisabled, setSaveDisabled] = useState<boolean>(true);
    const [initialValues, setInitialValues] = useState<VALUES>({});

    const fetchSummary = useFetchSummary({
        date: props.date,
        section: props.section,
    });
    const mutateSummary = useMutateSummary({
        alertPopup: false,
    });

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

        // Calculate the initial values to be displayed
        const theInitialValues: VALUES = {};
        theCategories.forEach(category => {
            theInitialValues[calculateName(category)] = getValue(fetchSummary.summary, category);
        });
        setInitialValues(theInitialValues);

        // Report our configuration information
        logger.info({
            context: "EntriesSection.useEffect",
            active: props.active,
            date: props.date,
            section: Abridgers.SECTION(props.section),
            categories: Abridgers.CATEGORIES(theCategories),
            summary: fetchSummary.summary,
            initialValues: theInitialValues,
        });

    }, [props.active, props.date, props.section,
        fetchSummary.summary]);

    // Calculate the field name for the value associated with this Category
    const calculateName = (category: Category): string => {
        return PREFIX + category.id;
    }

    // Return the value (if present) for this Category from this Summary
    const getValue = (summary: Summary, category: Category): string => {
        const value = summary.values[category.id];
        if (value === 0) {
            return "0";
        } else if (value) {
            return "" + summary.values[category.id];
        } else {
            return "";
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
            const value: string = values[calculateName(category)];
            if (value === "") {
                summary.values[category.id] = null;
            } else {
                summary.values[category.id] = Number(value);
            }
        });
        logger.info({
            context: "EntriesSection.handleSubmit",
            section: Abridgers.SECTION(props.section),
            values: values,
            summary: summary,
        });
        await mutateSummary.write(summary);
        if (mutateSummary.error) {
            notifications.addNotification({
                container: "top-right",
                dismiss: {
                    duration: 0,
                },
                insert: "top",
                message: `${(mutateSummary.error as Error).message}`,
                title: props.section.slug,
                type: "danger",
            });
        } else {
            setSaveDisabled(true);
            notifications.addNotification({
                container: "top-right",
                dismiss: {
                    duration: 5000,
                },
                insert: "bottom",
                message: "Data entries have been saved",
                title: props.section.slug,
                type: "success",
            })
        }

    }

    // The user has changed an input value, so enable the Save button
    const localHandleChange = (event: ChangeEvent<any>): void => {
        setSaveDisabled(false);
    }

    // @ts-ignore
    return (
        <Formik
            enableReinitialize={true}
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

                <Form id={`Section_${props.section.id}_Form`}>

        <Table
            bordered={true}
            hover={true}
            size="sm"
            striped={true}
        >

            <thead>
            <tr className="table-warning">
                <th className="text-center" colSpan={2}>
                    {props.section.slug}
                </th>
            </tr>
            <tr>
                <th>Statistic</th>
                <th>Value</th>
            </tr>
            </thead>

            <tbody>
            {categories.map((category, rowIndex) => (
                <tr
                    className="table-default"
                    key={(1000 + props.section.ordinal) + (rowIndex * 100)}
                >
                    <td key={(1000 + props.section.ordinal) + (rowIndex * 100) + 1}>
                        <label htmlFor={calculateName(category)}>{category.slug}</label>
                    </td>
                    <td key={(1000 + props.section.ordinal) + (rowIndex * 100) + 98}>
                        <input
                            id={calculateName(category)}
                            inputMode="numeric"
                            key={(1000 + props.section.ordinal) + (rowIndex * 100) + 99}
                            name={calculateName(category)}
                            onBlur={handleBlur}
                            onChange={event => {
                                handleChange(event);
                                localHandleChange(event);
                            }}
                            pattern="[0-9]*"
                            type="number"
                            value={values[calculateName(category)]}
                        />
                    </td>
                </tr>
            ))}
            <tr>
                <td>&nbsp;</td>
                <td>
                    <Button
                        className="align-content-start"
                        disabled={saveDisabled}
                        size="sm"
                        type="submit"
                        variant="primary"
                    >
                        Save
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                        className="align-content-end"
                        size="sm"
                        type="reset"
                        variant="secondary"
                    >
                        Reset
                    </Button>
                </td>
            </tr>
            </tbody>

        </Table>

        </Form>

        )}

        </Formik>
    )

}

export default EntriesSection;
