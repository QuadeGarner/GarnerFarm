import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Navbar from "./components/NavBar";
import AddAnimal from "./views/AddAnimal";
import EditAnimal from "./views/EditAnimal";
import ViewAllAnimalsOwned from "./views/ViewAllAnimalsOwned";

import "./App.css";

export default function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animals" element={<AddAnimal />} />
          <Route path="/update/:id" element={<EditAnimal/>} />
          <Route path="/delete/:id" element={<EditAnimal/>} />
          <Route path="/ownedAnimals" element={<ViewAllAnimalsOwned />} />
        </Routes>
      </main>
    </div>
  );
}
