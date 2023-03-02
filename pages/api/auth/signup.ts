import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/db";
import { hashSync } from "bcryptjs";
import { UserModel } from "../../../models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }

  await db.connect();

  const existingUser = await UserModel.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: "User exists already!" });
    await db.disconnect();
    return;
  }

  const newUser = new UserModel({
    name,
    email,
    password: hashSync(password),
    isAdmin: false,
  });

  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send({
    message: "Created user!",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}
