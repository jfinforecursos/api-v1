# Capítulo 2: Configuración del Proyecto, Maven y Dependencias

En este capítulo aprenderás cómo se construye el esqueleto del proyecto, qué herramientas se utilizan para gestionar librerías externas y cómo se configura la conexión a la base de datos.

---

## 1. ¿Qué es Maven y para qué sirve `pom.xml`?

Cuando programas en Java, no tienes que escribir todo desde cero. Existen miles de librerías creadas por expertos (por ejemplo, para conectarse a PostgreSQL o generar documentación interactiva).

**Apache Maven** es una herramienta que:
1. Descarga automáticamente todas las librerías que tu proyecto necesita.
2. Compila tu código fuente en archivos binarios (`.class`).
3. Empaqueta tu aplicación en un único archivo ejecutable (`.jar`).

Toda la configuración de Maven vive en el archivo **`pom.xml`** (*Project Object Model*), ubicado en la raíz del proyecto.

---

## 2. Desglose de las Dependencias en `pom.xml`

Veamos las librerías clave que incluimos en nuestro proyecto:

```xml
<dependencies>
    <!-- 1. Spring Boot Starter Data JPA: Permite interactuar con la Base de Datos -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- 2. Spring Boot Starter Web: Crea servidores web y endpoints REST -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webmvc</artifactId>
    </dependency>

    <!-- 3. Driver de PostgreSQL: Permite a Java hablar el dialecto de PostgreSQL -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- 4. SpringDoc OpenAPI (Swagger UI): Documentación visual e interactiva -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.8.5</version>
    </dependency>

    <!-- 5. Scalar: Interfaz moderna y elegante para probar la API en el navegador -->
    <dependency>
        <groupId>com.scalar.maven</groupId>
        <artifactId>scalar-webmvc</artifactId>
        <version>0.6.74</version>
    </dependency>
</dependencies>
```

### ¿Por qué NO usamos Lombok en este proyecto?
Lombok es una librería popular que genera getters y setters automáticamente mediante anotaciones como `@Getter` y `@Data`. Sin embargo, para fines de **aprendizaje y proyectos robustos**:
1. **Claridad total:** Escribir los getters y setters explícitos en Java estándar permite al estudiante ver exactamente qué métodos existen y cómo se transfieren los datos sin "magia oculta".
2. **Cero problemas de compilación:** Elimina incompatibilidades con versiones recientes de Java (Java 17/21) o conflictos con el plugin de compilación de Maven.
3. **Control:** Permite personalizar la lógica de asignación (por ejemplo, convertir texto a mayúsculas o validar nulos al setear).

---

## 3. Configuración en `application.properties`

En la carpeta `src/main/resources/application.properties` definimos las propiedades de ejecución de la aplicación:

```properties
# Nombre asignado a la aplicación
spring.application.name=citas

# Conexión a la Base de Datos con valores por defecto locales (fallback)
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/citas_db}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}

# Puerto del servidor web (Render inyecta PORT automáticamente)
server.port=${PORT:8080}

# Configuración de JPA / Hibernate:
# 'update' crea o actualiza las tablas en la BD automáticamente al arrancar
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Rutas para la documentación Swagger y Scalar
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
scalar.enabled=true
scalar.url=/v3/api-docs
scalar.path=/scalar
```

### La sintaxis `${VARIABLE:valor_por_defecto}` explicada:
Observa esta línea:
```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/citas_db}
```
Significa:
- *"Si existe en el sistema una variable de entorno llamada `DB_URL`, úsala (por ejemplo, en servidores de producción como Render)"*.
- *"Si no existe ninguna variable en el sistema, usa el valor que está después de los dos puntos (`jdbc:postgresql://localhost:5432/citas_db`)"*.

Esto hace que la aplicación funcione tanto en la computadora del estudiante sin configuraciones complejas, como en la nube en servidores de producción.

---

## 4. Gestión Segura de Credenciales (`.env` y `.env.example`)

Nunca debes subir contraseñas o credenciales de bases de datos a repositorios públicos como GitHub. Para evitarlo:
1. El archivo **`.gitignore`** contiene la línea `.env`, lo que asegura que tu archivo con contraseñas reales jamás se subirá a Git.
2. Creamos **`.env.example`** como plantilla pública para que cualquier persona que descargue el proyecto sepa qué variables debe configurar:
   ```properties
   DB_URL=jdbc:postgresql://localhost:5432/citas_db
   DB_USERNAME=tu_usuario_de_bd
   DB_PASSWORD=tu_contrasenia_segura
   PORT=8080
   ```

---

## 5. El Maven Wrapper (`./mvnw`)

En la raíz del proyecto encontrarás los archivos `mvnw` (para Linux/Mac) y `mvnw.cmd` (para Windows).
El **Maven Wrapper** permite compilar y ejecutar el proyecto aunque la computadora **no tenga Maven instalado**, descargando la versión exacta y necesaria automáticamente.

Comandos básicos:
```bash
# Compilar el código para verificar que no haya errores de sintaxis
./mvnw clean compile

# Compilar código de aplicación y pruebas
./mvnw clean test-compile

# Generar el archivo .jar ejecutable
./mvnw clean package -DskipTests

# Ejecutar la aplicación localmente
./mvnw spring-boot:run
```

En el siguiente capítulo nos adentraremos en el corazón de los datos: **las Entidades, `@MappedSuperclass`, `@Embeddable` y las Relaciones JPA**.
