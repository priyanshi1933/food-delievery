
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const logOut = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/addRestaurant">
          Food Delievery
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav w-100 mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link"
                aria-current="page"
                to="/addRestaurant"
              >
                Add Restaurant
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dispRestaurant">
                Display Restaurtant
              </Link>
            </li>
             {/* <li className="nav-item">
              <Link className="nav-link" to="/addMenu">
                Add Menu
              </Link>
            </li> */}

            <li className="nav-item ms-auto">
              <button
                className="btn btn-outline-secondary shadow-sm"
                onClick={logOut}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
