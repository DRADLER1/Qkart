import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  CardActionArea,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardActionArea>
        <CardMedia component="img" height="240" image={product.image} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${product.cost}
          </Typography>
          <Rating
            name="half-rating-read"
            defaultValue={product.rating}
            precision={0.5}
            readOnly
          />
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          className="card-button"
          variant="contained"
          size="medium"
          color="primary"
          fullWidth
          startIcon = {<AddShoppingCartOutlined />}
          onClick = {handleAddToCart}
        >
          
            ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
