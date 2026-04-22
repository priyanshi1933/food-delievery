import React, { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Api/auth";
import { saveToken } from "../Utils/auth";

interface IUser {
  email: string;
  password: string;
}

const Login = () => {
  const [msg, setMsg] = useState({ email: "", password: "" });
  const [user, setUser] = useState<IUser>({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(() => ({ ...user, [name]: value }));
    setMsg((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let validationErrors = { email: "", password: "" };
    let hasError = false;

    if (user.email === "") {
      validationErrors.email = "Please enter email";
      hasError = true;
    }
    if (user.password === "") {
      validationErrors.password = "Please enter password";
      hasError = true;
    } else if (user.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long";
      hasError = true;
    }

    setMsg(validationErrors);
    if (hasError) return;

    try {
      const res = await loginUser(user.email, user.password);
      saveToken(res.data.token);
     
      const userRole = res.data.role;
       const userId = res.data.id ;
     
      localStorage.setItem("role", userRole);
       localStorage.setItem("id", userId);
      alert("Login Successfully");
      if (userRole === "customer") {
        navigate("/dispRestaurant");
      } else if(userRole==="manager" || userRole==="driver"){
        navigate("/addRestaurant");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { field, message } = error.response.data;
        setMsg((prev) => ({ ...prev, [field]: message }));
      } else {
        alert("Network error. Please check your connection.");
      }
    }
  };

  const styles = {
    wrapper: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f8f9fa",
      padding: "20px",
    },
    card: {
      background: "white",
      padding: "2.5rem",
      borderRadius: "15px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      width: "100%",
      maxWidth: "450px",
    },
    errorText: {
      color: "#dc3545",
      fontSize: "0.85rem",
      minHeight: "20px",
      marginTop: "4px",
    },
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2
          className="text-center mb-4"
          style={{ fontWeight: 700, color: "#333" }}
        >
          Welcome Back
        </h2>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={user.email}
            placeholder="Enter your email"
            onChange={handleChange}
            className={`form-control ${msg.email ? "is-invalid" : ""}`}
          />
          <div style={styles.errorText}>{msg.email}</div>
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            placeholder="Enter your password"
            onChange={handleChange}
            className={`form-control ${msg.password ? "is-invalid" : ""}`}
          />
          <div style={styles.errorText}>{msg.password}</div>
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100 py-2 mb-3"
          style={{ borderRadius: "8px", fontWeight: 600 }}
        >
          Login
        </button>

        <div className="text-center">
          <p className="mb-0 text-muted">Don't have an account?</p>
          <Link
            to="/register"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "#667eea",
            }}
          >
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
