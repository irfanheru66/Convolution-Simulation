import React, { useState } from 'react'
import cv from "@techstark/opencv-js";
import NavigationBar from './NavigationBar'
import '../assets/css/styles.css';
import arrayFlatten from '../utils/arrayFlatten';

const Reduction = () => {
    const [imageSrc, setImageSrc] = useState("")
    const [kernelSize, setKernelSize] = useState(3)
    const [kernel, setKernel] = useState([])
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
        else if (filter === "Custom") {
            let inputKernel = cv.matFromArray(3, 3, cv.CV_32FC1, arrayFlatten(kernel))
            console.log('kernel', inputKernel)
            let anchor = new cv.Point(-1, -1);
            cv.filter2D(src, dst, cv.CV_8U, inputKernel, anchor, 0, cv.BORDER_DEFAULT);
        }
        cv.imshow('canvasOutput', dst);
        src.delete();
        dst.delete();
        M.delete();
    }

    const handleKernel = (e) => {
        setKernelSize(e.target.value)
        let kernel = []
        for (let i = 0; i < e.target.value; i++) {
            kernel.push([])
            for (let j = 0; j < e.target.value; j++) {
                kernel[i].push(1)
            }
        }
        setKernel(kernel)
    }

    const updateKernel = (e, index, index_2) => {
        // use a functional state update to update from previous state
        setKernel((kernel) =>
            // shallow copy outer array
            kernel.map((outerEl, i1) =>
                i1 === index
                    // shallow copy inner array on index match
                    ? outerEl.map((innerEl, i2) =>
                        // update at index match or return current
                        i2 === index_2 ? e.target.value : innerEl
                    )
                    : outerEl
            )
        );
    };

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
                                    {filter === "Custom" &&
                                        kernel.map((value, index) => {
                                            return (
                                                <div className="row mt-3" key={`${index}_${value}`}>
                                                    {
                                                        value.map((value_2, index_2) => {
                                                            return (
                                                                <div className="input-wrap" key={`${index_2}_${value_2}`}>
                                                                    <input type="text" id="" className="form-control" value={value_2} onChange={(e) => updateKernel(e, index, index_2)} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                    }
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
                                <canvas id="canvasOutput" className="img-fluid image"></canvas>
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
