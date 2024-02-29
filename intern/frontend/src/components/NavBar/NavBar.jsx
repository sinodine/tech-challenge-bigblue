import * as React from "react";
// import { Link } from "react-router-dom";
import "./index.css";
import { IconName } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { FiHome } from "react-icons/fi";

const NavBar = (props) => {
  var count = 0;
  for (let i = 0; i < props.inCartProducts.length; i++) {
    if (props.inCartProducts[i] > 0) {
      count++;
    }
  }
  return (
    <div className="NavBar">
      <div className="link">
        <p>Logo</p>
      </div>
      <button className={`link${props.active === "Shop" ? "-active" : ""}`}
        onClick={() => { props.setPage("Shop") }}>
        <FiHome size={24} />
        <p>Shop</p>
      </button>
      <button className={`link${props.active === "Cart" ? "-active" : ""}`} onClick={() => { props.setPage("Cart") }}>
        <FiShoppingCart size={24} />
        <p>My Cart</p>
        <div className="nbItems">{count}</div>
      </button>
    </div>
  );
};

export { NavBar };
