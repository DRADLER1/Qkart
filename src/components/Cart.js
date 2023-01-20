import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, Card, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

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

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  //SIR KA METHOD
  // let cartItem = cartData.map((i) => ({
  //   ...i,
  //   ...productsData.find((p) => i.productId === p._id),
  // }));
  // return cartItem

  //MERA METHOD
  if (!cartData) return;
  let cartItem = [];
  for (let i = 0; i < cartData.length; i++) {
    for (let j = 0; j < productsData.length; j++) {
      if (cartData[i].productId === productsData[j]._id) {
        productsData[j].qty = cartData[i].qty;
        cartItem.push(productsData[j]);
      }
    }
  }
  return cartItem;

  // for(let j = 0 ; j<productsData.length ; i++){
  //   console.log(productsData[j])
  // }
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  if (!items) return 0;
  const total = items
    .map((i) => i.cost * i.qty)
    .reduce((total, n) => total + n);
  return total;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  let itemNum = 0;
  items.forEach((i) => (itemNum += i.qty));
  return itemNum;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const ItemQuantity = ({ readOnly, value, handleAdd, handleDelete }) => {
  if (readOnly) {
    return (
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
          Qty:{value}
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  }
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const Cart = ({ isReadOnly = false, products, items = [], handleQuantity }) => {
  const history = useHistory();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }
  let token = localStorage.getItem("token");
  const displayCart = (item, id) => {
    return (
      <Box display="flex" alignItems="flex-start" padding="1rem" key={id}>
        <Box className="image-container">
          <img
            // Add product image
            src={item.image}
            // Add product name as alt eext
            alt={item.name}
            width="100%"
            height="100%"
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="6rem"
          paddingX="1rem"
        >
          <div>{item.name}</div>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <ItemQuantity
              // Add required props by checking implementation
              readOnly={isReadOnly}
              value={item.qty}
              handleAdd={async () => {
                await handleQuantity(token, items, item._id, item.qty + 1);
              }}
              handleDelete={async () => {
                await handleQuantity(token, items, item._id, item.qty - 1);
              }}
            />
            <Box padding="0.5rem" fontWeight="700">
              ${item.cost}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((i) => displayCart(i, i._id))}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {isReadOnly ? null : (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                history.push("/checkout");
                localStorage.setItem("total", getTotalCartValue(items));
              }}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly ? (
        <Box className="cart">
          <Box padding={2}>
            <Typography variant="h5" fontWeight="600" padding={2}>
              Order Details
            </Typography>
            <Box display="flex" justifyContent="space-between" pl={2}>
              <Typography variant="inherit">Products</Typography>
              <Typography variant="inherit">{getTotalItems(items)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" pl={2} pt={2}>
              <Typography variant="inherit">Subtotal</Typography>
              <Typography variant="inherit">
                ${getTotalCartValue(items)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" pl={2} pt={2}>
              <Typography variant="inherit">Shipping Charges</Typography>
              <Typography variant="inherit">$0</Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              pl={2}
              pt={2}
              pb={3}
            >
              <Typography variant="h6" fontWeight="700">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="700">
                ${getTotalCartValue(items)}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default Cart;
