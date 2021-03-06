// SectionSelector -----------------------------------------------------------

// Selector drop-down to choose which Section (of those associated with the
// currently selected Facility) the user wants to interact with.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleSection, OnChangeSelect} from "../../types";
import useFetchSections from "../../hooks/useFetchSections";
import Section from "../../models/Section";
import logger from "../../util/ClientLogger";

// Incoming Properties ------------------------------------------------------

export interface Props {
    active?: boolean;                   // Offer only active Sections? [false]
    autoFocus?: boolean;                // Should element receive autoFocus? [false]
    disabled?: boolean;                 // Should element be disabled? [false]
    handleSection: HandleSection;       // Handle section selection
    label?: string;                     // Element label [Section:]
    name?: string;                      // Input control name [sectionSelector]
}

// Component Details ---------------------------------------------------------

const SectionSelector = (props: Props) => {

    const [index, setIndex] = useState<number>(-1);
    const [label] = useState<string>(props.label ? props.label : "Section:");
    const [name] = useState<string>(props.name ? props.name : "sectionSelector");

    const fetchSections = useFetchSections({
        active: props.active,
    });

    useEffect(() => {
        logger.debug({
            context: "SectionSelector.useEffect",
            index: index
        })
    }, [index, fetchSections.sections]);

    const onChange: OnChangeSelect = (event) => {
        const theIndex = parseInt(event.target.value, 10);
        const theSection = (theIndex >= 0) ? fetchSections.sections[theIndex] : new Section();
        if (theSection.id > 0) {
            props.handleSection(theSection);
        }
        setIndex(theIndex);
    }

    return (
        <div className="form-inline">
            <label className="me-2" htmlFor={name}>
                {label}
            </label>
            <select
                autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                className="form-control-sm me-2"
                disabled={(props.disabled !== undefined) ? props.disabled : undefined}
                id={name}
                onChange={onChange}
                value={index}
            >
                <option key="-1" value="-1">(Select Section)</option>
                {fetchSections.sections.map((section, si) => (
                    <option key={si} value={si}>
                        {section.title}
                    </option>
                ))}
            </select>
        </div>
    )

}

export default SectionSelector;
