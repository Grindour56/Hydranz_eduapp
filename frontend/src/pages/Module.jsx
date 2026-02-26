import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Module() {
  const location = useLocation();
  const navigate = useNavigate();
  const module = location.state;

  return (
    <Layout>
      <Card>
        <h1 className="title">{module?.title || "Module"}</h1>
        <p className="subtitle">{module?.content || "(no content)"}</p>

        <Button variant="primary" onClick={() => navigate("/") }>
          Learn Another Topic
        </Button>
      </Card>
    </Layout>
  );
}