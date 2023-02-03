import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./Header.css";
import { logout } from "../slices/user/userLoginSlice";

function Header() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
  };

  const wishcounter = 5;
  const cartcounter = 3;

  const [barsMenu, setBarsMenu] = useState(false);
  const handleClick = () => setBarsMenu(!barsMenu);

  return (
    <div className={barsMenu ? "nav responsive" : "nav"}>
      {/* <div className="nav-title">
        <Link className="nav-item" to="/">
          My Furniture
        </Link>
      </div> */}

      <div className="nav-menu ">
        {userInfo ? (
          <div className="dropdown">
            <span className="nav-item">My account</span>
            <div className="dropdown-content">
              <Link className="dropdown-option" to="/profile">
                Profile
              </Link>
              <p className="dropdown-option" onClick={logoutHandler}>
                Logout
              </p>
            </div>
          </div>
        ) : (
          <Link className="nav-item" to="/login">
            Login
          </Link>
        )}

        <Link className="nav-item" to="/wishlist">
          Wishlist <span>({wishcounter})</span>
        </Link>
        <Link className="nav-item" to="/contact">
          Contact
        </Link>
        <Link className="nav-item" to="/cart">
          Cart <span>({cartcounter})</span>
        </Link>
      </div>

      <button type="button" className="bars-icon" onClick={handleClick}>
        {barsMenu ? (
          <i className="fa fa-close" />
        ) : (
          <i className="fa fa-bars" />
        )}
      </button>
    </div>
  );
}

export default Header;
