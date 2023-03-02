import React from "react";
import Image from "next/image";
import { AddToCartButton, Layout } from "../../components";
import { GetServerSideProps } from "next";
import { Product } from "../../types/index";
import { db } from "../../utils/db";
import { ProductModel } from "../../models";

const SingleProductPage = (props: { product: Product }) => {
  const { product } = props;

  if (!product) {
    return <p>Not found</p>;
  }
  return (
    <Layout title={product?.title}>
      <div className="grid md:grid-cols-4 md:gap-3" key={product?._id}>
        <div className="md:col-span-2">
          <Image
            src={product?.image}
            height={640}
            width={480}
            alt={product?._id?.toString()}
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
              {product.rating} of {product.reviews} reviews
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
interface SingleProductPageQueryParams {
  id?: string;
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const { id } = params as SingleProductPageQueryParams;
  await db.connect();
  const product = await ProductModel.findById<Product>(id).lean();
  await db.disconnect();
  return {
    props: {
      product: product!,
    },
  };
};
export default SingleProductPage;
