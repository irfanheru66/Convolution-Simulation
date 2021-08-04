import React from 'react'
import '../assets/css/styles.css';

const RenderKernel = ({ filter = "", kernel = {} }) => {
    if (kernel.length > 1) {
        return (
            kernel.map((value, index) => {
                return (
                    <div className="col-xs-6 col-md-6" key={index}>
                        <div className="row">
                            <p className="kernel-text">{`Kernel ${Object.keys(value)}`}</p>
                            {
                                value[Object.keys(value)].map((value_2, index_2) => {
                                    return (
                                        <div className="row" key={index_2} >
                                            {
                                                value_2.map((value_3, index_3) => {
                                                    return (
                                                        <div className="col-xs-3 col-md-3 bg-white text-center fw-bold mt-1" style={{ margin: '0 .2rem' }} key={index_3}>
                                                            {value_3}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div >
                                    )
                                })
                            }
                        </div>
                    </div >
                )
            })
        )
    } else if (kernel.length == 1) {
        return (
            <div className="col-xs-6 col-md-6">
                <div className="row">
                    <p className="kernel-text">{`Kernel`}</p>
                    {kernel[0].X.map((value, index) => {
                        return (

                            <div className="col-xs-3 col-md-3" style={{ padding: '0 .2rem' }}>
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