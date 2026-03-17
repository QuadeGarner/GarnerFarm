import { useState, useEffect } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AddBreed() {
  const navigate = useNavigate();
  const [breed, setBreed] = useState([]);
  const [species, setSpecies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    speciesId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/species`);
        const data = await res.json();
        setSpecies(data);
      } catch (error) {
        console.error("Failed to fetch species", error);
      }
    };
    fetchSpecies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBreedCreation = async (e) => {
    e.preventDefault();
    const { name, speciesId } = formData;
    if (!name || !speciesId) {
      setError("Please Fill out all required Fields");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8081/api/breeds/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, speciesId }),
      });
      if (res.ok) {
        navigate("/breeds");
      } else {
        setError("Faild to add Breed");
      }
    } catch (error) {
      setError("Faild to fetch breeds");
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8} xl={6}>
        <h2 className="fw-bold mt-4"> Add Breed</h2>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleBreedCreation}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Breed
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="speciesId" className="form-label">
              Species
            </label>
            <select
              id="speciesId"
              name="speciesId"
              className="form-control"
              value={formData.speciesId}
              onChange={handleChange}
            >
              <option value="">Select species</option>
              {species.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit"> Add Breed </Button>
        </Form>
      </Col>
    </Row>
  );
}
