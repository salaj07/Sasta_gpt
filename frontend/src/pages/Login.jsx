import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // console.log(form);

    axios
      .post(
        "https://backbench-buddy.onrender.com/api/auth/login",
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true },
      )
      .then((res) => {
        navigate("/");
        // console.log(res);
        // alert("Login successful");
      })
      .catch((err) => {
        console.error(err);
        alert("Login failed");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="centered">
      <div className="card">
        <h1>Login</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email</label>
            <input
              className="input"
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input
              className="input"
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button className="btn" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
