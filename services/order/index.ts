import axios, { AxiosPromise } from "axios";
import { Order } from "../../types";

export const addOrder = async (order: Order): AxiosPromise<Order> =>
  await axios.post("/api/orders", order);
export const getSingleOrder = async (
  id: string | number
): AxiosPromise<Order> => await axios.get(`/api/orders/${id}`);
export const getOrders = async (): AxiosPromise<Order[]> =>
  await axios.get(`/api/orders/all`);
