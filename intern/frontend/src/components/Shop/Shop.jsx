import * as React from "react";
import "./index.css";

import { ProductCard } from "../ProductCard/ProductCard";
import { render } from "react-dom";

// function renderProducts(props) {
//   let renderedProducts = <></>;
//   for (let i = 0; i < props.availableProducts.length; i++) {
//     renderedProducts += <ProductCard
//       key={props.availableProducts[i].id}
//       product={props.availableProducts[i]}
//       inCartProducts={props.inCartProducts}
//       onAddToCart={props.onAddToCart}
//       onRmToCart={props.onRmToCart}
//     />;
//   }

//   return renderedProducts;
// }

const Shop = (props) => {

  // let listProducts = <></>;

  // listProducts = renderProducts(props);

  var listCategories = [];
  for (let i = 0; i < props.availableProducts.length; i++) {
    if (!listCategories.includes(props.availableProducts[i].category)) {
      listCategories.push(props.availableProducts[i].category);
    }
  };

  return (
    <div className="container-shop">
      {/* <div className="container-category">Category:
        <select name="custom-select" id="category">
          <option value="all">All</option>
          {listCategories.map((category) => (
            <option value={category}>{category}</option>
          ))}
        </select>
      </div> */}
      <ul className="container-products">
        {props.listProducts}
      </ul>
    </div>);
};

export { Shop };
