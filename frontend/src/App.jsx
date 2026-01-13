import { Routes, Route, Router, BrowserRouter } from "react-router-dom";
import Home from "./views/Home";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}
