import { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) { setUser(savedUser) }
    }, [])

    const login = (user, token) => {
        localStorage.setItem('user', user)
        localStorage.setItem('token', token);
        setUser(user);
        setToken(token)
    }
    const logout = () => {
        localStorage.clear();
        setUser(null);
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}