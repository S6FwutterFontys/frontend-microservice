import User from "../components/profile/Account";
import {authenticationState} from "../reducers/AuthReducer";

/**
 * wrapper for the dispatch redux login
 * @param user user to save
 */
export function login(user : User) {
    let state : authenticationState = {
        User: user,
        isAuthenticated: true
    }
    return (dispath: any) => {
        dispath({
            type: 'LOGIN',
            payload: state
        });
    }
}

/**
 * wrapper for the dispatch redux logout
 */
export function logout() {
    return (dispath: any) => {
        dispath({
            type: 'LOGOUT',
            payload: ``
        });
    };
}