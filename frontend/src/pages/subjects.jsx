import { questionBank } from "../data/questionBank";
import { appState } from "../state";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Subjects() {
  const navigate = useNavigate();
  const subjects = Object.keys(questionBank);

  function selectSubject(sub) {
    appState.selectedSubject = sub;
    navigate("/topics");
  }

  return (
    <Layout>
      <Card>
        <h2>Select Subject</h2>
        <div className="grid">
          {subjects.map(sub => (
            <Button
              key={sub}
              variant="secondary"
              onClick={() => selectSubject(sub)}
            >
              {sub}
            </Button>
          ))}
        </div>
      </Card>
    </Layout>
  );
}