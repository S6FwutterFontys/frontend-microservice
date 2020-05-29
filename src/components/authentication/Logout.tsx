import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import {logout} from '../../actions/AuthenticateActions';

/**
 * renders the logout component
 * @param props auth state from redux
 * @constructor
 */
const Logout = (props : any) => {
    //redirects the user to the main page and logs him out
    props.logout()
    props.auth.isAuthenticated = false;
    return (
        <Redirect to={{
            pathname: '/'
        }}/>
    );
}

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
        logout: () => {
            dispatch(logout());
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logout));