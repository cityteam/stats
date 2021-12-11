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
//    [name: string]: string;
    [name: string]: number | null;
}

const EntriesSection = (props: Props) => {

    const [categories, setCategories] = useState<Category[]>([]);
//    const [disabled, setDisabled] = useState<boolean>(true);
    const [initials, setInitials] = useState<VALUES>({});

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
        const theInitials: VALUES = {};
        theCategories.forEach(category => {
/*
            let value = "";
            if (fetchSummary.summary.values[category.id]) {
                value = "" + fetchSummary.summary.values[category.id];
            } else if (fetchSummary.summary.values[category.id] === 0) {
                value = "0";
            }
            theInitials[name(category)] = value;
*/
            theInitials[name(category)] = fetchSummary.summary.values[category.id];
        });
        setInitials(theInitials);

        // Report our configuration information
        logger.info({
            context: "EntriesSection.useEffect",
            active: props.active,
            date: props.date,
            section: Abridgers.SECTION(props.section),
            categories: Abridgers.CATEGORIES(theCategories),
            summary: fetchSummary.summary,
            initials: theInitials,
        });

    }, [props.active, props.date, props.section,
        fetchSummary.summary]);

    // Calculate the field name for the value associated with this Category
    const name = (category: Category): string => {
        return PREFIX + category.id;
    }

/*
    // Handle a change on input, even if the field is not committed yet
    const onChange: OnChangeInput = (event) => {
        setDisabled(false);
    }
*/

    // Handle a "Reset" button click
    const onReset: OnAction = () => {
        logger.info({
            context: "EntriesSection.onReset",
        });
        //setValues(initials);
        reset();
//        setDisabled(true);
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
/*
            const value: string = values[name(category)];
            if (value === "") {
                summary.values[category.id] = null;
            } else {
                summary.values[category.id] = Number(value);
            }
*/
            summary.values[category.id] = values[name(category)];
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
//            setDisabled(true);
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

    }

/*
    // Handle a "Save" button click
    const onSave: OnAction = async () => {

        // Calculate a Summary to send to the server
        const summary = new Summary({
            date: props.date,
            sectionId: props.section.id,
            values: {}
        });
        categories.forEach(category => {
            const value: string = values[name(category)];
            if (value === "") {
                summary.values[category.id] = null;
            } else {
                summary.values[category.id] = Number(value);
            }
        });
        logger.info({
            context: "EntriesSection.onSave",
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
            setDisabled(true);
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

    }
*/

/*
    // Handle a change in the value of an input field
    const onUpdate = (name: string, event: ChangeEvent<HTMLInputElement>): void => {
        logger.info({
            context: "EventSection.onUpdate",
            name: name,
            value: event.target.value,
        });
        const theValues = values;
        theValues[name] = event.target.value;
        setValues(theValues);
        setDisabled(false);
    }
*/

    const {formState: {isDirty}, handleSubmit, register, reset} = useForm<VALUES>({
        defaultValues: initials,
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
{/*
                            <input
                                id={name(category)}
                                inputMode="numeric"
                                key={`ES-S${props.section.id}-R${ri}-input`}
                                name={name(category)}
                                onChange={event => onUpdate(name(category), event)}
                                pattern="[0-9]*"
                                type="number"
                                value={values[name(category)]}
                            />
*/}
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
