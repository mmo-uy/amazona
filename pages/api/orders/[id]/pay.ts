import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/db";
import { OrderModel } from "../../../../models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db.connect();
  const order = await OrderModel.findById(req.query.id);
  if (order) {
    if (order.isPaid) {
      return res.status(400).send({ message: "Error: order is already paid" });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email: req.body.email_address,
    };
    const paidOrder = await order.save();
    await db.disconnect();
    res.send({ message: "order paid successfully", order: paidOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Error: order not found" });
  }
}
