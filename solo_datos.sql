-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-05-2026 a las 18:04:06
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
-- Base de datos: `railway`
--

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`) VALUES
(3, 'Accesorios'),
(2, 'Documentos'),
(1, 'Electrónica'),
(4, 'Ropa');

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id_estado`, `nombre`) VALUES
(1, 'ABANDONADO'),
(3, 'ENTREGADO'),
(2, 'REGISTRADO');

--
-- Volcado de datos para la tabla `objetos`
--

INSERT INTO `objetos` (`id_objeto`, `titulo`, `descripcion`, `lugar`, `fecha_evento`, `imagen_url`, `id_usuario`, `id_categoria`, `id_estado`, `fecha_registro`, `en_punto_encuentro`, `fecha_punto_encuentro`) VALUES
(1, 'Prueba', 'registro de pruebaaaa', 'cancha', '2026-04-01', NULL, 5, 3, 3, '2026-04-22 20:14:39', 0, NULL),
(2, 'Prueba 2', 'Prueba 2', 'Biblioteca', '2026-04-10', NULL, 4, 2, 3, '2026-04-22 20:24:56', 0, NULL),
(3, 'Prueba 3', 'Prueba 3', 'GYM', '2026-04-08', NULL, 5, 1, 1, '2026-04-22 20:33:26', 0, NULL),
(4, 'Prueba desde front', 'Aqui dandole a lo que es la programacion', 'mi pc juas juas', '2026-04-22', NULL, 9, 3, 3, '2026-04-22 21:17:46', 0, NULL),
(5, 'jhtdhgr', ',jyhnfc', 'kdfdd', '2026-05-05', NULL, 9, 2, 3, '2026-05-05 23:51:39', 0, NULL),
(6, 'Prueba2', '21231', 'cancha', '2026-05-06', NULL, 9, 3, 2, '2026-05-06 18:15:51', 0, NULL),
(7, 'Prueba3', '2w2', 'kdfdd', '2026-05-06', NULL, 10, 3, 3, '2026-05-06 18:39:17', 0, NULL),
(8, 'Prueba4232', 'registro de pruebaaaa', '2323', '2026-05-30', NULL, 10, 3, 2, '2026-05-06 20:07:03', 0, NULL),
(9, 'jhtdhgr', 'wd', 'kdfdd', '2026-05-06', NULL, 10, 3, 2, '2026-05-06 21:41:15', 0, NULL),
(10, 'Mochila', 'mmm', 'Biblioteca', '2026-05-07', NULL, 10, 4, 2, '2026-05-07 20:49:06', 0, NULL),
(11, 'Emmanuel', 'Estaba bien perdido', 'En el río medellin', '2026-05-08', NULL, 10, 3, 2, '2026-05-09 00:46:48', 0, NULL),
(12, 'E', 'E', 'D', '2026-05-08', NULL, 10, 3, 2, '2026-05-09 00:47:24', 0, NULL),
(13, 'Fbdjd', 'Dndbs', 'Dhss', '2026-05-08', NULL, 10, 1, 2, '2026-05-09 01:02:33', 0, NULL),
(14, 'm', '2', '2', '2026-05-08', NULL, 10, 3, 2, '2026-05-09 01:54:11', 0, NULL),
(15, '21', '2', '2', '2026-05-08', NULL, 10, 4, 2, '2026-05-09 02:03:47', 0, NULL),
(16, 'dad', 'ad', 'ad', '2026-05-07', NULL, 10, 2, 2, '2026-05-09 02:04:58', 0, NULL),
(17, 'a', '2', '2', '2026-05-30', NULL, 10, 2, 2, '2026-05-09 02:07:14', 0, NULL);

--
-- Volcado de datos para la tabla `preguntas_base`
--

INSERT INTO `preguntas_base` (`id_pregunta_base`, `pregunta`, `activa`) VALUES
(1, '¿De qué color es el objeto?', 1),
(2, '¿Tiene alguna marca, modelo o seña particular?', 1),
(3, '¿En qué estado se encontró el objeto (completo, dañado, etc.)?', 1),
(4, '¿Tenía algo dentro o acompañando al objeto cuando fue encontrado?', 1),
(5, '¿Dónde exactamente fue encontrado dentro del campus?', 1);

--
-- Volcado de datos para la tabla `preguntas_verificacion`
--

INSERT INTO `preguntas_verificacion` (`id_pregunta`, `id_objeto`, `respuesta`, `es_predefinida`, `id_usuario`, `id_pregunta_base`) VALUES
(1, 10, 'Negro', 0, 10, 1),
(2, 10, 'Huawei', 0, 10, 2),
(3, 10, 'Completo', 0, 10, 3),
(4, 10, 'no', 0, 10, 4),
(5, 10, 'Al lado de la puerta de la biblioteca', 0, 10, 5);

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'ADMIN'),
(3, 'prueba'),
(2, 'USUARIO');

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contrasena`, `id_rol`, `fecha_creacion`) VALUES
(4, 'Juan3', 'juannn@gmail.com', '$2a$10$41vV3zjH7gqhI9Ynat3ssOCnCNDU3ei6OleU/JKIHYlp5jmKtn.gi', 1, '2026-04-17 03:43:24'),
(5, 'Emmanuel', 'emma@gmail.com', '$2a$10$7BvQ9NnDXIpV20zlW216v.N9KKgwavEeasVFFjdSkMbrRahcwTuAa', 1, '2026-04-18 01:15:38'),
(7, 'Maria', 'maria@gmail.com', '$2a$10$c4rb4t5XrWuza.tZ3vBZ8O7f/snCfJ0x5P5xGJwDh945PqX0GYq/y', 2, '2026-04-18 01:54:59'),
(9, 'Juan D', 'juan@gmail.com', '$2a$10$2JgkxSY8zV46nq0.TQj.AesBmhUj0obCIAN128HY9yQypQjnYSi.e', 1, '2026-04-21 19:45:44'),
(10, 'Andres', 'andres@gmail.com', '$2a$10$sUPuPeiaWEqQWnh/QCJUzOWE7SCGVXe9f3mYK1jsi0vll4Z7xPGAi', 1, '2026-05-06 00:03:12'),
(11, 'Juan David Agudelo', 'jd.agudelorestrepo@gmail.com', '$2a$10$NQtpHgQd.Q.83Z3QBVDO0uA8WsSd8cYcHE5V.zvc3F0WahZb/9On6', 1, '2026-05-09 02:38:45'),
(12, 'Jdjdjd', 'jdjsjs@gmail.com', '$2a$10$MD6HXwKC07GawyJRXbO8HOm..AHZiljIvt7Xp.9f1D3/SdAcx1Mu.', 1, '2026-05-09 02:39:48'),
(13, 'adad', 'adada@', '$2a$10$9mfr43DXQyxxRr4vx15l1emN3loc6fJX4/vY0nrFTod2VcBvYOgM.', 1, '2026-05-09 02:52:42');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
