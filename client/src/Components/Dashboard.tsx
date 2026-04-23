import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../Utils/auth";
import DispRestaurant from "./DispRestaurant";
import NavbarUser from "./NavbarUser";
import Footer from "./Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const customerName = localStorage.getItem("name") || "Guest";
  const updateCartCount = () => {
    const items = JSON.parse(localStorage.getItem("cart_items") || "[]");
    const total = items.reduce(
      (acc: number, item: any) => acc + item.quantity,
      0,
    );
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();
    // Listen for updates from DisplayMenu component
    window.addEventListener("cartUpdate", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdate", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-light min-vh-100">
        <NavbarUser/>
      {/* <nav
        className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top shadow-sm py-2"
        style={{ height: "80px" }}
      >
        <div className="container-fluid">
          <div
            className="navbar-brand px-lg-3"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            <img
              src="/logo.jpg"
              alt="Logo"
              height="60"
              width="60"
              className="rounded-circle border border-2 border-secondary"
            />
          </div>

          <form className="d-flex mx-auto w-50 d-none d-lg-flex" role="search">
            <div className="input-group">
              <input
                className="form-control rounded-pill-start border-0 px-4 bg-light"
                type="search"
                placeholder="Search for food, cuisines..."
                style={{ borderRadius: "50px 0 0 50px" }}
              />
              <button
                className="btn btn-secondary px-4 shadow-sm"
                type="submit"
                style={{ borderRadius: "0 50px 50px 0" }}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          <div className="d-flex align-items-center ms-auto px-lg-3">
            <div
              className="position-relative me-4"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/cart")}
            >
              <i className="bi bi-bag-fill text-white fs-3"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark border border-dark border-1">
                  {cartCount}
                </span>
              )}
            </div>

            <div className="dropdown">
              <div
                className="d-flex align-items-center text-white dropdown-toggle cursor-pointer"
                data-bs-toggle="dropdown"
                role="button"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBbMogdPslbZaa9Th1hRvCCtzveStfagjWjw&s"
                  alt="User"
                  width="38"
                  height="38"
                  className="rounded-circle me-2 border border-2 border-secondary"
                  referrerPolicy="no-referrer"
                />
                <span className="fw-bold d-none d-md-inline text-capitalize">
                  {customerName}
                </span>
              </div>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3">
                <li>
                  <button
                    className="dropdown-item py-2 text-danger fw-bold"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav> */}

      <div
        id="heroCarousel"
        className="carousel slide shadow-sm mt-2"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="0"
            className="active"
          ></button>
          <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="2"
          ></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active" style={{ height: "450px" }}>
            <img
              src="./c1.jpg"
              className="d-block w-100 h-100 object-fit-cover"
              alt="Gourmet Food"
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-4 p-4 mb-4">
              <h2 className="fw-bold">Chef’s Seasonal Highlights</h2>
              <p className="lead">
                Savor the freshest flavors of the season, carefully crafted by
                our culinary team.
              </p>
            </div>
          </div>

          <div className="carousel-item" style={{ height: "450px" }}>
            <img
              src="./c2.jpg"
              className="d-block w-100 h-100 object-fit-cover"
              alt="Date Night"
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-4 p-4 mb-4">
              <h2 className="fw-bold">Elevate Your Date Night</h2>
              <p className="lead">
                Candlelight, cozy ambiance, and an exquisite culinary experience
                designed for two.
              </p>
            </div>
          </div>

          <div className="carousel-item" style={{ height: "450px" }}>
            <img
              src="./c3.jpg"
              className="d-block w-100 h-100 object-fit-cover"
              alt="Delivery"
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-4 p-4 mb-4">
              <h2 className="fw-bold">Hot & Fresh at Your Doorstep</h2>
              <p className="lead">
                Craving something delicious? Get your favorites delivered
                fast—guaranteed.
              </p>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container-fluid mt-2">
        <DispRestaurant />
      </div>
     
      <Footer/>
    </div>
  );
};

export default Dashboard;
