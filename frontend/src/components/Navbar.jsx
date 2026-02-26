import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div style={{
      background:"#4a4ae6",
      color:"white",
      padding:"14px 30px",
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center"
    }}>
      <h2 style={{cursor:"pointer"}} onClick={()=>navigate("/")}>
        Hydranz Edu
      </h2>

      <div>
        <button onClick={()=>navigate("/dashboard")} style={navBtn}>Dashboard</button>
        <button onClick={()=>navigate("/subjects")} style={navBtn}>Learn</button>
      </div>
    </div>
  );
}

const navBtn = {
  marginLeft:15,
  padding:"8px 14px",
  border:"none",
  borderRadius:6,
  cursor:"pointer"
};