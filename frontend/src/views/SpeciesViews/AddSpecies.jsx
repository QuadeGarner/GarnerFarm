import { useState, useEffect,  } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AddSpecies() {
    const navigate = useNavigate();
    const [species, setSpecies] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        scientificName :""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

    };
    const handleSpeciesCreation = async (e) => {
        e.preventDefault();
        const { name, scientificName} = formData;
        if (!name  || !scientificName) {
            setError("Please fill in all required fields");
            return;
        }
        try {
            const res = await fetch(`http://localhost:8081/api/species/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, scientificName }),
            });
            if (res.ok) {
                navigate("/species");
            }
            else {
                setError("Failed to create species");
            }
        } catch (err) {
            setError("Failed to fetch");
        }
    };

    

return (
        <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8} xl={6}>
                <h2 className="fw-bold mt-4">Edit Species</h2>
                {error && <p className="text-danger">{error}</p>}
                <form onSubmit={handleSpeciesCreation}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
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
                        <label htmlFor="scientificName" className="form-label">Scientific Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="scientificName"
                            name="scientificName"
                            value={formData.scientificName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-outline-primary mt-2"
                            onClick={handleSpeciesCreation}
                        >
                            Add Species 
                        </button>
                    </div>
                </form>
            </Col>
        </Row>
    );
}
