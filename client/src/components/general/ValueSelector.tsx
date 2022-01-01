// ValueSelector -------------------------------------------------------------

// Generic selector to pick a string value as a standalone dropdown.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Form from "react-bootstrap/Form";

// Internal Modules ----------------------------------------------------------

import {HandleValue, OnChangeInput} from "../../types";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should element receive autoFocus? [false]
    disabled?: boolean;                 // Should element be disabled? [false]
    handleValue: HandleValue;           // Handler for selecting a style
    header?: string;                    // No-current-selection value [(Select Value)]
    label?: string;                     // Element label [Value:]
    name?: string;                      // Input control name [valueSelector]
    value?: string;                     // Initially selected value [""]
    values: string[];                   // Values to offer
}

// Component Details ---------------------------------------------------------

const ValueSelector = (props: Props) => {

    const [index, setIndex] = useState<number>(-1);

    const onChange: OnChangeInput = (event): void => {
        const theIndex = parseInt(event.target.value);
        setIndex(theIndex);
        logger.trace({
            context: "ValueSelector.onChange",
            index: theIndex,
            value: props.values[theIndex],
        });
        props.handleValue(props.values[theIndex]);
    }

    return (
        <Form inline>
            <Form.Label className="mr-2" htmlFor={props.name ? props.name : "valueSelector"}>
                {props.label ? props.label : "Value:"}
            </Form.Label>
            <Form.Control
                as="select"
                autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                disabled={(props.disabled !== undefined) ? props.disabled : undefined}
                id={props.name ? props.name : "valueSelector"}
                onChange={onChange}
                size="sm"
                value={index}
            >
                <option key="-1">{props.header ? props.header : "(Select Value)"}</option>
                {props.values.map((value, vi) => (
                    <option key={vi} value={vi}>
                        {value}
                    </option>
                ))}
            </Form.Control>
        </Form>
    )

}

export default ValueSelector;
