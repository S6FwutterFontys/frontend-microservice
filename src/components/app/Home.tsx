import React from 'react';
import {Container, Card, Row} from "react-bootstrap";
import Emoji from "./Emoji";

/***
 * renders the home component
 * @constructor
 */
const Home = () => (
    <div>
        <br></br>
        <Container>
            <Row className="justify-content-md-center">
                <Card style={{ width: '36rem' }}>
                    <Card.Body>
                        <Card.Title>Fweet placeholder 1</Card.Title>
                        <Card.Subtitle className="mb-6 text-muted">Username placeholder</Card.Subtitle>
                        <hr></hr>
                        <Card.Text>
                            This will be the place where Fweets messages will be displaced.
                        </Card.Text>
                        <Card.Link href="#">Follow User</Card.Link>

                        <Card.Link href="#"><Emoji label="heart" symbol="❤"/>(6)</Card.Link>
                    </Card.Body>
                </Card>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Card style={{ width: '36rem' }}>
                    <Card.Body>
                        <Card.Title>Fweet placeholder 2</Card.Title>
                        <Card.Subtitle className="mb-6 text-muted">Username placeholder</Card.Subtitle>
                        <hr></hr>
                        <Card.Text>
                            This will be the place where Fweets messages will be displaced.
                        </Card.Text>
                        <Card.Link href="#">Follow User</Card.Link>

                        <Card.Link href="#"><Emoji label="heart" symbol="❤"/>(12)</Card.Link>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    </div>
);

export default Home