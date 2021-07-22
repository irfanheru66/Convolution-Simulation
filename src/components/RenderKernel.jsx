import React, { useState } from 'react'
import '../assets/css/styles.css';

const RenderKernel = ({ filter = "", kernel = {} }) => {
    if (kernel.length > 1) {
        return (
            kernel.map((value, index) => {
                return (
                    <div className="col-lg-6">
                        <div className="row">
                            <p className="kernel-text">{`Kernel ${Object.keys(value)}`}</p>
                            {
                                value[Object.keys(value)].map((value_2, index_2) => {
                                    return (
                                        <div className="col-lg-3" style={{ padding: '0 .2rem' }}>
                                            {value_2.map((value_3, index_3) => {
                                                return (
                                                    <div className="bg-white text-center fw-bold mt-1">
                                                        {value_3}
                                                    </div>
                                                )
                                            })}
                                        </div >
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            })
        )
    } else if (kernel.length == 1) {
        return (
            <div className="col-lg-6">
                <div className="row">
                    <p className="kernel-text">{`Kernel`}</p>
                    {kernel[0].X.map((value, index) => {
                        return (

                            <div className="col-lg-3" style={{ padding: '0 .2rem' }}>
                                {
                                    value.map((value_2, index_2) => {
                                        return (<div className="bg-white text-center fw-bold mt-1">
                                            {value_2}
                                        </div>)
                                    })
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    } else {
        return null
    }

}

export default RenderKernel