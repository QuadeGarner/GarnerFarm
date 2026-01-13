import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";

export default function AddAnimal() {
  const [animals, setAnimal] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const [formData, setFormData] = useState({
    specices: "",
    streetName: "",
    breed: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/animals");
        const data = await res.json();

        setAnimal(data);
      } catch (err) {
        setError("Failed to load Animal options");
      }
    };
    fetchAnimals();
  }, []);

  const handleStreetNameChange = (e) => {
    const streetName = e.target.value;
    const animal = animals.find((e) => e.streetName === streetName);

    setSelectedAnimal(animal);

    setFormData({
      streetName,
      species: animal?.specices || "",
      breed: "",
    });
  };

  const handleBreedChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      breed: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.streetName || !formData.breed) {
      setError("Please select animal type and breed");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/api/animalsOwned", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error();
      navigate("/animals");
    } catch (err) {
      setError("Failded to save animal");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="mt-4">
      <h3 className="mb-3"> Add Animal</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label> Animal Type</Form.Label>
          <Form.Select
            value={formData.streetName}
            onChange={handleStreetNameChange}
          >
            <option value="">Select animal</option>
            {animals.map((animal) => (
              <option key={animal._id} value={animal.streetName}>
                {animal.streetName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label> Breed</Form.Label>
          <Form.Select
            value={formData.breed}
            onChange={handleBreedChange}
            disabled={!selectedAnimal}
          >
            <option value="">Select breed</option>
            {selectedAnimal?.breed.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" disabled={loading} className="w-100">
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" /> Saving...
            </>
          ) : (
            "Add Animal"
          )}
        </Button>
      </Form>
    </Container>
  );
}
