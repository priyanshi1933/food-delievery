

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import NavbarUser from "./NavbarUser";
import Footer from "./Footer";
import { io } from "socket.io-client"; 

const socket = io("http://localhost:3000");

// --- FIX LEAFLET ICONS ---
// Default icons don't load correctly in React/Webpack/Vite
const customerIcon = new L.Icon({
  iconUrl: "https://flaticon.com",
  iconSize: [35, 35],
});
const driverIcon = new L.Icon({
  iconUrl: "https://flaticon.com",
  iconSize: [40, 40],
});
const restoIcon = new L.Icon({
  iconUrl: "https://flaticon.com",
  iconSize: [35, 35],
});

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetching data from the Backend
  const fetchTracking = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/orders/track/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Full Order Data:", res.data); // Inspect this in your browser console (F12)
console.log("Driver Object:", res.data.driverId);
      setOrder(res.data);
    } catch (err) {
      console.error("Tracking error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
     socket.emit("join_order", orderId);

    // Listen for live movement
    socket.on("driver_moved", (newCoords) => {
      setOrder((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          driverId: {
            ...prev.driverId,
            currentLocation: newCoords
          }
        };
      });
    });
    
    const interval = setInterval(fetchTracking, 10000); // Refresh every 10s
   return () => {
      socket.off("driver_moved");
    };
  }, [orderId]);

  const getStatusConfig = (status: string) => {
    const config: any = {
      PENDING: {
        percent: 15,
        label: "Order Placed",
        icon: "bi-receipt",
        color: "primary",
      },
      ACCEPTED: {
        percent: 40,
        label: "Preparing Food",
        icon: "bi-fire",
        color: "warning",
      },
      READY: {
        percent: 60,
        label: "Ready for Pickup",
        icon: "bi-box-seam",
        color: "info",
      },
      PICKED_UP: {
        percent: 75,
        label: "Picked Up",
        icon: "bi-bicycle",
        color: "info",
      },
      ON_THE_WAY: {
        percent: 90,
        label: "On the Way",
        icon: "bi-map",
        color: "primary",
      },
      DELIVERED: {
        percent: 100,
        label: "Delivered",
        icon: "bi-check-circle-fill",
        color: "success",
      },
    };
    return (
      config[status] || {
        percent: 0,
        label: "Processing",
        icon: "bi-clock",
        color: "secondary",
      }
    );
  };

  

  if (loading && !order)
    return <div className="text-center py-5">Loading Live Tracking...</div>;
  if (!order) return <div className="text-center py-5">Order Not Found</div>;

  const current = getStatusConfig(order.status);

  return (
    <>
      <NavbarUser />
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {/* LEFT COLUMN: MAP & STATUS */}
            <div className="col-lg-7">
              {/* STATUS CARD */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-center">
                <div className={`display-5 text-${current.color} mb-2`}>
                  <i className={`bi ${current.icon}`}></i>
                </div>
                <h3 className="fw-bold">{current.label}</h3>
                <div
                  className="progress mt-3 mb-2"
                  style={{ height: "8px", borderRadius: "10px" }}
                >
                  <div
                    className={`progress-bar progress-bar-striped progress-bar-animated bg-${current.color}`}
                    style={{ width: `${current.percent}%` }}
                  ></div>
                </div>
                <small className="text-muted">
                  ID: #{order._id.slice(-8).toUpperCase()}
                </small>
              </div>

              {/* LIVE MAP CONTAINER */}
              <div
                className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4"
                style={{ height: "400px", zIndex: 1 }}
              >
                <MapContainer
                  center={[order.deliveryCoords.lat, order.deliveryCoords.lng]}
                  zoom={14}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* 1. Customer Location */}
                  <Marker
                    position={[
                      order.deliveryCoords.lat,
                      order.deliveryCoords.lng,
                    ]}
                    icon={customerIcon}
                  >
                    <Popup>Your Delivery Address</Popup>
                  </Marker>

                  {/* 2. Restaurant Location */}
                  {order.restaurantId?.coordinates && (
                    <Marker
                      position={[
                        order.restaurantId.coordinates.lat,
                        order.restaurantId.coordinates.lng,
                      ]}
                      icon={restoIcon}
                    >
                      <Popup>{order.restaurantId.name}</Popup>
                    </Marker>
                  )}

                  {/* 3. Driver Live Location */}
                  {order.driverId?.currentLocation && (
                    <Marker
                      position={[
                        order.driverId.currentLocation.lat,
                        order.driverId.currentLocation.lng,
                      ]}
                      icon={driverIcon}
                    >
                      <Popup>
                        <b>{order.driverId.userId?.name}</b> is here
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              {/* DRIVER DETAILS SECTION */}
              <div className="mb-4">
              {/* Replace your current driver info block with this */}
<div className="mb-4">
 

  {order.driverId ? (
  <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
    <div className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3 text-primary">
          <i className="bi bi-person-badge fs-2"></i>
        </div>
        <div>
          <p className="text-muted small mb-0">Delivery Partner</p>
          <h5 className="fw-bold mb-0">
            {/* Shortened path: direct to name */}
            {order.driverId.name || "Driver Assigned"}
          </h5>
          <small className="text-muted">Contact: {order.driverId.phone}</small>
        </div>
      </div>
      
      {order.driverId.phone && (
        <a href={`tel:${order.driverId.phone}`} className="btn btn-dark rounded-pill px-4 shadow-sm">
          <i className="bi bi-telephone-fill me-2"></i> Call
        </a>
      )}
    </div>
  </div>
) : (
  <div className="alert alert-info rounded-4 border-0 shadow-sm p-4">
    <span>Finding a delivery partner...</span>
  </div>
)}

</div>

              </div>
            </div>

            {/* RIGHT COLUMN: TIMELINE & SUMMARY */}
            <div className="col-lg-4">
              {/* TIMELINE LOG */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h6 className="fw-bold mb-3">Timeline</h6>
                <div className="ms-2">
                  {order.statusHistory
                    .map((h: any, i: number) => (
                      <div
                        key={i}
                        className="d-flex border-start border-2 ps-3 pb-3 position-relative"
                      >
                        <div
                          className="bg-success rounded-circle position-absolute"
                          style={{
                            width: "10px",
                            height: "10px",
                            left: "-6px",
                            top: "6px",
                          }}
                        ></div>
                        <div>
                          <p className="fw-bold mb-0 small">{h.status}</p>
                          <small className="text-muted">
                            {new Date(h.timestamp).toLocaleTimeString()}
                          </small>
                        </div>
                      </div>
                    ))
                    .reverse()}
                </div>
              </div>

              {/* ORDER SUMMARY */}
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h6 className="fw-bold mb-3">
                  Summary from {order.restaurantId?.name}
                </h6>
                {order.items.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between small mb-2"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₹{item.priceAtTime * item.quantity}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between fw-bold text-primary">
                  <span>Grand Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrder;
