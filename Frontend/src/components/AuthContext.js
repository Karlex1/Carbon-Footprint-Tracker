import { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch {
            return saved; // Fallback if it's just a string
        }
    });
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // This confirms initialization is complete
        setLoading(false);
    }, []);
    const login = (user, token) => {
        const userValue = typeof user=== 'object' ? JSON.stringify(user) : user;
        localStorage.setItem('user', userValue);
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
        <AuthContext.Provider value={{ user, token, login, logout,loading}}>
            {children}
        </AuthContext.Provider>
    )
}