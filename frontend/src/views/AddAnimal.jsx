import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";

export default function AddAnimal() {
  const navigate = useNavigate();

  // master data
  const [animals, setAnimals] = useState([]);
  const [ownedAnimals, setOwnedAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // form state
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    streetName: "",
    breed: "",
    birthdate: "",
    mother: "",
    father: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ----------------------------------
     LOAD DATA
  -----------------------------------*/
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

  /* ----------------------------------
     HANDLERS
  -----------------------------------*/
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (!formData.name || !formData.streetName || !formData.breed) {
      setError("Please fill out all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/api/animalsOwned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      navigate("/animals");
    } catch {
      setError("Failed to save animal");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     FILTER PARENTS
  -----------------------------------*/
  const possibleParents = ownedAnimals.filter(
    (a) => a.species === formData.species && a.breed === formData.breed
  );

  /* ----------------------------------
     RENDER
  -----------------------------------*/
  return (
    <Container className="mt-4">
      <h3 className="mb-3">Add Animal</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* NAME */}
        <Form.Group className="mb-3">
          <Form.Label>Name *</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* BIRTHDATE */}
        <Form.Group className="mb-3">
          <Form.Label>Birthdate</Form.Label>
          <Form.Control
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
          />
        </Form.Group>

        {/* ANIMAL TYPE */}
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

        {/* BREED */}
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

        {/* MOTHER */}
        <Form.Group className="mb-3">
          <Form.Label>Mother</Form.Label>
          <Form.Select
            name="mother"
            value={formData.mother}
            onChange={handleChange}
            disabled={!formData.breed}
          >
            <option value="">Unknown</option>
            {possibleParents.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* FATHER */}
        <Form.Group className="mb-3">
          <Form.Label>Father</Form.Label>
          <Form.Select
            name="father"
            value={formData.father}
            onChange={handleChange}
            disabled={!formData.breed}
          >
            <option value="">Unknown</option>
            {possibleParents.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* SUBMIT */}
        <Button type="submit" disabled={loading} className="w-100">
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            "Add Animal"
          )}
        </Button>
      </Form>
    </Container>
  );
}
