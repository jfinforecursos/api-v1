# Capítulo 5: Repositorios y Persistencia con Spring Data JPA

En este capítulo aprenderás cómo la capa de **Repositorios** elimina la necesidad de escribir sentencias SQL manuales complejas como `SELECT * FROM citas WHERE cliente_id = ?`, permitiendo interactuar con PostgreSQL usando simplemente métodos de Java.

---

## 1. ¿Qué es un Repositorio en Spring Boot?

En la arquitectura en capas, el **Repositorio** es el único componente autorizado para dialogar con la base de datos.
En lugar de escribir código JDBC con conexiones manuales, controladores y cursores, en Spring Data JPA creamos una **interfaz** que extiende `JpaRepository`.

Observa el código de [ClienteRepository.java](file:///c:/Users/Jhon/Desktop/Proyectos/b2-dto/src/main/java/com/example/citas/repository/ClienteRepository.java):

```java
package com.example.citas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.citas.model.entity.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    boolean existsByContactoEmail(String email);
}
```

¡Eso es todo! No escribimos ninguna clase que implemente esta interfaz. Spring detecta la anotación `@Repository` y en tiempo de ejecución genera automáticamente la implementación de conexión SQL por nosotros.

---

## 2. Los Métodos CRUD que `JpaRepository` te regala

Al extender `JpaRepository<Entidad, TipoId>`, tu interfaz hereda de inmediato decenas de operaciones listas para usar:

| Método de Java | Qué sentencia SQL ejecuta | Para qué se usa |
|---|---|---|
| `save(entidad)` | `INSERT INTO ...` o `UPDATE ...` | Guarda un nuevo registro o actualiza uno existente |
| `findById(id)` | `SELECT * FROM tabla WHERE id = ?` | Busca un registro por su clave primaria (retorna un `Optional<T>`) |
| `findAll()` | `SELECT * FROM tabla` | Trae todos los registros de la tabla |
| `existsById(id)` | `SELECT 1 FROM tabla WHERE id = ?` | Comprueba rápidamente si un ID existe (retorna `true` o `false`) |
| `deleteById(id)` | `DELETE FROM tabla WHERE id = ?` | Elimina el registro con ese ID |
| `count()` | `SELECT COUNT(*) FROM tabla` | Cuenta cuántas filas hay en la tabla |

---

## 3. ¿Qué son los *Query Methods* (Métodos Derivados)?

¿Qué pasa si necesitas buscar por un campo que no es el `id`?
Por ejemplo: *"Quiero saber si ya existe un cliente con este correo electrónico"*.

Spring Data JPA incluye una característica llamada **Derivación de Consultas a partir del Nombre del Método**. Spring lee el nombre del método en inglés (`findBy...`, `existsBy...`, `countBy...`) y **construye la consulta SQL automáticamente**.

### Ejemplos en nuestro proyecto:

### A. En [ClienteRepository.java](file:///c:/Users/Jhon/Desktop/Proyectos/b2-dto/src/main/java/com/example/citas/repository/ClienteRepository.java) y [ProfesionalRepository.java](file:///c:/Users/Jhon/Desktop/Proyectos/b2-dto/src/main/java/com/example/citas/repository/ProfesionalRepository.java):
```java
boolean existsByContactoEmail(String email);
```
- **Cómo lo interpreta Spring:** Como `Contacto` es un objeto `@Embeddable` dentro de `Cliente`, Spring navega a la propiedad `email` dentro de `contacto` y genera el SQL:
  ```sql
  SELECT COUNT(*) > 0 FROM clientes WHERE email = ?;
  ```

---

### B. En [CitaRepository.java](file:///c:/Users/Jhon/Desktop/Proyectos/b2-dto/src/main/java/com/example/citas/repository/CitaRepository.java):
```java
// 1. Obtener todas las citas de un cliente (para la relación 1 a Muchos)
List<Cita> findByClienteId(Long clienteId);

// 2. Comprobar si un profesional ya tiene cita a esa hora (para la regla de negocio)
boolean existsByProfesionalIdAndFechaHora(Long profesionalId, LocalDateTime fechaHora);
```
- **El SQL que genera Spring automáticamente:**
  ```sql
  -- Para findByClienteId:
  SELECT * FROM citas WHERE cliente_id = ?;

  -- Para existsByProfesionalIdAndFechaHora:
  SELECT COUNT(*) > 0 FROM citas WHERE profesional_id = ? AND fecha_hora = ?;
  ```

---

### C. En [PagoRepository.java](file:///c:/Users/Jhon/Desktop/Proyectos/b2-dto/src/main/java/com/example/citas/repository/PagoRepository.java):
```java
// Buscar el pago correspondiente a una cita específica
Optional<Pago> findByCitaId(Long citaId);

// Validar que una cita no tenga ya un pago registrado (Relación 1 a 1)
boolean existsByCitaId(Long citaId);
```
- **El SQL que genera Spring automáticamente:**
  ```sql
  SELECT * FROM pagos WHERE cita_id = ?;
  ```

---

## 4. ¿Qué es `Optional<T>` y por qué es tan útil?

Cuando buscas un registro por ID con `findById(id)` o `findByCitaId(citaId)`, Spring no devuelve directamente el objeto, sino un `Optional<T>`.

### ¿Por qué?
Porque el registro podría **no existir** en la base de datos (por ejemplo, si buscas el cliente con ID 9999).
En lugar de retornar un peligroso valor `null` que causaría el clásico error `NullPointerException`, el `Optional` te obliga a manejar la posibilidad de ausencia de forma limpia:

```java
// En la capa Service:
Cita cita = citaRepository.findById(id)
    .orElseThrow(() -> new RecursoNoEncontradoException("Cita no encontrada con id: " + id));
```
Si la cita existe, se desempaqueta en la variable `cita`. Si no existe, se lanza de inmediato nuestra excepción personalizada `RecursoNoEncontradoException`, la cual devolverá un código HTTP 404 al usuario.

En el siguiente capítulo nos adentraremos en el cerebro de la aplicación: **la Capa de Servicio y las Reglas de Negocio**.
