import React, { useState, type ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../Utils/auth";
import { useParams } from "react-router-dom";

interface IMenu {
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  image: File | null;
  restaurantId: string;
}

const AddMenu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  const [msg, setMsg] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [data, setData] = useState<IMenu>({
    name: "",
    description: "",
    price: 0,
    category: "Italian",
    isAvailable: true,
    image: null,
    restaurantId: restaurantId || "",
  });
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));

    setMsg((prev) => ({ ...prev, [name]: "" }));
  };
   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setData((prev) => ({ ...prev, image: e.target.files![0] }));
        setMsg((prev) => ({ ...prev, image: "" }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let validationErrors = {
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    };
    let hasError = false;

    if (!data.name) {
      validationErrors.name = "Item name is required";
      hasError = true;
    }
    if (!data.description) {
      validationErrors.description = "Description is required";
      hasError = true;
    }
    if (!data.price) {
      validationErrors.price = "Price is required";
      hasError = true;
    } else if (data.price < 0) {
      validationErrors.price = "Price is greater than 0";
      hasError = true;
    }
    if (!data.category) {
      validationErrors.category = "Category is required";
      hasError = true;
    }
    if (!data.image) {
      validationErrors.image = "Please upload an image";
      hasError = true;
    }

    setMsg(validationErrors);
    if (hasError) return;

    try {
      //   const token = localStorage.getItem("token");
      //   await axios.post(`http://localhost:3000/addMenu`, data, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      //   alert("Menu Created Successfully");
      //   navigate("/dispRestaurant");
      // } catch (error: any) {
      //   alert("Error adding restaurant. Please try again.");
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("category", data.category);
      formData.append("restaurantId", data.restaurantId);
      formData.append("image", data.image as File);

      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/addMenu`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Menu Created Successfully");
      navigate("/dispRestaurant");
    } catch (error: any) {
      alert("Error adding restaurant. Please try again.");
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark">Create Menu</h2>
                  <p className="text-muted small">
                    Fill in the details to list your menu
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Item Name</label>
                    <input
                      type="text"
                      name="name"
                      value={data.name}
                      placeholder="e.g. Pizza"
                      onChange={handleChange}
                      className={`form-control form-control-lg rounded-3 ${msg.name ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">{msg.name}</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      value={data.description}
                      placeholder="Full description"
                      onChange={handleChange}
                      className={`form-control rounded-3 ${msg.description ? "is-invalid" : ""}`}
                    ></textarea>
                    <div className="invalid-feedback">{msg.description}</div>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold small text-uppercase text-muted">
                      Price
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        name="price"
                        min="1"
                        value={data.price}
                        onChange={handleChange}
                        className="form-control border-start-0 rounded-end-3"
                      />
                    </div>
                  </div>
                   <div className="mb-3">
                    <label className="form-label fw-semibold">Menu Item Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={`form-control ${msg.image ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{msg.image}</div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label fw-semibold small text-uppercase text-muted">
                        Category
                      </label>
                      <select
                        name="category"
                        value={data.category}
                        onChange={handleChange}
                        className="form-select rounded-3"
                        style={{ height: "50px" }}
                      >
                        <option value="Italian">🍝 Italian</option>
                        <option value="Punjabi">🥘 Punjabi</option>
                        <option value="Chinese">🍜 Chinese</option>
                        <option value="Desserts">🍰 Desserts</option>
                        <option value="Fast Food">🍔 Fast Food</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button
                      type="submit"
                      className="btn btn-dark btn-lg rounded-pill fw-bold shadow-sm py-3"
                      style={{ transition: "all 0.3s ease" }}
                    >
                      Create Menu
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/dispRestaurant")}
                      className="btn btn-link text-decoration-none text-muted mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
