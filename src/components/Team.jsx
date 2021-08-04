import React from 'react'
import foto from '../assets/img/23-crop.png'
import foto2 from '../assets/img/24-crop.png'
import NavigationBar from './NavigationBar'
import { motion } from 'framer-motion'
import Footer from './Footer'

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

const Team = (props) => {
    const primaryColor = "#fdaa56";
    const orangeColor = "#f4b474";
    const accentColor = "#f4977c";
    return (
        <motion.div variants={containerVariants}
            initial="hidden"
            animate="visible">
            <NavigationBar setModalFeedbackShow={props.setModalFeedbackShow}></NavigationBar>
            <div className="container-fluid mt-3">
                <h1 className="text-center fw-bold" style={{ color: primaryColor }}>Our Team</h1>
                <div className="row">
                    <div className="col-sm-12 col-lg-4 mt-5 p-5">
                        <div style={{ backgroundColor: orangeColor, minHeight: 300 + "px", position: "relative" }}>
                            <img src={foto} alt="" style={{ position: "absolute", top: -91.5 + "px" }} className="img-fluid" />
                        </div>
                        <div className="text-start fs-4 mt-3" style={{ color: primaryColor }}>
                            <span className="fw-bold">Mohamad Muqiit Faturrahman</span>
                            <p>152018016 - Informatika Itenas 2018</p>
                        </div>
                    </div>
                    <div className="col-sm-12 col-lg-4 mt-5 p-5">
                        <div style={{ backgroundColor: accentColor, minHeight: 300 + "px", position: "relative" }}>
                            <img src={foto2} alt="" style={{ position: "absolute", top: -70 + "px" }} className="img-fluid" />
                        </div>
                        <div className="text-start fs-4 mt-3" style={{ color: primaryColor }}>
                            <span className="fw-bold">Siti Asy Syifa</span>
                            <p>152018032 - Informatika Itenas 2018</p>
                        </div>
                    </div>
                    <div className="col-sm-12 col-lg-4 mt-5 p-5">
                        <div style={{ backgroundColor: orangeColor, minHeight: 300 + "px", position: "relative" }}>
                            <img src={foto} alt="" style={{ position: "absolute", top: -91.5 + "px" }} className="img-fluid" />
                        </div>
                        <div className="text-start fs-4 mt-3" style={{ color: primaryColor }}>
                            <span className="fw-bold">Irfan Heru Pratomo</span>
                            <p>152018089 - Informatika Itenas 2018</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </motion.div>
    )
}

export default Team
