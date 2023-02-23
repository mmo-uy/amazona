import React from "react";
import { Product } from "../../types";
import { useAppDispatch } from "../../redux/hooks";
import { addItem } from "../../redux/slices/cart";

interface AddToCartButtonProps {
  product: Product;
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const dispatch = useAppDispatch();
  const addToCart = (): void => {
    dispatch(addItem({ product }));
  };
  return (
    <button
      key={product._id}
      className="primary-button w-full"
      type="button"
      onClick={addToCart}
      disabled={product?.stock === 0}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
