// SectionForm --------------------------------------------------------------

// Detail editing form for Section objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import FacilityContext from "../facilities/FacilityContext";
import CheckBoxField from "../general/CheckBoxField";
import TextField from "../general/TextField";
import {HandleAction, HandleSection} from "../../types";
import Section from "../../models/Section";
import SectionData from "../../models/SectionData";
import {validateSectionOrdinal} from "../../util/ApplicationValidators";
import {validateSectionOrdinalUnique} from "../../util/AsyncValidators";
import * as ToModel from "../../util/ToModel";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleBack: HandleAction;           // Handle return to previous view
    handleInsert?: HandleSection;       // Handle Section insert request [not allowed]
    handleRemove?: HandleSection;       // Handle Section remove request [not allowed]
    handleUpdate?: HandleSection;       // Handle Section update request [not allowed]
    section: Section;                   // Initial values (id < 0 for adding)
}

// Component Details ---------------------------------------------------------

const SectionDetails = (props: Props) => {

    const facilityContext = useContext(FacilityContext);

    const [adding] = useState<boolean>(props.section.id < 0);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const onConfirm = (): void => {
        setShowConfirm(true);
    }

    const onConfirmNegative = (): void => {
        setShowConfirm(false);
    }

    const onConfirmPositive = (): void => {
        setShowConfirm(false);
        if (props.handleRemove) {
            props.handleRemove(props.section);
        }
    }

    const onSubmit: SubmitHandler<SectionData> = (values) => {
        const theSection = new Section({
            ...props.section,
            ...values,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theSection);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theSection);
        }
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
//            notes: Yup.string(),
        ordinal: Yup.number()
            .required("Ordinal is required")
            .test("unique-ordinal",
                "That ordinal is already in use within this Facility",
                async function (this) {
                    if (!validateSectionOrdinal(this.parent.ordinal)) {
                        return false;
                    }
                    return validateSectionOrdinalUnique(ToModel.SECTION(this.parent));
                }),
        scope: Yup.string()
            .required("Scope is required"),
        slug: Yup.string()
            .required("Slug is required"),
        title: Yup.string()
            .required("Title is required")
    });

    const {formState: {errors}, handleSubmit, register} = useForm<SectionData>({
        defaultValues: new SectionData(props.section),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="SectionDetails">

                <Row className="mb-3">
                    <Col className="text-left">
                        {(adding) ? (
                            <span><strong>Add New</strong></span>
                        ) : (
                            <span><strong>Edit Existing</strong></span>
                        )}
                        <span><strong>&nbsp;Section for Facility:&nbsp;</strong></span>
                        <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                    </Col>
                    <Col className="text-right">
                        <Button
                            onClick={props.handleBack}
                            size="sm"
                            type="button"
                            variant="secondary"
                        >Back</Button>
                    </Col>
                </Row>

                <Form
                    id="SectionDetailsForm"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Form.Row id="ordinalTitleRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            className="col-4"
                            errors={errors}
                            label="Ordinal:"
                            name="ordinal"
                            register={register}
                            type="number"
                            valid="Unique number that determines the sort order for Sections."
                        />
                        <TextField
                            errors={errors}
                            label="Title:"
                            name="title"
                            register={register}
                            valid="Report title for this section."
                        />
                    </Form.Row>

                    <Form.Row id="notesRow">
                        <TextField
                            errors={errors}
                            label="Notes:"
                            name="notes"
                            register={register}
                            valid="Miscellaneous notes about this Section."
                        />
                    </Form.Row>

                    <Form.Row id="slugScopeRow">
                        <TextField
                            errors={errors}
                            label="Slug:"
                            name="slug"
                            register={register}
                            valid="Abbreviated description for mobile devices."
                        />
                        <TextField
                            errors={errors}
                            label="Scope:"
                            name="scope"
                            register={register}
                            valid="Permission scope required to enter data in this Section."
                        />
                    </Form.Row>

                    <Form.Row id="activeRow">
                        <CheckBoxField
                            errors={errors}
                            label="Active?"
                            name="active"
                            register={register}
                        />
                    </Form.Row>

                    <Row className="mb-3">
                        <Col className="text-left">
                            <Button
                                disabled={!props.handleInsert && !props.handleUpdate}
                                size="sm"
                                type="submit"
                                variant="primary"
                            >Save</Button>
                        </Col>
                        <Col className="text-right">
                            <Button
                                disabled={adding || !props.handleRemove}
                                onClick={onConfirm}
                                size="sm"
                                type="button"
                                variant="danger"
                            >Remove</Button>
                        </Col>
                    </Row>

                </Form>

            </Container>

            {/* Remove Confirm Modal */}
            <Modal
                animation={false}
                backdrop="static"
                centered
                dialogClassName="bg-danger"
                onHide={onConfirmNegative}
                show={showConfirm}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>WARNING:  Potential Data Loss</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Removing this Section is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Section as inactive instead.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onConfirmPositive}
                        size="sm"
                        type="button"
                        variant="danger"
                    >
                        Remove
                    </Button>
                    <Button
                        onClick={onConfirmNegative}
                        size="sm"
                        type="button"
                        variant="primary"
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </>

    )

}

export default SectionDetails;
