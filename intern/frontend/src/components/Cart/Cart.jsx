import * as React from "react";
import "./index.css";

const Cart = (props) => {
  return (
    <div className="card w-50 m-4 pb-4">
      <h1 className="card-header">Shopping Cart</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Quantity</th>
            <th scope="col">Available</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {props.products.map((product) => (
            // props.inCartProducts[product.id] > 0 &&
            <tr key={product.id}>
              <td>{product.name}</td>
              <td className="line">
                <>
                  <button
                    onClick={() => props.onRmToCart(product.id)}
                    className="btn btn-item btn-tertiary red-btn"
                  >
                    -
                  </button>
                  <span style={{ minWidth: "60px" }}>
                    {props.inCartProducts[product.id]}</span>
                  <button
                    onClick={() => props.onAddToCart(product.id)}
                    className="btn btn-item btn-tertiary green-btn"
                  >
                    +
                  </button>
                </>
              </td>
              <td>{props.availableProducts[product.id]}</td>
              <td>{product.price}$</td>
            </tr>
          ))}
        </tbody>
      </table>
      <span className="mx-auto">Total: {" "}
        {props.products
          .map((p) => props.inCartProducts[p.id] * p.price)
          .reduce((a, b) => a + b, 0)}$
      </span>
    </div >
  );
};

export { Cart };
