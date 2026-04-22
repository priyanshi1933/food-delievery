import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditMenu = () => {
  const { menuId, restaurantId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isAvailable: true,
  });
  const [image, setImage] = useState<File | null>(null);

  // Fetch existing menu item details
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        // You might need an endpoint like /getMenuByItemId/:id or use your existing list filter
        const res = await axios.get(`http://localhost:3000/getMenu`); 
        const item = res.data.find((i: any) => i._id === menuId);
        if (item) {
          setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            isAvailable: item.isAvailable,
          });
        }
      } catch (err) {
        console.error("Error fetching menu item", err);
      }
    };
    fetchMenuItem();
  }, [menuId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("restaurantId", restaurantId || "");
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("isAvailable", String(formData.isAvailable));
    if (image) data.append("image", image);

    try {
      await axios.put(`http://localhost:3000/updateMenu/${menuId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Menu item updated!");
      navigate(`/dispMenu/${restaurantId}`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow border-0 p-4 rounded-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="fw-bold mb-4">Edit Menu Item</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Dish Name</label>
            <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea className="form-control" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Price (₹)</label>
              <input type="number" className="form-control" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Category</label>
              <input type="text" className="form-control" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
            </div>
          </div>
          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} />
            <label className="form-check-label">Available for Order</label>
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Change Image (Optional)</label>
            <input type="file" className="form-control" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-dark px-4 fw-bold">Update Dish</button>
            <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenu;
