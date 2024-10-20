import requests
import geopandas as gpd
from fastapi import FastAPI, HTTPException, Header
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import traceback
from shapely.geometry import Point
import zipfile
import threading
import shutil


app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://moneyapp.edwarhercules.site",
        "https://moneyapi.edwarhercules.site"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URL base de la API de Spring Boot
BASE_URL = "http://localhost:8081/api/geopuntos"

def eliminar_archivo(file_path: str):
    """Función para eliminar un archivo o carpeta especificada."""
    try:
        if os.path.isdir(file_path):  # Verifica si es un directorio
            shutil.rmtree(file_path)
            print(f"Carpeta {file_path} eliminada con éxito.")
        elif os.path.isfile(file_path):  # Verifica si es un archivo
            os.remove(file_path)
            print(f"Archivo {file_path} eliminado con éxito.")
        else:
            print(f"{file_path} no existe.")
    except Exception as e:
        print(f"No se pudo eliminar {file_path}: {e}")

@app.get("/descargar-gdb/{proyecto_id}")
async def descargar_gdb(proyecto_id: int, authorization: str = Header(None)):
    """Generar y descargar un archivo ZIP que contenga un archivo GDB con los geopuntos del proyecto."""
    gdb_file_name = f"geopuntos_{proyecto_id}.gdb"
    zip_file_name = f"geopuntos_{proyecto_id}.zip"

    try:
        print(f"Haciendo solicitud a la API para el proyecto_id: {proyecto_id}")
        
        # Hacer la solicitud a la API para obtener los geopuntos
        headers = {
            'Authorization': authorization,
            'Content-Type': 'application/json',
        }
        response = requests.get(f"{BASE_URL}/proyecto/{proyecto_id}", headers=headers)
        print(f"Estado de la respuesta de la API: {response.status_code}")

        # Verificar si la solicitud fue exitosa
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        geopuntos = response.json()
        print("Datos recibidos de la API:", geopuntos)

        # Crear una lista de geometrías a partir de las coordenadas
        geometries = [Point(p['longitud'], p['latitud']) for p in geopuntos]

        # Crear un GeoDataFrame de GeoPandas con los geopuntos
        gdf = gpd.GeoDataFrame(geopuntos)

        # Añadir la geometría al GeoDataFrame
        gdf['geometry'] = geometries

        # Seleccionar solo las columnas relevantes
        gdf = gdf[['id', 'nombre', 'descripcion', 'latitud', 'longitud', 'geometry']]

        # Establecer el CRS del GeoDataFrame    
        gdf.set_crs(epsg=4326, inplace=True)

        # Guardar el GeoDataFrame como archivo GDB
        print(f"Guardando el GeoDataFrame como archivo GDB: {gdb_file_name}")
        gdf.to_file(gdb_file_name, driver="OpenFileGDB", layer='geopuntos')

        # Crear un archivo ZIP que contenga el archivo GDB
        with zipfile.ZipFile(zip_file_name, 'w') as zipf:
            zipf.write(gdb_file_name, arcname=gdb_file_name)

        # Retornar el archivo ZIP como respuesta
        print(f"Devolviendo el archivo ZIP: {zip_file_name}")
        response = FileResponse(zip_file_name, media_type='application/zip', filename=zip_file_name)

        # Programar la eliminación del archivo después de que se haya enviado la respuesta
        threading.Timer(15.0, eliminar_archivo, args=[zip_file_name]).start()
        threading.Timer(20.0, eliminar_archivo, args=[gdb_file_name]).start()

        return response
    
    except Exception as e:
        # Manejo de excepciones con detalles
        error_message = f"Error al descargar el archivo GDB: {str(e)}\n{traceback.format_exc()}"
        print(error_message)  # Imprimir en consola para el log
        raise HTTPException(status_code=500, detail=error_message)

