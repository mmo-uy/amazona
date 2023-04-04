import React from "react";
import { Product } from "../../types";
import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "../../components";

type ProductItemProps = {
  product: Product;
};
export default function ProductItem({ product }: ProductItemProps) {
  return (
    <div className="card justify-between" key={product._id}>
      <Link href={`/product/${product._id}`}>
        <Image
          className="rounded"
          src={product?.image}
          alt={product?.title}
          width={200}
          height={200}
          // style={{ objectFit: "cover" }}
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5 align-bottom">
        <h2 className="text-lg">{product.title}</h2>
        <p>
          <strong>U$S {product.price}</strong>
        </p>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
