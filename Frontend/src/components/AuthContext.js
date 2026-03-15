import { useState, useEffect, createContext, useCallback } from 'react';

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
    const logout = useCallback(() => {
        localStorage.clear();
        setUser(null);
        setToken(null);
    }, [])
    const isTokenValid = useCallback((testtoken) => {
        const tokenToVerify = testtoken || token;
        if (!tokenToVerify) return false;
        try {
            const base64url = tokenToVerify.split('.')[1];
            const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join(''));
            const { exp } = JSON.parse(jsonPayload);
            const currentTime = Math.floor(Date.now() / 1000);
            return exp > currentTime;
        } catch (e) {
            console.log("Token decoding failed: ", e);
            return false;

        }
    }, [token])
    useEffect(() => {
        if (token && !isTokenValid(token)) {
                console.warn("Session expired.  Logging out.");
                logout();
            
        }
        setLoading(false);
    }, [token, isTokenValid, logout]);

    const login = (user, token) => {
        const userValue = typeof user === 'object' ? JSON.stringify(user) : user;
        localStorage.setItem('user', userValue);
        localStorage.setItem('token', token);
        setUser(user);
        setToken(token)
    }
  

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, isTokenValid }}>
            {children}
        </AuthContext.Provider>
    )
}