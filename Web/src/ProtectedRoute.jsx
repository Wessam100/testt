import { useAuth } from './Context.jsx';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  console.log("protected routes token: ", token)
  return token ? children : <Navigate to="/" />;
}
