import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: action.error || null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(savedUser) });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      
      if (response.data) {
        const user = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('auth_token', response.data.token);
        
        // Set default Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        dispatch({ type: 'LOGIN', payload: user });
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  const hasRole = (requiredRole) => {
    if (!state.user) {
      console.log('hasRole: No user found');
      return false;
    }
    
    const roleHierarchy = {
      'admin': ['admin', 'manager', 'user'],
      'manager': ['manager', 'user'],
      'user': ['user']
    };
    
    // Check if user's role hierarchy includes the required role
    const userRoleHierarchy = roleHierarchy[state.user.role] || [];
    const hasPermission = userRoleHierarchy.includes(requiredRole);
    
    console.log('hasRole Debug:', {
      userRole: state.user.role,
      requiredRole,
      userRoleHierarchy,
      hasPermission
    });
    
    return hasPermission;
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
