IF DB_ID(N'EmpleoCerca') IS NULL
BEGIN
    CREATE DATABASE EmpleoCerca;
END;
GO

USE EmpleoCerca;
GO

IF OBJECT_ID(N'dbo.usuarios', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.usuarios (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        nombre_usuario NVARCHAR(30) NOT NULL,
        contacto NVARCHAR(120) NOT NULL,
        clave_hash NVARCHAR(255) NOT NULL,
        rol NVARCHAR(20) NOT NULL CONSTRAINT DF_usuarios_rol DEFAULT N'postulante',
        CONSTRAINT UQ_usuarios_nombre_usuario UNIQUE (nombre_usuario),
        CONSTRAINT UQ_usuarios_contacto UNIQUE (contacto),
        CONSTRAINT CK_usuarios_rol CHECK (rol IN (N'administrador', N'postulante'))
    );
END;
GO

IF OBJECT_ID(N'dbo.empresas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.empresas (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        CONSTRAINT UQ_empresas_nombre UNIQUE (nombre)
    );
END;
GO

IF OBJECT_ID(N'dbo.categorias', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.categorias (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        nombre NVARCHAR(60) NOT NULL,
        CONSTRAINT UQ_categorias_nombre UNIQUE (nombre)
    );
END;
GO

IF OBJECT_ID(N'dbo.ofertas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ofertas (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        titulo NVARCHAR(100) NOT NULL,
        empresa_id INT NOT NULL,
        ubicacion NVARCHAR(100) NOT NULL,
        modalidad NVARCHAR(50) NOT NULL,
        sueldo NVARCHAR(60) NOT NULL,
        categoria_id INT NOT NULL,
        descripcion NVARCHAR(2000) NOT NULL,
        requisitos NVARCHAR(2000) NOT NULL,
        activa BIT NOT NULL CONSTRAINT DF_ofertas_activa DEFAULT 1,
        CONSTRAINT FK_ofertas_empresas FOREIGN KEY (empresa_id) REFERENCES dbo.empresas(id),
        CONSTRAINT FK_ofertas_categorias FOREIGN KEY (categoria_id) REFERENCES dbo.categorias(id)
    );
END;
GO

IF OBJECT_ID(N'dbo.postulaciones', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.postulaciones (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        oferta_id INT NOT NULL,
        usuario_id INT NOT NULL,
        nombre NVARCHAR(100) NOT NULL,
        correo NVARCHAR(120) NOT NULL,
        telefono NVARCHAR(15) NOT NULL,
        mensaje NVARCHAR(1500) NOT NULL CONSTRAINT DF_postulaciones_mensaje DEFAULT N'',
        fecha DATETIMEOFFSET(0) NOT NULL CONSTRAINT DF_postulaciones_fecha DEFAULT TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00'),
        CONSTRAINT FK_postulaciones_ofertas FOREIGN KEY (oferta_id) REFERENCES dbo.ofertas(id),
        CONSTRAINT FK_postulaciones_usuarios FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id),
        CONSTRAINT UQ_postulaciones_oferta_usuario UNIQUE (oferta_id, usuario_id)
    );
END;
GO

IF OBJECT_ID(N'dbo.sesiones', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.sesiones (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        usuario_id INT NOT NULL,
        token_hash CHAR(64) NOT NULL,
        expira_en DATETIMEOFFSET(0) NOT NULL,
        CONSTRAINT FK_sesiones_usuarios FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id),
        CONSTRAINT UQ_sesiones_token_hash UNIQUE (token_hash)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.ofertas') AND name = N'IX_ofertas_activa')
    CREATE INDEX IX_ofertas_activa ON dbo.ofertas(activa);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.postulaciones') AND name = N'IX_postulaciones_oferta_id')
    CREATE INDEX IX_postulaciones_oferta_id ON dbo.postulaciones(oferta_id);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.postulaciones') AND name = N'IX_postulaciones_usuario_id')
    CREATE INDEX IX_postulaciones_usuario_id ON dbo.postulaciones(usuario_id);
GO

SELECT t.name AS tabla
FROM sys.tables AS t
WHERE t.schema_id = SCHEMA_ID(N'dbo')
ORDER BY t.name;
GO
