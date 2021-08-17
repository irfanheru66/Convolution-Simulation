// libray
import React, { useState, useRef, useMemo } from 'react'
import cv from "@techstark/opencv-js";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion } from 'framer-motion';
import { Tooltip, OverlayTrigger, Nav, Tab } from 'react-bootstrap';
import { useDropzone } from "react-dropzone";

// assets
import '../assets/css/styles.css';

// components
import NavigationBar from './NavigationBar'
import RenderKernel from './RenderKernel';
import Footer from './Footer';

// utils
import { downloadImageOutput } from '../utils/downloadImage'
//import { Tab } from 'bootstrap';

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
const primaryColor = "#fdaa56";
const accentColor = "#ef5241";

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: accentColor
};

const acceptStyle = {
    borderColor: accentColor
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const OtherEffect = (props) => {
    const primaryColor = "#fdaa56";
    const [dropzoneShow, setDropzoneShow] = useState(true)
    const [imageSrc, setImageSrc] = useState("")
    const [kernel, setKernel] = useState([])
    const [filter, setFilter] = useState("")
    const canvasRef = useRef()
    const downloadButtonRef = useRef()
    const { getRootProps, getInputProps, isDragActive,
        isDragAccept,
        isDragReject } = useDropzone({
            accept: 'image/*',
            onDrop: acceptedFiles => {
                setImageSrc(URL.createObjectURL(acceptedFiles[0]))
                setDropzoneShow(false)
                console.log("image source", imageSrc)
            }
        });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

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
                <h1 className="text-title text-center fw-bold" style={{ color: primaryColor }}>Other Effects</h1>
                <div className="row mt-1">
                    <div className="col-lg-8 order-lg-1 order-md-2">
                        <div className="row">
                            <div className="col-lg-12 mb-3">
                                <div className="card">
                                    <div className="card-header">
                                        Input Image
                                    </div>
                                    <div className="card-body">
                                        {(dropzoneShow == false) && <div className="container second-step">
                                            <div {...getRootProps({ style })}>
                                                <div>
                                                    <input {...getInputProps()} />
                                                    <button class="btn btn-primary btn-upload" style={{ maxWidth: 225 + "px" }}><i class="fas fa-upload"></i>
                                                        Upload Image
                                                    </button>
                                                </div>
                                                <div class="mt-2 mb-4 d-none d-md-block">
                                                    or drop a file
                                                </div>
                                            </div>
                                        </div>}
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
                                                    {dropzoneShow &&
                                                        <div className="container second-step">
                                                            <div class="card card-with-shadow card-rounded-max card-without-border upload-widget-card" {...getRootProps({ style })}>
                                                                <div class="card-body text-center">
                                                                    <div class="mt-5 mb-4 d-none d-md-block">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 16" height="16mm" width="22mm"><path d="M.787 6.411l10.012 5.222a.437.437 0 0 0 .402 0l10.01-5.222a.434.434 0 0 0 .186-.585.45.45 0 0 0-.186-.187L11.2.417a.441.441 0 0 0-.404 0L.787 5.639a.439.439 0 0 0-.184.588.453.453 0 0 0 .184.184z" fill="#DDDFE1"></path><path d="M21.21 9.589l-1.655-.864-7.953 4.148a1.31 1.31 0 0 1-1.202 0L2.444 8.725l-1.657.864a.437.437 0 0 0-.184.583.427.427 0 0 0 .184.187l10.012 5.224a.437.437 0 0 0 .402 0l10.01-5.224a.434.434 0 0 0 .186-.586.444.444 0 0 0-.186-.184z" fill="#EDEFF0"></path></svg>
                                                                    </div>
                                                                    <div>
                                                                        <input {...getInputProps()} />
                                                                        <button class="btn btn-primary btn-upload" style={{ maxWidth: 225 + "px" }}><i class="fas fa-upload"></i>
                                                                            Upload Image
                                                                        </button>
                                                                    </div>
                                                                    <div class="mt-2 mb-4 d-none d-md-block">
                                                                        or drop a file
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
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
                                                        <option value="Emboss">Emboss Filter</option>
                                                        <option value="Sephia">Sephia Filter</option>
                                                    </select>
                                                    <div className="row mt-2">
                                                        <RenderKernel filter={filter} kernel={kernel}></RenderKernel>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-5">
                                                        <motion.button className="btn btn-submit btn-primary" onClick={() => props.setModalShow(true)} whileHover={{ scale: 1.1 }}
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

export default OtherEffect
