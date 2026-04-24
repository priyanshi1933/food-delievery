import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../Utils/auth";

const NavbarUser = () => {
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
    <>
      <nav
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
            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/order-history")}
            >
              <i className="bi bi-clock-history me-2"></i> My Orders
            </button>
            <div className="dropdown ms-3">
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
      </nav>
    </>
  );
};

export default NavbarUser;
