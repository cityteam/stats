// SectionForm --------------------------------------------------------------

// Detail editing form for Section objects.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import {Formik,FormikHelpers,FormikValues} from "formik";
import Button from "react-bootstrap/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import {HandleSection} from "../../types";
import Section from "../../models/Section";
import logger from "../../util/ClientLogger";
import {toSection} from "../../util/ToModelTypes";
import {validateSectionOrdinal} from "../../util/ApplicationValidators";
import {validateSectionOrdinalUnique} from "../../util/AsyncValidators";
import {toEmptyStrings, toNullValues} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    canRemove: boolean;                 // Can remove be performed? [false]
    canSave: boolean;                   // Can save be performed? [false]
    handleInsert: HandleSection;        // Handle Section insert request
    handleRemove: HandleSection;        // Handle Section remove request
    handleUpdate: HandleSection;        // Handle Section update request
    section: Section;                   // Initial values (id < 0 for adding)
}

// Component Details ---------------------------------------------------------

const SectionForm = (props: Props) => {

    const [adding] = useState<boolean>(props.section.id < 0);
    const [initialValues] = useState(toEmptyStrings(props.section));
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "SectionForm.useEffect",
            category: props.section,
            values: initialValues,
        });
    }, [props.section, initialValues]);

    const handleSubmit = (values: FormikValues, actions: FormikHelpers<FormikValues>): void => {
        logger.debug({
            context: "SectionForm.handleSubmit",
            category: toSection(toNullValues(values)),
            values: values,
        });
        if (adding) {
            props.handleInsert(toSection(toNullValues(values)));
        } else {
            props.handleUpdate(toSection(toNullValues(values)));
        }
    }

    const onConfirm = (): void => {
        setShowConfirm(true);
    }

    const onConfirmNegative = (): void => {
        setShowConfirm(false);
    }

    const onConfirmPositive = (): void => {
        setShowConfirm(false);
        props.handleRemove(props.section);
    }

    const validationSchema = () => {
        return Yup.object().shape({
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
                        return await validateSectionOrdinalUnique(toSection(this.parent));
                    }),
            scope: Yup.string()
                .required("Scope is required"),
            slug: Yup.string()
                .required("Slug is required"),
            title: Yup.string()
                .required("Title is required")
        });
    }

    return (

        <>

            {/* Details Form */}
            <Container id="SectionForm">

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        handleSubmit(values, actions);
                    }}
                    validateOnBlur={true}
                    validateOnChange={false}
                    validationSchema={validationSchema}
                >

                    {( {
                           errors,
                           handleBlur,
                           handleChange,
                           handleSubmit,
                           isSubmitting,
                           isValid,
                           touched,
                           values,
                       }) => (

                        <Form
                            id="SectionForm"
                            noValidate
                            onSubmit={handleSubmit}
                        >

                            <Form.Row id="ordinalTitleRow">
                                <Form.Group as={Col} className="col-4" controlId="ordinal" id="ordinalGroup">
                                    <Form.Label>Ordinal:</Form.Label>
                                    <Form.Control
                                        autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                                        isInvalid={touched.ordinal && !!errors.ordinal}
                                        isValid={!errors.ordinal}
                                        name="ordinal"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.ordinal}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Unique number that determines the sort order for sections.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ordinal}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="type" id="titleGroup">
                                    <Form.Label>Title Type:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.title && !!errors.title}
                                        isValid={!errors.title}
                                        name="title"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.title}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Report title for this section.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.title}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

{/*
                            <Form.Row id="notesRow">
                                <Form.Group as={Col} controlId="notes" id="notesGroup">
                                    <Form.Label>Notes:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.notes && !!errors.notes}
                                        isValid={!errors.notes}
                                        name="notes"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.notes}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Notes about this section.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.notes}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
*/}

                            <Form.Row id="slugScopeRow">
                                <Form.Group as={Col} controlId="slug" id="slugGroup">
                                    <Form.Label>Slug:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.slug && !!errors.slug}
                                        isValid={!errors.slug}
                                        name="slug"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.slug}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Abbreviated description for mobile devices.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.slug}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="scope" id="scopeGroup">
                                    <Form.Label>Scope:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.scope && !!errors.scope}
                                        isValid={!errors.scope}
                                        name="scope"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.scope}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Permission scope required to enter data in this Section.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.scope}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row id="activeRow">
                                <Form.Group as={Col} controlId="active" id="activeGroup">
                                    <Form.Check
                                        feedback={errors.active}
                                        defaultChecked={values.active}
                                        id="active"
                                        label="Active?"
                                        name="active"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Form.Row>

                            <Row className="mb-3">
                                <Col className="text-left">
                                    <Button
                                        disabled={isSubmitting || !props.canSave}
                                        size="sm"
                                        type="submit"
                                        variant="primary"
                                    >
                                        Save
                                    </Button>
                                </Col>
                                <Col className="text-right">
                                    <Button
                                        disabled={adding || !props.canRemove}
                                        onClick={onConfirm}
                                        size="sm"
                                        type="button"
                                        variant="danger"
                                    >
                                        Remove
                                    </Button>
                                </Col>
                            </Row>

                        </Form>

                    )}

                </Formik>

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

export default SectionForm;
