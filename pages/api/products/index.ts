import type { NextApiRequest, NextApiResponse } from "next";
import { mockedProducts } from "../../../utils/mocked";
import ProductModel from "../../../models/Product";
import { db } from "../../../utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db.connect();
  const products = await ProductModel.find({});
  console.log(products.length);
  if (!products) {
    db.disconnect();
    res.status(400).json({
      message: "error",
      data: null,
    });
  } else {
    db.disconnect();
    res.status(200).json({
      message: "success",
      data: products,
    });
  }
}
