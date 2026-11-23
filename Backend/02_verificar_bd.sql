USE EmpleoCerca;
GO
SELECT t.name AS tabla, COUNT(c.column_id) AS columnas
FROM sys.tables AS t
JOIN sys.columns AS c ON c.object_id = t.object_id
WHERE t.schema_id = SCHEMA_ID(N'dbo')
GROUP BY t.name
ORDER BY t.name;
GO
SELECT fk.name AS relacion,
       OBJECT_NAME(fk.parent_object_id) AS tabla_origen,
       OBJECT_NAME(fk.referenced_object_id) AS tabla_destino
FROM sys.foreign_keys AS fk
ORDER BY tabla_origen, tabla_destino;
GO
SELECT N'usuarios' AS tabla, COUNT(*) AS cantidad FROM dbo.usuarios
UNION ALL SELECT N'empresas', COUNT(*) FROM dbo.empresas
UNION ALL SELECT N'categorias', COUNT(*) FROM dbo.categorias
UNION ALL SELECT N'ofertas', COUNT(*) FROM dbo.ofertas
UNION ALL SELECT N'postulaciones', COUNT(*) FROM dbo.postulaciones
UNION ALL SELECT N'sesiones', COUNT(*) FROM dbo.sesiones;
GO
