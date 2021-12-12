// EntriesSection ------------------------------------------------------------

// Encapsulates display and input fields for the Categories associated with
// a specified Section.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import {SubmitHandler, useForm} from "react-hook-form";
import {store as notifications} from "react-notifications-component";

// Internal Modules ----------------------------------------------------------

import InputField from "../general/InputField";
import {OnAction} from "../../types";
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
//    [name: string]: number | null;
    [name: string]: string;
}

const EntriesSection = (props: Props) => {

    const [categories, setCategories] = useState<Category[]>([]);

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

        // Report our configuration information
        logger.info({
            context: "EntriesSection.useEffect",
            active: props.active,
            date: props.date,
            section: Abridgers.SECTION(props.section),
            categories: Abridgers.CATEGORIES(theCategories),
            summary: fetchSummary.summary,
        });

    }, [props.active, props.date, props.section,
        fetchSummary.summary]);

    // Calculate the field name for the value associated with this Category
    const name = (category: Category): string => {
        return PREFIX + category.id;
    }

    // Handle a "Reset" button click
    const onReset: OnAction = () => {
        logger.info({
            context: "EntriesSection.onReset",
        });
        reset();
    }

    // Handle a "Save" button click
    const onSubmit: SubmitHandler<VALUES> = async (values) => {

        // Calculate a Summary to send to the server
        const summary = new Summary({
            date: props.date,
            sectionId: props.section.id,
            values: {}
        });
        categories.forEach(category => {
            const value = values[name(category)];
            if (value.length > 0) {
                summary.values[category.id] = Number(value);
            } else {
                summary.values[category.id] = null;
            }
        });
        logger.info({
            context: "EntriesSection.onSubmit",
            section: Abridgers.SECTION(props.section),
            values: values,
            summary: summary,
        });

        // Send the Summary and process the results
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
            notifications.addNotification({
                container: "top-right",
                dismiss: {
                    duration: 5000,
                },
                insert: "bottom",
                message: "Data entries have been saved",
                title: props.section.slug,
                type: "success",
            });
        }
        fetchSummary.refresh();

    }

    const toValues = (summary: Summary): VALUES => {
        const results: VALUES = {};
        categories.forEach(category => {
            const value = summary.values[category.id];
            if (value === null) {
                results[name(category)] = "";
            } else {
                results[name(category)] = "" + value;
            }
        });
        logger.info({
            context: "EntriesSection.toValues",
            summary: fetchSummary.summary,
            values: results,
        });
        return results;
    }

    const {formState: {isDirty}, handleSubmit, register, reset} = useForm<VALUES>({
//        defaultValues: initials,
        defaultValues: toValues(fetchSummary.summary),
        mode: "onBlur",
    });

    return (
        <Form
            id={`ES-${props.section.id}-Form`}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
        >

            <Table
                bordered={true}
                id={`ES-S${props.section.id}-Table`}
                hover={true}
                key={`ES-S${props.section.id}-Table`}
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
                {categories.map((category, ri) => (
                    <tr
                        className="table-default"
                        id={`ES-S${props.section.id}-R${ri}-tr`}
                        key={`ES-S${props.section.id}-R${ri}-tr`}
                    >
                        <td
                            id={`ES-S${props.section.id}-R${ri}-label`}
                            key={`ES-S${props.section.id}-R${ri}-label`}
                        >
                            <label htmlFor={name(category)}>{category.slug}</label>
                        </td>
                        <td
                            id={`ES-S${props.section.id}-R${ri}-input`}
                            key={`ES-S${props.section.id}-R${ri}-input`}
                        >
                            <InputField
                                inputMode="numeric"
                                name={name(category)}
                                pattern="[0-9]*"
                                register={register}
                                type="number"
                            />
                        </td>
                    </tr>
                ))}
                <tr>
                    <td>&nbsp;</td>
                    <td>
                        <Button
                            className="align-content-start"
                            disabled={!isDirty}
                            size="sm"
                            type="submit"
                            variant="primary"
                        >Save</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                            className="align-content-end"
                            disabled={!isDirty}
                            onClick={onReset}
                            size="sm"
                            type="button"
                            variant="secondary"
                        >Reset</Button>
                    </td>
                </tr>
                </tbody>

            </Table>

        </Form>
    )

}

export default EntriesSection;
