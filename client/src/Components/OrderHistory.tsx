import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarUser from "./NavbarUser";
import Footer from "./Footer";

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("id");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/orders/customer/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [customerId, token]);

  const getStatusBadge = (status: string) => {
    const colors: any = { 
      PENDING: "bg-warning text-dark", 
      DELIVERED: "bg-success", 
      CANCELLED: "bg-danger",
      ON_THE_WAY: "bg-primary" 
    };
    return `badge rounded-pill px-3 ${colors[status] || "bg-secondary"}`;
  };

  return (
    <>
      <NavbarUser />
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <h2 className="fw-bold mb-4">Your Orders</h2>
          
          {loading ? (
            <div className="text-center py-5">Loading your history...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm">
              <i className="bi bi-bag-x display-1 text-muted"></i>
              <h4 className="mt-3">No orders yet</h4>
              <button className="btn btn-primary rounded-pill mt-3 px-4" onClick={() => navigate("/dashboard")}>
                Order Now
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {orders.map((order) => (
                <div key={order._id} className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <div className="bg-light rounded-circle p-3 d-inline-block">
                          <i className="bi bi-shop fs-2 text-primary"></i>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <h5 className="fw-bold mb-1">{order.restaurantId?.name || "Restaurant"}</h5>
                        <p className="text-muted small mb-0">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="fw-bold text-primary mt-1">₹{order.totalAmount}</p>
                      </div>
                 

                      <div className="col-md-3">
                        <span className={getStatusBadge(order.status)}>{order.status}</span>
                        <p className="small text-muted mt-2 mb-0">{order.items.length} Items Ordered</p>
                      </div>
                      <div className="col-md-3 text-md-end mt-3 mt-md-0">
                        <button 
                          className="btn btn-outline-primary rounded-pill px-4 me-2"
                          onClick={() => navigate(`/orders/track/${order._id}`)}
                        >
                          Track / Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
