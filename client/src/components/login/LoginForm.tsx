// LoginForm -----------------------------------------------------------------

// Form for logging in to this application.

// External Modules ----------------------------------------------------------

import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import TextField from "../general/TextField";
import Credentials from "../../models/Credentials";

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;        // Should the first element receive autfocus? [false]
    handleLogin:                // Handle (credentials) for login request
        (credentials: Credentials) => void;
}

// Component Details ---------------------------------------------------------

export const LoginForm = (props: Props) => {

    const onSubmit: SubmitHandler<Credentials> = (values) => {
        props.handleLogin({
            ...values
        });
    }

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required("Password is required"),
        username: Yup.string()
            .required("Username is required")
    });

    const {formState: {errors}, handleSubmit, register} = useForm<Credentials>({
        defaultValues: { password: "", username: "" },
        mode: "onBlur",
        resolver: yupResolver(validationSchema)
    });

    return (
        <Container id="LoginForm">
                <Form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Form.Row id="usernameRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            errors={errors}
                            label="Username:"
                            name="username"
                            register={register}
                            valid="Enter your login username."
                        />
                    </Form.Row>

                    <Form.Row id="passwordRow">
                        <TextField
                            errors={errors}
                            label="Password:"
                            name="password"
                            register={register}
                            type="password"
                            valid="Enter your login password"
                        />
                    </Form.Row>

                    <Row className="mb-3">
                        <Col>
                            <Button
                                size="sm"
                                type="submit"
                                variant="primary"
                            >Log In</Button>
                        </Col>
                    </Row>

                </Form>
        </Container>
    )

}

export default LoginForm;
