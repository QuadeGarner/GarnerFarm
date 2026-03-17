import { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";

export default function ViewBreedsBySpecies() {
  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState("");

  // Load all species
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/species");
        const data = await res.json();
        setSpecies(data);
      } catch (error) {
        console.error("Failed to fetch species", error);
      }
    };

    fetchSpecies();
  }, []);

  // Fetch breeds when species changes
  useEffect(() => {
    if (!selectedSpecies) return;

    const fetchBreeds = async () => {
      try {
        const res = await fetch(
          `http://localhost:8081/api/breeds/species/${selectedSpecies}`,
        );
        const data = await res.json();
        setBreeds(data);
      } catch (error) {
        console.error("Failed to fetch breeds", error);
      }
    };

    fetchBreeds();
  }, [selectedSpecies]);

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8} xl={6}>
        <h2 className="fw-bold mt-4">View Breeds by Species</h2>

        {/* Species Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Select Species</Form.Label>
          <Form.Select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
          >
            <option value="">Select species</option>
            {species.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Breeds List */}
        {breeds.length > 0 ? (
          <ul className="list-group">
            {breeds.map((b) => (
              <li key={b._id} className="list-group-item">
                {b.name}
              </li>
            ))}
          </ul>
        ) : (
          selectedSpecies && <p>No breeds found for this species.</p>
        )}
      </Col>
    </Row>
  );
}
