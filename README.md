# Woki Lite

## Stack Tecnológico

### Framework y Lenguajes
- **NestJS**: Framework principal para el desarrollo del backend
- **TypeScript**: Lenguaje de programación
- **MySQL**: Base de datos relacional

### Decisión de Stack
Se eligió **NestJS** por las siguientes razones:
- Es el framework más utilizado actualmente para desarrollo de monolitos en Node.js
- Proporciona una **estructura predefinida** que acelera el desarrollo
- Sistema de **inyección de dependencias** nativo que facilita testing y mantenibilidad
- Simplicidad en la configuración y scaffolding de módulos
- Excelente integración con TypeScript y decoradores

### Herramientas de Desarrollo
Durante el desarrollo se utilizaron las siguientes herramientas de IA como asistentes:
- **GitHub Copilot** con Claude integrado en el IDE
- **ChatGPT** vía interfaz web

## Consideraciones Técnicas

### 1. Uso de ORM y Consultas SQL
El ORM (TypeORM) se utiliza únicamente para establecer la conexión con la base de datos. Las consultas se implementan en **SQL puro** para facilitar la comprensión de la lógica.

### 2. Implementación de Idempotencia
La lógica de idempotencia actual está implementada de forma simplificada. En un entorno productivo, debería:
- Implementarse en un **middleware** dedicado
- Utilizar un **interceptor** (el equivalente de NestJS a un "post-middleware") para manejar las respuestas
- Almacenarse en una base de datos en memoria como **Redis** para mejor performance y escalabilidad
- Incluir TTL (Time To Live) para las claves de idempotencia

### 3. Manejo de Fechas y Zonas Horarias
El manejo de fechas en esta implementación es funcional pero simplificado. En producción se deberían considerar:
- **Ubicación del cliente**: Reservas realizadas desde países diferentes al del restaurante
- **Ubicación del servidor**: Zona horaria donde corre la aplicación
- **Horarios de verano/invierno**: Cambios de DST (Daylight Saving Time)
- **Normalización a UTC**: Almacenar todo en UTC y convertir en la presentación
- **Validación de horarios**: Considerar horarios locales del restaurante para slots válidos

### 4. Lógica de Asignación de Mesas
Se utiliza un algoritmo de optimización simple que:
- Prioriza la mesa más pequeña disponible que pueda acomodar al grupo
- Se utiliza un lockeo pesimista para evitar que múltiples usuarios reserven la misma mesa en el mismo horario de forma concurrente.

### 5. Inicialización del Sistema

Para levantar el sistema completo:
```bash
docker-compose up
```

Este comando:
- Crea los contenedores necesarios (base de datos, aplicación)
- Ejecuta automáticamente los scripts de inicialización de la BD
- Aplica el seed de datos de prueba

### 6. Ejecución de Tests

Los tests se ejecutan con:
```bash
npm run test
```

**Requisito importante**: La base de datos del Docker debe estar levantada y corriendo antes de ejecutar los tests, ya que estos realizan operaciones contra la BD real.
```bash
# Asegúrate de que el Docker esté corriendo
docker-compose up -d

# Luego ejecuta los tests
npm run test
```