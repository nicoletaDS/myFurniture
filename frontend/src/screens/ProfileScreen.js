import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./ProfileScreen.css";
import { getUserDetails } from "../slices/user/userDetailsSlice";
import {
  updateUserProfile,
  userUpdateProfileReset,
} from "../slices/user/userUpdateProfileSlice";
import { getOrderList } from "../slices/order/orderListSlice";
import Breadcrumbs from "../components/Breadcrumbs";
import store from "../store";

function ProfileScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderList = useSelector((state) => state.orderList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderList;

  // after the profile is updated (when success == true),
  // clear the state (reset the state.userUpdateProfile)
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.email || success) {
        dispatch(userUpdateProfileReset());
        dispatch(getUserDetails("profile"));
        dispatch(getOrderList());
      } else {
        if (user.first_name) {
          setFirstName(user.first_name);
        }
        if (user.last_name) {
          setLastName(user.last_name);
        }
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      setMessage("");
      dispatch(
        updateUserProfile({
          id: user.id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        })
      );
    }
  };

  const detailsHandler = (id) => {
    navigate(`/orders/${id}`);
  };

  return (
    <div>
      <Breadcrumbs>my account</Breadcrumbs>

      <div className="row">
        <div className="profile">
          <div className="section-title">my profile</div>

          {message && <p className="error">{message}</p>}
          {loading && <h2>Loading...</h2>}
          {error && <p className="error">{error}</p>}

          <div className="form-body">
            <form id="my-profile" onSubmit={submitHandler}>
              <label className="form-item">
                First Name:
                <input
                  type="text"
                  placeholder="enter first name"
                  value={firstName || ""}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              <label className="form-item">
                Last Name:
                <input
                  type="text"
                  placeholder="enter last name"
                  value={lastName || ""}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>

              <label className="form-item">
                Email:
                <input
                  type="email"
                  placeholder="enter email"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="form-item">
                Password:
                <input
                  type="password"
                  placeholder="enter password"
                  value={password || ""}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <label className="form-item">
                Confirm Password:
                <input
                  type="password"
                  placeholder="enter confirm password"
                  value={confirmPassword || ""}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>

              <div className="input-wrapper">
                <button className="btn form-item" type="submit">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="orders">
          <div className="section-title">my orders</div>
          <table className="my-orders">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr>
                  <td>{order.id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt : <>no</>}</td>
                  <td>
                    <button
                      className="btn form-item"
                      type="submit"
                      onClick={() => {
                        detailsHandler(order.id);
                      }}
                    >
                      Details...
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
