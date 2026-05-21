from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import os
from jose import jwt
from datetime import datetime, timedelta

# ==========================================
# CONFIGURACIÓN INICIAL
# ==========================================

app = FastAPI()

# Permite que el frontend (React) pueda hablar con el backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clave secreta para firmar los tokens
SECRET_KEY = "clave_super_secreta_2026"
ALGORITHM = "HS256"

# ==========================================
# CONEXIÓN A LA BASE DE DATOS
# ==========================================

def get_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "db"),
        database=os.getenv("DB_NAME", "saas_db"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres")
    )
    return conn

# ==========================================
# MODELOS (forma de los datos que recibimos)
# ==========================================

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenRequest(BaseModel):
    workspace_id: int

class ProjectRequest(BaseModel):
    name: str
    description: str

# ==========================================
# FUNCIÓN PARA LEER EL TOKEN
# ==========================================

def get_current_user(authorization: str = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

# ==========================================
# ENDPOINT 1: LOGIN
# ==========================================

@app.post("/api/auth/login")
def login(request: LoginRequest):
    db = get_db()
    cursor = db.cursor()
    
    # Busca el usuario en la base de datos
    cursor.execute(
        "SELECT id, email, full_name FROM users WHERE email=%s AND password=%s",
        (request.email, request.password)
    )
    user = cursor.fetchone()
    
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    # Busca los workspaces del usuario
    cursor.execute("""
        SELECT w.id, w.name, wm.role 
        FROM workspaces w
        JOIN workspace_members wm ON w.id = wm.workspace_id
        WHERE wm.user_id = %s
    """, (user[0],))
    
    workspaces = [
        {"id": row[0], "name": row[1], "role": row[2]}
        for row in cursor.fetchall()
    ]
    
    cursor.close()
    db.close()
    
    return {
        "user": {"id": user[0], "email": user[1], "full_name": user[2]},
        "workspaces": workspaces
    }

# ==========================================
# ENDPOINT 2: INTERCAMBIO DE CONTEXTO
# ==========================================

@app.post("/api/auth/token")
def get_token(request: TokenRequest, authorization: str = None):
    from fastapi import Header
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    db = get_db()
    cursor = db.cursor()
    
    # Verifica que el usuario pertenece a ese workspace
    cursor.execute("""
        SELECT role FROM workspace_members 
        WHERE user_id=%s AND workspace_id=%s
    """, (user_id, request.workspace_id))
    
    member = cursor.fetchone()
    cursor.close()
    db.close()
    
    if not member:
        raise HTTPException(status_code=403, detail="No tienes acceso a este workspace")
    
    # Genera el token final con el workspace y rol incluidos
    token_data = {
        "user_id": user_id,
        "workspace_id": request.workspace_id,
        "role": member[0],
        "exp": datetime.utcnow() + timedelta(hours=8)
    }
    
    final_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": final_token, "role": member[0]}

# ==========================================
# ENDPOINT 3: VER PROYECTOS
# ==========================================

@app.get("/api/projects")
def get_projects(authorization: str = None):
    from fastapi import Header
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    workspace_id = payload["workspace_id"]
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, name, description FROM projects WHERE workspace_id=%s",
        (workspace_id,)
    )
    
    projects = [
        {"id": row[0], "name": row[1], "description": row[2]}
        for row in cursor.fetchall()
    ]
    
    cursor.close()
    db.close()
    
    return {"projects": projects}

# ==========================================
# ENDPOINT 4: CREAR PROYECTO
# ==========================================

@app.post("/api/projects")
def create_project(request: ProjectRequest, authorization: str = None):
    from fastapi import Header
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    # Verifica el rol — Lector no puede crear proyectos
    role = payload["role"]
    if role == "Lector":
        raise HTTPException(status_code=403, detail="No tienes permiso para crear proyectos")
    
    workspace_id = payload["workspace_id"]
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO projects (name, description, workspace_id) VALUES (%s, %s, %s) RETURNING id",
        (request.name, request.description, workspace_id)
    )
    new_id = cursor.fetchone()[0]
    db.commit()
    cursor.close()
    db.close()
    
    return {"message": "Proyecto creado", "id": new_id}