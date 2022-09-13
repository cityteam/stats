// FacilityForm -----------------------------------------------------------

// Detail editing form for Facility objects.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {CaretLeftSquare} from "react-bootstrap-icons";
import {SubmitHandler, useForm} from "react-hook-form";
import {CheckBoxField, TextField} from "@craigmcc/shared-react";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleFacility} from "../../types";
import Facility from "../../models/Facility";
import FacilityData from "../../models/FacilityData";
import {
    validateFacilityNameUnique,
    validateFacilityScopeUnique
} from "../../util/AsyncValidators";
import * as ToModel from "../../util/ToModel";
import {
    validateEmail,
    validateFacilityScope,
    validatePhone,
    validateState,
    validateZipCode
} from "../../util/Validators";

// Incoming Properties ------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleInsert?: HandleFacility;      // Handle Facility insert request [not allowed]
    handleRemove?: HandleFacility;      // Handle Facility remove request [not allowed]
    handleReturn: HandleAction;         // Handle return to previous view
    handleUpdate?: HandleFacility;      // Handle Facility update request [not allowed]
    facility: Facility;                 // Initial values (id < 0 for adding)
}

// Component Details ---------------------------------------------------------

const FacilityForm = (props: Props) => {

    const [adding] = useState<boolean>(props.facility.id < 0);
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
            props.handleRemove(props.facility);
        }
    }

    const onSubmit: SubmitHandler<FacilityData> = (values) => {
        const theFacility = new Facility({
            ...props.facility,
            ...values,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theFacility);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theFacility);
        }
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        address1: Yup.string()
            .nullable(),
        address2: Yup.string()
            .nullable(),
        city: Yup.string()
            .nullable(),
        email: Yup.string()
            .nullable()
            .test("valid-email",
                "Invalid email format",
                function (value) {
                    return validateEmail(value ? value : "");
                }),
        name: Yup.string()
            .required("Name is required")
            .test("unique-name",
                "That name is already in use",
                async function (this) {
                    return validateFacilityNameUnique(ToModel.FACILITY(this.parent));
                }
            ),
        phone: Yup.string()
            .nullable()
            .test("valid-phone",
                "Invalid phone number format",
                function (value) {
                    return validatePhone(value ? value : "");
                }),
        scope: Yup.string()
            .required("Scope is required")
            .test("valid-scope",
                "Only alphanumeric (a-z, A-Z, 0-9) characters are allowed",
                function(value) {
                    return validateFacilityScope(value);
                })
            .test("unique-scope",
                "That scope is already in use",
                async function(value) {
                    return validateFacilityScopeUnique(ToModel.FACILITY(this.parent));
                }),
        state: Yup.string()
            .nullable()
            .test("valid-state",
                "Invalid state abbreviation",
                function(value) {
                    return validateState(value ? value : "");
                }),
        zipCode: Yup.string()
            .nullable()
            .test("valid-zip-code",
                "Invalid zip code format",
                function(value) {
                    return validateZipCode(value ? value : "");
                }),
    });

    const {formState: {errors}, handleSubmit, register}  = useForm<FacilityData>({
        defaultValues: new FacilityData(props.facility),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="FacilityForm">

                <Row className="mb-3">
                    <Col className="text-start">
                        <CaretLeftSquare
                            data-testid="back"
                            onClick={props.handleReturn}
                            size={32}
                        />
                    </Col>
                    <Col className="text-center">
                        {(adding) ? (
                            <span><strong>Add New</strong></span>
                        ) : (
                            <span><strong>Edit Existing</strong></span>
                        )}
                        <span><strong>&nbsp;Facility</strong></span>
                    </Col>
                    <Col className="text-end">
                    </Col>
                </Row>

                <Form
                    id="FacilityFormForm"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Row className="mb-3" id="nameScopeRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            className="col-8"
                            error={errors.name}
                            label="Name:"
                            name="name"
                            register={register}
                            valid="Name of this Facility."
                        />
                        <TextField
                            error={errors.scope}
                            label="Scope:"
                            name="scope"
                            register={register}
                            valid="Scope required to access this Facility."
                        />
                    </Row>

                    <Row className="mb-3" id="addressRow">
                        <TextField
                            error={errors.address1}
                            label="Address 1"
                            name="address1"
                            register={register}
                        />
                        <TextField
                            error={errors.address2}
                            label="Address 2"
                            name="address2"
                            register={register}
                        />
                    </Row>

                    <Row className="mb-3" id="cityStateZipRow">
                        <TextField
                            className="col-7"
                            error={errors.city}
                            label="City"
                            name="city"
                            register={register}
                        />
                        <TextField
                            className="col-2"
                            error={errors.state}
                            label="State:"
                            name="address2"
                            register={register}
                        />
                        <TextField
                            className="col-3"
                            error={errors.zipCode}
                            label="Zip Code:"
                            name="zipCode"
                            register={register}
                        />
                    </Row>

                    <Row className="mb-3" id="emailPhoneRow">
                        <TextField
                            className="col-8"
                            error={errors.email}
                            label="Email Address:"
                            name="email"
                            register={register}
                        />
                        <TextField
                            className="col-4"
                            error={errors.phone}
                            label="Phone Number:"
                            name="phone"
                            register={register}
                        />
                    </Row>

                    <Row className="mb-3" id="activeRow">
                        <CheckBoxField
                            error={errors.active}
                            label="Active?"
                            name="active"
                            register={register}
                        />
                    </Row>

                    <Row className="mb-3">
                        <Col className="text-start">
                            <Button
                                disabled={!props.handleInsert && !props.handleUpdate}
                                size="sm"
                                type="submit"
                                variant="primary"
                            >Save</Button>
                        </Col>
                        <Col className="text-end">
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
                        Removing this Facility is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Facility as inactive instead.</p>
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

export default FacilityForm;
