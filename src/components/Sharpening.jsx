//library
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion } from 'framer-motion';
import { v4 as uuidV4 } from "uuid";
import axios from "axios";
import { Tooltip, OverlayTrigger, Nav, Tab } from 'react-bootstrap';
// import cv from "@techstark/opencv-js";
import { useDropzone } from "react-dropzone";

// assets
import '../assets/css/styles.css';

// components
import NavigationBar from './NavigationBar'
import RenderKernel from './RenderKernel';
import Footer from './Footer';

// utils
import { arrayObjectFlatten } from '../utils/arrayFlat';
import convertBase64 from '../utils/convertBase64';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

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

const Sharpening = (props) => {
    const primaryColor = "#fdaa56";
    const [dropzoneShow, setDropzoneShow] = useState(true)
    const [imageSrc, setImageSrc] = useState(null)
    const [imageDst, setImageDst] = useState(null)
    const [errorMessage, setErrorMessage] = useState('');
    const [kernelSize, setKernelSize] = useState(3)
    const [totalCoeff, setTotalCoeff] = useState(0)
    const [kernel, setKernel] = useState([])
    const [kernelRender, setKernelRender] = useState([])
    const [filter, setFilter] = useState("")
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

    const outputImageRef = useRef()
    const downloadButtonRef = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (filter === "Custom") {
            let arrayKernel = kernel.map(e => e.value.map(f => f.value));
            let sumKernel = arrayKernel.flat().reduce(function (total, value) {
                return parseInt(total) + parseInt(value);
            }, 0)
            setTotalCoeff(sumKernel)
            if (parseInt(sumKernel) != 0 && parseInt(sumKernel) != 1) {
                setErrorMessage("Coefficient of kernel must be 0 or 1!")
            } else {
                setErrorMessage("")
                let image = await convertBase64(imageSrc)
                let type = filter
                let kernel = arrayKernel
                axios.post("https://convolution-api.herokuapp.com/api/high-pass/", { image, type, kernel }).then((res) => {
                    setImageDst(res.data.data)
                }).catch((err) => console.log(err))
            }
        } else {
            let image = await convertBase64(imageSrc)
            let type = filter
            axios.post("https://convolution-api.herokuapp.com/api/high-pass/", { image, type }).then((res) => {
                setImageDst(res.data.data)
            }).catch((err) => console.log(err));
        }

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
                    value: 1
                });
            }
        }
        setKernel(kernel);
        const arrayKernel = arrayObjectFlatten(kernel)
        const total = arrayKernel.flat().reduce(function (total, value) {
            return parseFloat(total) + parseFloat(value);
        }, 0)
        if (total > 1) {
            setErrorMessage("Total Coefficient of kernel must be 0 or 1!")
        } else {
            setErrorMessage("")
        }
        setTotalCoeff(total)
    }, [kernelSize]);

    const handleSelectFilter = (e) => {
        e.preventDefault()
        setFilter(e.target.value)
        if (e.target.value === "Kernel 1") {
            let X = [[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]]
            setKernelRender([
                { X }
            ])
        } else if (e.target.value === "Kernel 2") {
            let X = [[0, -1, 0], [-1, 8, -1], [0, -1, 0]]
            setKernelRender([
                { X }
            ])
        } else if (e.target.value === "Kernel 3") {
            let X = [[1, -2, 1], [-2, 5, -2], [1, -2, 1]]
            setKernelRender([
                { X }
            ])
        }
        setErrorMessage("")
    }

    const handleKernel = (e) => {
        setKernelSize(e.target.value);
        setErrorMessage("")
    };

    const updateKernel = (index, index2) => (e) => {
        setKernel((kernel) =>
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
                <h1 className="text-title text-center fw-bold" style={{ color: primaryColor }}>Sharpening</h1>
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
                                                        <a download="coverted.png" ref={downloadButtonRef} className="bi bi-cloud-download" onClick={() => {
                                                            downloadButtonRef.current.href = `data:image/png;base64,${imageDst}`
                                                            // downloadImageOutput(outputImageRef, downloadButtonRef)
                                                        }}></a>
                                                    </div>
                                                    <TransformComponent>
                                                        <img src={imageDst != null ? `data:image/png;base64,${imageDst}` : ''} className="img-fluid" style={{ minHeight: 150 + 'px' }} ref={outputImageRef} alt="" />
                                                        {/* <canvas id="canvasOutput" ref={outputImageRef} className="img-fluid image"></canvas> */}
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
                                                    <select name="noise" id="filter" className="form-control" onChange={(e) => { handleSelectFilter(e) }} required>
                                                        <option value="">-Select Filter-</option>
                                                        <option value="Laplace">Laplace</option>
                                                        <option value="Kernel 1">Kernel 1</option>
                                                        <option value="Kernel 2">Kernel 2</option>
                                                        <option value="Kernel 3">Kernel 3</option>
                                                        <option value="Custom">Custom Filter</option>
                                                    </select>
                                                    {filter === "Custom" && <div className="form-group">
                                                        <label for="" className="mt-3">Kernel Size</label>
                                                        <div className="d-flex">
                                                            <div className="kernel">
                                                                <span id="demo">{`${kernelSize}x${kernelSize}`}</span>
                                                            </div>
                                                            <div className="w-100 ps-2 mt-2">
                                                                <input type="range" step="2" name="range" min="3" max="7" value={kernelSize} className="slider" onChange={(e) => handleKernel(e)} />
                                                            </div>
                                                        </div>
                                                    </div>}
                                                    {filter === "Custom" && kernel.map((row, index) => {
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
                                                            <p className="text-white fs-5">Total Coefficient Kernel : <b className="text-dark">{totalCoeff.toFixed(1)}</b></p>
                                                        </div>
                                                    )}
                                                    {errorMessage && filter === "Custom" && (
                                                        <p className="text-danger fw-bold fs-5"> {errorMessage} </p>
                                                    )}
                                                    {filter !== "Custom" &&
                                                        <RenderKernel kernel={kernelRender}></RenderKernel>
                                                    }
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

export default Sharpening
