import React, { useState } from 'react'
import '../assets/css/styles.css';

const RenderKernel = ({ filter = "", kernel = {} }) => {
    if (kernel.length > 1) {
        return (
            kernel.map((value, index) => {
                return (
                    <div className="col-lg-6">
                        <p className="kernel-text">{`Kernel ${Object.keys(value)}`}</p>
                        {
                            value[Object.keys(value)].map((value_2, index_2) => {
                                return (
                                    <div className="mt-3 mx-2">
                                        {value_2.map((value_3, index_3) => {
                                            return (<span className="bg-white mx-2 py-2 px-1">{value_3}</span>)
                                        })}
                                    </div >
                                )
                            })
                        }
                    </div>
                )
            })
        )
    } else if (kernel.length == 1) {
        return (
            <div>
                <p className="kernel-text">{`Kernel`}</p>
                {kernel[0].X.map((value, index) => {
                    return (

                        <div className="mt-3 mx-2">
                            {
                                value.map((value_2, index_2) => {
                                    return (<span className="bg-white mx-2 py-2 px-1">{value_2}</span>)
                                })
                            }
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return null
    }

}

export default RenderKernel