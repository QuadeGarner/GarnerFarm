import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/db.js";

dotenv.config();

app.use(cors({ origin: "http://localhost:5173" }));

//Enable JSON parsing for incoming request
app.use(express.json());

//ROUTES

app.get("/", (req, res) => {
  res.send("Garner Farms API is running");
});

async function initializeAdmin() {
  try {
    const db = getDB();
    const adminExist = await db.collection("User").findOne({ role: "admin" });
    if (!adminExist) {
      await db.collection("Users").insertOne({
        fname: "Admin",
        lname: "User",
        email: "admin@example.com",
        password: "admin",
        createdAt: new Date(),
      });
      console.log("Defualt admin user created");
    } else {
      console.log("Defualt Admin already exist");
    }
  } catch (err) {
    console.log("Error creating Admin", err);
  }
}
const PORT = process.env.PORT || 8081;

connectDB().then(async () => {
  await initializeAdmin();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
