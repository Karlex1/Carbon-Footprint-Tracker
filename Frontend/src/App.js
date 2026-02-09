import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Questionaire from "./components/Questionaire";
import Register from "./components/Register";

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Register/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/questionaire' element={<Questionaire/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
