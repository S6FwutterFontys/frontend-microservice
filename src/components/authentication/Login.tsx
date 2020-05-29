import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import {login} from '../../actions/AuthenticateActions';
import {Alert, Button, Form} from "react-bootstrap";
import config from "../../config.json";
import {IAuthenticateUser} from "./IAuthenticateUser";
import User from "../profile/Account";

/***
 * renders the login component
 * @param props auth state from redux
 * @constructor
 */
const Login = (props : any) => {
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState();

    /**
     * changes email from event
     * @param event from the textbox
     */
    const onEmailChange = (event : any) => {
        setEmail(event.target.value);
    }

    /**
     * changes password from event
     * @param event from the textbox
     */
    const onPasswordChange = (event : any) => {
        setPassword(event.target.value);
    }

    let handleLogin = async (event : any) => {
        event.preventDefault();
        event.stopPropagation();

        setError('');

        if (email.length === 0 || password.length === 0) return;

        //creates user JSON object
        let user: IAuthenticateUser = {
            Email: email,
            Password: password
        };

        //create request parameters
        let options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        };

        //send API call to the Account server
        let response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL + '/login', options);

        //show error and stop flow
        if (response.status >= 400) {
            let body = await response.text();
            setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
                <Alert.Heading>{body}</Alert.Heading>
            </Alert>);
            return;
        }

        //save response body to redux store
        let body : User = await response.json();
        await props.login(body);

        props.history.push("/");
    };

    let content = props.auth.isAuthenticated ?
        (
            <Redirect to={{
                pathname: '/'
            }} />
        ) :
        (
            <Form className={"form-container"} onSubmit={handleLogin}>
                {error}
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" value={email} onChange={onEmailChange}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={onPasswordChange}/>
                </Form.Group>
                <Button type={"submit"} variant="outline-primary" onClick={handleLogin}>
                    Login
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

/**
 * maps redux dispatch to props
 * @param dispatch of the redux
 */
const mapDispatchToProps = (dispatch : any) => {
    return {
        login: (user : User) => {
            dispatch(login(user));
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));