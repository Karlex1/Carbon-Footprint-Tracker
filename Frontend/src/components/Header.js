import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handlelogout = () => {
        logout();
        navigate('/login');
    }
    if (!user) return null;
    return (
        <div>
            {user}
            <button onClick={handlelogout}>logout</button>
        </div>
    )
}

export default Header;