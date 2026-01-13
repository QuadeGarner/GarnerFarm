import { Routes, Route, Router, BrowserRouter } from "react-router-dom";
import Home from "./views/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
