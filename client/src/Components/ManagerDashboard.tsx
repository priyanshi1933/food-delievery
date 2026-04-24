

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [managedRestaurants, setManagedRestaurants] = useState<any[]>([]);
  const [selectedResId, setSelectedResId] = useState<string>("");
 const managerName = localStorage.getItem("name") || "Manager";
  const token = localStorage.getItem("token");
  const navigate=useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("managed_restaurants");
    if (raw) {
      const parsed = JSON.parse(raw);
      setManagedRestaurants(parsed);
   
      const initialId = parsed[0]?._id || parsed[0]?.id || "";
      setSelectedResId(initialId);
    }
  }, []);

 
  const fetchOrders = useCallback(async () => {
    if (!selectedResId || !token) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/orders/restaurant/${selectedResId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedResId, token]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await axios.patch("http://localhost:3000/orders/status", { orderId, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      alert("Status update failed");
    }
  };

    const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const getBadge = (status: string) => {
    const config: any = {
      PENDING: "bg-warning text-dark",
      ACCEPTED: "bg-primary",
      READY: "bg-info text-white",
      PICKED_UP: "bg-secondary",
      ON_THE_WAY: "bg-dark",
      DELIVERED: "bg-success",
      CANCELLED: "bg-danger"
    };
    return `badge rounded-pill px-3 py-2 ${config[status] || "bg-light text-dark"}`;
  };

  return (
    <>
<nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3 shadow-sm">
  <div className="container">
   
    <Link className="navbar-brand fs-3 d-flex align-items-center" to="/managerDashboard">
      <i className="bi bi-stack text-primary me-2"></i>
      <span className="fw-bold text-dark">DASH<span className="text-primary">BOARD</span></span>
    </Link>

    <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#managerNav">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="managerNav">
      <div className="d-flex flex-column flex-lg-row align-items-center gap-3 ms-auto">
        
       
        <Link to="/addRestaurant" className="text-decoration-none fw-bold text-dark px-2">
          <i className="bi bi-plus-circle me-1 text-primary"></i> Add Restaurant
        </Link>

        <Link to="/dispRestaurant" className="text-decoration-none fw-bold text-dark px-2">
          <i className="bi bi-shop me-1 text-primary"></i> Display Restaurant
        </Link>

     
        <div className="vr mx-2 text-muted opacity-25 d-none d-lg-block" style={{ height: "30px" }}></div>

      
        <div className="d-flex align-items-center">
          <div className="text-end me-3">
            <p className="small mb-0 fw-bold text-dark line-height-1">{managerName}</p>
            <p className="small mb-0 text-muted" style={{ fontSize: '0.7rem' }}>Administrator</p>
          </div>
          
          <button 
            className="btn btn-outline-danger rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm" 
            style={{ width: "40px", height: "40px" }}
            onClick={handleLogout}
            title="Logout"
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>

      </div>
    </div>
  </div>
</nav>




    <div className="container-fluid py-4 bg-light min-vh-100">
      
      <div className="container">
             
       
        <div className="row g-3 align-items-center mb-4">
          <div className="col-md-6">
            <h2 className="fw-bold text-dark m-0">Store Operations</h2>
            <p className="text-muted">Manage real-time orders and tracking</p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="bg-white p-2 rounded-pill shadow-sm d-inline-block border">
              <span className="small fw-bold px-3 text-uppercase text-primary">Active Store:</span>
              <select 
                className="form-select border-0 d-inline-block w-auto bg-transparent fw-bold"
                value={selectedResId}
                onChange={(e) => setSelectedResId(e.target.value)}
              >
                {managedRestaurants.map((r: any) => (
                  <option key={r._id || r.id} value={r._id || r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

      
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
          <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold m-0">Live Orders ({orders.length})</h5>
            <button onClick={fetchOrders} className="btn btn-sm btn-light border rounded-pill">
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase small fw-bold">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Customer</th>
                  <th>Order Items</th>
                  <th>Total</th>
                  <th>Current Status</th>
                  <th className="text-end pe-4">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && orders.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-5">Connecting to kitchen...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-5 text-muted">No orders found for this restaurant.</td></tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id}>
                      <td className="ps-4 fw-bold">#{o._id.slice(-6).toUpperCase()}</td>
                      <td>
                        <div className="fw-bold">{o.customerId?.name || "Guest"}</div>
                        <small className="text-muted">{o.customerId?.phone || "No Phone"}</small>
                      </td>
                      <td>
                        <span className="text-truncate d-inline-block" style={{maxWidth: "150px"}}>
                          {o.items.map((it:any) => it.name).join(", ")}
                        </span>
                      </td>
                      <td className="fw-bold text-success">₹{o.totalAmount}</td>
                      <td><span className={getBadge(o.status)}>{o.status}</span></td>
                      <td className="text-end pe-4">
                        <div className="btn-group shadow-sm rounded-pill overflow-hidden">
                          {o.status === "PENDING" && (
                            <button className="btn btn-primary btn-sm px-3" onClick={() => handleUpdateStatus(o._id, "ACCEPTED")}>Accept</button>
                          )}
                          {o.status === "ACCEPTED" && (
                            <button className="btn btn-info btn-sm text-white px-3" onClick={() => handleUpdateStatus(o._id, "READY")}>Mark Ready</button>
                          )}
                          {(o.status === "READY" || o.status === "PICKED_UP") && (
                            <span className="text-muted small p-2">Waiting for Driver</span>
                          )}
                          {o.status === "PENDING" && (
                            <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleUpdateStatus(o._id, "CANCELLED")}>Reject</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAILED CARDS VIEW */}
        <h5 className="fw-bold mb-4">Preparation Queue</h5>
        <div className="row g-4">
          {orders.filter(o => o.status !== "DELIVERED").map((order) => (
            <div key={order._id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 hover-shadow transition">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className={getBadge(order.status)}>{order.status}</span>
                      <div className="mt-2 small text-muted">ID: #{order._id.slice(-8)}</div>
                    </div>
                    <h4 className="fw-bold text-success m-0">₹{order.totalAmount}</h4>
                  </div>
                  
                  <h6 className="fw-bold mb-1">{order.customerId?.name}</h6>
                  <p className="small text-muted mb-3 border-bottom pb-2">
                    <i className="bi bi-geo-alt me-1"></i> {order.deliveryAddress}
                  </p>

                  <div className="bg-light p-3 rounded-3 mb-3">
                    <label className="small text-uppercase fw-bold text-muted mb-2 d-block">Items</label>
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="d-flex justify-content-between small mb-1">
                        <span>{item.name} <span className="text-muted">x{item.quantity}</span></span>
                        <span>₹{item.priceAtTime * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="d-grid gap-2">
                    {order.status === "PENDING" && (
                      <button className="btn btn-primary rounded-pill" onClick={() => handleUpdateStatus(order._id, "ACCEPTED")}>Start Preparing</button>
                    )}
                    {order.status === "ACCEPTED" && (
                      <button className="btn btn-success rounded-pill" onClick={() => handleUpdateStatus(order._id, "READY")}>Handover to Driver</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default ManagerDashboard;
