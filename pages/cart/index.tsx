import { useRouter } from "next/router";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Layout from "../../components/Layout/index";
import { ProductInCart } from "../../types";
import Link from "next/link";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { removeItem, addItem } from "../../redux/slices/cart";
import Image from "next/image";
import dynamic from "next/dynamic";

const CartPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const removeItemHandler = (product: ProductInCart): void => {
    dispatch(removeItem(product));
  };
  const updateCartHandler = (item: ProductInCart, quantity: string) => {
    dispatch(addItem({ product: item, qty: Number(quantity) }));
  };
  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td>
                      <Link
                        className="flex items-center"
                        href={`/product/${item._id}`}
                      >
                        <Image
                          src={item.image}
                          alt={item?._id.toString()}
                          width={50}
                          height={50}
                        ></Image>
                        <span className="ml-5">{item.title}</span>
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      {
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.stock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      }
                    </td>
                    <td className="p-5 text-right">
                      ${item.price}{" "}
                      <div className="tooltip">
                        PU
                        <span className="tooltiptext">Price per unit</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                  {cartItems
                    .reduce((a, c) => a + c.quantity * c.price, 0)
                    .toFixed(2)}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("auth/login?redirect=/shipping")}
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartPage), {
  ssr: false,
});
