import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { motion } from 'framer-motion';

import '../assets/css/styles.css';
import videos from '../assets/videos/convolution.mp4'
const WatchModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h2 className="text-center">Convolution Image Animation</h2>
                <video loop autoPlay controls className="w-100">
                    <source src={videos} type="video/mp4" />
                </video>
                <div className="d-flex justify-content-end mt-3">
                    <motion.button class="btn btn-primary" onClick={props.onHide} whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}>Close</motion.button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default WatchModal