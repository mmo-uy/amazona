import { useEffect } from "react";
import Layout from "../components/Layout";

import ProductItem from "../components/Products/ProductItem";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { asyncListProducts } from "../redux/slices/product";

export default function Home() {
  const dispatch = useAppDispatch();
  const { productsList, loading } = useAppSelector((state) => state.products);
  useEffect(() => {
    dispatch(asyncListProducts());
  }, []);

  if (loading === "pending") {
    return <p>CARGANDO...</p>;
  }
  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productsList.map((product) => (
          <ProductItem product={product} key={product?._id} />
        ))}
      </div>
    </Layout>
  );
}
