import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Container, Row, Col } from "react-bootstrap";

export default function ViewAllAnimalsOwned() {
    const navigate = useNavigate();
    const [ownedAnimals, setOwnedAnimals] = useState([]);
    
    useEffect(() => {
        const fetchOwnedAnimals = async () => {
            try {
                const res = await fetch("http://localhost:8081/api/animalsOwned");
                const data = await res.json();
                setOwnedAnimals(data);
            } catch (err) {
                console.error("Failed to fetch owned animals:", err);
            }
        };

        fetchOwnedAnimals();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this animal?")) {
            try {
                const res = await fetch(`http://localhost:8081/api/animalsOwned/${id}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    setOwnedAnimals(ownedAnimals.filter(animal => animal._id !== id));
                } else {
                    alert("Failed to delete animal");
                }
            } catch (err) {
                console.error("Failed to delete animal:", err);
                alert("Failed to delete animal");
            }
        }
    };
    return (
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8} xl={6}>
                    <h2 className="fw-bold mt-4">All Owned Animals</h2>
                    {ownedAnimals.length === 0 ? (
                        <p className="mt-3">No owned animals found.</p>
                    ) : (
                        <ul className="list-group mt-3">
                            {ownedAnimals.map((animal) => (
                                <li key={animal._id} className="list-group-item">
                                    <h5>{animal.name}</h5>
                                    <p>
                                        <strong>Species:</strong> {animal.species || "N/A"}<br />
                                        <strong>Breed:</strong> {animal.breed}<br />
                                        <strong>Birthdate:</strong> {animal.birthdate ? new Date(animal.birthdate).toLocaleDateString() : "N/A"}<br />
                                    </p>
                                    <Button variant="primary" onClick={() => navigate(`/update/${animal._id}`)}>
                                        Edit Animal Info
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(animal._id)} className="ms-2">
                                        Delete Animal
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Button className="mt-3" onClick={() => navigate("/animals")}>
                        Add New Owned Animal
                    </Button>
                </Col>
            </Row>
    );
}
