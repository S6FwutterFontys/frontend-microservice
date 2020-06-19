import User from "../profile/Account";

export default interface Fweet{
    fweetId: string,
    userId: string
    username: string,
    fweetMessage: string,
    timestamp: string
};

export const initialFweetState : Fweet ={
    userId: "",
    fweetId : "",
    username : "",
    fweetMessage : "",
    timestamp : ""
};