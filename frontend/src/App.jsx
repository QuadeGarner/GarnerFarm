import { Routes, Route, Router, BrowserRouter } from "react-router-dom";
import Home from "./views/Home";
import Navbar from "./components/Navbar";
import AddAnimal from "./views/AddAnimal";
import "./App.css";

export default function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animals" element={<AddAnimal />} />
        </Routes>
      </main>
    </div>
  );
}
