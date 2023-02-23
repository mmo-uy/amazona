import { NextApiRequest, NextApiResponse } from "next";
import { UserModel as User, ProductModel as Product } from "../../models";
import { db } from "../../utils/db";
import { mockedUsers, mockedProducts } from "../../utils/mocked";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(mockedUsers);
  await Product.deleteMany();
  await Product.insertMany(mockedProducts);
  await db.disconnect();
  res.send({ message: "seeded successfully" });
};
export default handler;
