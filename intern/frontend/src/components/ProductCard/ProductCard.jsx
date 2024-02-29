import * as React from "react";
import "./index.css";

import { FiShoppingCart } from "react-icons/fi";

{/* <ProductCard
  key={props.availableProducts[i].id}
  product={props.availableProducts[i]}
  inCartProducts={props.inCartProducts}
  onAddToCart={props.onAddToCart}
  onRmToCart={props.onRmToCart}
/> */}

// type Product struct {
// 	ID       string `json:"id"`
// 	Name     string `json:"name"`
// 	Price    int    `json:"price"`
// 	Stock    int    `json:"stock"`
// 	ImageURL string `json:"image_url"`
// 	Category string `json:"category"`
// }

const ProductCard = (props) => {
  return (
    (<li className="container">
      <div className="card-img-container" style={{ paddingTop: "100px" }}>
        <img
          className="card-img-top h-100 w-100"
          src={props.product.image_url}
          alt={props.product.name}
        />
      </div>
      {/* Price and add to cart button */}
      <div className="card-price">
        <p className="price">{props.product.price}$</p>
        <button
          className="btn-product"
          onClick={() => props.onAddToCart(props.product.id)}
        // className="btn btn-primary"
        >
          + <FiShoppingCart size={20} />
        </button>
      </div>
      <div className="card-info">
        <p className="product-name">{props.product.name}</p>
        {/* <p>{props.product.category}</p> */}
        <p className="product-available">{props.product.stock} available</p>

      </div>
    </li>)
  );
};

export { ProductCard };
