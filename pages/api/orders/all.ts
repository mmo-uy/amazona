// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "../../../utils/db";
import { OrderModel } from "../../../models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  await db.connect();
  const orders = await OrderModel.find({ userId: session?.user?.id });
  await db.disconnect();
  res.send(orders);
}
