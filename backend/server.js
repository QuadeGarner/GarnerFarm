import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/db.js";
import animalRoutes from "./routes/animals.js";
import animalsOwnedRoutes from "./routes/animalsOwned.js";
import speciesRoutes from "./routes/species.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

//Enable JSON parsing for incoming request
app.use(express.json());

//ROUTES
app.use("/api/animals", animalRoutes);
app.use("/api/animalsOwned", animalsOwnedRoutes);
app.use("/api/species", speciesRoutes);

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
async function initializeSpecies() {
  try {
    const db = getDB();
    const count = await db.collection("Species").countDocuments();

    if (count === 0) {
      const species = [
        {
          name: "Cattle", scientificName: "Bos taurus"
        },
        {
          name: "Sheep", scientificName: "Ovis aries"
        },
        {
          name: "Goat", scientificName: "Capra aegagrus hircus"
        },
        {
          name: "Pig", scientificName: "Sus scrofa domesticus"
        },
        {
          name: "Chicken", scientificName: "Gallus gallus domesticus"
        },
        {
          name: "Horse", scientificName: "Equus ferus caballus"
        },
        {
          name: "Duck", scientificName: "Anas platyrhynchos domesticus"
        },
        {
          name: "Turkey", scientificName: "Meleagris gallopavo"
        },
        {
          name: "Rabbit", scientificName: "Oryctolagus cuniculus"
        },
        {
          name: "Alpaca", scientificName: "Vicugna pacos"
        },
        { 
          name: "Llama", scientificName: "Lama glama" 
        },
        { 
          name: "Donkey", scientificName: "Equus africanus asinus" 
        },
        {
          name: "Dog", scientificName: "Canis lupus familiaris"
        },
        {
          name: "Cat", scientificName: "Felis catus"
        } 
      ];
      await db.collection("Species").insertMany(species);
      console.log(`Initialized ${species.length} species`);
    }
  } catch (err) {
    console.error("Error Initializing species", err);
  }
}
async function initializeBreeds() {
  try {
    const db = getDB();
    const speciesList = await db.collection("Species").find().toArray();
    
    const cattle = speciesList.find(s => s.name === "Cattle");
    const sheep = speciesList.find(s => s.name === "Sheep");
    const goat = speciesList.find(s => s.name === "Goat");
    const pig = speciesList.find(s => s.name === "Pig");
    const chicken = speciesList.find(s => s.name === "Chicken");
    const horse = speciesList.find(s => s.name === "Horse");
    const duck = speciesList.find(s => s.name === "Duck");
    const turkey = speciesList.find(s => s.name === "Turkey");
    const rabbit = speciesList.find(s => s.name === "Rabbit");
    const alpaca = speciesList.find(s => s.name === "Alpaca");
    const llama = speciesList.find(s => s.name === "Llama");
    const donkey = speciesList.find(s => s.name === "Donkey");
    const dog = speciesList.find(s => s.name === "Dog");
    const cat = speciesList.find(s => s.name === "Cat");

    const breeds = [
      {name: "Angus", speciesId: cattle._id},
      {name: "Hereford", speciesId: cattle._id},
      {name: "Suffolk", speciesId: sheep._id},
      {name: "Dorset", speciesId: sheep._id},
      {name: "Boer", speciesId: goat._id},
      {name: "Kiko", speciesId: goat._id},
      {name: "Yorkshire", speciesId: pig._id},
      {name: "Berkshire", speciesId: pig._id},
      {name: "Leghorn", speciesId: chicken._id},
      {name: "Rhode Island Red", speciesId: chicken._id},
      {name: "Quarter Horse", speciesId: horse._id},
      {name: "Thoroughbred", speciesId: horse._id},
      {name: "Pekin", speciesId: duck._id},
      {name: "Muscovy", speciesId: duck._id},
      {name: "Broad Breasted White", speciesId: turkey._id},
      {name: "Standard Chinchilla", speciesId: rabbit._id},
      {name: "Huacaya", speciesId: alpaca._id},
      {name: "Suri", speciesId: alpaca._id},
      {name: "Classic Llama", speciesId: llama._id},
      {name: "Woolly Llama", speciesId: llama._id},
      {name: "Standard Donkey", speciesId: donkey._id},
      {name: "Miniature Donkey", speciesId: donkey._id},
      {name: "Labrador Retriever", speciesId: dog._id},
      {name: "German Shepherd", speciesId: dog._id},
      {name: "Siamese", speciesId: cat._id},
      {name: "Maine Coon", speciesId: cat._id},
    ];

    await db.collection("Breeds").insertMany(breeds);
    console.log(`Initialized ${breeds.length} breeds`);
  } catch (err) {
    console.error("Error Initializing breeds", err);
  } 
}

const PORT = process.env.PORT || 8081;

connectDB().then(async () => {
  await initializeAdmin();
  await initializeSpecies();
  await initializeBreeds();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
