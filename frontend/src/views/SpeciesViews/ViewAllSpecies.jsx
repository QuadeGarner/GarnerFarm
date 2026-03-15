import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {  Button, Row, Col } from "react-bootstrap";

export default function ViewAllSpecies() {
    const navigate = useNavigate();
    const [species, setSpecies] = useState([]);

    useEffect(() => {
        const fetchSpecies = async () => {
            try { 
                const res = await fetch("http://localhost:8081/api/species");
                const data = await res.json();
                setSpecies(data);
            }catch (err) {
                console.error("Failed to fetch species", err);
                
            }
        };
        fetchSpecies();
    }, []);

    // handle delete
    const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this species?")) return;

    try {
        const res = await fetch(`http://localhost:8081/api/species/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        if (res.ok) {
            setSpecies(prev => prev.filter(s => s._id !== id));
        } else {
            console.error(data);
            alert(data.message || "Failed to delete species");
        }

    } catch (err) {
        console.error("Delete error:", err);
        alert("Server error deleting species");
    }
};

    return (
        <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8} xl={6}>
                <h2 className="fw-bold mt-4">All Species</h2>

                {species.length === 0 ? (
                    <p className="mt-3">No species found.</p>
                ) : (
                    <ul className="list-group mt-3">
                        {species.map((s) => (
                            <li key={s._id} className="list-group-item">
                                <h5>{s.name}</h5>
                                <h6> {s.scientificName}</h6>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(`/updateSpecies/${s._id}`)}
                                >
                                    Edit Species Info
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="ms-2"
                                    onClick={() => navigate(`/addBreed/${s._id}`)}
                                >Add Breed</Button> 
                                   

                                <Button
                                    variant="danger"
                                    className="ms-2"
                                    onClick={() => handleDelete(s._id)}
                                >
                                    Delete Species
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}

                <Button className="mt-3" onClick={() => navigate("/addSpecies")
                }>
                    Add New Species
                </Button>
            </Col>
        </Row>
    );

}