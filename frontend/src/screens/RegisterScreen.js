import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./RegisterScreen.css";
import FormContainer from "../components/FormContainer";
import { register } from "../slices/user/userRegisterSlice";
import Breadcrumbs from "../components/Breadcrumbs";

function LoginScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, userInfo, error } = userRegister;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      setMessage("");
      dispatch(register(firstName, lastName, email, password));
    }
  };

  return (
    <FormContainer>
      <h1 className="form-title">Register</h1>
      <Breadcrumbs>Register</Breadcrumbs>
      {message && <p className="error">{message}</p>}
      {loading && <h2>Loading...</h2>}
      {error && <p className="error">{error}</p>}

      <div className="form-body">
        <form onSubmit={submitHandler}>
          <label className="form-item">
            First Name:
            <input
              type="text"
              placeholder="enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>

          <label className="form-item">
            Last Name:
            <input
              type="text"
              placeholder="enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>

          <label className="form-item">
            Email:
            <input
              required
              type="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="form-item">
            Password:
            <input
              required
              type="password"
              placeholder="enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="form-item">
            Confirm Password:
            <input
              required
              type="password"
              placeholder="enter confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          <div className="input-wrapper">
            <button className="btn form-item" type="submit">
              Register
            </button>
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Already a customer?
            </Link>
          </div>
        </form>
      </div>
    </FormContainer>
  );
}

export default LoginScreen;
