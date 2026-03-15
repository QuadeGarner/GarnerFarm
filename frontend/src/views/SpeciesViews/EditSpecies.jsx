import { useState, useEffect,  } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { useNavigate ,useParams} from "react-router-dom";

export default function EditSpecies() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [species, setSpecies] = useState([]);
    const [formData, setFormData] = useState({
        streetName: "",
        species: "",
        breed: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
        try {
            const res = await fetch(`http://localhost:8081/api/species/${id}`);
            const data = await res.json();
            setSpecies(data);
            setFormData({
                streetName: data.streetName || "",
                species: data.species || "",
                breed: data.breed || []
            });
        } catch (err) {
            setError("Failed to load species data");
        }
    };
        loadData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

    };
    const handleSpeciesUpdate = async (e) => {
        e.preventDefault();
        const { streetName, breed} = formData;
        if (!streetName  || breed.length === 0) {
            setError("Please fill in all required fields");
            return;
        }
        try {
            const res = await fetch(`http://localhost:8081/api/species/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ streetName, breed }),
            });
            if (res.ok) {
                navigate("/species");
            }
            else {
                setError("Failed to update species");
            }
        } catch (err) {
            setError("Failed to update species");
        }
    };

    const handleAddBreed = async () => {
        const breedName = prompt("Enter new breed name:");
        if (!breedName) return;

        setFormData((prev) => ({
            ...prev,
            breed: [...prev.breed, {name: breedName}]
        }));
    };

return (
        <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8} xl={6}>
                <h2 className="fw-bold mt-4">Edit Species</h2>
                {error && <p className="text-danger">{error}</p>}
                <form onSubmit={handleSpeciesUpdate}>
                    <div className="mb-3">
                        <label htmlFor="streetName" className="form-label">Street Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="streetName"
                            name="streetName"
                            value={formData.streetName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Breeds</label>
                        <div className="d-flex flex-wrap gap-2">
                            {formData.breed.map((breed, index) => (
                                <span key={index} className="badge bg-secondary">
                                    {breed.name}
                                </span>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="btn btn-outline-primary mt-2"
                            onClick={handleAddBreed}
                        >
                            Add Breed
                        </button>
                    </div>
                </form>
            </Col>
        </Row>
    );
}
