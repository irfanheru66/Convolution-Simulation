import React, { useState, useEffect, useRef } from 'react'
import cv from "@techstark/opencv-js";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { v4 as uuidV4 } from "uuid";
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import NavigationBar from './NavigationBar'
import '../assets/css/styles.css';
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

const Reduction = () => {
    const primaryColor = "#fdaa56";
    const accentColor = "#ef5241";
    const [imageSrc, setImageSrc] = useState("")
    const [kernelSize, setKernelSize] = useState(3)
    const [errorMessage, setErrorMessage] = useState('');
    const [kernel, setKernel] = useState([])
    const [kernelRender, setKernelRender] = useState([])
    const [kernelCustom, setKernelCustom] = useState([])
    const [filter, setFilter] = useState("")
    const [direction, setDirection] = useState(null)
    const canvasRef = useRef()
    const downloadButtonRef = useRef()
    const [isTourOpen, setIsTourOpen] = useState(false);

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
            // console.log(arrayObjectFlatten(kernel))
            let arrayKernel = arrayObjectFlatten(kernelCustom)
            let sumKernel = arrayKernel.reduce(function (total, value) {
                return parseFloat(total) + parseFloat(value);
            }, 0);
            console.log(sumKernel)
            if (parseFloat(sumKernel) > 1) {
                setErrorMessage("Maximum number of kernel coefficients 1")
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
        <div>
            <NavigationBar></NavigationBar>
            <div className="container-fluid mt-3">
                <h1 className="text-center fw-bold first-step" style={{ color: primaryColor }}>Reduction/Smoothing</h1>
                <div className="row mt-1">
                    <div className="col-lg-8 order-lg-1 order-md-2 order-sm-2 order-xs-2">
                        <div className="row">
                            <div className="col-lg-12 mb-3">
                                <div className="card">
                                    <div className="card-header">
                                        Input Image
                                    </div>
                                    <div className="card-body">
                                        <form action="">
                                            <input type="file" id="fileInput" name="file" className="second-step custom-file-input" onChange={(e) =>
                                                setImageSrc(URL.createObjectURL(e.target.files[0]))} />
                                        </form>

                                        <TransformWrapper
                                            initialScale={1}
                                        >
                                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                                <React.Fragment>
                                                    <div className="icon third-step">
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
                                <div className="card seventh-step">
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
                    <div className="col-lg-4 order-lg-2 order-md-1">
                        <div className="sticky-top" style={{ top: 15 + 'px', zIndex: 999 }}>
                            <div className="card">
                                <div className="card-header">
                                    Process
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <select name="noise" id="filter" className="form-control fourth-step" onChange={(e) => {
                                            setDirection(null)
                                            setFilter(e.target.value)
                                        }} required>
                                            <option value="">-Select Filter-</option>
                                            <option value="Gaussian">Gaussian Filter</option>
                                            <option value="Mean">Mean Filter</option>
                                            <option value="Motion">Motion Blur Filter</option>
                                            <option value="Custom">Custom Filter</option>
                                        </select>
                                        <div className="form-group">
                                            <label for="">{filter !== "Motion" ? `Kernel Size` : `Direction`}</label>
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

                                        {errorMessage && (
                                            <p className="text-danger fw-bold fs-5"> {errorMessage} </p>
                                        )}
                                        <div className="d-flex justify-content-between mt-5 sixth-step">
                                            <a className="btn btn-submit btn-primary">Watch How It Works </a>
                                            <button className="btn btn-submit px-5 btn-primary" id="apply" type="submit">Apply</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center my-3">
                                <button className="btn fw-500 btn-lg btn-primary d-none d-lg-block d-xl-block" onClick={() => setIsTourOpen(true)}>
                                    Open Tour Guide
                                </button>
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
            // onAfterOpen={disableBody}
            // onBeforeClose={enableBody}
            />
        </div>
    )
}

export default Reduction
