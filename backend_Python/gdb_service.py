import requests
import fiona
import geopandas as gpd
from fiona.crs import from_epsg

# URL base de la API
BASE_URL = "http://localhost:8081/api/geopuntos"

def descargar_geopuntos(proyecto_id):
    """Descargar los geopuntos del proyecto y crear un archivo GDB."""
    try:
        # Hacer la solicitud a la API para obtener los geopuntos
        response = requests.get(f"{BASE_URL}/proyecto/{proyecto_id}")
        
        # Verificar si la solicitud fue exitosa
        if response.status_code == 200:
            geopuntos = response.json()
            
            # Crear un GeoDataFrame de GeoPandas
            gdf = gpd.GeoDataFrame(geopuntos)
            
            # Definir el esquema del archivo GDB
            schema = {
                'geometry': 'Point',  # Cambia esto si tus datos tienen geometrías diferentes
                'properties': {
                    'id': 'int',
                    'nombre': 'str',
                    # Agrega más propiedades según los datos que tengas
                }
            }

            # Guardar el GeoDataFrame como archivo GDB
            gdf.to_file("geopuntos.gdb", driver="OpenFileGDB", layer='geopuntos', crs=from_epsg(4326))

            print("Archivo GDB creado con éxito.")
        else:
            print(f"Error al obtener geopuntos: {response.status_code} - {response.text}")
    
    except Exception as e:
        print(f"Ocurrió un error: {e}")

if __name__ == "__main__":
    # Cambia el ID del proyecto según sea necesario
    proyecto_id = 1  # ID del proyecto a descargar
    descargar_geopuntos(proyecto_id)
