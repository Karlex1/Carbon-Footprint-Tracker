import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Questionaire from "./components/Questionaire";
import Register from "./components/Register";

const Protectedrouter = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to='/login'/>
}
function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Protectedrouter>
            <Questionaire />
          </Protectedrouter>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
