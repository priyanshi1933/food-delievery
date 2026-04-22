

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Restaurant = {
  id: string;
  _id?: string;
  name: string;
  address: string;
  categories: string[];
  rating: number;
  image: string;
};

const DispRestaurant = () => {
  const [restaurant, setRestaurant] = useState<Restaurant[]>([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const managerId = localStorage.getItem("id"); 

  const display = async () => {
    try {
      let url = `http://localhost:3000/getRestaurant`;
     
      if (role === "manager" && managerId) {
        url = `http://localhost:3000/getRestaurantsByManager/${managerId}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurant(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`http://localhost:3000/deleteRestaurant/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setRestaurant((prev) => prev.filter((r) => (r.id || (r as any)._id) !== id));
        alert("Restaurant deleted successfully!");
      } catch (err: any) {
        console.error("Delete error", err);
        alert(err.response?.data?.message || "Failed to delete. You might not be the owner.");
      }
    }
  };

  useEffect(() => {
    display();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <div className="bg-white border-bottom py-5 mb-5 shadow-sm">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="fw-black display-4 mb-2">
                {role === "manager" ? "My Restaurants" : "Local Favorites"}
              </h1>
              <p className="text-muted lead">
                {role === "manager" 
                  ? "Manage your listings and menus here." 
                  : "Discover the best-rated spots in your area."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {restaurant?.map((r) => {
            const rId = r.id || (r as any)._id;
            return (
              <div key={rId} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative transition-all"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/dispMenu/${rId}`)}
                >
                  {/* Image Section */}
                  <div className="position-relative" style={{ height: "200px" }}>
                    <img
                      src={`http://localhost:3000/${r.image}`}
                      alt={r.name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co";
                      }}
                    />
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className="badge rounded-pill bg-warning text-dark fw-bold px-3 shadow-sm">
                        ★ {r.rating || "5.0"}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div
                    className="card-body p-4 bg-white rounded-top-4 position-relative"
                    style={{ marginTop: "-30px" }}
                  >
                    <div className="mb-2">
                      {r.categories?.map((cat, i) => (
                        <span key={i} className="badge bg-primary-subtle text-primary border border-primary-subtle me-1 fw-normal">
                          {cat}
                        </span>
                      ))}
                    </div>

                    <h4 className="fw-bold text-dark mb-1">{r.name}</h4>
                    <p className="text-muted small mb-4">
                      <i className="bi bi-geo-alt-fill me-1"></i> {r.address}
                    </p>

                    {/* Action Buttons */}
                    <div className="d-grid gap-2">
                      {role === "manager" ? (
                        <>
                          <button
                            className="btn btn-dark rounded-3 fw-bold w-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/addMenu/${rId}`);
                            }}
                          >
                            <i className="bi bi-plus-lg me-2"></i>Add Item
                          </button>

                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-success rounded-3 flex-grow-1 fw-semibold"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/editRestaurant/${rId}`);
                              }}
                            >
                              <i className="bi bi-pencil-square me-2"></i>Edit
                            </button>
                            <button
                              className="btn btn-outline-danger rounded-3 flex-grow-1 fw-semibold"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(rId);
                              }}
                            >
                              <i className="bi bi-trash3 me-2"></i>Delete
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          className="btn btn-primary rounded-3 fw-bold w-100 py-2 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dispMenu/${rId}`);
                          }}
                        >
                          Explore Menu <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DispRestaurant;

