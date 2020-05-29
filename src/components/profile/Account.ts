export default interface User{
    id: string,
    email : string,
    username: string,
    token: string
};

export const initialUserState : User ={
    id : "",
    email : "",
    username : "",
    token : ""
};