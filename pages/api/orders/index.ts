import type { NextApiRequest, NextApiResponse } from "next";
import { OrderModel } from "../../../models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const newOrder = new OrderModel({
      ...req.body,
    });
    const order = await newOrder.save();
    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
      message: "Error saving order!!!",
    });
  }
}
