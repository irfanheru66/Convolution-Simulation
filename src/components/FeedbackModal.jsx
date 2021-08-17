import React, { useState } from 'react'
import { Modal, Button, Form, Col, Row, } from 'react-bootstrap'
import { Container, Radio, Rating } from "./RatingStyles";
import { FaStar } from "react-icons/fa";

import '../assets/css/styles.css';

const FeedbackModal = (props) => {
    const [rate, setRate] = useState(1)
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h2 className="text-center">Feedback!</h2>
                <p className="fs-4">We would like your opinion to improve our website.</p>
                <p className="fs-4">What is your opinion of this page?</p>
                <Container>
                    {[...Array(5)].map((item, index) => {
                        const givenRating = index + 1;
                        return (
                            <label>
                                <Radio
                                    type="radio"
                                    value={givenRating}
                                    onClick={() => {
                                        setRate(givenRating)
                                    }}
                                />
                                <Rating>
                                    <FaStar
                                        color={
                                            givenRating < rate || givenRating === rate
                                                ? "#ef5241"
                                                : "rgb(192,192,192)"
                                        }
                                    />
                                </Rating>
                            </label>
                        );
                    })}
                </Container>
                <Form>
                    <Form.Group className="mb-3" controlId="formPlaintextPassword">
                        <Form.Label column sm="2">
                            Feedback
                        </Form.Label>
                        <Form.Control as="textarea" placeholder="Leave a comment here" />
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
                <div className="d-flex justify-content-end mt-3">
                    <Button onClick={props.onHide}>Close</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default FeedbackModal