import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          <Link to="/">Garner Farms</Link>
        </h1>
        <div className="flex gap-6 items-center">
          {/* Navigation Links */}
          <div className="flex gap-4 items-center">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
