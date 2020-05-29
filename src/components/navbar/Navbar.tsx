import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {Nav, Navbar} from "react-bootstrap";

const Navigationbar = (props: any) => {
    const [loginLink, setLoginLink] = React.useState("");
    const [loginText, setLoginText] = React.useState("");
    const [registerText, setRegisterText] = React.useState(<div/>);
    const [accountText, setAccountText] = React.useState("");
    const [accountLink, setAccountLink] = React.useState("");

    const [profileNavigationBlock, setProfileNavigationBlock] = React.useState(<div/>)

    useEffect(() => {
        const initialize = () => {
            if (props.auth.isAuthenticated) {
                setLoginLink('/logout');
                setLoginText('Logout');
                setAccountLink("/profile/" + props.auth.User.id);
                setAccountText("My Account");
                setRegisterText(
                    <div/>
                );
            } else {
                setLoginLink('/login');
                setLoginText('Login');
                setRegisterText(
                    <div>
                        <Nav.Link href='register'>Create an account</Nav.Link>
                    </div>
                );
                setProfileNavigationBlock(<div/>);
            }
        };
        initialize()
    }, [props.auth]);

    return (
        <div>
            <Navbar bg="primary" variant="dark">
                <Navbar.Brand href="/">Fwutter</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    {profileNavigationBlock}
                    <Nav className="">
                        {registerText}
                        <Nav.Link href={accountLink}>{accountText}</Nav.Link>
                        <Nav.Link href={loginLink}>{loginText}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

/**
 * maps redux state to props
 * @param state of the redux
 */
const mapStateToProps = (state: any) => {
    return {
        auth: state.auth
    };
};


export default withRouter(connect(mapStateToProps)(Navigationbar));