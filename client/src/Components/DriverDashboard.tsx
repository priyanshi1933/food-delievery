import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DriverDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const driverId = localStorage.getItem("id");
  const driverName = localStorage.getItem("name") || "Driver";

    const navigate=useNavigate();

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const available = await axios.get("http://localhost:3000/orders/available", {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setAvailableOrders(available.data);

  //     const active = await axios.get(`http://localhost:3000/orders/driver/${driverId}/active`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setActiveOrder(active.data[0] || null);
  //   } catch (err) {
  //     console.error("Error fetching driver data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  

const fetchData = async () => {
  setLoading(true);
  try {
    const available = await axios.get("http://localhost:3000/orders/available", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAvailableOrders(available.data);

    const active = await axios.get(`http://localhost:3000/orders/driver/${driverId}/active`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (active.data && active.data.length > 0) {
      setActiveOrder(active.data[0]);
    } else {
      setActiveOrder(null);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setActiveOrder(null);
  } finally {
    setLoading(false);
  }
};





  useEffect(() => {
    fetchData();
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // const handleClaim = async (orderId: string) => {
  //   try {
  //     await axios.patch("http://localhost:3000/orders/claim", { orderId, driverId }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     fetchData();
  //   } catch (err) { alert("Could not claim order"); }
  // };

const handleClaim = async (orderId: string) => {
  try {
    const response = await axios.patch("http://localhost:3000/orders/claim", 
      { orderId, driverId }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Claim successful:", response.data);
    await fetchData(); 
  } catch (err: any) {
    console.error("Claim Error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Could not claim order");
  }
};



const updateStatus = async (orderId: string, nextStatus: string) => {
  try {
    await axios.patch("http://localhost:3000/orders/status", 
      { 
        orderId: orderId, // Check if this is the correct _id string
        status: nextStatus 
      }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // IMPORTANT: Re-fetch the data to see the "Confirm Delivery" button
    fetchData(); 
  } catch (err) { 
    alert("Update failed. Check console for details."); 
    console.error(err);
  }
};



  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3 shadow-sm">
  <div className="container">
   <Link className="navbar-brand fs-3 d-flex align-items-center" to="/driverDashboard">
      <i className="bi bi-stack text-primary me-2"></i>
      <span className="fw-bold text-dark">DASH<span className="text-primary">BOARD</span></span>
    </Link>

    {/* MOBILE TOGGLE */}
    <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#managerNav">
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* COLLAPSIBLE CONTENT (Pushed to Right) */}
    <div className="collapse navbar-collapse" id="managerNav">
      <div className="d-flex flex-column flex-lg-row align-items-center gap-3 ms-auto">
        
      

        {/* VERTICAL DIVIDER (Hidden on mobile) */}
        <div className="vr mx-2 text-muted opacity-25 d-none d-lg-block" style={{ height: "30px" }}></div>

        {/* PROFILE & LOGOUT */}
        <div className="d-flex align-items-center">
          <div className="text-end me-3">
            <p className="small mb-0 fw-bold text-dark line-height-1">{driverName}</p>
            <p className="small mb-0 text-muted" style={{ fontSize: '0.7rem' }}>Driver</p>
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
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Driver Portal</h2>

      {/* SECTION: ACTIVE DELIVERY */}
{activeOrder ? (
  <div className="card border-primary shadow-sm rounded-4 mb-5">
    <div className="card-header bg-primary text-white py-3">
      <h5 className="m-0 fw-bold">Current Delivery in Progress</h5>
    </div>
    <div className="card-body p-4">
      <div className="row align-items-center"> 
        <div className="col-md-7 mb-3 mb-md-0">
          <h6 className="mb-2">
            <i className="bi bi-person-circle me-2 text-primary"></i>
            <strong>Customer:</strong> {activeOrder.customerId?.name || "N/A"}
          </h6>
          <p className="text-muted mb-3">
            <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
            <strong>Address:</strong> {activeOrder.deliveryAddress || "Althan"}
          </p>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
            Current Status: {activeOrder.status}
          </span>
        </div>
        
        <div className="col-md-5 text-md-end">
          {activeOrder.status === "PICKED_UP" && (
            <button 
              className="btn btn-warning btn-lg w-100 fw-bold shadow-sm" 
              onClick={() => updateStatus(activeOrder._id, "ON_THE_WAY")}
            >
              <i className="bi bi-truck me-2"></i> Start Driving
            </button>
          )}
          {activeOrder.status === "ON_THE_WAY" && (
            <button 
              className="btn btn-success btn-lg w-100 fw-bold shadow-sm" 
              onClick={() => updateStatus(activeOrder._id, "DELIVERED")}
            >
              <i className="bi bi-check-circle me-2"></i> Confirm Delivery
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
) : (
  <div className="alert alert-info rounded-4 border-0 shadow-sm p-4">
    <i className="bi bi-info-circle me-2"></i>
    You have no active deliveries. Claim an order below.
  </div>
)}




      {/* SECTION: AVAILABLE ORDERS */}
      <h4 className="fw-bold mb-3">Available Pickups</h4>
      <div className="row g-3">
        {availableOrders.length === 0 ? <p>No orders ready for pickup right now.</p> : 
          availableOrders.map((order) => (
            <div key={order._id} className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <h6 className="fw-bold">{order.restaurantId?.name}</h6>
                  <p className="small text-muted">{order.restaurantId?.address}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-success">Total: ₹{order.totalAmount}</span>
                    <button 
                      className="btn btn-sm btn-outline-primary rounded-pill px-4"
                      disabled={!!activeOrder}
                      onClick={() => handleClaim(order._id)}
                    >
                      Claim & Pick Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
    </>
  );
};

export default DriverDashboard;
