# =========================================================================
# Etapa 1: Compilación del proyecto (Builder)
# =========================================================================
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copiar Maven wrapper y pom.xml primero para aprovechar el caché de capas de Docker
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Dar permisos de ejecución al wrapper y precargar dependencias
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# Copiar el código fuente y empaquetar el JAR (omitiendo tests para no requerir conexión a BD en build)
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests -B

# =========================================================================
# Etapa 2: Imagen ligera para ejecución (Runtime)
# =========================================================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Crear usuario sin privilegios root por seguridad en entornos cloud
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copiar únicamente el archivo JAR generado desde la etapa de compilación
COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

# Render define automáticamente la variable PORT (por defecto 8080 o 10000)
ENV PORT=8080
EXPOSE ${PORT}

# Ajuste de memoria para contenedores (limita el uso de RAM al 75% del contenedor gratuito de Render)
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -jar app.jar"]
