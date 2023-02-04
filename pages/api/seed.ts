import { NextApiRequest, NextApiResponse } from "next";
import User from "../../models/User";
import { db } from "../../utils/db";
import { mockedUsers } from "../../utils/mocked";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(mockedUsers);
  await db.disconnect();
  res.send({ message: "seeded successfully" });
};
export default handler;
