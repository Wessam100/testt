import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem('jwt') || null);
  const [user, setUser] = useState(() => (token ? jwtDecode(token) : null));

  console.log('from context: user is: ', user);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("context: the set expiry is ", decoded.exp * 1000)
        console.log('context: and the token is ', token, " or ", decoded)
        if (decoded.exp * 1000 < Date.now()) {
            console.log('context: session expired, logging out...')
          logout();
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.log("invalid token: ", err)
        logout();
      }
    }
  }, [token]);

  const login = (newToken) => {
    console.log('context, login: token: ', newToken)
    console.log("logging in in context.jsx")
    localStorage.setItem('jwt', newToken);
    setToken(newToken);
    setUser(jwtDecode(newToken));
  };

  const logout = () => {
    console.log("logging out in context.jsx")
    localStorage.removeItem('jwt');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);