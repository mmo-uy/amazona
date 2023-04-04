import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { CheckoutWizard, Layout } from "../../components";
import Link from "next/link";
import Image from "next/image";
import { addOrder } from "../../services/order/index";
import { Order } from "../../types";
import { getSession } from "next-auth/react";
import { asyncAddOrder } from "../../redux/slices/order";
import { removeAll } from "../../redux/slices/cart";

const PlaceOrderPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { shippingAddress, items, paymentMethod } = useAppSelector(
    (state) => state.cart
  );
  const { selectedOrder } = useAppSelector((state) => state.order);
  // TODO change
  const [loading, setLoading] = useState(false);
  //TODO move to utils
  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    items.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  const placeOrderHandler = async () => {
    // TODO change
    setLoading(true);
    const session = await getSession();
    const { user } = session!;
    const order: Order = {
      userId: user?.id!,
      orderItems: items,
      taxPrice,
      itemsPrice,
      paymentMethod: paymentMethod?.name,
      shippingAddress: shippingAddress!,
      totalPrice,
      shippingPrice,
    };
    dispatch(asyncAddOrder(order));
    setLoading(false);
  };
  useEffect(() => {
    if (selectedOrder) {
      dispatch(removeAll());
      router.push(`/order/${selectedOrder._id}`);
    }
  }, [selectedOrder]);

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Place Order</h1>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="overflow-x-auto md:col-span-3">
          <div className="card  p-5">
            <h2 className="mb-2 text-lg">Shipping Address</h2>
            <div>
              {shippingAddress?.fullName}, {shippingAddress?.address},{" "}
              {shippingAddress?.city}, {shippingAddress?.postalCode},{" "}
              {shippingAddress?.country}
            </div>
            <div>
              <Link href="/shipping">Edit</Link>
            </div>
          </div>
          <div className="card  p-5">
            <h2 className="mb-2 text-lg">Payment Method</h2>
            <div>{paymentMethod?.name}</div>
            <div>
              <Link href="/payment">Edit</Link>
            </div>
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
                {items.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td>
                      <Link
                        className="flex items-center"
                        href={`/product/${item._id}`}
                      >
                        <Image
                          src={item.image}
                          alt={item._id.toString()}
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
            <div>
              <Link href="/cart">Edit</Link>
            </div>
          </div>
        </div>
        <div>
          <div className="card  p-5">
            <h2 className="mb-2 text-lg">Order Summary</h2>
            <ul>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Items</div>
                  <div>${itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Tax</div>
                  <div>${taxPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Shipping</div>
                  <div>${shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Total</div>
                  <div>${totalPrice}</div>
                </div>
              </li>
              <li>
                <button
                  // disabled={loading}
                  onClick={placeOrderHandler}
                  className="primary-button w-full"
                >
                  {loading ? "Loading..." : "Place Order"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default PlaceOrderPage;
PlaceOrderPage.auth = true;
