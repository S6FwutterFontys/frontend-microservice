import User, {initialUserState} from "../components/profile/Account";

export interface authenticationState{
    User: User,
    isAuthenticated: boolean
}
const initialAuthenticationState={
    User: initialUserState,
    isAuthenticated : false
}

/**
 * reducer for the authentication functions
 * @param state contains an isAuthenticated boolean and a user string
 * @param action type of action to handle
 */
const authReducer = (
    state : authenticationState = initialAuthenticationState,
    action : any) => {
    switch (action.type) {
        //in case of login save the token as user and set authenticated
        case 'LOGIN':
            state = { ...state, ...action.payload };
            break;
        //in case of logout remove the token and unset authenticated
        case 'LOGOUT':
            state = { ...state, isAuthenticated : false, User : initialUserState };
            break;
        default:
            break;
    };
    return state;
};

export default authReducer;