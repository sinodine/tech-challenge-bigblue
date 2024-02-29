import * as React from "react";
import * as ReactDOM from "react-dom";
import { Cart } from "./components/Cart/Cart";
import { Shop } from "./components/Shop/Shop";
import { NavBar } from "./components/NavBar/NavBar";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { ProductCard } from "./components/ProductCard/ProductCard";


import "./main.css";

const App = () => {
  const [products, setProducts] = React.useState([]);

  // availableProducts is an object that looks like
  // { ['product 1 name']: number of products 1 available,
  //   ['product 2 name']: number of products 2 available,
  //    ....
  //  }
  const [availableProducts, setAvailableProducts] = React.useState({});

  // inCartProducts is an object that looks like
  // { ['product 1 name']: number of products 1 in cart,
  //   ['product 2 name']: number of products 2 in cart,
  //    ....
  //  }
  // A product item is either available or in cart so that
  // product.stock = availableProducts[product.id] + inCartProducts[product.id]
  const [inCartProducts, setInCartProducts] = React.useState({});

  const [listProducts, setListProducts] = React.useState(<></>);

  // Add a product to cart.
  // Updating corresponding quantities in availableProducts and inCartProducts
  const onAddToCart = (productId) => {
    const availableBeforeAdd = availableProducts[productId];
    if (availableBeforeAdd !== 0) {
      setAvailableProducts({
        ...availableProducts,
        [productId]: availableBeforeAdd - 1,
      });
      const inCartBeforeAdd = inCartProducts[productId];
      setInCartProducts({
        ...inCartProducts,
        [productId]: inCartBeforeAdd + 1,
      });
    }
  }; // Should show an error message if the product is not available.

  // Remove a product from the cart.
  // Updating corresponding quantities in availableProducts and inCartProducts
  const onRmToCart = (productId) => {
    const availableBeforeAdd = availableProducts[productId];
    if (inCartProducts[productId] !== 0) {
      setAvailableProducts({
        ...availableProducts,
        [productId]: availableBeforeAdd + 1,
      });
      const inCartBeforeAdd = inCartProducts[productId];
      setInCartProducts({
        ...inCartProducts,
        [productId]: inCartBeforeAdd - 1,
      });
    }
  }; // Should show an error message if the product is not in the cart.

  function renderProducts(props) {
    let renderedProducts = [];
    for (let i = 0; i < props.availableProducts.length; i++) {
      renderedProducts.push(<ProductCard
        key={props.availableProducts[i].id}
        product={props.availableProducts[i]}
        inCartProducts={props.inCartProducts}
        onAddToCart={props.onAddToCart}
        onRmToCart={props.onRmToCart}
      />);
    }

    return renderedProducts;
  }

  // Fetch products from the backend
  // and store them in the products state.
  React.useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((response) => response.json())
      .then((products) => {
        setProducts(products.products);

        // Initialize availableProducts and cartProducts
        const initialAvailableProducts = products.products.reduce(
          (acc, curr) => {
            return { ...acc, [curr.id]: curr.stock };
          },
          {}
        );
        const initialInCartProducts = products.products.reduce((acc, curr) => {
          return { ...acc, [curr.id]: 0 };
        }, {});

        setAvailableProducts(initialAvailableProducts);
        setInCartProducts(initialInCartProducts);
        setListProducts(renderProducts({ availableProducts: products.products, inCartProducts: initialInCartProducts, onAddToCart: onAddToCart, onRmToCart: onRmToCart }));
      });
  }, []);


  // What is displayed.
  // Display the Shop component and the Cart component.

  const [page, setPage] = React.useState("Shop");

  // setListProducts(renderProducts({ availableProducts: products, inCartProducts: inCartProducts, onAddToCart: onAddToCart, onRmToCart: onRmToCart }));

  return (
    <div className="mainComponent">
      < NavBar
        active={page}
        setPage={setPage}
        inCartProducts={inCartProducts}
      />
      {page === "Shop" && (
        <Shop
          products={products}
          availableProducts={availableProducts}
          onAddToCart={onAddToCart}
          onRmToCart={onRmToCart}
          listProducts={listProducts}
        />
      )}
      {page === "Cart" && (
        <Cart
          products={products}
          inCartProducts={inCartProducts}
          availableProducts={availableProducts}
          onAddToCart={onAddToCart}
          onRmToCart={onRmToCart}
        />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
