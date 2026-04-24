

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavbarUser from "./NavbarUser";
import Footer from "./Footer";

const DisplayMenu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const syncCartWithStorage = () => {
      const savedItems = JSON.parse(localStorage.getItem("cart_items") || "[]");
      const currentRestoQty: any = {};
      savedItems.forEach((item: any) => {
        if (item.restaurantId === restaurantId) {
          currentRestoQty[item._id] = item.quantity;
        }
      });
      setCart(currentRestoQty);
    };

    if (restaurantId) {
      fetchMenu();
      syncCartWithStorage();
    }
  }, [restaurantId]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/getMenuById/${restaurantId}`,
      );
      setMenuItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (menuId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:3000/deleteMenu/${menuId}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { restaurantId: restaurantId },
        });
        setMenuItems((prev) => prev.filter((item) => item._id !== menuId));
        alert("Item deleted successfully!");
      } catch (err: any) {
        console.error("Delete error", err);
        alert(err.response?.data?.message || "Failed to delete item.");
      }
    }
  };

  const changeQty = (id: string, delta: number) => {
    const globalCart = JSON.parse(localStorage.getItem("cart_items") || "[]");
    const itemIndex = globalCart.findIndex((item: any) => item._id === id);
    let newGlobalCart = [...globalCart];

    if (itemIndex > -1) {
      const newQty = newGlobalCart[itemIndex].quantity + delta;
      if (newQty <= 0) {
        newGlobalCart.splice(itemIndex, 1);
      } else {
        newGlobalCart[itemIndex].quantity = newQty;
      }
    } else if (delta > 0) {
      const itemInfo = menuItems.find((m) => m._id === id);
      if (itemInfo) {
        newGlobalCart.push({ ...itemInfo, restaurantId, quantity: 1 });
      }
    }
 localStorage.setItem("current_restaurant_id", restaurantId || ""); 
  
  localStorage.setItem("cart_items", JSON.stringify(newGlobalCart));
    const updatedLocalQty: any = {};
    newGlobalCart.forEach((item: any) => {
      if (item.restaurantId === restaurantId) {
        updatedLocalQty[item._id] = item.quantity;
      }
    });
    setCart(updatedLocalQty);
    window.dispatchEvent(new Event("cartUpdate"));
  };


  
  return (
    <>
       {role === "customer" && (
    <NavbarUser/>
       )}
    <div className="container py-5">
     
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Menu Items</h2>
        {role === "manager" && (
          <button
            className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm"
            onClick={() => navigate(`/addMenu/${restaurantId}`)}
          >
            <i className="bi bi-plus-lg me-2"></i>Add New Dish
          </button>
        )}
      </div>

      <div className="row g-4">
        {menuItems.map((item) => (
          <div key={item._id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <img
                src={`http://localhost:3000/${item.image}`}
                height="200"
                className="card-img-top object-fit-cover"
                alt={item.name}
              />
              <span className="position-absolute top-0 start-0 m-3 badge rounded-pill bg-dark bg-opacity-75">
                {item.category || "Food"}
              </span>
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold mb-0">{item.name}</h5>
                  <span className="badge bg-light text-dark border fw-bold">
                    ₹{item.price}
                  </span>
                  <p
                    className={`small fw-bold mb-2 ${item.isAvailable ? "text-success" : "text-danger"}`}
                  >
                    {item.isAvailable ? "● Available" : "● Out of Stock"}
                  </p>
                </div>

                <p className="text-muted small mb-4 flex-grow-1">{item.description}</p>

              
                <div className="d-grid gap-2">
                  {role === "manager" ? (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-success rounded-3 flex-grow-1 fw-semibold"
                        onClick={() =>
                          navigate(`/editMenu/${item._id}/${restaurantId}`)
                        }
                      >
                        <i className="bi bi-pencil-square me-2"></i>Edit
                      </button>
                      <button
                        className="btn btn-outline-danger rounded-3 flex-grow-1 fw-semibold"
                        onClick={() => handleDelete(item._id)}
                      >
                        <i className="bi bi-trash3 me-2"></i>Delete
                      </button>
                    </div>
                  ) : (
                    <>
                      {cart[item._id] ? (
                        <div className="input-group border border-dark rounded-pill overflow-hidden">
                          <button
                            className="btn btn-white border-0 px-3"
                            onClick={() => changeQty(item._id, -1)}
                          >
                            -
                          </button>
                          <span className="input-group-text bg-white border-0 flex-grow-1 justify-content-center fw-bold">
                            {cart[item._id]}
                          </span>
                          <button
                            className="btn btn-white border-0 px-3"
                            onClick={() => changeQty(item._id, 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-dark w-100 rounded-pill fw-bold"
                          onClick={() => changeQty(item._id, 1)}
                        >
                          Add to Cart
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
     {role === "customer" && (
    <Footer/>
     )}
    </>
  );
};

export default DisplayMenu;
