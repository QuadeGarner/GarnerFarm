import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/db.js";
import animalRoutes from "./routes/animals.js";
import animalsOwnedRoutes from "./routes/animalsOwned.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

//Enable JSON parsing for incoming request
app.use(express.json());

//ROUTES
app.use("/api/animals", animalRoutes);
app.use("/api/animalsOwned", animalsOwnedRoutes);

app.get("/", (req, res) => {
  res.send("Garner Farms API is running");
});

async function initializeAdmin() {
  try {
    const db = getDB();
    const adminExist = await db.collection("Users").findOne({ role: "admin" });
    if (!adminExist) {
      await db.collection("Users").insertOne({
        fname: "Admin",
        lname: "User",
        email: "admin@example.com",
        password: "admin",
        role: "admin",
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
async function initializeAnimals() {
  try {
    const db = getDB();
    const count = await db.collection("Animals").countDocuments();

    if (count === 0) {
      const animals = [
        {
          species: "Bos taurus",
          streetName: "Cattle",
          breed: [
            {
              name: "Holstien Friesain",
            },
            {
              name: "Hereford",
            },
          ],
        },
        {
          species: "canine",
          streetName: "Dog",
          breed: [
            {
              name: "Treeing Walker",
            },
            {
              name: " Border Collie",
            },
          ],
        },
        {
          species: "equus caballus",
          streetName: "Horse",
          breed: [
            {
              name: "QuaterHorse",
            },
            {
              name: "Mustang",
            },
          ],
        },
        {
          species: "feline",
          streetName: "Cat",
          breed: [
            {
              name: "siamese",
            },
            {
              name: "Birman",
            },
          ],
        },
        {
          species: "capra aegagrus hircus",
          streetName: "Goat",
          breed: [
            {
              name: "Boer",
            },
            {
              name: "American Pygmy",
            },
          ],
        },
        {
          species: "gallus gallus domesticus",
          streetName: "Chicken",
          breed: [
            {
              name: "legHorn",
            },
            {
              name: "Plymouth Rock",
            },
          ],
        },
      ];
      await db.collection("Animals").insertMany(animals);
      console.log(`Initialized ${animals.length} animals`);
    }
  } catch (err) {
    console.error("Error Initializing animals", err);
  }
}
const PORT = process.env.PORT || 8081;

connectDB().then(async () => {
  await initializeAdmin();
  await initializeAnimals();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
