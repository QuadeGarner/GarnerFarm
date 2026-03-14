import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Container, Row, Col } from "react-bootstrap";

export default function AddAnimal() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [ownedAnimals, setOwnedAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    streetName: "",
    breed: "",
    birthdate: "",
    sex: "",
    mother: "",
    father: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [animalsRes, ownedRes] = await Promise.all([
          fetch("http://localhost:8081/api/animals"),
          fetch("http://localhost:8081/api/animalsOwned"),
        ]);

        setAnimals(await animalsRes.json());
        setOwnedAnimals(await ownedRes.json());
      } catch {
        setError("Failed to load data");
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnimalSelect = (e) => {
    const streetName = e.target.value;
    const animal = animals.find((a) => a.streetName === streetName);

    setSelectedAnimal(animal || null);

    setFormData((prev) => ({
      ...prev,
      streetName,
      species: animal?.species || "",
      breed: "",
      mother: "",
      father: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.name ||
      !formData.streetName ||
      !formData.breed ||
      !formData.sex
    ) {
      setError("Please fill out all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        birthdate: formData.birthdate || null,
      };

      const res = await fetch("http://localhost:8081/api/animalsOwned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      navigate("/animals");
    } catch {
      setError("Failed to save animal");
    } finally {
      setLoading(false);
      navigate("/ownedAnimals");
    }
  };

  const possibleMothers = ownedAnimals.filter(
    (a) => a.sex === "Female" && a.streetName === formData.streetName
  );

  const possibleFathers = ownedAnimals.filter(
    (a) => a.sex === "Male" && a.streetName === formData.streetName
  );

  return (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6}>
          <h3 className="mb-4 text-center">Add Animal</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name / Tag *</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
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
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Animal Type *</Form.Label>
                  <Form.Select
                    value={formData.streetName}
                    onChange={handleAnimalSelect}
                    required
                  >
                    <option value="">Select animal</option>
                    {animals.map((a) => (
                      <option key={a._id} value={a.streetName}>
                        {a.streetName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Breed *</Form.Label>
                  <Form.Select
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    disabled={!selectedAnimal}
                    required
                  >
                    <option value="">Select breed</option>
                    {selectedAnimal?.breed.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
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
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mother</Form.Label>
                  <Form.Select
                    name="mother"
                    value={formData.mother}
                    onChange={handleChange}
                    disabled={!formData.streetName}
                  >
                    <option value="">Unknown</option>
                    {possibleMothers.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Father</Form.Label>
                  <Form.Select
                    name="father"
                    value={formData.father}
                    onChange={handleChange}
                    disabled={!formData.streetName}
                  >
                    <option value="">Unknown</option>
                    {possibleFathers.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" disabled={loading} className="w-100">
              {loading ? <Spinner size="sm" /> : "Add Animal"}
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}
