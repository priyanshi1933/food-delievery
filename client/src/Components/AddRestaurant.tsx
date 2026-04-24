


import React, { useState, type ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../Utils/auth";

interface IRestaurant {
  name: string;
  address: string;
  categories: string[];
  rating: number;
  image:File | null;
  managerId: string;
}

const AddRestaurant = () => {
  const getManagerIdFromToken = (): string => {
    const token = getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.id || decoded.sub || "";
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
    return "";
  };

  const [msg, setMsg] = useState({ name: "", address: "",image:"" });
  const [data, setData] = useState<IRestaurant>({
    name: "",
    address: "",
    categories: [],
    rating: 0,
    image:null,
    managerId: getManagerIdFromToken()
  });
  const navigate = useNavigate();

 const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData((prev) => ({ ...prev, image: e.target.files![0] }));
      setMsg((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "categories") {
      const select = e.target as HTMLSelectElement;
      const values = Array.from(select.selectedOptions).map((option) => option.value);
      setData((prev) => ({ ...prev, [name]: values }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
    setMsg((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let validationErrors = { name: "", address: "",image:"" };
    let hasError = false;

    if (!data.name) { validationErrors.name = "Restaurant name is required"; hasError = true; }
    if (!data.address) { validationErrors.address = "Address is required"; hasError = true; }
    if (!data.image) { validationErrors.image = "Please upload an image"; hasError = true; }

    setMsg(validationErrors);
    if (hasError) return;

    try {
   
    const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("rating", data.rating.toString());
      formData.append("managerId", data.managerId);
      formData.append("image", data.image as File); 
      data.categories.forEach(cat => formData.append("categories", cat));

      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/addRestaurant`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        },
      });
      
      alert("Restaurant Created Successfully");
      navigate("/dispRestaurant");
    } catch (error: any) {
      alert("Error adding restaurant. Please try again.");
    }
    
  };

  return (
    <div className="bg-light min-vh-100">
      {/* <Navbar /> */}
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">
                
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark">Register Restaurant</h2>
                  <p className="text-muted small">Fill in the details to list your business</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Restaurant Name</label>
                    <input
                      type="text"
                      name="name"
                      value={data.name}
                      placeholder="e.g. The Italian Bistro"
                      onChange={handleChange}
                      className={`form-control form-control-lg rounded-3 ${msg.name ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{msg.name}</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Location / Address</label>
                    <textarea
                      name="address"
                      rows={2}
                      value={data.address}
                      placeholder="Full street address"
                      onChange={handleChange}
                      className={`form-control rounded-3 ${msg.address ? 'is-invalid' : ''}`}
                    ></textarea>
                    <div className="invalid-feedback">{msg.address}</div>
                  </div>
                    <div className="mb-3">
                    <label className="form-label fw-semibold">Restaurant Banner Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={`form-control ${msg.image ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{msg.image}</div>
                  </div>

                  <div className="row">
                
                    <div className="col-md-8 mb-3">
                      <label className="form-label fw-semibold small text-uppercase text-muted">Categories</label>
                      <select
                        multiple
                        name="categories"
                        value={data.categories}
                        onChange={handleChange}
                        className="form-select rounded-3"
                        style={{ height: '100px' }}
                      >
                        <option value="Italian">🍝 Italian</option>
                        <option value="Punjabi">🥘 Punjabi</option>
                        <option value="Chinese">🍜 Chinese</option>
                        <option value="Desserts">🍰 Desserts</option>
                        <option value="Fast Food">🍔 Fast Food</option>
                      </select>
                      <div className="form-text mt-1" style={{fontSize: '0.7rem'}}>Hold Ctrl (Cmd) to select multiple</div>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold small text-uppercase text-muted">Rating</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 rounded-start-3 text-warning">★</span>
                        <input
                          type="number"
                          name="rating"
                          min="0"
                          max="5"
                          step="0.1"
                          value={data.rating}
                          onChange={handleChange}
                          className="form-control border-start-0 rounded-end-3"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button
                      type="submit"
                      className="btn btn-dark btn-lg rounded-pill fw-bold shadow-sm py-3"
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      Create Restaurant
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

export default AddRestaurant;

