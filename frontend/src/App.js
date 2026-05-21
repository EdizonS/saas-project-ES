import React, { useState } from 'react';
import Login from './Login';
import WorkspaceSelector from './WorkspaceSelector';
import Dashboard from './Dashboard';

// ==========================================
// COMPONENTE PRINCIPAL - DIRECTOR DE PANTALLAS
// ==========================================

function App() {
  // Controla qué pantalla se muestra
  const [screen, setScreen] = useState('login');

  // Datos que se van guardando conforme el usuario avanza
  const [tempToken, setTempToken] = useState('');
  const [finalToken, setFinalToken] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const [role, setRole] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');

  // ==========================================
  // FUNCIONES DE NAVEGACIÓN ENTRE PANTALLAS
  // ==========================================

  const handleLoginSuccess = (token, userWorkspaces, user) => {
    setTempToken(token);
    setWorkspaces(userWorkspaces);
    setScreen('workspace');
  };

  const handleWorkspaceSelected = (token, userRole, name) => {
    setFinalToken(token);
    setRole(userRole);
    setWorkspaceName(name);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    setTempToken('');
    setFinalToken('');
    setWorkspaces([]);
    setRole('');
    setWorkspaceName('');
    setScreen('login');
  };

  // ==========================================
  // RENDERIZADO SEGÚN LA PANTALLA ACTIVA
  // ==========================================

  return (
    <div>
      {screen === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {screen === 'workspace' && (
        <WorkspaceSelector
          workspaces={workspaces}
          tempToken={tempToken}
          onWorkspaceSelected={handleWorkspaceSelected}
        />
      )}

      {screen === 'dashboard' && (
        <Dashboard
          token={finalToken}
          role={role}
          workspaceName={workspaceName}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;