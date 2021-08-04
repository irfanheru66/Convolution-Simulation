import React, { useState, useEffect, useRef } from 'react'
// import cv from "@techstark/opencv-js";
import NavigationBar from './NavigationBar'
import '../assets/css/styles.css';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { v4 as uuidV4 } from "uuid";
import axios from "axios";
import RenderKernel from './RenderKernel';
import Footer from './Footer';
import { arrayObjectFlatten } from '../utils/arrayFlat';
import { motion } from 'framer-motion';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)

        fileReader.onload = () => {
            resolve(fileReader.result.substr(fileReader.result.indexOf(',') + 1))
        }

        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}

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

const Sharpening = (props) => {
    const primaryColor = "#fdaa56";
    const [imageSrc, setImageSrc] = useState(null)
    const [imageDst, setImageDst] = useState(null)
    const [errorMessage, setErrorMessage] = useState('');
    const [kernelSize, setKernelSize] = useState(3)
    const [totalCoeff, setTotalCoeff] = useState(0)
    const [kernel, setKernel] = useState([])
    const [kernelRender, setKernelRender] = useState([])
    const [filter, setFilter] = useState("")
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
                setErrorMessage("Sum of kernel must be 0 or 1!")
            } else {
                setErrorMessage("")
                let image = await convertBase64(imageSrc)
                let type = filter
                let kernel = arrayKernel
                axios.post("/api/high-pass/", { image, type, kernel }).then((res) => {
                    setImageDst(res.data.data)
                }).catch((err) => console.log(err))
            }
        } else {
            let image = await convertBase64(imageSrc)
            let type = filter
            axios.post("/api/high-pass/", { image, type }).then((res) => {
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
            setErrorMessage("Sum of kernel must be 0 or 1!")
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
                <h1 className="text-center fw-bold" style={{ color: primaryColor }}>Sharpening</h1>
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
                                            <motion.input type="file" id="fileInput" name="file" className="custom-file-input" onChange={(e) => setImageSrc(e.target.files[0])} whileHover={{ scale: 1.1, x: 15 }}
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
                                                            <img id="imageSrc" className="img-fluid" src={imageSrc != null ? URL.createObjectURL(imageSrc) : ''} alt="" />
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
                                <div className="card-header">
                                    Process
                                </div>
                                <div className="card-body">
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
                                            <label for="">Kernel Size</label>
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
                                        {errorMessage && filter === "Custom" && (
                                            <p className="text-danger fw-bold fs-5"> {errorMessage} </p>
                                        )}
                                        {filter === "Custom" && (
                                            <div>
                                                <p className="text-white fs-5">Total Coefficient Kernel : <b className="text-dark">{totalCoeff.toFixed(1)}</b></p>
                                            </div>
                                        )}
                                        {filter !== "Custom" &&
                                            <RenderKernel kernel={kernelRender}></RenderKernel>
                                        }
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

export default Sharpening
