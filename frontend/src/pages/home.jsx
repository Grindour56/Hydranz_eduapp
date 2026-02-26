import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Card className="home-card">
        <h1 className="title">Hydranz Edu</h1>
        <p className="subtitle">
          Personalized learning. Zero tracking. Built for every student.
        </p>

        <Button variant="primary" onClick={() => navigate("/subjects")}>Start Learning</Button>
      </Card>
    </Layout>
  );
}