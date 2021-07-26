import React, { useState, useEffect, useRef } from 'react'
import cv from "@techstark/opencv-js";
import NavigationBar from './NavigationBar'
import '../assets/css/styles.css';
import { arrayObjectFlatten, array2DFlatten } from '../utils/arrayFlat';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { v4 as uuidV4 } from "uuid";
import { downloadImageOutput } from '../utils/downloadImage'

const Reduction = () => {
    const [imageSrc, setImageSrc] = useState("")
    const [kernelSize, setKernelSize] = useState(3)
    const [errorMessage, setErrorMessage] = useState('');
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

        let ksize = new cv.Size(parseInt(kernelSize), parseInt(kernelSize))
        if (filter === "Gaussian") {
            cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
        } else if (filter === "Mean") {
            cv.blur(src, dst, ksize, new cv.Point(-1, -1), cv.BORDER_DEFAULT)
        }
        else if (filter === "Motion") {
            // let arrayKernel = [
            //     1, 0, 0, 0, 0, 0, 0, 0, 0,
            //     0, 1, 0, 0, 0, 0, 0, 0, 0,
            //     0, 0, 1, 0, 0, 0, 0, 0, 0,
            //     0, 0, 0, 1, 0, 0, 0, 0, 0,
            //     0, 0, 0, 0, 1, 0, 0, 0, 0,
            //     0, 0, 0, 0, 0, 1, 0, 0, 0,
            //     0, 0, 0, 0, 0, 0, 1, 0, 0,
            //     0, 0, 0, 0, 0, 0, 0, 1, 0,
            //     0, 0, 0, 0, 0, 0, 0, 0, 1,
            // ]

            // let anchor = new cv.Point(-1, -1);
            // let inputKernel = cv.matFromArray(9, 9, cv.CV_32FC2, arrayKernel)
            // cv.filter2D(src, dst, cv.CV_8U, inputKernel, anchor, 0, cv.BORDER_DEFAULT)
        }
        else if (filter === "Custom") {
            // console.log(arrayObjectFlatten(kernel))
            let arrayKernel = arrayObjectFlatten(kernel)
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

    // let isi = [[0.0625, 0.125, 0.0625],
    // [0.125, 0.25, 0.125],
    // [0.0625, 0.125, 0.0625]]

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
        setKernel(kernel);
    }, [kernelSize]);

    const handleKernel = (e) => {
        setKernelSize(e.target.value);
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
        <div>
            <NavigationBar></NavigationBar>
            <div className="container-fluid mt-3">
                <h1 className="text-center fw-bold">Reduction/Smoothing</h1>
                <div className="row mt-1">
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                Input Image
                            </div>
                            <div className="card-body">
                                <form action="">
                                    <input type="file" id="fileInput" name="file" className="custom-file-input" onChange={(e) => setImageSrc(URL.createObjectURL(e.target.files[0]))} />
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
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                Process
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <select name="noise" id="filter" className="form-control" onChange={(e) => setFilter(e.target.value)} required>
                                        <option value="">-Select Filter-</option>
                                        <option value="Gaussian">Gaussian Filter</option>
                                        <option value="Mean">Mean Filter</option>
                                        <option value="Motion">Motion Blur Filter</option>
                                        <option value="Custom">Custom Filter</option>
                                    </select>
                                    <div className="form-group">
                                        <label for="">Kernel Size</label>
                                        <div className="d-flex">
                                            <div className="kernel">
                                                <span id="demo">{`${kernelSize}x${kernelSize}`}</span>
                                            </div>
                                            <div className="w-100 ps-2 mt-2">
                                                <input type="range" step="2" name="range" min="3" max="7" value={kernelSize} className="slider" onChange={(e) => handleKernel(e)} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* {filter === "Custom" &&
                                        kernel.map((value, index) => {
                                            return (
                                                <div className="row-custom mt-3" key={`${index}_${value}`}>
                                                    {
                                                        value.map((value_2, index_2) => {
                                                            return (
                                                                <div className="input-wrap" key={`${index_2}_${value_2}`}>
                                                                    <input type="number" pattern="[0-9]*" id="" className="form-control" value={value_2} onChange={(e) => updateKernel(e, index, index_2)} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                    } */}
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
                                    {errorMessage && (
                                        <p className="text-danger fw-bold fs-5"> {errorMessage} </p>
                                    )}
                                    <div className="d-flex flex-column-reverse mt-5">
                                        <div className="ms-auto">
                                            <button className="btn btn-submit px-5 btn-primary" id="apply" type="submit">Apply</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
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
                                <div className="d-flex flex-column-reverse mt-5">
                                    <div className="ms-auto">
                                        <a className="btn btn-submit px-5 btn-primary">Watch How It Works </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reduction
