import React, { useReducer, useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { authManager } from './config/context/auth-manager';
import AuthContext from './config/context/auth-context';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

const init = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser && storedUser.user && storedUser.user.rol) {
    return {
      ...storedUser,
      signed: true,
    };
  }
  return { signed: false, token: null, user: { rol: null } };
};

function App() {
  const [user, dispatch] = useReducer(authManager, {}, init);

  useEffect(() => {
    if (user && user.user && user.user.rol !== null) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <PrimeReactProvider>
      <AuthContext.Provider value={{ dispatch, user }}>
        <AppRouter />
      </AuthContext.Provider>
    </PrimeReactProvider>
  );
}

export default App;