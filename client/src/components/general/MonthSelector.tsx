// MonthSelector -------------------------------------------------------------

// Selector text field to choose a month (YYYY-MM string) for processing.
// On up-to-date browsers, this will utilize the browser's extended
// input facilities.  For all other browsers, it will fall back to
// accepting and processing text strings.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";

// Internal Modules ----------------------------------------------------------

import {HandleMonth, OnChangeInput, OnKeyDown} from "../../types";
import logger from "../../util/ClientLogger";
import {validateMonth} from "../../util/Validators";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should element receive autoFocus? [false]
    disabled?: boolean;                 // Should element be disabled? [false]
    handleMonth?: HandleMonth;          // Handle month selection [No handler]
    label?: string;                     // Element label [Month:]
    max?: string;                       // Maximum accepted value [no limit]
    min?: string;                       // Minimum accepted value [no limit]
    name?: string;                      // Input control name [monthSelector]
    required?: boolean;                 // Is entry required? [false]
    type?: "month" | "text";            // Control type (month,text) [month]
    value?: string;                     // Initially displayed value [""]
}

// Component Details ---------------------------------------------------------

const MonthSelector = (props: Props) => {

    const [label] = useState<string>(props.label ? props.label : "Month:");
    const [name] = useState<string>(props.name ? props.name : "monthSelector");
    const [type] = useState<string>(props.type ? props.type : "month");
    const [value, setValue] = useState<string>(props.value ? props.value : "");

    useEffect(() => {
        logger.debug({
            context: "MonthSelector.useEffect"
        });
    });

    const onChange: OnChangeInput = (event): void => {
        const theValue = event.target.value;
        setValue(theValue);
    }

    const onKeyDown: OnKeyDown = (event): void => {
        if ((event.key === "Enter") || (event.key === "Tab")) {
            processValue(value);
        }
    }

    const processValue = (theValue: string): void => {

        // Validate the response
        let isValid = validateMonth(theValue);
        if (props.required && (theValue === "")) {
            isValid = false;
        } else if (props.max && (theValue > props.max)) {
            isValid = false;
        } else if (props.min && (theValue < props.min)) {
            isValid = false;
        }

        // Forward response to parent if it is valid
        if (!isValid) {
            let message = "Invalid month, must be in format YYYY-MM";
            if (props.required && (theValue === "")) {
                message += ", required";
            }
            if (props.max && (theValue > props.max)) {
                message += `, <= ${props.max}`;
            }
            if (props.min && (theValue < props.min)) {
                message += `, >= ${props.min}`;
            }
            alert(message);
        } else if (isValid && props.handleMonth) {
            props.handleMonth(theValue);
        }

    }

    return (
        <Form inline id="MonthSelector">
            <Form.Label className="mr-2" htmlFor={name}>
                {label}
            </Form.Label>
            <Form.Control
                autoFocus={props.autoFocus ? props.autoFocus : undefined}
                disabled={props.disabled ? props.disabled : undefined}
                htmlSize={7}
                id={name}
                max={props.max ? props.max : undefined}
                min={props.min ? props.min : undefined}
                onChange={onChange}
                onKeyDown={onKeyDown}
                size="sm"
                type={type}
                value={value}
            />
        </Form>
    )

}

export default MonthSelector;
