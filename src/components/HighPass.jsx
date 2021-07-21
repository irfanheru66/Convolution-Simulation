import React, { useState, useEffect } from 'react'
import cv from "@techstark/opencv-js";
import NavigationBar from './NavigationBar'
import '../assets/css/styles.css';
import arrayFlatten from '../utils/arrayFlatten';
import { v4 as uuidV4 } from "uuid";

const HighPass = () => {
    const [imageSrc, setImageSrc] = useState("")
    const [errorMessage, setErrorMessage] = useState('');
    const [kernelSize, setKernelSize] = useState(3)
    const [kernel, setKernel] = useState([])
    const [filter, setFilter] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        let src = cv.imread('imageSrc');
        let dst = new cv.Mat();
        let gray = new cv.Mat();
        let M = cv.Mat.eye(3, 3, cv.CV_32FC1);

        let ksize = new cv.Size(parseInt(kernelSize), parseInt(kernelSize))
        if (filter === "Laplacian") {
            cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY, 0);
            cv.Laplacian(gray, dst, cv.CV_8U, parseInt(kernelSize));
        }
        else if (filter === "Custom") {
            let arrayKernel = arrayObjectFlatten(kernel)
            let sumKernel = arrayKernel.reduce(function (total, value) {
                return parseInt(total) + parseInt(value);
            }, 0);
            console.log(sumKernel)
            if (parseInt(sumKernel) != 0 && parseInt(sumKernel) != 1) {
                setErrorMessage("Sum of kernel must be 0 or 1!")
            } else {
                setErrorMessage("")
                let inputKernel = cv.matFromArray(parseInt(kernelSize), parseInt(kernelSize), cv.CV_32FC1, arrayKernel)
                let anchor = new cv.Point(-1, -1);
                cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY, 0);
                cv.filter2D(gray, dst, cv.CV_8U, inputKernel, anchor, 0, cv.BORDER_DEFAULT);
            }
        }
        cv.imshow('canvasOutput', dst);
        src.delete();
        gray.delete();
        dst.delete();
        M.delete();
    }

    // let isi = [[0.0625, 0.125, 0.0625],
    // [0.125, 0.25, 0.125],
    // [0.0625, 0.125, 0.0625]]

    const arrayObjectFlatten = (arr = []) => {
        let num = []
        arr.map((row, index) => {
            row.value.map((row_2, index_2) => {
                num.push(row_2.value)
            })
        })
        return num
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
                <h1 className="text-center fw-bold">High Pass Filter</h1>
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
                                        <option value="Laplacian">Laplacian</option>
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

export default HighPass
