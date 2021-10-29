// CategoryForm --------------------------------------------------------------

// Detail editing form for Category objects.

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

import {HandleCategory, Type} from "../../types";
import Category from "../../models/Category";
import logger from "../../util/ClientLogger";
import {toCategory} from "../../util/ToModelTypes";
import {toEmptyStrings, toNullValues} from "../../util/Transformations";
import {validateCategoryOrdinal, validateCategoryType} from "../../util/ApplicationValidators";
import {validateCategoryOrdinalUnique} from "../../util/AsyncValidators";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    canRemove: boolean;                 // Can remove be performed? [false]
    canSave: boolean;                   // Can save be performed? [false]
    handleInsert: HandleCategory;       // Handle Category insert request
    handleRemove: HandleCategory;       // Handle Category remove request
    handleUpdate: HandleCategory;       // Handle Category update request
    category: Category;                 // Initial values (id < 0 for adding)
}

// Component Details ---------------------------------------------------------

const CategoryForm = (props: Props) => {

    const [adding] = useState<boolean>(props.category.id < 0);
    const [initialValues] = useState(toEmptyStrings(props.category));
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "CategoryForm.useEffect",
            category: props.category,
            values: initialValues,
        });
    }, [props.category, initialValues]);

    const handleSubmit = (values: FormikValues, actions: FormikHelpers<FormikValues>): void => {
        logger.debug({
            context: "CategoryForm.handleSubmit",
            category: toCategory(toNullValues(values)),
            values: values,
        });
        if (adding) {
            props.handleInsert(toCategory(toNullValues(values)));
        } else {
            props.handleUpdate(toCategory(toNullValues(values)));
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
        props.handleRemove(props.category);
    }

    interface TypeOption {
        key: string,
        value: string
    }

    const typeOptions = (): TypeOption[] => {
        return [
            { key: Type.DETAIL, value: "Detail line item" },
            { key: Type.HEADER, value: "Group header"},
        ];
    }

    const validationSchema = () => {
        return Yup.object().shape({
            active: Yup.boolean(),
            description: Yup.string(),
            notes: Yup.string(),
            ordinal: Yup.number()
                .required("Ordinal is required")
                .test("unique-ordinal",
                    "That ordinal is already in use within this Facility",
                    async function (this) {
                        if (!validateCategoryOrdinal(this.parent.ordinal)) {
                            return false;
                        }
                        return await validateCategoryOrdinalUnique(toCategory(this.parent));
                    }),
            service: Yup.string()
                .required("Service is required"),
            scope: Yup.string(),
            slug: Yup.string(),
            type: Yup.string()
                .required("Type is required")
                .test("valid-type",
                    "Invalid type, must be one of the specified values",
                    function(value) {
                        return validateCategoryType(value);
                    })
        });
    }

    return (

        <>

            {/* Details Form */}
            <Container id="CategoryForm">

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
                            id="CategoryForm"
                            noValidate
                            onSubmit={handleSubmit}
                        >

                            <Form.Row id="ordinalTypeServiceRow">
                                <Form.Group as={Col} controlId="ordinal" id="ordinalGroup">
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
                                        Unique number that determines the sort order for categories.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ordinal}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="type" id="typeGroup">
                                    <Form.Label>Category Type:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="type"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        value={values.type}
                                    >
                                        {typeOptions().map((typeOption, index) => (
                                            <option key={index} value={typeOption.key}>
                                                {typeOption.value}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback type="valid">
                                        Line item type (Detail or Header).
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.type}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="service" id="serviceGroup">
                                    <Form.Label>Service:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.service && !!errors.service}
                                        isValid={!errors.service}
                                        name="service"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.service}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        General service category.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.service}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row id="descriptionNotesRow">
                                <Form.Group as={Col} controlId="description" id="descriptionGroup">
                                    <Form.Label>Description:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.description && !!errors.description}
                                        isValid={!errors.description}
                                        name="description"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.description}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Where or by whom was this service provided.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>
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
                                        Notes about how this service is measured.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.notes}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row id="slugActiveRow">
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
                        Removing this Category is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Category as inactive instead.</p>
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

export default CategoryForm;
