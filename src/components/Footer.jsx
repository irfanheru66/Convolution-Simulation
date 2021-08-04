import React from 'react'

const Footer = () => {
    return (
        <footer class="text-center mt-5" style={{ backgroundColor: "#fdaa56" }}>
            <div class="container-fluid py-3">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="text-white">
                            <p class="mb-2 fs-4">&copy; Informatika Itenas {new Date().getFullYear()}. All Rights Reserved.</p>
                            <a href="#!" className="fs-5 text-accent fw-bold">Privacy</a>
                            <span class="mx-1">&middot;</span>
                            <a href="#!" className="fs-5 text-accent fw-bold">Terms</a>
                            <span class="mx-1">&middot;</span>
                            <a href="#!" className="fs-5 text-accent fw-bold">FAQ</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer