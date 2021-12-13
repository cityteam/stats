// CategoryDetails --------------------------------------------------------------

// Detail editing form for Category objects.

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
import {HandleAction, HandleCategory} from "../../types";
import Category from "../../models/Category";
import CategoryData from "../../models/CategoryData";
import Section from "../../models/Section";
import {validateCategoryOrdinal} from "../../util/ApplicationValidators";
import {validateCategoryOrdinalUnique} from "../../util/AsyncValidators";
import * as ToModel from "../../util/ToModel";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    category: Category;                 // Initial values (id < 0 for adding)
    handleBack: HandleAction;           // Handle return to previous view
    handleInsert?: HandleCategory;      // Handle Category insert request [not allowed]
    handleRemove?: HandleCategory;      // Handle Category remove request [not allowed]
    handleUpdate?: HandleCategory;      // Handle Category update request [not allowed]
    section: Section;                   // Section that owns this Category
}

// Component Details ---------------------------------------------------------

const CategoryDetails = (props: Props) => {

    const facilityContext = useContext(FacilityContext);

    const [adding] = useState<boolean>(props.category.id < 0);
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
            props.handleRemove(props.category);
        }
    }

    const onSubmit: SubmitHandler<CategoryData> = (values) => {
        const theCategory = new Category({
            ...props.category,
            ...values,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theCategory);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theCategory);
        }
    }

    const validationSchema = Yup.object().shape({
//        accumulated: Yup.boolean(),
        active: Yup.boolean(),
//        description: Yup.string(),
        notes: Yup.string()
            .nullable(),
        ordinal: Yup.number()
            .required("Ordinal is required")
            .test("unique-ordinal",
                "That ordinal is already in use within this Section",
                async function (this) {
                    if (!validateCategoryOrdinal(this.parent.ordinal)) {
                        return false;
                    }
                    return await validateCategoryOrdinalUnique(facilityContext.facility, ToModel.CATEGORY(this.parent));
                }),
        service: Yup.string()
            .required("Service is required"),
        slug: Yup.string()
            .required("Slug is required")
    });

    const {formState: {errors}, handleSubmit, register} = useForm<CategoryData>({
        defaultValues: new CategoryData(props.category),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="CategoryDetails">

                <Row className="mb-3 ml-1 mr-1">
                    <Col className="text-left">
                        {(adding) ? (
                            <span><strong>Add New</strong></span>
                        ) : (
                            <span><strong>Edit Existing</strong></span>
                        )}
                        <span><strong>&nbsp;Category for Section:&nbsp;</strong></span>
                        <span className="text-info"><strong>{props.section.title}</strong></span>
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
                    id="CategoryDetailsForm"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Form.Row id="ordinalServiceRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            className="col-4"
                            errors={errors}
                            label="Ordinal:"
                            name="ordinal"
                            register={register}
                            type="number"
                            valid="Unique number that determines the sort order for Categories within a Section."
                        />
                        <TextField
                            errors={errors}
                            label="Service:"
                            name="service"
                            register={register}
                            valid="General service category."
                        />
                    </Form.Row>

                    <Form.Row id="notesRow">
                        <TextField
                            errors={errors}
                            label="Notes:"
                            name="notes"
                            register={register}
                            valid="Miscellaneous notes about this Category."
                        />
                    </Form.Row>

                    <Form.Row id="slugActiveAccumulatedRow">
                        <TextField
                            errors={errors}
                            label="Slug:"
                            name="slug"
                            register={register}
                            valid="Abbreviated description for mobile devices"
                        />
                        <CheckBoxField
                            errors={errors}
                            label="Active?"
                            name="active"
                            register={register}
                        />
{/*
                        <CheckBoxField
                            errors={errors}
                            label="Accumulated?"
                            name="accumulated"
                            register={register}
                        />
*/}
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

export default CategoryDetails;
