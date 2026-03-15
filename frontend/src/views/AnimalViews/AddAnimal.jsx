import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";

export default function AddAnimal() {
  const navigate = useNavigate();
  const [speciesList, setSpeciesList] = useState([]);
  const [breedsList, setBreedsList] = useState([]);
  const [ownedAnimals, setOwnedAnimals] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    speciesId: "",
    breedId: "",
    birthdate: "",
    sex: "",
    motherId: "",
    fatherId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load species and owned animals
  useEffect(() => {
    const loadData = async () => {
      try {
        const [speciesRes, animalsRes] = await Promise.all([
          fetch("http://localhost:8081/api/species"),
          fetch("http://localhost:8081/api/animals"),
        ]);
        setSpeciesList(await speciesRes.json());
        setOwnedAnimals(await animalsRes.json());
      } catch {
        setError("Failed to load data");
      }
    };
    loadData();
  }, []);

  // Load breeds when species changes
  useEffect(() => {
    const loadBreeds = async () => {
      if (!formData.speciesId) return;
      try {
        const res = await fetch(
          `http://localhost:8081/api/breeds/species/${formData.speciesId}`
        );
        setBreedsList(await res.json());
      } catch {
        setError("Failed to load breeds");
      }
    };
    loadBreeds();
  }, [formData.speciesId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.speciesId || !formData.breedId || !formData.sex) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      const res = await fetch("http://localhost:8081/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      navigate("/animals"); // redirect to owned animals list
    } catch {
      setError("Failed to save animal");
    } finally {
      setLoading(false);
    }
  };

  const possibleMothers = ownedAnimals.filter(
    (a) => a.sex === "Female" && a.speciesId === formData.speciesId
  );

  const possibleFathers = ownedAnimals.filter(
    (a) => a.sex === "Male" && a.speciesId === formData.speciesId
  );

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8} xl={6}>
        <h3 className="mb-4 text-center">Add Animal</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name / Tag *</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Birthdate</Form.Label>
            <Form.Control
              type="date"
              name="birthdate"
              max={new Date().toISOString().split("T")[0]}
              value={formData.birthdate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Species *</Form.Label>
            <Form.Select
              name="speciesId"
              value={formData.speciesId}
              onChange={handleChange}
              required
            >
              <option value="">Select species</option>
              {speciesList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Breed *</Form.Label>
            <Form.Select
              name="breedId"
              value={formData.breedId}
              onChange={handleChange}
              required
              disabled={!formData.speciesId}
            >
              <option value="">Select breed</option>
              {breedsList.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sex *</Form.Label>
            <Form.Select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mother</Form.Label>
            <Form.Select
              name="motherId"
              value={formData.motherId}
              onChange={handleChange}
              disabled={!formData.speciesId}
            >
              <option value="">Unknown</option>
              {possibleMothers.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Father</Form.Label>
            <Form.Select
              name="fatherId"
              value={formData.fatherId}
              onChange={handleChange}
              disabled={!formData.speciesId}
            >
              <option value="">Unknown</option>
              {possibleFathers.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="submit" disabled={loading} className="w-100">
            {loading ? <Spinner size="sm" /> : "Add Animal"}
          </Button>
        </Form>
      </Col>
    </Row>
  );
}