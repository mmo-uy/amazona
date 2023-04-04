import React, { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";
import Layout from "../../components/Layout/index";

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { asyncGetOrder } from "../../redux/slices/order";
import { toast } from "react-toastify";
import { getError } from "../../utils";
import axios from "axios";
import { log } from "console";

interface OrderScreenQueryParams {
  id?: string;
}

function OrderScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, order } = useAppSelector((state) => state.order);
  const [{ isResolved, isPending }] = usePayPalScriptReducer();

  useEffect(() => {
    if (router.isReady && router.query) {
      const { id } = router.query as OrderScreenQueryParams;
      dispatch(asyncGetOrder(id!));
    }
  }, [router]);

  async function onCreateOrder(
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> {
    const orderID = await actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order!.totalPrice!.toString(),
          },
        },
      ],
    });
    return orderID;
  }
  async function onApprove(
    data: OnApproveData,
    actions: OnApproveActions
  ): Promise<void> {
    try {
      const details = await actions!.order!.capture();
      const response = await axios.put(
        `/api/orders/${order!._id}/pay`,
        details
      );
      dispatch(asyncGetOrder(order?._id!));
      toast.success("Order is paid successfully", { delay: 1500 });
    } catch (err) {
      toast.error(getError(err));
    }
  }
  function onError(err: Record<string, unknown>): void {
    toast.error(getError(err));
  }
  return (
    <Layout title={`Order ${order ? order?._id : "Order not found"}`}>
      {loading === "pending" ? (
        <div>Loading...</div>
      ) : loading === "failed" ? (
        <div className="alert-error">{`${error!.message}, Order ${
          router.query.id
        } not found !!!`}</div>
      ) : (
        order && (
          <>
            <h1 className="mb-4 text-xl">{`Order ${router.query.id}`}</h1>
            <div className="grid md:grid-cols-4 md:gap-5">
              <div className="overflow-x-auto md:col-span-3">
                <div className="card  p-5">
                  <h2 className="mb-2 text-lg">Shipping Address</h2>
                  <div>
                    {order!.shippingAddress.fullName},{" "}
                    {order!.shippingAddress.address},{" "}
                    {order!.shippingAddress.city},{" "}
                    {order!.shippingAddress.postalCode},{" "}
                    {order!.shippingAddress.country}
                  </div>
                  {order!.isDelivered ? (
                    <div className="alert-success">
                      Delivered at {order!.deliveredAt}
                    </div>
                  ) : (
                    <div className="alert-error">Not delivered</div>
                  )}
                </div>

                <div className="card p-5">
                  <h2 className="mb-2 text-lg">Payment Method</h2>
                  <div>{order!.paymentMethod}</div>
                  {order!.isPaid ? (
                    <div className="alert-success">Paid at {order!.paidAt}</div>
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
                      {order!.orderItems.map((item) => (
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
              <div className="card p-5">
                <h2 className="mb-2 text-lg">Order Summary</h2>
                <ul>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Items</div>
                      <div>${order!.itemsPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Tax</div>
                      <div>${order!.taxPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Shipping</div>
                      <div>${order!.shippingPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Total</div>
                      <div>${order!.totalPrice}</div>
                    </div>
                  </li>
                  {!order?.isPaid && (
                    <li>
                      {isPending ? (
                        <div>Loading...</div>
                      ) : (
                        <div className="w-full">
                          <PayPalScriptProvider
                            options={{
                              "client-id":
                                process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                            }}
                          >
                            <PayPalButtons
                              createOrder={onCreateOrder}
                              onApprove={onApprove}
                              onError={onError}
                            ></PayPalButtons>
                          </PayPalScriptProvider>
                        </div>
                      )}
                      {/* {loadingPay && <div>Loading...</div>} */}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )
      )}
    </Layout>
  );
}
OrderScreen.auth = true;
export default OrderScreen;
