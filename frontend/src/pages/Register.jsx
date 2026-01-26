import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // console.log("Register submit", form);
    // alert("Submitted: " + JSON.stringify(form));
    axios
      .post(
        "https://backbench-buddy.onrender.com/api/auth/register",
        {
          email: form.email,
          fullName: {
            firstName: form.firstName,
            lastName: form.lastName,
          },
          password: form.password,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        navigate("/");
        // console.log(res);
        // alert("Registration successful");
      })
      .catch((err) => {
        console.error(err);
        alert("Registration failed");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="centered">
      <div className="card">
        <h1>Register</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label className="label">First name</label>
              <input
                className="input"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
            </div>
            <div>
              <label className="label">Last name</label>
              <input
                className="input"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Email</label>
            <input
              className="input"
              name="email"
              type="email"
              value={form.email}
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
              value={form.password}
              onChange={handleChange}
              placeholder="Choose a password"
            />
          </div>

          <button className="btn" type="submit">
            Create account
          </button>
        </form>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
