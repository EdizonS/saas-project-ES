-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL
);

-- Tabla de workspaces
CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Tabla que relaciona usuarios con workspaces y su rol
CREATE TABLE workspace_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    workspace_id INTEGER REFERENCES workspaces(id),
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Editor', 'Lector'))
);

-- Tabla de proyectos
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    workspace_id INTEGER REFERENCES workspaces(id)
);

-- DATOS PRE-CARGADOS

-- Usuario de prueba (password: 1234)
INSERT INTO users (email, password, full_name) VALUES
('usuario@test.com', '1234', 'Usuario de Prueba');

-- Workspaces
INSERT INTO workspaces (name) VALUES
('Workspace Alfa'),
('Workspace Beta');

-- Roles: Admin en Alfa, Lector en Beta
INSERT INTO workspace_members (user_id, workspace_id, role) VALUES
(1, 1, 'Admin'),
(1, 2, 'Lector');

-- Proyectos en Workspace Alfa
INSERT INTO projects (name, description, workspace_id) VALUES
('Proyecto Alpha 1', 'Primer proyecto del workspace Alfa', 1),
('Proyecto Alpha 2', 'Segundo proyecto del workspace Alfa', 1);

-- Proyectos en Workspace Beta
INSERT INTO projects (name, description, workspace_id) VALUES
('Proyecto Beta 1', 'Primer proyecto del workspace Beta', 2),
('Proyecto Beta 2', 'Segundo proyecto del workspace Beta', 2);