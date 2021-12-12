// EntriesSection ------------------------------------------------------------

// Encapsulates display and input fields for the Categories associated with
// a specified Section.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {store as notifications} from "react-notifications-component";

// Internal Modules ----------------------------------------------------------

import {HandleAction, OnChangeInput} from "../../types";
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
    const [dirty, setDirty] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [values, setValues] = useState<VALUES>({});

    const fetchSummary = useFetchSummary({
        date: props.date,
        section: props.section,
    });
    const mutateSummary = useMutateSummary({
        alertPopup: false,
    });

    useEffect(() => {

        // Calculate the Categories we will be entering values for
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

        // Record the initial values for our categories
        const theValues: VALUES = {};
        theCategories.forEach(category => {
            const value = fetchSummary.summary.values[category.id];
            if (value === null) {
                theValues[name(category)] = "";
            } else {
                theValues[name(category)] = "" + value;
            }
        });
        setValues(theValues);

        // Report our configuration information
        logger.info({
            context: "EntriesSection.useEffect",
            active: props.active,
            date: props.date,
            section: Abridgers.SECTION(props.section),
            categories: Abridgers.CATEGORIES(theCategories),
            summary: fetchSummary.summary,
            values: theValues,
        });
        setDirty(false);
        setRefresh(false);

    }, [props.active, props.date, props.section,
        refresh,
        fetchSummary.summary]);

    // Calculate the field name for the value associated with this Category
    const name = (category: Category): string => {
        return PREFIX + category.id;
    }

    // Handle a "Change" event
    const onChange: OnChangeInput = (event) => {
        const theValues: VALUES = {};
        categories.forEach(category => {
            const theName = name(category);
            theValues[theName] = values[theName];
        });
        theValues[event.target.name] = event.target.value;
        setDirty(true);
        setValues(theValues);
    }

    // Handle a "Reset" button click
    const onReset: HandleAction = () => {
        setRefresh(true);
    }

    // Handle a "Submit" button click
    const onSubmit = async (event: any) => {

        // Prevent the usual HTML form submit
        event.preventDefault();

        // Calculate a Summary to send to the server
        const theSummary = new Summary({
            date: props.date,
            sectionId: props.section.id,
            values: {}
        });
        categories.forEach(category => {
            const value = values[name(category)];
            if (value.length > 0) {
                theSummary.values[category.id] = Number(value);
            } else {
                theSummary.values[category.id] = null;
            }
        });

        // Send the Summary and process the results
        await mutateSummary.write(theSummary);
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
            logger.info({
                context: "EntriesSection.onSubmit",
                values: values,
                summary: theSummary,
            });
            setDirty(false);
        }

    }

    return (
        <form
            id={`ES-${props.section.id}-Form`}
            key={`ES-${props.section.id}-Form`}
            noValidate
            onReset={onReset}
            onSubmit={onSubmit}
        >

            <Table
                bordered={true}
                //id={`ES-S${props.section.id}-Table`}
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
                        //id={`ES-S${props.section.id}-R${ri}-tr`}
                        key={`ES-S${props.section.id}-R${ri}-tr`}
                    >
                        <td
                            id={`ES-S${props.section.id}-R${ri}-label`}
                            key={`ES-S${props.section.id}-R${ri}-label`}
                        >
                            <label htmlFor={name(category)}>{category.slug}</label>
                        </td>
                        <td
                            //id={`ES-S${props.section.id}-R${ri}-input`}
                            key={`ES-S${props.section.id}-R${ri}-input`}
                        >
                            <input
                                inputMode="numeric"
                                name={name(category)}
                                onChange={onChange}
                                pattern="[0-9]*"
                                type="number"
                                value={values[name(category)]}
                            />
                        </td>
                    </tr>
                ))}
                <tr>
                    <td>&nbsp;</td>
                    <td>
                        <Button
                            disabled={!dirty}
                            size="sm"
                            type="submit"
                            variant="primary"
                        >Save</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                            disabled={!dirty}
                            size="sm"
                            type="reset"
                            variant="secondary"
                        >Reset</Button>
                    </td>
                </tr>
                </tbody>

            </Table>

        </form>
    )

}

export default EntriesSection;
