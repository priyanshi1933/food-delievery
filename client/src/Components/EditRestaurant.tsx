


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditRestaurant = () => {
  const { id } = useParams(); // Get the Restaurant ID from URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    categories: "",
    rating: 1,
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch existing data and fill the form
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // IMPORTANT: Use the 'getSingleRestaurant' endpoint we created
        const res = await axios.get(`http://localhost:3000/getSingleRestaurant/${id}`);
        
        const data = res.data;

        if (data) {
          setFormData({
            name: data.name || "",
            address: data.address || "",
            // Convert Array ["Pizza", "Pasta"] -> String "Pizza, Pasta"
            categories: Array.isArray(data.categories) ? data.categories.join(", ") : "",
            rating: data.rating || 1,
          });
        }
      } catch (err) {
        console.error("Error fetching data", err);
        alert("Could not load restaurant details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  // 2. Handle the Update (PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    
    // Convert string back to array for Backend
    const catArray = formData.categories.split(",").map(c => c.trim());
    catArray.forEach(cat => data.append("categories", cat));
    
    data.append("rating", formData.rating.toString());
    if (image) data.append("image", image);

    try {
      await axios.put(`http://localhost:3000/updateRestaurant/${id}`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      alert("Restaurant updated successfully!");
      navigate("/dispRestaurant"); // Redirect back to list
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading details...</div>;

  return (
    <div className="container py-5">
      <div className="card shadow border-0 p-4 rounded-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="fw-bold mb-4">Edit Restaurant</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Address</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Categories (Comma separated)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Italian, Chinese"
              value={formData.categories} 
              onChange={(e) => setFormData({ ...formData, categories: e.target.value })} 
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Rating (1-5)</label>
            <input 
              type="number" 
              className="form-control" 
              max="5" min="1" 
              value={formData.rating} 
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} 
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">New Image (Optional)</label>
            <input 
              type="file" 
              className="form-control" 
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} 
            />
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary px-4 fw-bold">Save Changes</button>
            <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate('/dispRestaurant')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurant;
