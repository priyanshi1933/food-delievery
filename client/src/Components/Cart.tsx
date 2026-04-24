

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarUser from "./NavbarUser";
import Footer from "./Footer";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem("cart_items");
      if (data) {
        setCartItems(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to parse cart items:", error);
      setCartItems([]);
    }
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = subtotal + 40; // Delivery fee

 
  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart_items", JSON.stringify(updatedCart));
    
    window.dispatchEvent(new Event("cartUpdate"));
    window.dispatchEvent(new Event("storage"));
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("id");
    const restaurantId = cartItems.length > 0 ? cartItems[0].restaurantId : localStorage.getItem("current_restaurant_id");

  if (!restaurantId) {
    return alert("Restaurant ID is missing. Please clear your cart and add items again.");
  }
   

    if (!address) return alert("Please enter a delivery address.");
    if (!token) return navigate("/login");

    setLoading(true);
    const orderData = {
      customerId,
      restaurantId,
      items: cartItems.map(item => ({
        menuItemId: item._id,
        name: item.name,
        priceAtTime: item.price,
        quantity: item.quantity
      })),
      deliveryAddress: address,
      deliveryCoords: { lat: 21.1702, lng: 72.8311 }, 
      totalAmount
    };
   console.log("Payload being sent:", orderData);
    try {
      const res = await axios.post("http://localhost:3000/orders/checkout", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Order Placed Successfully!");
      localStorage.removeItem("cart_items");
      window.dispatchEvent(new Event("cartUpdate")); 
      navigate(`/orders/track/${res.data._id}`); 
    } catch (err: any) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <NavbarUser/>
    <div className="bg-light min-vh-100 pb-5 mt-2">
    
      <div className="bg-white shadow-sm py-3 mb-4">
        <div className="container d-flex align-items-center">
          <button className="btn btn-link text-dark p-0 me-3" onClick={() => navigate(-1)}>
            <i className="bi bi-chevron-left fs-4"></i>
          </button>
          <h3 className="fw-bold mb-0">Checkout</h3>
        </div>
      </div>

      <div className="container">
        <div className="row g-4 position-relative">
          <div className="col-lg-8">
         
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold mb-3">Delivery Address</h5>
              <textarea 
                className="form-control border-0 bg-light rounded-3 p-3" 
                rows={3} 
                placeholder="Enter your full delivery address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

        
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-4">Items in Cart</h5>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <div className="d-flex align-items-center flex-grow-1">
                      <img src={`http://localhost:3000/${item.image}`} width="60" height="60" className="rounded-3 me-3 object-fit-cover shadow-sm" alt="" />
                      <div>
                        <h6 className="mb-0 fw-bold">{item.name}</h6>
                        <small className="text-muted">₹{item.price} x {item.quantity}</small>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <span className="fw-bold me-4">₹{item.price * item.quantity}</span>
                   
                      <button 
                        className="btn btn-outline-danger btn-sm rounded-pill border-0" 
                        onClick={() => removeItem(item._id)}
                      >
                        <i className="bi bi-trash3 fs-5"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-cart-x display-4 text-muted"></i>
                  <p className="text-muted mt-2">Your cart is empty.</p>
                  <button className="btn btn-dark rounded-pill mt-2" onClick={() => navigate("/dashboard")}>
                    Add Items
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px',zIndex: 10 }}>
              <h5 className="fw-bold mb-4">Payment Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Delivery Fee</span>
                <span className="text-success fw-bold">₹40</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold">Total Amount</h5>
                <h5 className="fw-bold text-primary">₹{totalAmount}</h5>
              </div>

              <button 
                className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow" 
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : "Place Your Order"}
              </button>
              
             
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CartPage;

