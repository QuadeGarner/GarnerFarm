import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Navbar from "./components/NavBar";
import AddAnimal from "./views/AnimalViews/AddAnimal";
import EditAnimal from "./views/AnimalViews/EditAnimal";
import ViewAllAnimalsOwned from "./views/AnimalViews/ViewAllAnimalsOwned";
import ViewAllSpecies from "./views/SpeciesViews/ViewAllSpecies";
import EditSpecies from "./views/SpeciesViews/EditSpecies";
import AddSpecies from "./views/SpeciesViews/AddSpecies";
import AddBreed from "./views/BreedViews/AddBreed";
import ViewBreedFormSpecies from "./views/BreedViews/ViewBreedBySpecies";

import "./App.css";

export default function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animals" element={<AddAnimal />} />
          <Route path="/update/:id" element={<EditAnimal />} />
          <Route path="/delete/:id" element={<EditAnimal />} />
          <Route path="/ownedAnimals" element={<ViewAllAnimalsOwned />} />
          <Route path="/species" element={<ViewAllSpecies />} />
          <Route path="/addBreed/:id" element={<EditSpecies />} />
          <Route path="/updateSpecies/:id" element={<EditSpecies />} />
          <Route path="/deleteSpecies/:id" element={<EditSpecies />} />
          <Route path="/addSpecies" element={<AddSpecies />} />
          <Route path="/addBreed" element={<AddBreed />} />
          <Route path="/breeds" element={<ViewBreedFormSpecies />} />
        </Routes>
      </main>
    </div>
  );
}
