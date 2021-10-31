// SectionSelector -----------------------------------------------------------

// Selector drop-down to choose which Section (of those associated with the
// currently selected Facility) the user wants to interact with.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";

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
        let theIndex: number;
        if (fetchSections.sections.length > 0) {
            theIndex = 0;
        } else {
            theIndex = -1;
        }
        setIndex(theIndex);
        logger.debug({
            context: "SectionSelector.useEffect",
            index: theIndex
        })
    }, [fetchSections.sections]);

    const onChange: OnChangeSelect = (event) => {
        const theIndex = parseInt(event.target.value, 10);
        const theSection = (theIndex >= 0) ? fetchSections.sections[theIndex] : new Section();
        if (theSection.id > 0) {
            props.handleSection(theSection);
        }
        setIndex(theIndex);
    }

    return (
        <Form inline id="sectionSelectorForm">
            <Form.Label className="mr-2" htmlFor={name}>
                {label}
            </Form.Label>
            <Form.Control
                as="select"
                autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                disabled={(props.disabled !== undefined) ? props.disabled : undefined}
                id={name}
                onChange={onChange}
                size="sm"
                value={index}
            >
                <option key="-1" value="-1">(Select Section)</option>
                {fetchSections.sections.map((section, index) => (
                    <option key={index} value={index}>
                        {section.title}
                    </option>
                ))}
            </Form.Control>
        </Form>
    )

}

export default SectionSelector;
