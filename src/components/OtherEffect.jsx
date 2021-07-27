import React, { useState, useRef } from 'react'
import cv from "@techstark/opencv-js";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import NavigationBar from './NavigationBar'
import '../assets/css/styles.css';
import RenderKernel from './RenderKernel';
import { arrayObjectFlatten, array2DFlatten } from '../utils/arrayFlat';
import { downloadImageOutput } from '../utils/downloadImage'

const OtherEffect = () => {
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
                0, -1, -1,
                1, 0, -1,
                1, 1, 0,
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
            let X = [[0, -1, -1], [1, 0, -1], [1, 1, 0]]
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
        <div>
            <NavigationBar></NavigationBar>
            <div className="container-fluid mt-3">
                <h1 className="text-center fw-bold">Other Effect</h1>
                <div className="row mt-1">
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col-lg-12 mb-3">
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

                    <div className="col-lg-4">
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
                                        {/* <div className="col-lg-6">
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <div className="bg-white text-center fw-bold">
                                                        4
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="bg-white text-center fw-bold">
                                                        4
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="bg-white text-center fw-bold">
                                                        4
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                        {/* <div className="col-lg-6"></div> */}
                                    </div>
                                    <div className="d-flex justify-content-between mt-5">
                                        <a className="btn btn-submit px-5 btn-primary">Watch How It Works </a>
                                        <button className="btn btn-submit px-5 btn-primary" id="apply" type="submit">Apply</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtherEffect
