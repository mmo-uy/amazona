import type { NextApiRequest, NextApiResponse } from "next";
import { mockedProducts } from "../../../utils/mocked";
import { db } from "../../../utils/db";
import ProductModel from "../../../models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db.connect();
  const product = await ProductModel.findById(req.query.id);
  if (!product) {
    db.disconnect();
    res.status(400).json({
      message: "error",
      data: null,
    });
  } else {
    db.disconnect();
    res.status(200).json({
      message: "success",
      data: product,
    });
  }
}
