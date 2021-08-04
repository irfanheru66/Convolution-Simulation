import React, { useState, useRef } from 'react'
import cv from "@techstark/opencv-js";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import NavigationBar from './NavigationBar'
import '../assets/css/styles.css';
import RenderKernel from './RenderKernel';
import { downloadImageOutput } from '../utils/downloadImage'
import Footer from './Footer';
import { motion } from 'framer-motion';

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

const OtherEffect = (props) => {
    const primaryColor = "#fdaa56";
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
        let M = cv.Mat.eye(3, 3, cv.CV_32FC1);
        if (filter === "Emboss") {
            let inputKernel = [
                -2, -1, 0,
                -1, 1, 1,
                0, 1, 2,
            ]
            cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
            let embos = cv.matFromArray(3, 3, cv.CV_32FC1, inputKernel);
            cv.filter2D(src, dst, -1, embos);
        } else if (filter === "Sephia") {
            let inputKernel = [
                0.272, 0.534, 0.131,
                0.349, 0.686, 0.168,
                0.393, 0.769, 0.189
            ]
            let sephia = cv.matFromArray(3, 3, cv.CV_32FC1, inputKernel);
            cv.filter2D(src, dst, -1, sephia);
        }
        cv.imshow('canvasOutput', dst);
        src.delete();
        dst.delete();
        M.delete();
    }
    let elements = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];

    const handleSelectFilter = (e) => {
        e.preventDefault()
        setFilter(e.target.value)
        if (e.target.value === "Emboss") {
            let X = [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]]
            setKernel([
                { X }
            ])
        } else if (e.target.value === "Sephia") {
            // 0.272,0.534,0.131,
            // 0.349,0.686,0.168,
            // 0.393,0.769,0.189
            let X = [[0.272, 0.534, 0.131], [0.349, 0.686, 0.168,], [0.393, 0.769, 0.189]]
            setKernel([
                { X }
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
                <h1 className="text-center fw-bold" style={{ color: primaryColor }}>Other Effects</h1>
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
                                            <motion.input type="file" id="fileInput" name="file" className="custom-file-input" onChange={(e) => {
                                                setImageSrc(URL.createObjectURL(e.target.files[0]))
                                            }
                                            } whileHover={{ scale: 1.1, x: 15 }}
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
                                <div className="card-header">
                                    Process
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <select name="noise" id="filter" className="form-control" onChange={(e) => handleSelectFilter(e)} required>
                                            <option value="">-Select Filter-</option>
                                            <option value="Emboss">Emboss Filter</option>
                                            <option value="Sephia">Sephia Filter</option>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </motion.div>
    )
}

export default OtherEffect
