import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  const [innovations, setInnovations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/animals")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setInnovations(shuffled.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Header */}
      <Row className="justify-content-center text-center text-md-start mt-4">
        <Col xs={12} md={10} lg={8} xl={6}>
          <h1 className="fw-bold mt-0">Welcome to Garner Farms</h1>
          <p className="mt-3 fs-5">
            Explore innovation, technology, and the people driving change.
          </p>
        </Col>
      </Row>

      {/* Cards */}
      <Row className="g-4 justify-content-center mt-3">
        <Col xs={12} md={6}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Innovators</Card.Title>
              <Card.Text className="flex-grow-1">
                Innovations in computer science are driven by innovators who
                turn theoretical ideas into practical technologies like
                algorithms, software systems, and artificial intelligence.
                <strong className="d-block mt-2">
                  Click here to learn about the innovators.
                </strong>
              </Card.Text>
              <Button className="mt-3" onClick={() => nav("/update")}>
                Learn More
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Example: Add more cards here, xs=12 md=6 for responsive stacking */}
      </Row>
    </>
  );
}
