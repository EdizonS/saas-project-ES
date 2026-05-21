# SaaS Project - Sistema de Gestión de Proyectos Multi-Tenant

Sistema MVP de gestión de proyectos con soporte multi-tenant, donde un usuario puede pertenecer a múltiples workspaces con roles diferentes en cada uno.

## Tecnologías utilizadas

- **Backend:** Python + FastAPI
- **Frontend:** React
- **Base de datos:** PostgreSQL
- **Contenedores:** Docker + Docker Compose

## Requisitos previos

- Docker Desktop instalado y corriendo
- Git

## Instrucciones de ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/EdizonS/saas-project-ES.git
cd saas-project-ES
```

### 2. Levantar la aplicación

```bash
docker compose up --build
```

Este comando levanta automáticamente:
- Base de datos PostgreSQL con datos pre-cargados
- Backend FastAPI en el puerto 8000
- Frontend React en el puerto 3000

### 3. Acceder a la aplicación

Abrir el navegador en: **http://localhost:3000**

### 4. Credenciales de prueba

| Campo | Valor |
|-------|-------|
| Email | usuario@test.com |
| Contraseña | 1234 |

## Datos pre-cargados

- **1 usuario** de prueba
- **Workspace Alfa** — usuario con rol Admin
- **Workspace Beta** — usuario con rol Lector
- **2 proyectos** de ejemplo en cada workspace

## Roles y permisos

| Rol | Ver proyectos | Crear proyectos |
|-----|--------------|-----------------|
| Admin | ✅ | ✅ |
| Editor | ✅ | ✅ |
| Lector | ✅ | ❌ |

## Estructura del proyecto
saas-project-ES/
├── backend/
│   ├── main.py           # API endpoints
│   ├── init.sql          # Script de base de datos
│   ├── requirements.txt  # Dependencias Python
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── Login.js
│   │   ├── WorkspaceSelector.js
│   │   └── Dashboard.js
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml
## Endpoints del API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Autenticación del usuario |
| POST | /api/auth/token | Intercambio de contexto de workspace |
| GET | /api/projects | Listar proyectos del workspace activo |
| POST | /api/projects | Crear proyecto (Admin y Editor únicamente) |