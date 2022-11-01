// UserForm ---------------------------------------------------------------

// Detail editing form for User objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {SubmitHandler, useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {BackButton, CheckBoxField, SelectField, SelectOption, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import FacilityContext from "../facilities/FacilityContext";
import {HandleAction, HandleUser} from "../../types";
import User from "../../models/User";
import UserData from "../../models/UserData";
import * as Abridgers from "../../util/Abridgers";
import {validateUserUsernameFacilityUnique} from "../../util/AsyncValidators";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";
import {toNullValues} from "../../util/Transformations";

// Incoming Properties ------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleInsert?: HandleUser;          // Handle User insert request [not allowed]
    handleRemove?: HandleUser;          // Handle User remove request [not allowed]
    handleReturn: HandleAction;         // Handle return to previous view
    handleUpdate?: HandleUser;          // Handle User update request [not allowed]
    user: User;                         // Initial values (id < 0 for adding)
}

// Component Details ---------------------------------------------------------

type Entry = {
    scope: string;                      // Scope value
    value: boolean;                     // Assigned or not value
}

interface PerFacility {
    name: string;                       // Facility name
    scope: string;                      // Facility scope
    permissions: Entry[];               // Scope/value entries for admin/regular
    scopes: Entry[];                    // Scope/value entries for section specific scopes
}

class UserDataExtended extends UserData {
    constructor(data: any = {}) {
        super(data);
        this.logLevel = data.logLevel ? data.logLevel : "info";
        this.perFacilities = [];
    }
    logLevel: string;
    perFacilities: PerFacility[];

}

const LOG_LEVEL_OPTIONS: SelectOption[] = [
    {label: "Trace", value: "trace"},
    {label: "Debug", value: "debug"},
    {label: "Info",  value: "info"},
    {label: "Warn",  value: "warn"},
    {label: "Error", value: "error"},
    {label: "Fatal", value: "fatal"},
];
const LOG_LEVEL_PREFIX = "log:"

const UserForm = (props: Props) => {

    const facilityContext = useContext(FacilityContext);

    const [adding] = useState<boolean>(props.user.id < 0);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "UserForm.useEffect",
            facilities: Abridgers.FACILITIES(facilityContext.facilities),
        });
    }, [facilityContext.facilities]);

    const calculateDefaultValues = (): UserDataExtended => {
        let defaultValues = new UserDataExtended(props.user);
        const alloweds = props.user.scope.split(" ");
        facilityContext.facilities.forEach(facility => {
            const perFacility: PerFacility = {
                name: facility.name,
                scope: facility.scope,
                permissions: [],
                scopes: [],
            }
            // Record overall permissions for this Facility
            perFacility.permissions.push({
                scope: "admin",
                value: alloweds.includes(`${facility.scope}:admin`),
            });
            perFacility.permissions.push({
                scope: "regular",
                value: alloweds.includes(`${facility.scope}:regular`),
            });
            // Collect the set of unique section scope values
            let scopes: string[] = [];
            facility.sections?.forEach(section => {
                if (!scopes.includes(section.scope)) {
                    scopes.push(section.scope);
                }
            });
            scopes = scopes.sort((a, b) => {
                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                } else {
                    return 0;
                }
            })
            scopes.forEach(scope => {
                perFacility.scopes.push({
                    scope: scope,
                    value: alloweds.includes(`${facility.scope}:${scope}`),
                });
            });
            defaultValues.perFacilities.push(perFacility);
            logger.debug({
                context: "UserForm.calculateDefaultValues",
                defaultValues: defaultValues,
            });
        });
        alloweds.forEach(allowed => {
            if (allowed.startsWith(LOG_LEVEL_PREFIX)) {
                defaultValues.logLevel = allowed.substring(LOG_LEVEL_PREFIX.length);
            }
        })
        return defaultValues;
    }

    const calculateScope = (values: UserDataExtended): string => {
        const alloweds: string[] = [];
        values.perFacilities.forEach(perFacility => {
            perFacility.permissions.forEach((permission) => {
                if (permission.value) {
                    alloweds.push(`${perFacility.scope}:${permission.scope}`);
                }
            });
            perFacility.scopes.forEach((permission) => {
                if (permission.value) {
                    alloweds.push(`${perFacility.scope}:${permission.scope}`);
                }
            });
        });
        if (values.logLevel !== "") {
            alloweds.push(`${LOG_LEVEL_PREFIX}${values.logLevel}`);
        }
        logger.debug({
            context: "UserForm.calculateScope",
            scope: alloweds.join(" "),
            values: values,
        });
        return alloweds.join(" ");
    }

    const onConfirm = (): void => {
        setShowConfirm(true);
    }

    const onConfirmNegative = (): void => {
        setShowConfirm(false);
    }

    const onConfirmPositive = (): void => {
        setShowConfirm(false);
        if (props.handleRemove) {
            props.handleRemove(props.user)
        }
    }

    const onSubmit: SubmitHandler<UserDataExtended> = (values) => {
        values.scope = calculateScope(values);
        logger.debug({
            context: "UserForm.onSubmit",
            values: values,
        })
        const theUser = new User({
            ...props.user,
            ...values,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theUser);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theUser);
        }
    }

    // NOTE - there is no server-side equivalent for this because there is
    // not an individual logged-in user performing the request
    // NOTE - needs LoginContext to provide validateScope() method
    const validateRequestedScope = (requested: string | undefined): boolean => {
        return true; // NOTE - needs server side support
        /*
                if (!requested || ("" === requested)) {
                    return true;  // Not asking for scope but should be required
                } else {
                    // NOTE - deal with log:<level> pseudo-scopes
                    return loginContext.validateScope(requested);
                }
        */
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        name: Yup.string()
            .required("Name is required"),
        password: Yup.string() // NOTE - required on add, optional on edit
            .nullable(),
        scope: Yup.string()
            .required("Scope is required")
            .test("allowed-scope",
                "You are not allowed to assign a scope you do not possess",
                function(value) {
                    return validateRequestedScope(value);
                }),
        username: Yup.string()
            .required("Username is required")
            .test("unique-username",
                "That username is already in use",
                async function (this) {
                    return validateUserUsernameFacilityUnique(ToModel.USER(toNullValues(this.parent)), facilityContext.facility)
                }),
    });

    const {formState: {errors}, getValues, handleSubmit, register} = useForm<UserDataExtended>({
        defaultValues: calculateDefaultValues(),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });
    const values = getValues();
    logger.debug({
        context: "UserForm.getValues",
        getValues: values,
    });

    return (

        <>

            {/* Details Form */}
            <Container id="UserForm">

                <Row className="mb-3">
                    <Col className="text-start">
                        <BackButton
                            handleBack={props.handleReturn}
                        />
                    </Col>
                    <Col className="text-center">
                        <strong>
                            {(adding)? (
                                <span>Add New</span>
                            ) : (
                                <span>Edit Existing</span>
                            )}
                            &nbsp;User
                        </strong>
                    </Col>
                    <Col className="text-end">
                    </Col>
                </Row>

                <Form
                    id="UserFormForm"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Row className="mb-3" id="nameRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            error={errors.name}
                            label="Name:"
                            name="name"
                            register={register}
                            valid="Name or description of this User."
                        />
                    </Row>

                    <Row className="mb-3" id="usernamePasswordRow">
                        <TextField
                            error={errors.username}
                            label="Username:"
                            name="username"
                            register={register}
                            valid="Login username for this User (must be unique)."
                        />
                        <TextField
                            error={errors.password}
                            label="Password:"
                            name="password"
                            register={register}
                            valid="Enter ONLY for a new User or to change the password for an existing User."
                        />
                    </Row>

                    <Row className="mb-3" id="scopeRow">
                        <TextField
                            disabled={true}
                            error={errors.scope}
                            label="Scope:"
                            name="scope"
                            register={register}
                            valid="Space-separated permission(s) granted to this User."
                        />
                    </Row>

                    <Row className="mb-3" id="activeRow">
                        <SelectField
                            error={errors.logLevel}
                            header={{label: "(Default)", value: ""}}
                            label="Log Detail Level:"
                            name="logLevel"
                            options={LOG_LEVEL_OPTIONS}
                            register={register}
                        />
                        <CheckBoxField
                            error={errors.active}
                            label="Active?"
                            name="active"
                            register={register}
                        />
                    </Row>

                    <Row className="g-3 mb-3">
                        <Table
                            bordered={true}
                            hover={true}
                            size="sm"
                            striped={true}
                        >
                            <thead>
                            <tr className="table-secondary">
                                <th>Facility</th>
                                <th>Permissions</th>
                                <th>Sections</th>
                            </tr>
                            </thead>
                            <tbody>
                            {values.perFacilities.map((perFacility, pfi) => (
                                <tr key={`perFacility.${pfi}`}>
                                    <td>{perFacility.name}</td>
                                    <td>
                                        {perFacility.permissions.map((permission, ppi) => (
                                            <CheckBoxField
                                                label={permission.scope}
                                                name={`perFacilities.${pfi}.permissions.${ppi}.value`}
                                                register={register}
                                            />
                                        ))}
                                    </td>
                                    <td>
                                        {perFacility.scopes.map((permission, psi) => (
                                            <CheckBoxField
                                                label={permission.scope}
                                                name={`perFacilities.${pfi}.scopes.${psi}.value`}
                                                register={register}
                                            />
                                        ))}
                                    </td>
                                </tr>
                            ))}

{/*
                            {facilityContext.facilities.map((facility, fi) => (
                                <tr key={fi}>
                                    <td>{facility.name}</td>
                                    <td>
                                        <CheckBoxField
                                            label="Admin"
                                            name={`permissions.${fi}.admin`}
                                            register={register}
                                        />
                                        <CheckBoxField
                                            label="Regular"
                                            name={`permissions.${fi}.regular`}
                                            register={register}
                                        />
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                            ))}
*/}
                            </tbody>
                        </Table>
                    </Row>

                    <Row className="mb-3">
                        <Col className="text-start">
                            <Button
                                disabled={!props.handleInsert && !props.handleUpdate}
                                size="sm"
                                type="submit"
                                variant="primary"
                            >
                                Save
                            </Button>
                        </Col>
                        <Col className="col text-end">
                            <Button
                                disabled={adding || !props.handleRemove}
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
                        Removing this User is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this User as inactive instead.</p>
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

export default UserForm;
