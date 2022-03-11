// ValueSelector -------------------------------------------------------------

// Generic selector to pick a string value as a standalone dropdown.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleValue, OnChangeSelect} from "../../types";
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

    const onChange: OnChangeSelect = (event): void => {
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
        <div className="form-inline">
            <label className="me-2" htmlFor={props.name ? props.name : "valueSelector"}>
                {props.label ? props.label : "Value:"}
            </label>
            <select
                autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                className="form-control-sm me-2"
                disabled={(props.disabled !== undefined) ? props.disabled : undefined}
                id={props.name ? props.name : "valueSelector"}
                onChange={onChange}
                value={index}
            >
                <option key="-1">{props.header ? props.header : "(Select Value)"}</option>
                {props.values.map((value, vi) => (
                    <option key={vi} value={vi}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    )

}

export default ValueSelector;
