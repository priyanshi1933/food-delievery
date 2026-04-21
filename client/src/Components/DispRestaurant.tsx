import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

type Restaurant = {
  id: string;
  name: string;
  address: string;
  categories: string[];
  rating: number;
  image: string;
};


const DispRestaurant = () => {
  const [restaurant, setRestaurant] = useState<Restaurant[]>([]);
  const navigate = useNavigate();

  const display = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/getRestaurant`);
      setRestaurant(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    display();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="bg-white border-bottom py-5 mb-5 shadow-sm">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="fw-black display-4 mb-2">Local Favorites</h1>
              <p className="text-muted lead">
                Discover the best-rated spots in your area.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {restaurant?.map((r) => (
            <div
              key={r.id || (r as any)._id}
              className="col-12 col-md-6 col-lg-4"
            >
              <div
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative transition-all"
                style={{
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const restaurantId = r.id || (r as any)._id;
                  navigate(`/dispMenu/${restaurantId}`);
                }}
              >
                {/* Replace the 140px bg-dark div with this: */}
                <div className="position-relative" style={{ height: "200px" }}>
                  <img
                    src={`http://localhost:3000/${r.image}`} 
                    alt={r.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src =
                        "https://placeholder.com";
                    }}
                  />
                  <div className="position-absolute top-0 end-0 p-3">
                    <span className="badge rounded-pill bg-warning text-dark fw-bold px-3 shadow-sm">
                      ★ {r.rating || "5.0"}
                    </span>
                  </div>
                </div>

                <div
                  className="card-body p-4 mt-n5 bg-white rounded-top-4 position-relative"
                  style={{ marginTop: "-30px" }}
                >
                  <div className="mb-2">
                    {r.categories?.map((cat, i) => (
                      <span
                        key={i}
                        className="badge bg-primary-subtle text-primary border border-primary-subtle me-1 fw-normal"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <h4 className="fw-bold text-dark mb-1">{r.name}</h4>
                  <p className="text-muted small mb-4">
                    <i className="bi bi-geo-alt-fill me-1"></i> {r.address}
                  </p>

                
                  <div className="d-flex gap-2">

  {(localStorage.getItem("role") === "manager" || localStorage.getItem("role") === "driver") && (
    <button
      className="btn btn-dark rounded-3 fw-bold"
      style={{ width: "180px" }}
      onClick={(e) => {
        e.stopPropagation();
        const restaurantId = r.id || (r as any)._id;
        if (restaurantId) {
          navigate(`/addMenu/${restaurantId}`);
        }
      }}
    >
      Add Menu
    </button>
  )}

  <button
    className="btn btn-outline-dark rounded-3 fw-bold flex-grow-1"
    onClick={(e) => {
      e.stopPropagation();
      const restaurantId = r.id || (r as any)._id;
      navigate(`/dispMenu/${restaurantId}`);
    }}
  >
    Explore Menu
  </button>
</div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DispRestaurant;
