import React from 'react';

// ==========================================
// PANTALLA DE SELECCIÓN DE WORKSPACE
// ==========================================

function WorkspaceSelector({ workspaces, tempToken, onWorkspaceSelected }) {

  const handleSelectWorkspace = async (workspace) => {
    try {
      // Llama al endpoint de intercambio de contexto
      const response = await fetch('http://localhost:8000/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ workspace_id: workspace.id })
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Error al seleccionar workspace');
        return;
      }

      // Avisa al App que ya tenemos token final con rol y workspace
      onWorkspaceSelected(data.access_token, data.role, workspace.name);

    } catch (err) {
      alert('Error conectando con el servidor');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Selecciona un Workspace</h2>
        <p style={styles.subtitle}>¿A qué espacio de trabajo deseas ingresar?</p>

        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            style={styles.workspaceCard}
            onClick={() => handleSelectWorkspace(workspace)}
          >
            <div style={styles.workspaceName}>{workspace.name}</div>
            <div style={styles.workspaceRole}>
              Rol: <strong>{workspace.role}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// ESTILOS
// ==========================================

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '5px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: '10px'
  },
  workspaceCard: {
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #1890ff',
    cursor: 'pointer',
    transition: 'background 0.2s',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  workspaceName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333'
  },
  workspaceRole: {
    fontSize: '14px',
    color: '#666'
  }
};

export default WorkspaceSelector;