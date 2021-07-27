import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/img/VolugeSIMLogo (1).png'

const NavigationBar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light" id="navbar">
            <div className="container">
                <Link className="navbar-brand text-primary" to="/">
                    <img src={logo} width="120px" height="120px" alt="" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" className="feather feather-menu">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto me-lg-5">
                        <li className="nav-item dropdown dropdown-xl no-caret">
                            <a className="nav-link dropdown-toggle" id="navbarDropdownDemos" href="#" role="button"
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Features
                                <i className="fas fa-chevron-right dropdown-arrow"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end animated--fade-in-up"
                                aria-labelledby="navbarDropdownDemos">
                                <div className="row g-0">
                                    <div className="col-lg-12 ps-5 pe-5 pt-3 pb-3">
                                        <Link className="dropdown-item" style={{ fontSize: 25 + 'px' }} to="/noise-reduction">Noise
                                            Reduction</Link>
                                        <Link className="dropdown-item" style={{ fontSize: 25 + 'px' }} to="/high-pass">High-Pass
                                            Filter</Link>
                                        <Link className="dropdown-item" style={{ fontSize: 25 + 'px' }} to="/edge-detection">Edge Detection</Link>
                                        <Link className="dropdown-item" style={{ fontSize: 25 + 'px' }} to="/others">Others</Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item dropdown no-caret">
                            <a className="nav-link dropdown-toggle" id="navbarDropdownDocs" href="#" role="button"
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Documentation
                            </a>
                            <div className="dropdown-menu dropdown-menu-end animated--fade-in-up"
                                aria-labelledby="navbarDropdownDocs">
                                <a className="dropdown-item py-3"
                                    href="https://docs.startbootstrap.com/sb-ui-kit-pro/quickstart" target="_blank">
                                    <div className="icon-stack bg-primary-soft text-primary me-4"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" className="feather feather-book-open">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                    </svg></div>
                                    <div>
                                        <div className="small text-gray-500">Documentation</div>
                                        Usage instructions and reference
                                    </div>
                                </a>
                                <div className="dropdown-divider m-0"></div>
                                <a className="dropdown-item py-3"
                                    href="https://docs.startbootstrap.com/sb-ui-kit-pro/components" target="_blank">
                                    <div className="icon-stack bg-primary-soft text-primary me-4"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" className="feather feather-code">
                                        <polyline points="16 18 22 12 16 6"></polyline>
                                        <polyline points="8 6 2 12 8 18"></polyline>
                                    </svg></div>
                                    <div>
                                        <div className="small text-gray-500">Components</div>
                                        Code snippets and reference
                                    </div>
                                </a>
                                <div className="dropdown-divider m-0"></div>
                                <a className="dropdown-item py-3" href="https://docs.startbootstrap.com/sb-ui-kit-pro/changelog"
                                    target="_blank">
                                    <div className="icon-stack bg-primary-soft text-primary me-4"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" className="feather feather-file-text">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg></div>
                                    <div>
                                        <div className="small text-gray-500">Changelog</div>
                                        Updates and changes
                                    </div>
                                </a>
                            </div>
                        </li>
                        <li className="nav-item d-flex align-items-center">
                            <a className="btn fw-500 ms-lg-4 btn-lg btn-primary" href="#">
                                Feedback
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavigationBar
