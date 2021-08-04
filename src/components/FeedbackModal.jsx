import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import '../assets/css/styles.css';
import videos from '../assets/videos/convolution.mp4'

const FeedbackModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h2 className="text-center">Feedback!</h2>
                <input type="text" name="" id="" className="form-control" />
                <div className="d-flex justify-content-end mt-3">
                    <Button onClick={props.onHide}>Close</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default FeedbackModal