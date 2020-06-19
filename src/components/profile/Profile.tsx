import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import User, {initialUserState} from "./Account";
import config from "../../config.json"
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {Alert, Button, Card, Col, Container, Form, Modal, Row} from "react-bootstrap";
import {ChangePasswordModel} from "./ChangePasswordModel";
import Fweet, {initialFweetState} from "../fweet/Fweet";

const GetUserInformation = async (userId: string): Promise<User> => {
    let options: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        cache: "default"
    };
    try {
        let idRequest: string = "/" + userId;
        let response: Response = await fetch(config["SERVICES"]["ACCOUNT_SERVICE_URL"] + idRequest, options);
        let body = await response.text();
        if (response.status === 200) {
            return JSON.parse(body); //returns type User if backend is consistent.
        } else {
            return initialUserState;
        }
    } catch (Exception) {
        console.log("PROFILE GET REQUEST EXCEPTION: " + Exception);
        return initialUserState;
    }
}

const UpdateUserInformation = async (user: User, token: string): Promise<boolean> => {
    console.log(JSON.stringify(user));
    let options: RequestInit = {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        mode: "cors",
        cache: "default"
    };
    let response: Response = await fetch(config["SERVICES"]["ACCOUNT_SERVICE_URL"] + "/" + user.id, options);
    if (response.status === 200) {
        return true;
    } else {
        let text = await response.text();
        throw new Error(text);
    }
}

const DeleteAccount = async (userId: string, token: string): Promise<boolean> =>{
    let options: RequestInit = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        mode: "cors",
        cache: "default"
    };
    let response: Response = await fetch(config["SERVICES"]["ACCOUNT_SERVICE_URL"] + "/" + userId, options);
    if (response.status === 200) {
        return true;
    } else {
        let text = await response.text();
        throw new Error(text);
    }
}

const ChangePassword = async (userId: string, oldPassword: string, newPassword: string, token: string): Promise<boolean> =>{
    let passwordModel: ChangePasswordModel = {
        OldPassword: oldPassword,
        NewPassword: newPassword
    };
    let options: RequestInit = {
        method: "PUT",
        body: JSON.stringify(passwordModel),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        mode: "cors",
        cache: "default"
    };
    let response: Response = await fetch(config["SERVICES"]["ACCOUNT_SERVICE_URL"] + "/UpdatePassword/" + userId, options);
    if (response.status === 200) {
        return true;
    } else {
        let text = await response.text();
        throw new Error(text);
    }
}

/**
 * Dialogue to show
 * @param props
 * @constructor
 */
const Dialogue = (props: any) => {
    return (
        <Modal
            {...props} aria-labelledby="contained-modal-title-vcenter" centered>

            <Modal.Header
                closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Are you sure you would like to delete your account?</Modal.Title> </Modal.Header>
            <Modal.Body>
                <Button variant="outline-secondary" onClick={props.handleClose}>
                    No
                </Button>
                <Button variant="outline-primary" onClick={props.deleteAccount}>
                    Yes
                </Button>
            </Modal.Body>
        </Modal>);
};

const Profile = (props: any) => {
    //Boolean that indicates if the user is in edit mode or not.
    let editMode: boolean = false;
    const {id} = useParams();
    /**
     * Runs when page loads in and the userId is filled in. will run again when editmode has been changed.
     */

    useEffect(() => {

        initialize(editMode)
        handleLoadUserFweets()
        // eslint-disable-next-line
    }, [editMode]);

    /**
     * User that is currently logged in which is obtained from the react-redux.
     */
    let currentlyLoggedInUser: User = initialUserState;

    /**
     * The id of the profile you want to see, will be filled in with page parameter. >> useParams
     */
    let profileId = "";

    /**
     * user : user which will be displayed, and will be used in edit mode.
     * initialUserState has empty strings, and state false on isDelegate and isdAppOwner
     */
    let profileUser: User = initialUserState;

    //Html block that contains the information to display, or to edit.
    const [profileInformationBlock, setProfileInformationBlock] = React.useState(<div>Loading account data. Please wait...</div>);

    //Html block which contains the enter edit button and save changes from edit.
    const [editButton, setEditButton] = React.useState(<div/>)

    //Html block which contains the fields oldPassword, newPassword, repeatNewPassword.
    const [passwordBlock, setPasswordBlock] = React.useState(<div/>);

    //HTML block which contains an error if need be to display one.
    const [error, setError] = React.useState(<div/>);

    const [successUpdate, setSuccessUpdate] = React.useState(<div/>);
    const [successPasswordUpdate, setSuccessPasswordUpdate] = React.useState(<div/>);

    //HTML Block that lets u get out of the edit mode.
    const [cancelEditButton, setCancelEditButton] = React.useState(<div/>);

    //HTML BLock that lets you delete your account.
    const [deleteAccountButton, setDeleteAccountButton] = React.useState(<div/>);
    const [showModal, setShowModal] = React.useState(false);

    //Fweet Cards
    const [fweetCards, setFweetCards] = React.useState(<></>);

    //const [show, setShow] = React.useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    let changePassword = false; //Boolean which indicates if the user has decided to change to password.
    let oldPassword: string = ""; //String which has the oldPassword
    let newPassword: string = ""; //String which has the newPassword
    let repeatNewPassword: string = ""; //String which has the repeatNewPassword

    let username: string = "";

    /**
     * Method used for loading/reloading the userInformation
     * @param edit which indicates if the profile will be editable or not this boolean also sets the editMode parameter.
     */

    async function initialize(edit: boolean) {
        if (id) {
            profileId = id;
            currentlyLoggedInUser = props.auth.User;
            editMode = edit;
            //check if loggedInUser is the the profile you want to check, then you have the option edit the profile.
            if (currentlyLoggedInUser) {
                if (currentlyLoggedInUser.id === profileId) {
                    profileUser = await GetUserInformation(id);
                    setInformationDisplay(profileUser, true, edit);
                } else {
                    profileUser = await GetUserInformation(id);
                    setInformationDisplay(profileUser, false, edit);
                }
                username = profileUser.username;
            }
        }
    }

    function handleLoadUserFweets(){
        setFweetCards(<div>Loading</div>)

        loadUserFweets(id).then(r => {
            let mappedItems = r.map((item : Fweet) => {
                return (
                    <div>
                        <Card key={item.fweetId}>
                            <Card.Body>
                                <p className="card-text">{item.fweetMessage}</p>
                                <p className="card-text"><small className="text-muted">Written on {new Date(item.timestamp).toLocaleString()}</small></p>
                            </Card.Body>
                        </Card>
                        <br></br>
                    </div>
                )
            })
            setFweetCards(<>{mappedItems} </>)

            //mapJsonToTSX(r.data);

        }).catch((error) =>{
            setError(error.message)
        })
    }

    const loadUserFweets = async (userId: string) => {
        let options: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // mode: "cors",
            // cache: "default"
        };
        let response: Response = await fetch(config["SERVICES"]["FWEET_SERVICE_URL"] + "/User/" + userId, options);
        let data = await response.json();
        if (response.status !== 200)
            throw new Error(JSON.stringify(response));

        let item = {
            id: "",
            content: "",
            dateTime: ""
        }
        return data
    }

    const mapJsonToTSX = (json: Fweet[]) =>{
        let mappedItems = json.map((item, key) => {
            return <div key={item.fweetId}>
                <div className="card" key={item.fweetId} style={{marginTop: '20px'}}>
                    <div className="card-body">
                        <p className="card-text">{item.fweetMessage}</p>
                        <p className="card-text"><small className="text-muted">Written on {new Date(item.timestamp).toLocaleString()}</small></p>
                    </div>
                </div>
            </div>
        })
        setFweetCards(<>{mappedItems} </>)
    }

    /**
     * Method used for saving changes of a profile edit.
     */
    const saveChangesEdit = async () => {
        try {
            let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
            if (!profileUser.email.match(reg)) {
                throw new Error("Email does not match the syntax of an email")
            } else {
                //ignore
            }
            profileUser.username = username;
            if (await UpdateUserInformation(profileUser, props.auth.User.token)) {
                setSuccessUpdate(<Alert variant={"success"} onClick={() => setSuccessUpdate(<div/>)}>Account information
                    successfully updated.</Alert>)
            } else {
                //ignore
            }
            if (changePassword) {
                if (changePassword && oldPassword !== "" && newPassword !== "" && repeatNewPassword !== "") {
                    if (changePassword && newPassword !== repeatNewPassword) {
                        throw new Error("Repeat is not the same as the new password, so the password is not updated");
                    }

                    if (await ChangePassword(profileUser.id, oldPassword, newPassword, props.auth.User.token)) {
                        setSuccessPasswordUpdate(<Alert variant={"success"} onClick={() => setSuccessUpdate(<div/>)}>Password
                            successfully changed.</Alert>)
                    }
                } else {
                    throw new Error("Did you mean to change the password? The fields were empty.")
                }
            } else {
                //ignore
            }
            await initialize(false);
        } catch (ex) {
            setError(<Alert variant={"danger"} onClick={() => setError(<div/>)}>{ex.message}</Alert>)
            return;
        }
    };

    /**
     * Handles the deletion of the account.
     */
    const deleteAccount = async () => {
        if (id) {
            try {
                setShowModal(false)
                await DeleteAccount(id, props.auth.User.token)
                props.history.push("/logout");
            } catch (ex) {
                setError(<Alert variant={"danger"} onClick={() => setError(<div/>)}>{ex.message}</Alert>)
                console.log(JSON.stringify(ex))
                return;
            }
        }
    }

    const onEmailChange = (event: any) => {
        profileUser.email = event.target.value;
    };

    const onChangeOldPassword = (event: any) => {
        oldPassword = event.target.value;
    };

    const onChangeNewPassword = (event: any) => {
        newPassword = event.target.value;
    };

    const onChangeNewRepeatPassword = (event: any) => {
        repeatNewPassword = event.target.value;
    };

    //Method that is used for changing the edit passwordBlock
    const setChangePasswordBlock = (event: any) => {
        changePassword = event.target.checked;
        if (event.target.checked) {
            setPasswordBlock(<Form>
                <Form.Group>
                    <Form.Label>Old password</Form.Label>
                    <Form.Control type="password" placeholder="enter old password" onChange={onChangeOldPassword}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>New password</Form.Label>
                    <Form.Control type="password" placeholder="enter new password" onChange={onChangeNewPassword}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Repeat new password</Form.Label>
                    <Form.Control type="password" placeholder="repeat new password"
                                  onChange={onChangeNewRepeatPassword}/>
                </Form.Group>
            </Form>);
        } else {
            setPasswordBlock(<div/>);
        }
    };

    /**
     * Html Block that is used when just viewing a profile.
     * @param user which contains display information.
     */
    const profileInformationBlockNotEdit = (user: User) => {
        setPasswordBlock(<div/>)
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Username: {user.username}</Form.Label>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email: {user.email}</Form.Label>
                </Form.Group>
            </Form>
        )
    };

    /**
     * Html Block that is used when editing a profile.
     */
    let profileInformationBlockEditMode = () => {
        return (
            <div>
                <form>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" defaultValue={profileUser.email}
                                      onChange={onEmailChange}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Change Password" onChange={setChangePasswordBlock}/>
                    </Form.Group>
                </form>
            </div>
        )
    };

    /**
     * Changes the display of the render to match the userinformation.
     * @param user which contains the information
     * @param edit boolean that checks if edit mode is on or not.
     * @param loggedIn indicates if the information display should contain an edit button.
     */
    const setInformationDisplay = (user: User, loggedIn: boolean, edit: boolean) => {
        //profile block that is variable to edit and non edit mode.
        if (!edit) {
            setProfileInformationBlock(
                profileInformationBlockNotEdit(user)
            );
            setCancelEditButton(<div/>)
        } else {
            setProfileInformationBlock(
                profileInformationBlockEditMode
            );
            setCancelEditButton(<Button variant={"outline-warning"} onClick={() => initialize(false)}>Cancel Edit</Button>);
        }

        //Button that you can use if you are logged to start and save edit.
        if (loggedIn && !edit) { //If logged in but not in edit mode
            setEditButton(<Button variant={"outline-primary"} onClick={() => {
                initialize(true);
            }}>Edit</Button>);
        } else if (edit && loggedIn) {//If logged in and in edit mode
            setEditButton(<Button variant={"outline-primary"} onClick={saveChangesEdit}>Save changes</Button>)

            setDeleteAccountButton(<Button variant={"outline-danger"} onClick={handleShow}> Delete Account</Button>)//setDeleteProfileButtonBlock()

        } else {
            setEditButton(<div/>)
        }
    };
    return (
        <div>
            <Container>
                <br></br>
                <Row className="justify-content-md-center">
                    <Col>
                        <Card style={{ width: '32rem' }}>
                            <Card.Body>
                                {successUpdate}
                                {successPasswordUpdate}
                                {error}
                                {profileInformationBlock}
                                {passwordBlock}
                                {editButton}
                                {cancelEditButton}
                                {deleteAccountButton}
                                <Dialogue show={showModal} deleteAccount={deleteAccount} handleClose={handleClose}
                                          onHide={() => setShowModal(false)}/>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        {fweetCards}
                    </Col>
                </Row>
            </Container>
        </div>
    )
};

/**
 * maps redux state to props
 * @param state of the redux
 */
const mapStateToProps = (state: any) => {
    return {
        auth: state.auth,
        fweets: []
    };
};

export default withRouter(connect(mapStateToProps)(Profile));