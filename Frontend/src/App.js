import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Questionaire from "./components/Questionaire";
import Register from "./components/Register";
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { AuthProvider,AuthContext } from './components/AuthContext';
import { useContext } from 'react';

const Protectedrouter = ({ children }) => {
  const {token }=useContext(AuthContext)
  return token ? children : <Navigate to='/login' />
}

const Appcontent = () => {
  const { token } = useContext(AuthContext);
  return (
    
      <Router>
        {token && <Header />}
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={
            <Protectedrouter>
              <Questionaire />
            </Protectedrouter>
          } />
          <Route path='/dashboard' element={<Protectedrouter>
            <Dashboard />
          </Protectedrouter>} />

        </Routes>
      </Router>)
}

function App() {
  return (<AuthProvider>
    <Appcontent/>
    </AuthProvider>
  );
}

export default App;
