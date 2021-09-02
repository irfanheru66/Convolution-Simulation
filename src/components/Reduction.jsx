// library
import React, { useState, useEffect, useRef, useMemo } from 'react'
import cv from "@techstark/opencv-js";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { v4 as uuidV4 } from "uuid";
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { Tooltip, OverlayTrigger, Nav, Tab } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useDropzone } from "react-dropzone";

// assets
import '../assets/css/styles.css';

// Components
import NavigationBar from './NavigationBar'
import Footer from './Footer';

// Utilities
import { arrayObjectFlatten } from '../utils/arrayFlat';
import { downloadImageOutput } from '../utils/downloadImage'

const steps = [
    {
        selector: '.first-step',
        content: 'This section shows the filter type or name.',
    },
    {
        selector: '.second-step',
        content: 'Select an image from the computer.',
    },
    {
        selector: '.third-step',
        content: 'This section contains features to zoom in, zoom out, and scale using the mouse or touchpad.',
    },
    {
        selector: '.fourth-step',
        content: 'Next, select the type of kernel or filter to use.',
    },
    {
        selector: '.fifth-step',
        content: 'Kernel size can be changed according to available options.',
    },
    {
        selector: '.sixth-step',
        content: 'Click apply and the image results will appear.',
    },
    {
        selector: '.seventh-step',
        content: 'This section is for displaying the result image',
    },
];
const primaryColor = "#fdaa56";
const accentColor = "#ef5241";

const containerVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            type: 'spring',
            delay: 0.5,
            when: "beforeChildren",
            staggerChildren: 0.4
        }
    }
}
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

const Reduction = (props) => {

    const [imageSrc, setImageSrc] = useState("")
    const [dropzoneShow, setDropzoneShow] = useState(true)
    const [kernelSize, setKernelSize] = useState(3)
    const [errorMessage, setErrorMessage] = useState('');
    const [totalCoeff, setTotalCoeff] = useState(0)
    const [kernel, setKernel] = useState([])
    const [kernelRender, setKernelRender] = useState([])
    const [kernelCustom, setKernelCustom] = useState([])
    const [filter, setFilter] = useState("")
    const [direction, setDirection] = useState(null)
    const canvasRef = useRef()
    const downloadButtonRef = useRef()
    const [isTourOpen, setIsTourOpen] = useState(false);

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


    const disableBody = target => disableBodyScroll(target);
    const enableBody = target => enableBodyScroll(target);

    const handleSubmit = (e) => {
        e.preventDefault()
        let src = cv.imread('imageSrc');
        let dst = new cv.Mat();
        let M = cv.Mat.eye(3, 3, cv.CV_32FC1);

        let ksize = new cv.Size(parseInt(kernelSize), parseInt(kernelSize))
        if (filter === "Gaussian") {
            cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
        } else if (filter === "Mean") {
            cv.blur(src, dst, ksize, new cv.Point(-1, -1), cv.BORDER_DEFAULT)
        }
        else if (filter === "Motion") {
            let arrayKernel = kernel.flat()
            let gray = new cv.Mat()
            cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY, 0);
            let inputKernel = cv.matFromArray(9, 9, cv.CV_32FC1, arrayKernel)
            cv.filter2D(gray, dst, -1, inputKernel);
        }
        else if (filter === "Custom") {
            let arrayKernel = arrayObjectFlatten(kernelCustom)
            let sumKernel = arrayKernel.reduce(function (total, value) {
                return parseFloat(total) + parseFloat(value);
            }, 0);
            setTotalCoeff(sumKernel)
            if (parseFloat(sumKernel) > 1) {
                setErrorMessage("Maximum Total Coefficient of kernel is 1")
            } else if (parseFloat(sumKernel) <= 1) {
                setErrorMessage("")
            }
            let inputKernel = cv.matFromArray(parseInt(kernelSize), parseInt(kernelSize), cv.CV_32FC1, arrayKernel)
            let anchor = new cv.Point(-1, -1);
            cv.filter2D(src, dst, cv.CV_8U, inputKernel, anchor, 0, cv.BORDER_DEFAULT);

        }
        cv.imshow('canvasOutput', dst);
        src.delete();
        dst.delete();
        M.delete();
    }

    const handleDirection = (e) => {
        setDirection(e.target.value)
        if (e.target.value === "Diagonal") {
            setKernel([
                [0.1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0.1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0.1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0.1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0.1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0.1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0.1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0.1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0.1],
            ])
        } else if (e.target.value === "Horizontal") {
            setKernel([
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ])
        } else if (e.target.value === "Vertical") {
            setKernel([
                [0, 0, 0, 0, 0.1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0.1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0.1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0.1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0.1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0.1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0.1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0.1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0.1, 0, 0, 0, 0],
            ])
        }
        setKernelRender([
            { X: kernel }
        ])
    }

    useEffect(() => {
        let kernel = [];

        for (let i = 0; i < kernelSize; i++) {
            kernel.push({
                id: uuidV4(),
                value: []
            });
            for (let j = 0; j < kernelSize; j++) {
                kernel[i].value.push({
                    id: uuidV4(),
                    value: 0.111
                });
            }
        }
        setKernelCustom(kernel);
        const arrayKernel = arrayObjectFlatten(kernel)
        const total = arrayKernel.flat().reduce(function (total, value) {
            return parseFloat(total) + parseFloat(value);
        }, 0)
        if (total > 1) {
            setErrorMessage("Maximum Total Coefficient of kernel is 1")
        } else {
            setErrorMessage("")
        }
        setTotalCoeff(total)
    }, [kernelSize]);

    const handleKernel = (e) => {
        setKernelSize(e.target.value);
    };

    const updateKernel = (index, index2) => (e) => {
        setKernelCustom((kernel) =>
            kernel.map((outerEl, i1) =>
                i1 === index
                    ? {
                        ...outerEl,
                        value: outerEl.value.map((innerEl, i2) =>
                            i2 === index2
                                ? {
                                    ...innerEl,
                                    value: e.target.value
                                }
                                : innerEl
                        )
                    }
                    : outerEl
            )
        );
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <NavigationBar setModalFeedbackShow={props.setModalFeedbackShow}></NavigationBar>
            <div className="container-fluid mt-3">
                <motion.h1 className="text-title text-center fw-bold first-step"
                    style={{ color: primaryColor }}>
                    Reduction Noise
                </motion.h1>
                <div className="row mt-1">
                    <div className="col-lg-8 order-lg-1 order-md-2 order-sm-2 order-xs-2">
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
                                                    <div className="icon third-step mt-3">
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 150, hide: 200 }}
                                                            overlay={
                                                                <Tooltip>
                                                                    Zoom In
                                                                </Tooltip>}
                                                        >
                                                            <i className="bi bi-zoom-in" onClick={() => zoomIn()}></i>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 150, hide: 200 }}
                                                            overlay={
                                                                <Tooltip>
                                                                    Zoom Out
                                                                </Tooltip>}
                                                        >
                                                            <i className="bi bi-zoom-out" onClick={() => zoomOut()}></i>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 150, hide: 200 }}
                                                            overlay={
                                                                <Tooltip>
                                                                    Reset Aspect Ratio
                                                                </Tooltip>}
                                                        >
                                                            <i className="bi bi-aspect-ratio" onClick={() => resetTransform()}></i>
                                                        </OverlayTrigger>
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
                            <div className="col-lg-12 seventh-step mb-3">
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
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 150, hide: 200 }}
                                                            overlay={
                                                                <Tooltip>
                                                                    Zoom In
                                                                </Tooltip>}
                                                        >
                                                            <i className="bi bi-zoom-in" onClick={() => zoomIn()}></i>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 150, hide: 200 }}
                                                            overlay={
                                                                <Tooltip>
                                                                    Zoom Out
                                                                </Tooltip>}
                                                        >
                                                            <i className="bi bi-zoom-out" onClick={() => zoomOut()}></i>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 150, hide: 200 }}
                                                            overlay={
                                                                <Tooltip>
                                                                    Reset Aspect Ratio
                                                                </Tooltip>}
                                                        >
                                                            <i className="bi bi-aspect-ratio" onClick={() => resetTransform()}></i>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 150, hide: 200 }}
                                                            overlay={
                                                                <Tooltip>
                                                                    Download Image
                                                                </Tooltip>}
                                                        >
                                                            <a download="coverted.png" ref={downloadButtonRef} className="bi bi-cloud-download" onClick={() => downloadImageOutput(canvasRef, downloadButtonRef)}></a>
                                                        </OverlayTrigger>
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
                    <div className="col-lg-4 order-lg-2 order-md-1">
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
                                                    <select name="noise" id="filter" className="form-control fourth-step" onChange={(e) => {
                                                        setDirection(null)
                                                        setErrorMessage("")
                                                        setFilter(e.target.value)
                                                    }} required>
                                                        <option value="">-Select Filter-</option>
                                                        <option value="Gaussian">Gaussian Filter</option>
                                                        <option value="Mean">Mean Filter</option>
                                                        <option value="Motion">Motion Blur Filter</option>
                                                        <option value="Custom">Custom Filter</option>
                                                    </select>
                                                    <div className="form-group">
                                                        <label for="" className="mt-3">{filter !== "Motion" ? `Kernel Size` : `Direction`} </label>
                                                        <div className="d-flex fifth-step">
                                                            {filter !== "Motion" && <div className="kernel">
                                                                <span id="demo">{`${kernelSize}x${kernelSize}`}</span>
                                                            </div>}
                                                            <div className="w-100 ps-2 mt-2">
                                                                {filter !== "Motion" ? <input type="range" step="2" name="range" min="3" max="7" value={kernelSize} className="slider " onChange={(e) => handleKernel(e)} /> :
                                                                    <select name="type" id="direction" className="form-control" onChange={(e) => {
                                                                        handleDirection(e)
                                                                    }} required>
                                                                        <option value="">-Select Direction-</option>
                                                                        <option value="Vertical">Vertical</option>
                                                                        <option value="Horizontal">Horizontal</option>
                                                                        <option value="Diagonal">Diagonal</option>
                                                                    </select>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {filter === "Custom" && kernelCustom.map((row, index) => {
                                                        return (
                                                            <div className="row-custom mt-3" key={row.id}>
                                                                {row.value.map(({ id, value }, index_2) => {
                                                                    return (
                                                                        <span className="input-wrap" key={id}>
                                                                            <input
                                                                                type="number"
                                                                                className="form-control"
                                                                                value={value}
                                                                                onChange={updateKernel(index, index_2)}
                                                                            />
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    })}

                                                    {filter === "Custom" && (
                                                        <div>
                                                            <p className="text-white fs-5">Total Coefficient Kernel : <b className="text-dark">{totalCoeff.toFixed(5)}</b></p>
                                                        </div>
                                                    )}

                                                    {direction !== null &&
                                                        <div className="col-lg-12">
                                                            <div className="row">
                                                                <p className="kernel-text">{`Kernel`}</p>
                                                                {kernel.map((value, index) => {
                                                                    return (
                                                                        <div className="d-flex mb-1">
                                                                            {
                                                                                value.map((value_2, index_2) => {
                                                                                    return (
                                                                                        <div className="bg-white mx-1 d-table" style={{ minWidth: '32px' }}>
                                                                                            <p className="text-center fw-bold d-table-cell align-middle">
                                                                                                {value_2}
                                                                                            </p>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    }

                                                    {errorMessage && filter === "Custom" && (
                                                        <p className="text-danger fw-bold fs-5"> {errorMessage} </p>
                                                    )}
                                                    <div className="d-flex justify-content-between mt-5 sixth-step">
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
                            <div className="d-flex justify-content-center my-3">
                                <motion.button className="btn fw-500 btn-lg btn-primary d-none d-lg-block d-xl-block" onClick={() => setIsTourOpen(true)} whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}>
                                    Open Tour Guide
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tour
                steps={steps}
                isOpen={isTourOpen}
                onRequestClose={() => setIsTourOpen(false)}
                accentColor={accentColor}
                onAfterOpen={disableBody}
                onBeforeClose={enableBody}
            />
            <Footer></Footer>
        </motion.div >
    )
}

export default Reduction
