import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/styles.css';
import ImageBanner from '../assets/img/image-side-2-removebg-preview.png'
import ImageBanner2 from '../assets/img/image-banner.png'

const Home = () => {
    return (
        <div className="hero">
            <div className="container-fluid" style={{ paddingLeft: '0 !important', paddingRight: '0 !important' }}>
                <div className="row justify-content-between">
                    <div className="col-lg-6 col-md-12 intro">
                        <div className="d-flex">
                            <div className="img-side">
                                <img src={ImageBanner} alt="" />
                            </div>
                            <div className="hero-caption" style={{ marginTop: 100 + 'px' }}>
                                <h1 className="text-white font-weight-bold mb-4 aos-init aos-animate" data-aos="fade-up"
                                    data-aos-delay="0">Convolution Image Simulation</h1>
                                <p className="mb-4 aos-init aos-animate" style={{ letterSpacing: 1.7 + 'px' }} data-aos="fade-up"
                                    data-aos-delay="100">
                                    Do you want to know how image convolution works in a more interesting way? So let's
                                    start.
                                </p>
                                <Link to="/noise-reduction" className="btn btn-lg btn-primary" style={{ letterSpacing: 1.7 + 'px' }}>GET STARTED</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 d-none d-sm-none d-md-none d-lg-block">
                        <div className="hero_img aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"
                            style={{ marginTop: 100 + 'px' }}>
                            <img src={ImageBanner2} alt="Image" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="slant">
            </div>
        </div>
    )
}

export default Home
