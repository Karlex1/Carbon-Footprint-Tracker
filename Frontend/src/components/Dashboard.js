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

  const fetchSuggestion = async () => {
    const response = await fetch("http://localhost:5000/suggestionengine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(data);
  }
  return (<div>
    <button onClick={fetchData}>fetch data</button>
    <button onClick={fetchSuggestion}>fetch suggestion</button></div>
  )
}

export default Dashboard