// library
import React, { useState, useRef } from 'react'
import cv from "@techstark/opencv-js";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion } from 'framer-motion';
import { Tooltip, OverlayTrigger, Nav, Tab } from 'react-bootstrap';

// assets
import '../assets/css/styles.css';

// components
import NavigationBar from './NavigationBar'
import RenderKernel from './RenderKernel';
import Footer from './Footer';

// utils
import { array2DFlatten } from '../utils/arrayFlat';
import { downloadImageOutput } from '../utils/downloadImage'


const containerVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            type: 'spring',
            delay: 0.3,
            when: "beforeChildren",
            staggerChildren: 0.4
        }
    }
}

const EdgeDetection = (props) => {
    const primaryColor = "#fdaa56";
    const accentColor = "#ef5241";
    const [imageSrc, setImageSrc] = useState("")
    const [kernel, setKernel] = useState([])
    const [filter, setFilter] = useState("")
    const canvasRef = useRef()
    const downloadButtonRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault()
        // if (!imageSrc) {
        //     return;
        // }
        let src = cv.imread('imageSrc');
        let dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        let M = cv.Mat.eye(3, 3, cv.CV_32FC1);
        if (filter === "Canny") {
            cv.Canny(src, dst, 50, 100, 3, false);
            //console.log("Canny")
        } else if (filter === "Sobel") {
            let dstx = new cv.Mat();
            let dsty = new cv.Mat();
            cv.Sobel(src, dstx, cv.CV_64F, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
            cv.Sobel(src, dsty, cv.CV_64F, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
            //console.log("Mean")
            cv.convertScaleAbs(dstx, dstx);
            cv.convertScaleAbs(dsty, dsty);
            cv.addWeighted(dstx, 0.5, dsty, 0.5, 0, dst);
        } else if (filter === "Prewitt") {
            let X = array2DFlatten([[1, 0, -1], [1, 0, -1], [1, 0, -1]])
            let Y = array2DFlatten([[1, 1, 1], [0, 0, 0], [-1, -1, -1]])
            let dstx = new cv.Mat();
            let dsty = new cv.Mat();
            let prewittX = cv.matFromArray(3, 3, cv.CV_32FC1, X);
            let prewittY = cv.matFromArray(3, 3, cv.CV_32FC1, Y);
            //console.log("Mean")
            cv.filter2D(src, dstx, -1, prewittX);
            cv.filter2D(src, dsty, -1, prewittY);
            cv.convertScaleAbs(dstx, dstx);
            cv.convertScaleAbs(dsty, dsty);
            cv.addWeighted(dstx, 0.5, dsty, 0.5, 0, dst);
        } else if (filter === "Laplacian") {
            cv.Laplacian(src, dst, cv.CV_8U, 1);
        } else if (filter === "Scharr") {
            let dstx = new cv.Mat();
            let dsty = new cv.Mat();
            cv.Scharr(src, dstx, cv.CV_8U, 1, 0, 1, 0, cv.BORDER_DEFAULT);
            cv.Scharr(src, dsty, cv.CV_8U, 0, 1, 1, 0, cv.BORDER_DEFAULT);
            cv.convertScaleAbs(dstx, dstx);
            cv.convertScaleAbs(dsty, dsty);
            cv.addWeighted(dstx, 0.5, dsty, 0.5, 0, dst);
        }
        cv.imshow('canvasOutput', dst);
        src.delete();
        dst.delete();
        M.delete();
    }

    const handleSelectFilter = (e) => {
        e.preventDefault()
        setFilter(e.target.value)
        if (e.target.value === "Canny") {
            let X = [[-1, 0, 1], [-2, 0, -2], [-1, 0, 1]]
            let Y = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]
            setKernel([
                { X }, { Y }
            ])
        } else if (e.target.value === "Sobel") {
            let X = [[-1, 0, 1], [-2, 0, -2], [-1, 0, 1]]
            let Y = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]
            setKernel([
                { X }, { Y }
            ])
        } else if (e.target.value === "Prewitt") {
            let X = [[1, 0, -1], [1, 0, -1], [1, 0, -1]]
            let Y = [[1, 1, 1], [0, 0, 0], [-1, -1, -1]]
            setKernel([
                { X }, { Y }
            ])
        } else if (e.target.value === "Laplacian") {
            let X = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]]
            setKernel([
                { X }
            ])
        } else if (e.target.value === "Scharr") {
            let X = [[3, 0, -3], [10, 0, -10], [3, 0, -3]]
            let Y = [[3, 10, 3], [0, 0, 0], [-3, -10, -3]]
            setKernel([
                { X }, { Y }
            ])
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <NavigationBar setModalFeedbackShow={props.setModalFeedbackShow}></NavigationBar>
            <div className="container-fluid mt-3">
                <h1 className="text-center fw-bold" style={{ color: primaryColor }}>Edge Detection</h1>
                <div className="row mt-1">
                    <div className="col-lg-8 order-lg-1 order-md-2">
                        <div className="row">
                            <div className="col-lg-12 mb-3">
                                <div className="card">
                                    <div className="card-header">
                                        Input Image
                                    </div>
                                    <div className="card-body">
                                        <form action="">
                                            <motion.input type="file" id="fileInput" name="file" className="custom-file-input" accept="image/png, image/jpeg" onChange={(e) => setImageSrc(URL.createObjectURL(e.target.files[0]))} whileHover={{ scale: 1.1, x: 15 }}
                                                whileTap={{ scale: 0.95 }} />
                                        </form>
                                        <TransformWrapper
                                            initialScale={1}
                                        >
                                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                                <React.Fragment>
                                                    <div className="icon">
                                                        <i className="bi bi-zoom-in" onClick={() => zoomIn()}></i>
                                                        <i className="bi bi-zoom-out" onClick={() => zoomOut()}></i>
                                                        <i className="bi bi-aspect-ratio" onClick={() => resetTransform()}></i>
                                                    </div>
                                                    <TransformComponent>
                                                        <div className="image">
                                                            <img id="imageSrc" className="img-fluid" src={imageSrc} alt="" />
                                                        </div>
                                                    </TransformComponent>
                                                </React.Fragment>
                                            )}
                                        </TransformWrapper>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 mb-3">
                                <div className="card">
                                    <div className="card-header">
                                        Output Image
                                    </div>
                                    <div className="card-body">
                                        <TransformWrapper
                                            initialScale={1}
                                        >
                                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                                <React.Fragment>
                                                    <div className="icon">
                                                        <i className="bi bi-zoom-in" onClick={() => zoomIn()}></i>
                                                        <i className="bi bi-zoom-out" onClick={() => zoomOut()}></i>
                                                        <i className="bi bi-aspect-ratio" onClick={() => resetTransform()}></i>
                                                        <a download="coverted.png" ref={downloadButtonRef} className="bi bi-cloud-download" onClick={() => downloadImageOutput(canvasRef, downloadButtonRef)}></a>
                                                    </div>
                                                    <TransformComponent>
                                                        <canvas id="canvasOutput" ref={canvasRef} className="img-fluid image"></canvas>
                                                    </TransformComponent>
                                                </React.Fragment>
                                            )}
                                        </TransformWrapper>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="col-lg-4 order-lg-2 order-md-1 mb-3">
                        <div className="sticky-top" style={{ top: 15 + 'px', zIndex: 999 }}>
                            <div className="card">
                                <Tab.Container defaultActiveKey="process">
                                    <div className="card-header">
                                        <Nav variant="pills" >

                                            <Nav.Item>
                                                <Nav.Link eventKey="process">Process</Nav.Link>
                                            </Nav.Item>

                                            <Nav.Item>
                                                <Nav.Link eventKey="documentation">Documentation</Nav.Link>
                                            </Nav.Item>

                                        </Nav>
                                    </div>
                                    <div className="card-body">
                                        <Tab.Content>
                                            <Tab.Pane eventKey="process">
                                                <form onSubmit={handleSubmit}>
                                                    <select name="noise" id="filter" className="form-control" onChange={(e) => handleSelectFilter(e)} required>
                                                        <option value="">-Select Filter-</option>
                                                        <option value="Canny">Canny Edge Detection</option>
                                                        <option value="Sobel">Sobel Edge Detection</option>
                                                        <option value="Prewitt">Prewitt Edge Detection</option>
                                                        <option value="Scharr">Scharr Edge Detection</option>
                                                        <option value="Laplacian">Laplacian Filter</option>
                                                    </select>
                                                    <div className="row mt-2">
                                                        <RenderKernel filter={filter} kernel={kernel}></RenderKernel>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-5">
                                                        <motion.button className="btn btn-submit px-5 btn-primary" onClick={() => props.setModalShow(true)} whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}>Watch How It Works </motion.button>
                                                        <motion.button className="btn btn-submit px-5 btn-primary" id="apply" type="submit" whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}>Apply</motion.button>
                                                    </div>
                                                </form>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="documentation">
                                                <h5 className="text-white">List of Documentation</h5>
                                                <ul className="reset-style custom-style-base custom-style-hover-type-arrow custom-style-hover-animate cursor-pointer">
                                                    <li>
                                                        <a href="https://online.flipbuilder.com/ogbjq/syfe/" target="_blank">Pengenalan Pengolahan Citra Digital</a>
                                                    </li>
                                                    <li>
                                                        <a href="https://online.flipbuilder.com/ogbjq/tcom/" target="_blank">Pengantar Konvolusi</a>
                                                    </li>
                                                    <li>
                                                        <a href="https://online.flipbuilder.com/ogbjq/vuik/" target="_blank">Cara kerja konvolusi</a>
                                                    </li>
                                                    <li>
                                                        <a href="https://online.flipbuilder.com/ogbjq/uyfj/index.html" target="_blank">Kernel Filter</a>
                                                    </li>
                                                </ul>
                                            </Tab.Pane>
                                        </Tab.Content>

                                    </div>
                                </Tab.Container>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </motion.div >
    )
}

export default EdgeDetection
