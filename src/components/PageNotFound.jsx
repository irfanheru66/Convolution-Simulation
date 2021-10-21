import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/404page.css';
import { motion } from 'framer-motion';

const PageNotFound = (props) => {
    return (
        <div>
            <h1>404 Page Not Found</h1>
            <section class="error-container">
                <span class="four"><span class="screen-reader-text">4</span></span>
                <span class="zero"><span class="screen-reader-text">0</span></span>
                <span class="four"><span class="screen-reader-text">4</span></span>
            </section>
        </div>
    )
}

export default PageNotFound