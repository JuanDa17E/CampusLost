# CampusLost

Sistema web para la gestión de objetos perdidos dentro del campus/institución.  
Permite registrar objetos encontrados, consultar reportes, administrar usuarios y gestionar estados de entrega.

---

# Tecnologías usadas

## Frontend
- Angular
- TypeScript
- Bootstrap

## Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Spring Security
- Maven

## Base de datos
- MySQL / MariaDB
- XAMPP (opcional para entorno local)

---

# Estructura del proyecto

```bash
CampusLost/
│── Frontend/   # Proyecto Angular
│── Backend/    # API REST con Spring Boot
│── README.md

Tecnologías usadas

Frontend:

Angular
TypeScript
Bootstrap

Backend:

Java 21
Spring Boot
Spring Data JPA
Spring Security
Maven

Base de datos:

MySQL / MariaDB
XAMPP (opcional para entorno local)
Estructura del proyecto

CampusLost/
│── Frontend/ Proyecto Angular
│── Backend/ API REST con Spring Boot
│── README.txt

Requisitos previos

Instalar lo siguiente:

Frontend:

Node.js versión 18 o superior
Angular CLI

Comando:

npm install -g @angular/cli

Backend:

Java JDK 21
Maven

Base de datos:

XAMPP o MySQL Server
Configuración de Base de Datos
Crear base de datos

Entrar a phpMyAdmin o MySQL y ejecutar:

CREATE DATABASE campuslost;

Importar script SQL

Si existe archivo campuslost.sql, importarlo en phpMyAdmin.

Configuración Backend

Ir al archivo:

Backend/src/main/resources/application.properties

Configurar:

spring.datasource.url=jdbc:mysql://localhost:3306/campuslost
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080

Si MySQL tiene contraseña, colocarla en password.

Ejecutar Backend

Desde la carpeta Backend ejecutar:

mvn spring-boot:run

Si todo sale bien aparecerá:

Tomcat started on port 8080

Ejecutar Frontend

Desde carpeta Frontend ejecutar:

cd Frontend
npm install
ng serve

Abrirá en:

http://localhost:4200

Usuarios del sistema

Los usuarios se registran desde el CRUD o directamente desde la base de datos.

Roles sugeridos:

1 = Admin
2 = Usuario

Inicio de sesión

El sistema valida:

correo
contraseña encriptada con BCrypt

Endpoint:

POST /api/auth/login

Ejemplo JSON:

{
"correo": "admin@gmail.com
",
"contrasena": "123456"
}

Funcionalidades principales

Usuarios:

Registrar usuarios
Editar usuarios (solo admin)
Eliminar usuarios
Login

Objetos:

Registrar objeto perdido
Consultar objetos
Cambiar estado
Entregar objeto

Categorías:

CRUD completo

Estados:

CRUD completo

Roles:

CRUD completo
Seguridad

Las contraseñas se guardan cifradas usando BCryptPasswordEncoder.

Problemas comunes
Error conexión MySQL

Verificar que XAMPP y MySQL estén iniciados.

Angular no abre

Ejecutar:

npm install

Puerto ocupado

Frontend:

ng serve --port 4201

Backend:

server.port=8081

Futuras mejoras
JWT
Subida de imágenes
Reportes PDF
Dashboard estadístico
Notificaciones por correo
Roles avanzados
Autor

CampusLost Team