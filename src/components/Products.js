import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import data from "./data.json";
import Cart, { generateCartItemsFrom, getTotalCartValue } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const [product, setProduct] = useState([]);
  const [isLoading, setLoading] = useState(false);
  
  const [item, setItems] = useState([]);
  useEffect(() => {
    performAPICall();
    fetchCart(token);
  }, []);
  // useEffect(() => {
  //   fetchCart(token);
  // }, [item]);

  const performAPICall = async () => {
    setLoading(true);
    try {
      let url = `${config.endpoint}/products`;
      let res = await axios.get(url);
      setProduct(res.data);
    } catch (e) {
      console.log(e.message);
    }
    setLoading(false);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const [notFound, setNotFound] = useState(false);
  // const [text, setText] = useState("");

  const performSearch = async (text) => {
    try {
      let url = `${config.endpoint}/products/search?value=${text}`;
      let res = await axios.get(url);
      setProduct(res.data);
    } catch (e) {
      setNotFound(true);
      console.log(e.message);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const debounceSearch = (event, debounceTimeout) => {
    let value = event.target.value;
    if (value) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      let timer = setTimeout(() => performSearch(value), 500);
      setDebounceTimeout(timer);
    } else {
      setNotFound(false);
    }
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  let token = localStorage.getItem("token");
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let url = `${config.endpoint}/cart`;
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(res.data);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let alreadyCart = [];
    items.forEach((i) => {
      if (i.productId === productId) {
        alreadyCart.push(i);
      }
    });

    if (alreadyCart.length > 0) {
      return true;
      // console.log("true")
    }
    return false;
    // console.log("false")
    // console.log(items)
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

  const addToCart = async (
    token,
    items,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
        autoHideDuration: 2000,
      });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
          autoHideDuration: 2000,
        }
      );
      return;
    }

    try {
      let res = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setItems(res.data);
    } catch (e) {
      let message = e?.response?.data?.message;
      message
        ? enqueueSnackbar(message, { variant: "error", autoHideDuration: 2000 })
        : enqueueSnackbar(
            "Could not fetch products. Check that the backend is running, reachable and returns valid JSON",
            {
              variant: "error",
              autoHideDuration: 2000,
            }
          );
    }
  };
  
  return (
    <div>
      <Header hasHiddenAuthButtons={false}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <Box className="search-desktop-con">
          <TextField
            className="search-desktop"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={(e) => {
              debounceSearch(e, debounceTimeout);
            }}
          />
        </Box>
      </Header>
      {/* Search view for mobiles */}

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e, debounceTimeout);
        }}
      />
      {token ? (
        <Grid container>
          <Grid item md={9}>
            <Grid container spacing={2}>
              <Grid item className="product-grid">
                <Box className="hero">
                  <p className="hero-heading">
                    India’s{" "}
                    <span className="hero-highlight">FASTEST DELIVERY</span> to
                    your door step
                  </p>
                </Box>
              </Grid>
              {isLoading ? (
                <Box className="loading">
                  <CircularProgress />
                  Loading Products...
                </Box>
              ) : notFound ? (
                <Box className="loading">
                  <SentimentDissatisfied />
                  No products found
                </Box>
              ) : (
                product.map((i) => (
                  <Grid item xs={6} md={3} key={i._id}>
                    <ProductCard
                      product={i}
                      handleAddToCart={async () => {
                        await addToCart(token, item, i._id, 1, {
                          preventDuplicate: true,
                        });
                      }}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={3} className="bac">
            <Cart items={generateCartItemsFrom(item,product)} products={product} handleQuantity={addToCart} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          {isLoading ? (
            <Box className="loading">
              <CircularProgress />
              Loading Products...
            </Box>
          ) : notFound ? (
            <Box className="loading">
              <SentimentDissatisfied />
              No products found
            </Box>
          ) : (
            product.map((i) => (
              <Grid item xs={6} md={3} key={i._id}>
                <ProductCard
                  product={i}
                  handleAddToCart={async () => {
                    await addToCart(token, item, product._id, product.qty);
                  }}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}

      <Footer />
    </div>
  );
};

export default Products;
