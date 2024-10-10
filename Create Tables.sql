-- Tabla: rol
CREATE TABLE rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

-- Tabla: usuario
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla: usuario_roles
CREATE TABLE usuario_roles (
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    PRIMARY KEY (usuario_id, rol_id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (rol_id) REFERENCES rol(id)
);

-- Tabla: estructuras
CREATE TABLE estructuras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50),
    nombre VARCHAR(250),
    categoria VARCHAR(50)
);

-- Tabla: materiales
CREATE TABLE materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50),
    nombre VARCHAR(250)
);

-- Tabla: est_mat
CREATE TABLE est_mat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_estructura INT NOT NULL,
    id_material INT NOT NULL,
    unidad VARCHAR(50),
    cantidad_mat_34kva INT,
    cantidad_mat_18kva INT,
    cantidad_mat INT,
    FOREIGN KEY (id_estructura) REFERENCES estructuras(id),
    FOREIGN KEY (id_material) REFERENCES materiales(id)
);

-- Tabla: proyecto
CREATE TABLE proyecto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado VARCHAR(50) NOT NULL,
    responsable_id INT,
    FOREIGN KEY (responsable_id) REFERENCES usuario(id)
);

-- Tabla: proyecto_estructuras
CREATE TABLE proyecto_estructuras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    estructura_id INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (proyecto_id) REFERENCES proyecto(id),
    FOREIGN KEY (estructura_id) REFERENCES estructuras(id)
);

-- Tabla: proyecto_materiales
CREATE TABLE proyecto_materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    material_id INT NOT NULL,
    cantidad INT NOT NULL,
    unidad VARCHAR(50),
    FOREIGN KEY (proyecto_id) REFERENCES proyecto(id),
    FOREIGN KEY (material_id) REFERENCES materiales(id)
);

-- Tabla: levantamientos
CREATE TABLE levantamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    FOREIGN KEY (proyecto_id) REFERENCES proyecto(id)
);

-- Tabla: geopuntos
CREATE TABLE geopuntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    utm_x DECIMAL(10, 8) NOT NULL,
    utm_y DECIMAL(10, 8) NOT NULL,
    descripcion VARCHAR(255),
    FOREIGN KEY (proyecto_id) REFERENCES proyecto(id)
);

-- Tabla: geopunto_estructuras
CREATE TABLE geopunto_estructuras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    geopunto_id INT NOT NULL,
    estructura_id INT NOT NULL,
    circuito VARCHAR(50),
    FOREIGN KEY (geopunto_id) REFERENCES geopuntos(id),
    FOREIGN KEY (estructura_id) REFERENCES estructuras(id)
);

-- Tabla: progreso_proyecto
CREATE TABLE progreso_proyecto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    fase VARCHAR(50),
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    FOREIGN KEY (proyecto_id) REFERENCES proyecto(id)
);

-- Tabla: inventario_materiales
CREATE TABLE inventario_materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL,
    cantidad_disponible INT NOT NULL,
    unidad VARCHAR(50),
    FOREIGN KEY (material_id) REFERENCES materiales(id)
);

-- Tabla: historial_materiales
CREATE TABLE historial_materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    material_id INT NOT NULL,
    fecha DATE NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (proyecto_id) REFERENCES proyecto(id),
    FOREIGN KEY (material_id) REFERENCES materiales(id)
);


