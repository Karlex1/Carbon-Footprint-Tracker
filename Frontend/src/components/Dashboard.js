import { useContext } from "react";
import { AuthContext } from "./AuthContext";


function Dashboard() {
  const { token } = useContext(AuthContext);

  
  const fetchData =async () => {
    const response = await fetch("http://localhost:5000/gethistory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }});
    const data = await response.json();
    console.log(data);
  }
  return (
    <button onClick={fetchData}>fetch data</button>
    
  )
}

export default Dashboard