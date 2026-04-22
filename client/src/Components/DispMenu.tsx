import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

interface IMenu {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  image: string;
}

const DisplayMenu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menuItems, setMenuItems] = useState<IMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const display = async () => {
    setLoading(true); 
    try {
      const res = await axios.get(
        `http://localhost:3000/getMenuById/${restaurantId}`,
      );
      setMenuItems(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

   const handleDelete = async (menuId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:3000/deleteMenu/${menuId}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { restaurantId: restaurantId } 
        });
        setMenuItems((prev) => prev.filter((item) => item._id !== menuId));
        alert("Item deleted successfully!");
      } catch (err: any) {
        console.error("Delete error", err);
        alert(err.response?.data?.message || "Failed to delete item.");
      }
    }
  };

  useEffect(() => {
    if (restaurantId) {
      display();
    }
  }, [restaurantId]);

  return (
    <div className="bg-light min-vh-100">
      {/* <Navbar /> */}

    
      <div className="bg-white border-bottom py-5 mb-5 shadow-sm">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="fw-black display-4 mb-2">Our Menu</h1>
              <p className="text-muted lead">
                Explore hand-crafted dishes and seasonal specialties.
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              {localStorage.getItem("role") === "manager" && (
                <button
                  className="btn btn-dark rounded-pill px-4 py-2 fw-bold"
                  onClick={() => navigate(`/addMenu/${restaurantId}`)}
                >
                  + Add New Dish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {menuItems.map((item) => (
              <div key={item._id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                  {/* Image Section with Overlap Height */}
                  <div
                    className="position-relative"
                    style={{ height: "200px" }}
                  >
                    <img
                      src={`http://localhost:3000/${item.image}`}
                      alt={item.name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placeholder.com";
                      }}
                    />
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className="badge rounded-pill bg-success text-white fw-bold px-3 shadow-sm">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  {/* Overlapping Content Section */}
                  <div
                    className="card-body p-4 mt-n5 bg-white rounded-top-5 position-relative"
                    style={{ marginTop: "-30px" }}
                  >
                    <div className="mb-2">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-normal">
                        {item.category}
                      </span>
                    </div>

                    <h4 className="fw-bold text-dark mb-1">{item.name}</h4>
                    <p
                      className="text-muted small mb-4"
                      style={{ minHeight: "40px" }}
                    >
                      {item.description}
                    </p>

                    <div className="d-flex align-items-center justify-content-between">
                      <span
                        className={`small fw-bold ${item.isAvailable ? "text-success" : "text-danger"}`}
                      >
                        {item.isAvailable ? "● Available" : "● Out of Stock"}
                      </span>

                   
                      <div className="d-flex gap-2">
                        {["manager", "driver"].includes(
                          localStorage.getItem("role") || "",
                        ) ? (
                          <>
                            
                            <button 
                              className="btn btn-outline-dark btn-sm rounded-3 px-3"
                              onClick={() => navigate(`/editMenu/${item._id}/${restaurantId}`)}
                            >
                              Edit
                            </button>
                         
                            <button 
                              className="btn btn-outline-danger btn-sm rounded-3 px-3"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <button className="btn btn-dark rounded-3 fw-bold px-4">
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && menuItems.length === 0 && (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
            <h5 className="text-muted">No items found.</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayMenu;
