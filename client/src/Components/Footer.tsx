import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate=useNavigate();
  return (<footer className="bg-dark text-white pt-5 pb-4 mt-5">
        <div className="container text-center text-md-start">
          <div className="row text-center text-md-start">
            <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
              <h5 className="text-uppercase mb-4 fw-bold text-warning">
                RestoLogic
              </h5>
              <p className="small text-white-50">
                Bringing the best flavors from local restaurants straight to
                your doorstep. Quality food, fast delivery, and a seamless
                experience.
              </p>
            </div>

            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
              <h5 className="text-uppercase mb-4 fw-bold text-warning">
                Links
              </h5>
              <p>
                <span
                  onClick={() => navigate("/dashboard")}
                  className="text-white-50 text-decoration-none small cursor-pointer"
                  style={{ cursor: "pointer" }}
                >
                  Home
                </span>
              </p>
              <p>
                <span
                  className="text-white-50 text-decoration-none small"
                  style={{ cursor: "pointer" }}
                >
                  My Orders
                </span>
              </p>
              <p>
                <span
                  className="text-white-50 text-decoration-none small"
                  style={{ cursor: "pointer" }}
                >
                  Offers
                </span>
              </p>
              <p>
                <span
                  className="text-white-50 text-decoration-none small"
                  style={{ cursor: "pointer" }}
                >
                  Help & Support
                </span>
              </p>
            </div>

            {/* Contact Info */}
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
              <h5 className="text-uppercase mb-4 fw-bold text-warning">
                Contact
              </h5>
              <p className="small text-white-50">
                <i className="bi bi-house-door-fill me-2"></i> 129, The Galleria
                Shopping Hub, Nr. Sanjeev Kumar Auditorium, Opp. 3Seventy
                Kitchen Restaurant, Pal, Adajan, Surat - 395009
              </p>
              <p className="small text-white-50">
                <i className="bi bi-envelope-fill me-2"></i> pd.opash@gmail.com
              </p>
              <p className="small text-white-50">
                <i className="bi bi-telephone-fill me-2"></i> +91 87808 39326
              </p>
            </div>

            {/* Social Media */}
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
              <h5 className="text-uppercase mb-4 fw-bold text-warning">
                Follow Us
              </h5>
              <div className="d-flex justify-content-center justify-content-md-start gap-3">
                <i className="bi bi-facebook fs-4 cursor-pointer text-white-50"></i>
                <i className="bi bi-instagram fs-4 cursor-pointer text-white-50"></i>
                <i className="bi bi-twitter-x fs-4 cursor-pointer text-white-50"></i>
              </div>
            </div>
          </div>

          <hr className="mb-4 mt-5 border-secondary" />

          {/* Copyright */}
          <div className="row align-items-center">
            <div className="col-md-7 col-lg-8">
              <p className="small text-white-50 text-center text-md-start">
                © {new Date().getFullYear()} All Rights Reserved by:
                <strong className="text-warning"> Opash Software</strong>
              </p>
            </div>
            <div className="col-md-5 col-lg-4 text-center text-md-end">
              <p className="small text-white-50">
                Privacy Policy | Terms of Service
              </p>
            </div>
          </div>
        </div>
        </footer>
  )
}

export default Footer