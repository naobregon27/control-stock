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

import './App.css';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

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
                <Route path="/" element={isAuthenticated ? <ProtectedRoute><Ecommerce /></ProtectedRoute> : <Navigate to="/login" />} />
                <Route path="/ecommerce" element={isAuthenticated ? <ProtectedRoute><Ecommerce /></ProtectedRoute> : <Navigate to="/login" />} />
                <Route path="/Inventory" element={isAuthenticated ? <ProtectedRoute><Orders /></ProtectedRoute> : <Navigate to="/login" />} />
                <Route path="/Add" element={isAuthenticated ? <ProtectedRoute><Editor /></ProtectedRoute> : <Navigate to="/login" />} />
                <Route path="/Add/:id/edit" element={isAuthenticated ? <ProtectedRoute><Editor /></ProtectedRoute> : <Navigate to="/login" />} />
                <Route path="/Ventas" element={isAuthenticated ? <ProtectedRoute><Venta /></ProtectedRoute> : <Navigate to="/login" />} />
                <Route path="/Registro" element={isAuthenticated ? <ProtectedRoute><Registro /></ProtectedRoute> : <Navigate to="/login" />} />
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