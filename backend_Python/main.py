# energy/main.py

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Ruta para servir el archivo GDB
@app.get("/download/gdb/{filename}")
async def download_gdb(filename: str):
    file_path = os.path.join("path/to/your/gdb/files", filename)  # Especifica la ruta a tus archivos GDB
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='application/octet-stream', filename=filename)
    raise HTTPException(status_code=404, detail="File not found")
