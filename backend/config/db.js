import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

let db;

export async function connectDB() {
  let client;
  if (db) return db;
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in enviroment variables");
  }
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("GarnerFarm");
    console.log("connected");
    return db;
  } catch (err) {
    console.error("Failed to connect");
    throw err;
  }
}
export function getDB() {
  if (!db) {
    throw new Error("Database not init");
  }
  return db;
}
