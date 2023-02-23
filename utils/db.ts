import mongoose, { ConnectionStates, Mongoose } from "mongoose";
import Product from "../types/index";

const connection = {
  isConnected: 0,
};
const { MONGODB } = process.env;

async function connect() {
  if (connection.isConnected) {
    console.info("already connected");
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.info("use previous connection");
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(MONGODB!);
  console.log("new connection");
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = 0;
    } else {
      console.log("not disconnected");
    }
  }
}

function convertDocToObj(doc: mongoose.DocumentDefinition<Product>) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

export const db = { connect, disconnect, convertDocToObj };
