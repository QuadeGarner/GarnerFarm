import { Routes, Route, Router, BrowserRouter } from "react-router-dom";
import Home from "./views/Home";
import Navbar from "./components/Navbar";
import AddAnimal from "./views/AddAnimal";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animals" element={<AddAnimal />} />
        </Routes>
      </main>
    </div>
  );
}
