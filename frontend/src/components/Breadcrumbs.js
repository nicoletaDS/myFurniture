import React from "react";
import { Link } from "react-router-dom";

import "./Breadcrumbs.css";

function Breadcrumbs({ children }) {
  return (
    <div className="breadcrumbs">
      {/* <img src="/favicon.png" alt="not"></img> */}
      <Link className="title" to="/">
        MyFurniture
      </Link>
      <div className="links">
        <Link to="/">home</Link>/{children}
      </div>
    </div>
  );
}

export default Breadcrumbs;
