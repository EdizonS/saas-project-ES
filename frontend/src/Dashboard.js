import React, { useState, useEffect } from 'react';

// ==========================================
// PANTALLA DE DASHBOARD DE PROYECTOS
// ==========================================

function Dashboard({ token, role, workspaceName, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  // Se ejecuta automáticamente cuando carga el componente
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      setProjects(data.projects);

    } catch (err) {
      setError('Error cargando proyectos');
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDesc
        })
      });

      if (!response.ok) {
        setError('No tienes permiso para crear proyectos');
        return;
      }

      // Limpia el formulario y recarga los proyectos
      setNewProjectName('');
      setNewProjectDesc('');
      setShowForm(false);
      setError('');
      fetchProjects();

    } catch (err) {
      setError('Error creando el proyecto');
    }
  };

  return (
    <div style={styles.container}>

      {/* ENCABEZADO */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{workspaceName}</h2>
          <span style={styles.roleBadge}>Rol: {role}</span>
        </div>
        <button style={styles.logoutButton} onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>

      {/* BOTÓN CREAR PROYECTO - solo visible para Admin y Editor */}
      {role !== 'Lector' && (
        <button
          style={styles.createButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Crear Proyecto'}
        </button>
      )}

      {/* FORMULARIO DE CREAR PROYECTO */}
      {showForm && (
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Nombre del proyecto"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Descripción (opcional)"
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
          />
          <button style={styles.saveButton} onClick={handleCreateProject}>
            Guardar Proyecto
          </button>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}

      {/* LISTA DE PROYECTOS */}
      <div style={styles.projectsGrid}>
        {projects.length === 0 ? (
          <p style={styles.empty}>No hay proyectos en este workspace</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} style={styles.projectCard}>
              <h3 style={styles.projectName}>{project.name}</h3>
              <p style={styles.projectDesc}>{project.description}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

// ==========================================
// ESTILOS
// ==========================================

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0'
  },
  title: {
    color: '#333',
    margin: 0
  },
  roleBadge: {
    backgroundColor: '#e6f7ff',
    color: '#1890ff',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px'
  },
  logoutButton: {
    padding: '8px 20px',
    backgroundColor: '#ff4d4f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#52c41a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px'
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  saveButton: {
    padding: '10px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    fontSize: '14px'
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  projectCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #1890ff'
  },
  projectName: {
    color: '#333',
    margin: '0 0 8px 0'
  },
  projectDesc: {
    color: '#888',
    fontSize: '14px',
    margin: 0
  },
  empty: {
    color: '#888',
    textAlign: 'center'
  }
};

export default Dashboard;