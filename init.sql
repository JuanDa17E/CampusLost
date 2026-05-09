-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-05-2026 a las 16:28:41
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `campuslost`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caracteristicas`
--

CREATE TABLE `caracteristicas` (
  `id_caracteristica` int(11) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `tiene_golpes` tinyint(1) DEFAULT NULL,
  `tiene_rayones` tinyint(1) DEFAULT NULL,
  `descripcion_detallada` text DEFAULT NULL,
  `id_objeto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`) VALUES
(3, 'Accesorios'),
(2, 'Documentos'),
(1, 'Electrónica'),
(4, 'Ropa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id_estado` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id_estado`, `nombre`) VALUES
(1, 'ABANDONADO'),
(3, 'ENTREGADO'),
(2, 'REGISTRADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_estados`
--

CREATE TABLE `historial_estados` (
  `id_historial` int(11) NOT NULL,
  `id_objeto` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenes` (
  `id_imagen` int(11) NOT NULL,
  `url` text NOT NULL,
  `id_objeto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `intentos_reclamacion`
--

CREATE TABLE `intentos_reclamacion` (
  `id_intento` int(11) NOT NULL,
  `id_objeto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `objetos`
--

CREATE TABLE `objetos` (
  `id_objeto` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  `fecha_evento` date NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `en_punto_encuentro` tinyint(1) DEFAULT 0,
  `fecha_punto_encuentro` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `objetos`
--

INSERT INTO `objetos` (`id_objeto`, `titulo`, `descripcion`, `lugar`, `fecha_evento`, `imagen_url`, `id_usuario`, `id_categoria`, `id_estado`, `fecha_registro`, `en_punto_encuentro`, `fecha_punto_encuentro`) VALUES
(1, 'Prueba', 'registro de pruebaaaa', 'cancha', '2026-04-01', NULL, 5, 3, 2, '2026-04-22 20:14:39', 0, NULL),
(2, 'Prueba 2', 'Prueba 2', 'Biblioteca', '2026-04-10', NULL, 4, 2, 3, '2026-04-22 20:24:56', 0, NULL),
(3, 'Prueba 3', 'Prueba 3', 'GYM', '2026-04-08', NULL, 5, 1, 1, '2026-04-22 20:33:26', 0, NULL),
(4, 'Prueba desde front', 'Aqui dandole a lo que es la programacion', 'mi pc juas juas', '2026-04-22', NULL, 9, 3, 3, '2026-04-22 21:17:46', 0, NULL),
(5, 'jhtdhgr', ',jyhnfc', 'kdfdd', '2026-05-05', NULL, 9, 2, 3, '2026-05-05 23:51:39', 0, NULL),
(6, 'Prueba2', '21231', 'cancha', '2026-05-06', NULL, 9, 3, 2, '2026-05-06 18:15:51', 0, NULL),
(7, 'Prueba3', '2w2', 'kdfdd', '2026-05-06', NULL, 10, 3, 3, '2026-05-06 18:39:17', 0, NULL),
(8, 'Prueba4232', 'registro de pruebaaaa', '2323', '2026-05-30', NULL, 10, 3, 2, '2026-05-06 20:07:03', 0, NULL),
(9, 'jhtdhgr', 'wd', 'kdfdd', '2026-05-06', NULL, 10, 3, 2, '2026-05-06 21:41:15', 0, NULL),
(10, 'Mochila', 'mmm', 'Biblioteca', '2026-05-07', NULL, 10, 4, 2, '2026-05-07 20:49:06', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_base`
--

CREATE TABLE `preguntas_base` (
  `id_pregunta_base` int(11) NOT NULL,
  `pregunta` varchar(255) NOT NULL,
  `activa` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `preguntas_base`
--

INSERT INTO `preguntas_base` (`id_pregunta_base`, `pregunta`, `activa`) VALUES
(1, '¿De qué color es el objeto?', 1),
(2, '¿Tiene alguna marca, modelo o seña particular?', 1),
(3, '¿En qué estado se encontró el objeto (completo, dañado, etc.)?', 1),
(4, '¿Tenía algo dentro o acompañando al objeto cuando fue encontrado?', 1),
(5, '¿Dónde exactamente fue encontrado dentro del campus?', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_verificacion`
--

CREATE TABLE `preguntas_verificacion` (
  `id_pregunta` int(11) NOT NULL,
  `id_objeto` int(11) NOT NULL,
  `respuesta` varchar(255) NOT NULL,
  `es_predefinida` tinyint(1) DEFAULT 0,
  `id_usuario` int(11) DEFAULT NULL,
  `id_pregunta_base` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `preguntas_verificacion`
--

INSERT INTO `preguntas_verificacion` (`id_pregunta`, `id_objeto`, `respuesta`, `es_predefinida`, `id_usuario`, `id_pregunta_base`) VALUES
(1, 10, 'Negro', 0, 10, 1),
(2, 10, 'Huawei', 0, 10, 2),
(3, 10, 'Completo', 0, 10, 3),
(4, 10, 'no', 0, 10, 4),
(5, 10, 'Al lado de la puerta de la biblioteca', 0, 10, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_reclamacion`
--

CREATE TABLE `respuestas_reclamacion` (
  `id_respuesta` int(11) NOT NULL,
  `id_intento` int(11) NOT NULL,
  `respuesta_dada` varchar(255) NOT NULL,
  `id_pregunta_base` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'ADMIN'),
(3, 'prueba'),
(2, 'USUARIO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contrasena`, `id_rol`, `fecha_creacion`) VALUES
(4, 'Juan3', 'juannn@gmail.com', '$2a$10$41vV3zjH7gqhI9Ynat3ssOCnCNDU3ei6OleU/JKIHYlp5jmKtn.gi', 1, '2026-04-17 03:43:24'),
(5, 'Emmanuel', 'emma@gmail.com', '$2a$10$7BvQ9NnDXIpV20zlW216v.N9KKgwavEeasVFFjdSkMbrRahcwTuAa', 1, '2026-04-18 01:15:38'),
(7, 'Maria', 'maria@gmail.com', '$2a$10$c4rb4t5XrWuza.tZ3vBZ8O7f/snCfJ0x5P5xGJwDh945PqX0GYq/y', 2, '2026-04-18 01:54:59'),
(9, 'Juan D', 'juan@gmail.com', '$2a$10$2JgkxSY8zV46nq0.TQj.AesBmhUj0obCIAN128HY9yQypQjnYSi.e', 1, '2026-04-21 19:45:44'),
(10, 'Andres', 'andres@gmail.com', '$2a$10$sUPuPeiaWEqQWnh/QCJUzOWE7SCGVXe9f3mYK1jsi0vll4Z7xPGAi', 1, '2026-05-06 00:03:12'),
(11, 'emma', 'emma@comunidad.edu.co', '$2a$10$s06YCexJJANXgLS1UOeJGOD1omlH2A71TRM6xivoR8IMoWxQWj2Yi', 1, '2026-05-09 01:14:07'),
(12, 'emma', 'hola@gmail.com', '$2a$10$e6nJSsiPVzli7aEZGlXVn.1U.6/Nxhhp77P2XUDevdLR2oHB9tkbG', 1, '2026-05-09 02:03:25'),
(13, 'alo', 'alo@gmail.com', '$2a$10$b5vqtrcXkcawERyGmrbMWOrw/.jDcUwbbnC8KScBMazgGvktecjly', 1, '2026-05-09 02:33:38');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `caracteristicas`
--
ALTER TABLE `caracteristicas`
  ADD PRIMARY KEY (`id_caracteristica`),
  ADD KEY `id_objeto` (`id_objeto`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id_estado`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_objeto` (`id_objeto`),
  ADD KEY `id_estado` (`id_estado`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `id_objeto` (`id_objeto`);

--
-- Indices de la tabla `intentos_reclamacion`
--
ALTER TABLE `intentos_reclamacion`
  ADD PRIMARY KEY (`id_intento`),
  ADD KEY `id_objeto` (`id_objeto`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `objetos`
--
ALTER TABLE `objetos`
  ADD PRIMARY KEY (`id_objeto`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `preguntas_base`
--
ALTER TABLE `preguntas_base`
  ADD PRIMARY KEY (`id_pregunta_base`);

--
-- Indices de la tabla `preguntas_verificacion`
--
ALTER TABLE `preguntas_verificacion`
  ADD PRIMARY KEY (`id_pregunta`),
  ADD KEY `id_objeto` (`id_objeto`),
  ADD KEY `id_pregunta_base` (`id_pregunta_base`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `respuestas_reclamacion`
--
ALTER TABLE `respuestas_reclamacion`
  ADD PRIMARY KEY (`id_respuesta`),
  ADD KEY `id_intento` (`id_intento`),
  ADD KEY `id_pregunta_base` (`id_pregunta_base`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `caracteristicas`
--
ALTER TABLE `caracteristicas`
  MODIFY `id_caracteristica` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `intentos_reclamacion`
--
ALTER TABLE `intentos_reclamacion`
  MODIFY `id_intento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `objetos`
--
ALTER TABLE `objetos`
  MODIFY `id_objeto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `preguntas_base`
--
ALTER TABLE `preguntas_base`
  MODIFY `id_pregunta_base` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `preguntas_verificacion`
--
ALTER TABLE `preguntas_verificacion`
  MODIFY `id_pregunta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `respuestas_reclamacion`
--
ALTER TABLE `respuestas_reclamacion`
  MODIFY `id_respuesta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `caracteristicas`
--
ALTER TABLE `caracteristicas`
  ADD CONSTRAINT `caracteristicas_ibfk_1` FOREIGN KEY (`id_objeto`) REFERENCES `objetos` (`id_objeto`);

--
-- Filtros para la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  ADD CONSTRAINT `historial_estados_ibfk_1` FOREIGN KEY (`id_objeto`) REFERENCES `objetos` (`id_objeto`),
  ADD CONSTRAINT `historial_estados_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estados` (`id_estado`),
  ADD CONSTRAINT `historial_estados_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `imagenes_ibfk_1` FOREIGN KEY (`id_objeto`) REFERENCES `objetos` (`id_objeto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `intentos_reclamacion`
--
ALTER TABLE `intentos_reclamacion`
  ADD CONSTRAINT `intentos_reclamacion_ibfk_1` FOREIGN KEY (`id_objeto`) REFERENCES `objetos` (`id_objeto`),
  ADD CONSTRAINT `intentos_reclamacion_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `objetos`
--
ALTER TABLE `objetos`
  ADD CONSTRAINT `objetos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `objetos_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `objetos_ibfk_3` FOREIGN KEY (`id_estado`) REFERENCES `estados` (`id_estado`);

--
-- Filtros para la tabla `preguntas_verificacion`
--
ALTER TABLE `preguntas_verificacion`
  ADD CONSTRAINT `preguntas_verificacion_ibfk_1` FOREIGN KEY (`id_objeto`) REFERENCES `objetos` (`id_objeto`),
  ADD CONSTRAINT `preguntas_verificacion_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `preguntas_verificacion_ibfk_3` FOREIGN KEY (`id_pregunta_base`) REFERENCES `preguntas_base` (`id_pregunta_base`),
  ADD CONSTRAINT `preguntas_verificacion_ibfk_4` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `respuestas_reclamacion`
--
ALTER TABLE `respuestas_reclamacion`
  ADD CONSTRAINT `respuestas_reclamacion_ibfk_1` FOREIGN KEY (`id_intento`) REFERENCES `intentos_reclamacion` (`id_intento`),
  ADD CONSTRAINT `respuestas_reclamacion_ibfk_2` FOREIGN KEY (`id_pregunta_base`) REFERENCES `preguntas_base` (`id_pregunta_base`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
