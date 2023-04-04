import React, { useEffect } from "react";
import { Layout } from "../../components";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { asyncGetOrders } from "../../redux/slices/order/index";
import Link from "next/link";

function OrdersScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(asyncGetOrders());
  }, []);
  return (
    <Layout title="Order History">
      <h1 className="mb-4 text-xl">Order History</h1>
      {loading === "pending" ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error.message}</div>
      ) : (
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <p className="text-center">No orders yet!</p>
          ) : (
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">ID</th>
                  <th className="p-5 text-left">DATE</th>
                  <th className="p-5 text-left">TOTAL</th>
                  <th className="p-5 text-left">PAID</th>
                  <th className="p-5 text-left">DELIVERED</th>
                  <th className="p-5 text-left">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className=" p-5 ">{order._id!.substring(20, 24)}</td>
                    <td className=" p-5 ">
                      {order!.createdAt!.substring(0, 10)}
                    </td>
                    <td className=" p-5 ">${order.totalPrice}</td>
                    <td className=" p-5 ">
                      {order.isPaid
                        ? `${order!.paidAt!.substring(0, 10)}`
                        : "not paid"}
                    </td>
                    <td className=" p-5 ">
                      {order.isDelivered
                        ? `${order!.deliveredAt!.substring(0, 10)}`
                        : "not delivered"}
                    </td>
                    <td className=" p-5 ">
                      <Link
                        href={`/order/${order._id}`}
                        passHref
                        legacyBehavior
                      >
                        <a className="underline text-blue-700">Details</a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </Layout>
  );
}
OrdersScreen.auth = true;
export default OrdersScreen;
