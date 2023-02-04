import { useRouter } from "next/router";
import React, { ButtonHTMLAttributes } from "react";
import Image from "next/image";
import { AddToCartButton, Layout } from "../../components";
import { useAppSelector } from "../../redux/hooks";

const SingleProductPage = () => {
  const { query } = useRouter();
  const { id } = query;
  const { productsList, loading } = useAppSelector((state) => state.products);
  const product = productsList.find((p) => p.id.toString() === id);

  if (!product) {
    return <p>Not found</p>;
  }
  return (
    <Layout title={product.title}>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            height={640}
            width={480}
            alt={product.id.toString()}
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.title}</h1>
            </li>
            <li>
              <p>{product.description}</p>
            </li>
            <li>
              <p>{product.category}</p>
            </li>
            <li>
              {product.rating.rate} of {product.rating.count} reviews
            </li>
          </ul>
        </div>
        <div className="card p-5">
          <div className="mb-2 flex justify-between">
            <div>Price</div>
            <div>USD {product.price}</div>
          </div>
          <div className="mb-2 flex justify-between">
            <div>Stock</div>
            <div>available</div>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </Layout>
  );
};

export default SingleProductPage;
