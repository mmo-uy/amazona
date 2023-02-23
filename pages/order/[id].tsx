import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/index";
import { useRouter } from "next/router";
import { Order } from "../../types";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { asyncGetOrder } from "../../redux/slices/order";

const OrderScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { selectedOrder, loading, error } = useAppSelector(
    (state) => state.order
  );
  useEffect(() => {
    return () => {
      if (router.isReady) {
        dispatch(asyncGetOrder(router.query.id));
      }
    };
  }, [router.isReady]);

  return (
    <Layout title={`Order ${router.query.id}`}>
      <h1 className="mb-4 text-xl">{`Order ${router.query.id}`}</h1>
      {loading === "pending" ? (
        <div>Loading...</div>
      ) : loading === "failed" ? (
        <div className="alert-error">{error!.message}</div>
      ) : (
        selectedOrder && (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card  p-5">
                <h2 className="mb-2 text-lg">Shipping Address</h2>
                <div>
                  {selectedOrder!.shippingAddress.fullName},{" "}
                  {selectedOrder!.shippingAddress.address},{" "}
                  {selectedOrder!.shippingAddress.city},{" "}
                  {selectedOrder!.shippingAddress.postalCode},{" "}
                  {selectedOrder!.shippingAddress.country}
                </div>
                {selectedOrder!.isDelivered ? (
                  <div className="alert-success">
                    Delivered at {selectedOrder!.deliveredAt}
                  </div>
                ) : (
                  <div className="alert-error">Not delivered</div>
                )}
              </div>

              <div className="card p-5">
                <h2 className="mb-2 text-lg">Payment Method</h2>
                <div>{selectedOrder!.paymentMethod}</div>
                {selectedOrder!.isPaid ? (
                  <div className="alert-success">
                    Paid at {selectedOrder!.paidAt}
                  </div>
                ) : (
                  <div className="alert-error">Not paid</div>
                )}
              </div>

              <div className="card overflow-x-auto p-5">
                <h2 className="mb-2 text-lg">Order Items</h2>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">Item</th>
                      <th className="    p-5 text-right">Quantity</th>
                      <th className="  p-5 text-right">Price</th>
                      <th className="p-5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder!.orderItems.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td>
                          <Link
                            className="flex items-center"
                            href={`/product/${item._id}`}
                          >
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {item.title}
                          </Link>
                        </td>
                        <td className=" p-5 text-right">{item.quantity}</td>
                        <td className="p-5 text-right">${item.price}</td>
                        <td className="p-5 text-right">
                          ${item.quantity * item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="card  p-5">
                <h2 className="mb-2 text-lg">Order Summary</h2>
                <ul>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Items</div>
                      <div>${selectedOrder!.itemsPrice}</div>
                    </div>
                  </li>{" "}
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Tax</div>
                      <div>${selectedOrder!.taxPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Shipping</div>
                      <div>${selectedOrder!.shippingPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Total</div>
                      <div>${selectedOrder!.totalPrice}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      )}
    </Layout>
  );
};
OrderScreen.auth = true;
export default OrderScreen;
