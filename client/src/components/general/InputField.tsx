// InputField ----------------------------------------------------------------

// Render a raw <input> element for a text input field that is processed
// by react-hook-form.  No labels or other decorations are included.
// Field names MUST be unique within a single Form.

// External Modules ----------------------------------------------------------

import React from "react";
import {UseFormRegister} from "react-hook-form";

// Internal Modules ----------------------------------------------------------

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // This field to receive autoFocus? [false]
    className?: string;                 // CSS class(es) for the input field [none]
    disabled?: boolean;                 // Disable this field? [false]
    inputMode?:  "search" | "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal";
                                        // HTML input mode [none]
    name: string;                       // Unique-within-form name of this field
    pattern?: string;                   // Regular expression for valid values [none]
    readOnly?: boolean;                 // Mark field as read only? [false]
    register: UseFormRegister<any>;     // register object from useForm() // TODO - <any> ???
    type?: "date" | "hidden" | "month" | "number" | "password" | "text" | "time";
                                        // Input field type [text]
}

// Component Details ---------------------------------------------------------

const InputField = (props: Props) => {

    return (
        <input
            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
            className={props.className ? props.className : undefined}
            disabled={(props.disabled !== undefined) ? props.disabled : undefined}
            inputMode={props.inputMode ? props.inputMode : undefined}
            pattern={props.pattern ? props.pattern : undefined}
            readOnly={(props.readOnly !== undefined) ? props.readOnly : undefined}
            type={props.type ? props.type : undefined}
            {...props.register(props.name)}
        />
    )

}

export default InputField;
