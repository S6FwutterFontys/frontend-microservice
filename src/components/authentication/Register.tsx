import {Redirect, withRouter} from "react-router";
import {connect} from "react-redux";
import React from "react";
import {Alert, Button, Form} from "react-bootstrap";
import './Register.css'
import config from '../../config.json'
import {IRegisterUser} from "./IRegisterUser";

/**
 * renders the login component
 * @param props auth state form redux
 * @constructor
 */
const Register = (props : any) => {
    const [password, setPassword] = React.useState('');
    const [passwordRepeat, setPasswordRepeat] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState();
    const [username, setUsername] = React.useState('');

    /**
     * validates email, password and passwordrepeat. Also sets error when it did not pass.
     * @returns false when the input does not match the given criteria.
     */
    const validateInput = (): boolean => {
        //check if passwords are the same
        if (password !== passwordRepeat){
            setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
                <Alert.Heading>Password Error</Alert.Heading>
                <p>The passwords do not match</p>
            </Alert>)
            return false;
        }

        //checks if the given password meets criteria
        let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,32}$/;
        if (!password.match(reg)){
            setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
                <Alert.Heading>Password Error</Alert.Heading>
                    <p>The password must have at least 1 UpperCase letter, 1 lowercase letter, 1 $pecial character, 1 numb3r and between 8 and 32 characters</p>
            </Alert>)
            return false;
        }

        //checks if the given email is valid
        reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        if (!email.match(reg)){
            setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
                <Alert.Heading>Email Error</Alert.Heading>
                <p>The email is not valid</p>
            </Alert>)
            return false;
        }
        return true;
    }

    /**
     * handles a register event and sends it to the backend
     * @param event on register button press
     */
    const handleRegister = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        setError(true);

        //validates input
        if (!validateInput()) {
            return;
        }

        //creates user JSON object
        let user : IRegisterUser = {
            Username: username,
            Email: email,
            Password: password
        };

        //create request parameters
        let options : RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        };

        //send API call to the Account server
        let response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL, options);

        let body = await response.text();

        //show error and stop flow
        if (response.status >= 400) {
            setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
                <Alert.Heading>{body}</Alert.Heading>
            </Alert>);
            return;
        }
        props.history.push("/login");
    }

    /**
     * changes email from event
     * @param event from the textbox
     */
    const onEmailChange = (event : any) => {
        setEmail(event.target.value);
    }

    const onUsernameChange = (event : any) => {
        setUsername(event.target.value);
    }

    /**
     * changes password from event
     * @param event from the textbox
     */
    const onPasswordChange = (event : any) => {
        setPassword(event.target.value);
    }

    /**
     * changes passwordrepeat from event
     * @param event from the textbox
     */
    const onPasswordRepeatChange = (event : any) => {
        setPasswordRepeat(event.target.value);
    }

    //creates an redirect when the user is already authenticated
    let content = props.auth.isAuthenticated ?
        (
            <Redirect to={{
                pathname: '/'
            }} />
        ) :
        (
            <Form className={"form-container"} onSubmit={handleRegister}>
                {error}
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="name" placeholder="Enter a Username" value={username} onChange={onUsernameChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter an email address" value={email} onChange={onEmailChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter a Password" value={password} onChange={onPasswordChange}/>
                </Form.Group>
                <Form.Group controlId="formBasicPasswordRepeat">
                    <Form.Label>Password (repeat)</Form.Label>
                    <Form.Control type="password" placeholder="Repeat entered Password" value={passwordRepeat} onChange={onPasswordRepeatChange}/>
                </Form.Group>
                <Button type={"submit"} variant="outline-primary" >
                    Submit
                </Button>
            </Form>
        );

    return (
        <div>
            {content}
        </div>
    );
};

/**
 * maps redux state to props
 * @param state of the redux
 */
const mapStateToProps = (state : any) => {
    return {
        auth: state.auth
    };
};

export default withRouter(connect(mapStateToProps)(Register));