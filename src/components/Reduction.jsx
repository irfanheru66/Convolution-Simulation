import React, { useState } from 'react'
import cv from "@techstark/opencv-js";
import NavigationBar from './NavigationBar'
import '../assets/css/styles.css';

const Reduction = () => {
    const [imageSrc, setImageSrc] = useState("")
    const [kernelSize, setKernelSize] = useState(3)
    const [filter, setFilter] = useState("")

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
        cv.imshow('canvasOutput', dst);
        src.delete();
        dst.delete();
        M.delete();
    }

    return (
        <div>
            <NavigationBar></NavigationBar>
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                Input Image
                            </div>
                            <div className="card-body">
                                <form action="">
                                    <input type="file" id="fileInput" name="file" className="custom-file-input" onChange={(e) => setImageSrc(URL.createObjectURL(e.target.files[0]))} />
                                </form>
                                <div className="icon">
                                    <i className="bi bi-zoom-in"></i>
                                    <i className="bi bi-zoom-out"></i>
                                    <i className="bi bi-aspect-ratio"></i>
                                </div>
                                <div className="image">
                                    <img id="imageSrc" className="img-fluid" src={imageSrc} alt="" />
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
                                    <select name="noise" id="filter" className="form-control" onChange={(e) => setFilter(e.target.value)} required>
                                        <option value="">-Select Filter-</option>
                                        <option value="Gaussian">Gaussian Filter</option>
                                        <option value="Mean">Mean Filter</option>
                                    </select>
                                    <div className="form-group">
                                        <label for="">Kernel Size</label>
                                        <div className="d-flex">
                                            <div className="kernel">
                                                <span id="demo">{`${kernelSize}x${kernelSize}`}</span>
                                            </div>
                                            <div className="w-100 ps-2 mt-2">
                                                <input type="range" step="2" name="range" min="3" max="11" value={kernelSize} className="slider" onChange={(e) => setKernelSize(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
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
                                <div className="icon">
                                    <i className="bi bi-zoom-in"></i>
                                    <i className="bi bi-zoom-out"></i>
                                    <i className="bi bi-aspect-ratio"></i>
                                    <i className="bi bi-save"></i>
                                </div>
                                <div className="image">
                                    <canvas id="canvasOutput" className="img-fluid"></canvas>
                                </div>
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
