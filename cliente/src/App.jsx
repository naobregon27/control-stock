import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Orders, Editor } from './pages';
import Venta from "./pages/Venta";
import Registro from './pages/registro';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import PasswordProtected from "./components/PasswordProtected"

import './App.css';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [userRole, setUserRole] = useState('admin'); // Añade el estado para el rol del usuario

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  const checkEditPermissions = (user) => {
    // Solo permitir acceso a los administradores
    return user.role === 'admin';
  };
  
  // // Ejemplo de uso
  // const user = { role: 'admin' }; // Cambia esto según el rol del usuario actual
  // if (checkEditPermissions(user)) {
  //   console.log('Acceso permitido');
  // } else {
  //   console.log('Acceso denegado');
  // }

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <Router>
        <div className="flex relative dark:bg-main-dark-bg">
          {isAuthenticated && (
            <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
              <TooltipComponent
                content="Settings"
                position="Top"
              >
                <button
                  type="button"
                  onClick={() => setThemeSettings(true)}
                  style={{ background: currentColor, borderRadius: '50%' }}
                  className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                >
                  <FiSettings />
                </button>
              </TooltipComponent>
            </div>
          )}
          {isAuthenticated && activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              isAuthenticated && activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            {isAuthenticated && (
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                <Navbar />
              </div>
            )}
            <div>
              {themeSettings && (<ThemeSettings />)}

              <Routes>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Ecommerce /></ProtectedRoute>} />

                <Route path="/ecommerce" element={<ProtectedRoute isAuthenticated={isAuthenticated} ><Ecommerce /></ProtectedRoute>} />

                <Route path="/Inventory" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Orders /></ProtectedRoute>} />

                <Route path="/Add" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Editor /></ProtectedRoute>} />

                <Route path="/Add/:id/edit" element={<ProtectedRoute isAuthenticated={isAuthenticated}> 
                <PasswordProtected correctPassword="Respuesto234"><Editor /> 
                </PasswordProtected>
                </ProtectedRoute>}/>

                <Route path="/Ventas" element={<ProtectedRoute isAuthenticated={isAuthenticated} ><Venta /></ProtectedRoute>} />

                <Route path="/Registro" element={<ProtectedRoute isAuthenticated={isAuthenticated} ><Registro /></ProtectedRoute>} />
              </Routes>
            </div>
            {isAuthenticated && <Footer />}
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;


