# Base - Python 3.11 liviano
FROM python:3.11-slim
# Carpeta de trabajo dentro del contenedor
WORKDIR /app
# CopiaR el archivo de dependencias primero
COPY requirements.txt .
# Luego se instalan todas las librerías del requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
# Se copia el resto del código
COPY . .
# Parte 6: Le decimos a Docker qué comando ejecutar para arrancar
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]