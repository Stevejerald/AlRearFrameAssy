-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 09, 2025 at 06:45 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `self_certification`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_details`
--

DROP TABLE IF EXISTS `admin_details`;
CREATE TABLE IF NOT EXISTS `admin_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('reworkTeam','assemblyHead') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin_details`
--

INSERT INTO `admin_details` (`id`, `emp_id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'EMP001', 'John Smith', 'assembly@al.in', '$2y$10$H7S8StLiV7qOvs8cvWkVAupT7B/LObmMiCvD0kALNjw9nbDv7j.Zm', 'assemblyHead', '2025-12-09 05:14:39'),
(2, 'EMP001', 'John Smith', 'rework@al.in', '$2y$10$/qI2EfRRzbEjCKaYLVf4XOFrj58xCppHXpkCNz0CDxcK2updkZjUO', 'reworkTeam', '2025-12-09 05:27:52');

-- --------------------------------------------------------

--
-- Table structure for table `conveyorsequence`
--

DROP TABLE IF EXISTS `conveyorsequence`;
CREATE TABLE IF NOT EXISTS `conveyorsequence` (
  `id` int NOT NULL AUTO_INCREMENT,
  `master_id` int NOT NULL,
  `stage_id` varchar(10) NOT NULL,
  `processed` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dropped` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `master_id` (`master_id`)
) ENGINE=MyISAM AUTO_INCREMENT=235 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `conveyorsequence`
--

INSERT INTO `conveyorsequence` (`id`, `master_id`, `stage_id`, `processed`, `created_at`, `dropped`) VALUES
(1, 1, '1L', 1, '2025-12-09 18:32:00', 0),
(2, 1, '1R', 1, '2025-12-09 18:32:00', 0),
(3, 1, '1INSP', 1, '2025-12-09 18:32:00', 0),
(4, 1, '2L', 1, '2025-12-09 18:32:00', 0),
(5, 1, '2R', 1, '2025-12-09 18:32:00', 0),
(6, 1, '2INSP', 1, '2025-12-09 18:32:00', 0),
(7, 1, '3L', 1, '2025-12-09 18:32:00', 0),
(8, 1, '3R', 1, '2025-12-09 18:32:00', 0),
(9, 1, '3INSP', 1, '2025-12-09 18:32:00', 0),
(10, 1, '4L', 1, '2025-12-09 18:32:00', 0),
(11, 1, '4R', 1, '2025-12-09 18:32:00', 0),
(12, 1, '4INSP', 1, '2025-12-09 18:32:00', 0),
(13, 1, '5L', 1, '2025-12-09 18:32:00', 0),
(14, 1, '5R', 1, '2025-12-09 18:32:00', 0),
(15, 1, '5INSP', 1, '2025-12-09 18:32:00', 0),
(16, 1, '6L', 1, '2025-12-09 18:32:00', 0),
(17, 1, '6R', 1, '2025-12-09 18:32:00', 0),
(18, 1, '6INSP', 1, '2025-12-09 18:32:00', 0),
(19, 1, '7L', 1, '2025-12-09 18:32:00', 0),
(20, 1, '7R', 1, '2025-12-09 18:32:00', 0),
(21, 1, '7INSP', 1, '2025-12-09 18:32:00', 0),
(22, 1, '8L', 1, '2025-12-09 18:32:00', 0),
(23, 1, '8R', 1, '2025-12-09 18:32:00', 0),
(24, 1, '8INSP', 1, '2025-12-09 18:32:00', 0),
(25, 1, '9L', 1, '2025-12-09 18:32:00', 0),
(26, 1, '9R', 1, '2025-12-09 18:32:00', 0),
(27, 1, '9INSP', 1, '2025-12-09 18:32:00', 0),
(28, 1, '10L', 1, '2025-12-09 18:32:00', 0),
(29, 1, '10R', 1, '2025-12-09 18:32:00', 0),
(30, 1, '10INSP', 1, '2025-12-09 18:32:00', 0),
(31, 1, '11L', 1, '2025-12-09 18:32:00', 0),
(32, 1, '11R', 1, '2025-12-09 18:32:00', 0),
(33, 1, '11INSP', 1, '2025-12-09 18:32:00', 0),
(34, 1, '12L', 1, '2025-12-09 18:32:00', 0),
(35, 1, '12R', 1, '2025-12-09 18:32:00', 0),
(36, 1, '12INSP', 1, '2025-12-09 18:32:00', 0),
(37, 1, '13L', 1, '2025-12-09 18:32:00', 0),
(38, 1, '13R', 1, '2025-12-09 18:32:00', 0),
(39, 1, '13INSP', 1, '2025-12-09 18:32:00', 0),
(40, 2, '1L', 1, '2025-12-09 18:32:24', 0),
(41, 2, '1R', 1, '2025-12-09 18:32:24', 0),
(42, 2, '1INSP', 1, '2025-12-09 18:32:24', 0),
(43, 2, '2L', 1, '2025-12-09 18:32:24', 0),
(44, 2, '2R', 1, '2025-12-09 18:32:24', 0),
(45, 2, '2INSP', 1, '2025-12-09 18:32:24', 0),
(46, 2, '3L', 1, '2025-12-09 18:32:24', 0),
(47, 2, '3R', 1, '2025-12-09 18:32:24', 0),
(48, 2, '3INSP', 1, '2025-12-09 18:32:24', 0),
(49, 2, '4L', 1, '2025-12-09 18:32:24', 0),
(50, 2, '4R', 1, '2025-12-09 18:32:24', 0),
(51, 2, '4INSP', 1, '2025-12-09 18:32:24', 0),
(52, 2, '5L', 1, '2025-12-09 18:32:24', 0),
(53, 2, '5R', 1, '2025-12-09 18:32:24', 0),
(54, 2, '5INSP', 1, '2025-12-09 18:32:24', 0),
(55, 2, '6L', 1, '2025-12-09 18:32:24', 0),
(56, 2, '6R', 1, '2025-12-09 18:32:24', 0),
(57, 2, '6INSP', 1, '2025-12-09 18:32:24', 0),
(58, 2, '7L', 1, '2025-12-09 18:32:24', 0),
(59, 2, '7R', 1, '2025-12-09 18:32:24', 0),
(60, 2, '7INSP', 1, '2025-12-09 18:32:24', 0),
(61, 2, '8L', 1, '2025-12-09 18:32:24', 0),
(62, 2, '8R', 1, '2025-12-09 18:32:24', 0),
(63, 2, '8INSP', 1, '2025-12-09 18:32:24', 0),
(64, 2, '9L', 1, '2025-12-09 18:32:24', 0),
(65, 2, '9R', 1, '2025-12-09 18:32:24', 0),
(66, 2, '9INSP', 1, '2025-12-09 18:32:24', 0),
(67, 2, '10L', 1, '2025-12-09 18:32:24', 0),
(68, 2, '10R', 1, '2025-12-09 18:32:24', 0),
(69, 2, '10INSP', 1, '2025-12-09 18:32:24', 0),
(70, 2, '11L', 1, '2025-12-09 18:32:24', 0),
(71, 2, '11R', 1, '2025-12-09 18:32:24', 0),
(72, 2, '11INSP', 1, '2025-12-09 18:32:24', 0),
(73, 2, '12L', 1, '2025-12-09 18:32:24', 0),
(74, 2, '12R', 1, '2025-12-09 18:32:24', 0),
(75, 2, '12INSP', 1, '2025-12-09 18:32:24', 0),
(76, 2, '13L', 1, '2025-12-09 18:32:24', 0),
(77, 2, '13R', 1, '2025-12-09 18:32:24', 0),
(78, 2, '13INSP', 1, '2025-12-09 18:32:24', 0),
(79, 3, '1L', 1, '2025-12-09 18:32:48', 0),
(80, 3, '1R', 1, '2025-12-09 18:32:48', 0),
(81, 3, '1INSP', 1, '2025-12-09 18:32:48', 0),
(82, 3, '2L', 1, '2025-12-09 18:32:48', 0),
(83, 3, '2R', 1, '2025-12-09 18:32:48', 0),
(84, 3, '2INSP', 1, '2025-12-09 18:32:48', 0),
(85, 3, '3L', 1, '2025-12-09 18:32:48', 0),
(86, 3, '3R', 1, '2025-12-09 18:32:48', 0),
(87, 3, '3INSP', 1, '2025-12-09 18:32:48', 0),
(88, 3, '4L', 1, '2025-12-09 18:32:48', 0),
(89, 3, '4R', 1, '2025-12-09 18:32:48', 0),
(90, 3, '4INSP', 1, '2025-12-09 18:32:48', 0),
(91, 3, '5L', 1, '2025-12-09 18:32:48', 0),
(92, 3, '5R', 1, '2025-12-09 18:32:48', 0),
(93, 3, '5INSP', 1, '2025-12-09 18:32:48', 0),
(94, 3, '6L', 1, '2025-12-09 18:32:48', 0),
(95, 3, '6R', 1, '2025-12-09 18:32:48', 0),
(96, 3, '6INSP', 1, '2025-12-09 18:32:48', 0),
(97, 3, '7L', 1, '2025-12-09 18:32:48', 0),
(98, 3, '7R', 1, '2025-12-09 18:32:48', 0),
(99, 3, '7INSP', 1, '2025-12-09 18:32:48', 0),
(100, 3, '8L', 1, '2025-12-09 18:32:48', 0),
(101, 3, '8R', 1, '2025-12-09 18:32:48', 0),
(102, 3, '8INSP', 1, '2025-12-09 18:32:48', 0),
(103, 3, '9L', 1, '2025-12-09 18:32:48', 0),
(104, 3, '9R', 1, '2025-12-09 18:32:48', 0),
(105, 3, '9INSP', 1, '2025-12-09 18:32:48', 0),
(106, 3, '10L', 1, '2025-12-09 18:32:48', 0),
(107, 3, '10R', 1, '2025-12-09 18:32:48', 0),
(108, 3, '10INSP', 1, '2025-12-09 18:32:48', 0),
(109, 3, '11L', 1, '2025-12-09 18:32:48', 0),
(110, 3, '11R', 1, '2025-12-09 18:32:48', 0),
(111, 3, '11INSP', 1, '2025-12-09 18:32:48', 0),
(112, 3, '12L', 1, '2025-12-09 18:32:48', 0),
(113, 3, '12R', 1, '2025-12-09 18:32:48', 0),
(114, 3, '12INSP', 1, '2025-12-09 18:32:48', 0),
(115, 3, '13L', 1, '2025-12-09 18:32:48', 0),
(116, 3, '13R', 1, '2025-12-09 18:32:48', 0),
(117, 3, '13INSP', 1, '2025-12-09 18:32:48', 0),
(118, 4, '1L', 1, '2025-12-09 18:33:06', 0),
(119, 4, '1R', 1, '2025-12-09 18:33:06', 0),
(120, 4, '1INSP', 1, '2025-12-09 18:33:06', 0),
(121, 4, '2L', 1, '2025-12-09 18:33:06', 0),
(122, 4, '2R', 1, '2025-12-09 18:33:06', 0),
(123, 4, '2INSP', 1, '2025-12-09 18:33:06', 0),
(124, 4, '3L', 1, '2025-12-09 18:33:06', 0),
(125, 4, '3R', 1, '2025-12-09 18:33:06', 0),
(126, 4, '3INSP', 1, '2025-12-09 18:33:06', 0),
(127, 4, '4L', 1, '2025-12-09 18:33:06', 0),
(128, 4, '4R', 1, '2025-12-09 18:33:06', 0),
(129, 4, '4INSP', 1, '2025-12-09 18:33:06', 0),
(130, 4, '5L', 1, '2025-12-09 18:33:06', 0),
(131, 4, '5R', 1, '2025-12-09 18:33:06', 0),
(132, 4, '5INSP', 1, '2025-12-09 18:33:06', 0),
(133, 4, '6L', 1, '2025-12-09 18:33:06', 0),
(134, 4, '6R', 1, '2025-12-09 18:33:06', 0),
(135, 4, '6INSP', 1, '2025-12-09 18:33:06', 0),
(136, 4, '7L', 1, '2025-12-09 18:33:06', 0),
(137, 4, '7R', 1, '2025-12-09 18:33:06', 0),
(138, 4, '7INSP', 1, '2025-12-09 18:33:06', 0),
(139, 4, '8L', 1, '2025-12-09 18:33:06', 0),
(140, 4, '8R', 1, '2025-12-09 18:33:06', 0),
(141, 4, '8INSP', 1, '2025-12-09 18:33:06', 0),
(142, 4, '9L', 1, '2025-12-09 18:33:06', 0),
(143, 4, '9R', 1, '2025-12-09 18:33:06', 0),
(144, 4, '9INSP', 1, '2025-12-09 18:33:06', 0),
(145, 4, '10L', 1, '2025-12-09 18:33:06', 0),
(146, 4, '10R', 1, '2025-12-09 18:33:06', 0),
(147, 4, '10INSP', 1, '2025-12-09 18:33:06', 0),
(148, 4, '11L', 1, '2025-12-09 18:33:06', 0),
(149, 4, '11R', 1, '2025-12-09 18:33:06', 0),
(150, 4, '11INSP', 1, '2025-12-09 18:33:06', 0),
(151, 4, '12L', 1, '2025-12-09 18:33:06', 0),
(152, 4, '12R', 1, '2025-12-09 18:33:06', 0),
(153, 4, '12INSP', 1, '2025-12-09 18:33:06', 0),
(154, 4, '13L', 1, '2025-12-09 18:33:06', 0),
(155, 4, '13R', 1, '2025-12-09 18:33:06', 0),
(156, 4, '13INSP', 1, '2025-12-09 18:33:06', 0),
(157, 5, '1L', 1, '2025-12-09 18:33:22', 0),
(158, 5, '1R', 1, '2025-12-09 18:33:22', 1),
(159, 5, '1INSP', 1, '2025-12-09 18:33:22', 0),
(160, 5, '2L', 1, '2025-12-09 18:33:22', 0),
(161, 5, '2R', 1, '2025-12-09 18:33:22', 0),
(162, 5, '2INSP', 1, '2025-12-09 18:33:22', 0),
(163, 5, '3L', 1, '2025-12-09 18:33:22', 0),
(164, 5, '3R', 1, '2025-12-09 18:33:22', 0),
(165, 5, '3INSP', 1, '2025-12-09 18:33:22', 0),
(166, 5, '4L', 1, '2025-12-09 18:33:22', 0),
(167, 5, '4R', 1, '2025-12-09 18:33:22', 0),
(168, 5, '4INSP', 1, '2025-12-09 18:33:22', 0),
(169, 5, '5L', 1, '2025-12-09 18:33:22', 0),
(170, 5, '5R', 1, '2025-12-09 18:33:22', 0),
(171, 5, '5INSP', 1, '2025-12-09 18:33:22', 0),
(172, 5, '6L', 1, '2025-12-09 18:33:22', 0),
(173, 5, '6R', 1, '2025-12-09 18:33:22', 0),
(174, 5, '6INSP', 1, '2025-12-09 18:33:22', 0),
(175, 5, '7L', 1, '2025-12-09 18:33:22', 0),
(176, 5, '7R', 1, '2025-12-09 18:33:22', 0),
(177, 5, '7INSP', 1, '2025-12-09 18:33:22', 0),
(178, 5, '8L', 1, '2025-12-09 18:33:22', 0),
(179, 5, '8R', 1, '2025-12-09 18:33:22', 0),
(180, 5, '8INSP', 1, '2025-12-09 18:33:22', 0),
(181, 5, '9L', 1, '2025-12-09 18:33:22', 0),
(182, 5, '9R', 1, '2025-12-09 18:33:22', 0),
(183, 5, '9INSP', 1, '2025-12-09 18:33:22', 0),
(184, 5, '10L', 1, '2025-12-09 18:33:22', 0),
(185, 5, '10R', 1, '2025-12-09 18:33:22', 0),
(186, 5, '10INSP', 1, '2025-12-09 18:33:22', 0),
(187, 5, '11L', 1, '2025-12-09 18:33:22', 0),
(188, 5, '11R', 1, '2025-12-09 18:33:22', 0),
(189, 5, '11INSP', 1, '2025-12-09 18:33:22', 0),
(190, 5, '12L', 1, '2025-12-09 18:33:22', 0),
(191, 5, '12R', 1, '2025-12-09 18:33:22', 0),
(192, 5, '12INSP', 1, '2025-12-09 18:33:22', 0),
(193, 5, '13L', 1, '2025-12-09 18:33:22', 0),
(194, 5, '13R', 1, '2025-12-09 18:33:22', 0),
(195, 5, '13INSP', 1, '2025-12-09 18:33:22', 0),
(196, 6, '1L', 1, '2025-12-09 18:35:14', 0),
(197, 6, '1R', 1, '2025-12-09 18:35:14', 0),
(198, 6, '1INSP', 1, '2025-12-09 18:35:14', 0),
(199, 6, '2L', 1, '2025-12-09 18:35:14', 0),
(200, 6, '2R', 1, '2025-12-09 18:35:14', 0),
(201, 6, '2INSP', 1, '2025-12-09 18:35:14', 0),
(202, 6, '3L', 1, '2025-12-09 18:35:14', 0),
(203, 6, '3R', 1, '2025-12-09 18:35:14', 0),
(204, 6, '3INSP', 1, '2025-12-09 18:35:14', 0),
(205, 6, '4L', 1, '2025-12-09 18:35:14', 0),
(206, 6, '4R', 1, '2025-12-09 18:35:14', 0),
(207, 6, '4INSP', 1, '2025-12-09 18:35:14', 0),
(208, 6, '5L', 1, '2025-12-09 18:35:14', 0),
(209, 6, '5R', 1, '2025-12-09 18:35:14', 0),
(210, 6, '5INSP', 1, '2025-12-09 18:35:14', 0),
(211, 6, '6L', 1, '2025-12-09 18:35:14', 0),
(212, 6, '6R', 1, '2025-12-09 18:35:14', 0),
(213, 6, '6INSP', 1, '2025-12-09 18:35:14', 0),
(214, 6, '7L', 1, '2025-12-09 18:35:14', 0),
(215, 6, '7R', 1, '2025-12-09 18:35:14', 0),
(216, 6, '7INSP', 1, '2025-12-09 18:35:14', 0),
(217, 6, '8L', 1, '2025-12-09 18:35:14', 0),
(218, 6, '8R', 1, '2025-12-09 18:35:14', 0),
(219, 6, '8INSP', 1, '2025-12-09 18:35:14', 0),
(220, 6, '9L', 1, '2025-12-09 18:35:14', 0),
(221, 6, '9R', 1, '2025-12-09 18:35:14', 0),
(222, 6, '9INSP', 1, '2025-12-09 18:35:14', 0),
(223, 6, '10L', 1, '2025-12-09 18:35:14', 0),
(224, 6, '10R', 1, '2025-12-09 18:35:14', 0),
(225, 6, '10INSP', 1, '2025-12-09 18:35:14', 0),
(226, 6, '11L', 1, '2025-12-09 18:35:14', 0),
(227, 6, '11R', 1, '2025-12-09 18:35:14', 0),
(228, 6, '11INSP', 1, '2025-12-09 18:35:14', 0),
(229, 6, '12L', 1, '2025-12-09 18:35:14', 0),
(230, 6, '12R', 1, '2025-12-09 18:35:14', 0),
(231, 6, '12INSP', 1, '2025-12-09 18:35:14', 0),
(232, 6, '13L', 1, '2025-12-09 18:35:14', 0),
(233, 6, '13R', 1, '2025-12-09 18:35:14', 0),
(234, 6, '13INSP', 1, '2025-12-09 18:35:14', 0);

-- --------------------------------------------------------

--
-- Table structure for table `device_master`
--

DROP TABLE IF EXISTS `device_master`;
CREATE TABLE IF NOT EXISTS `device_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` varchar(50) NOT NULL,
  `device_mac` varchar(100) NOT NULL,
  `stage` varchar(5) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `device_master`
--

INSERT INTO `device_master` (`id`, `emp_id`, `device_mac`, `stage`, `created_at`) VALUES
(1, '538', 'A4:C3:33:22:E1', '1R', '2025-11-20 14:14:13'),
(2, '506', 'A4:C3:33:22:E2', '1L', '2025-11-20 14:14:13'),
(3, '495', 'A4:C3:33:22:E3', '2L', '2025-11-20 14:14:13');

-- --------------------------------------------------------

--
-- Table structure for table `drop_log`
--

DROP TABLE IF EXISTS `drop_log`;
CREATE TABLE IF NOT EXISTS `drop_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `master_id` int NOT NULL,
  `sequence_id` int NOT NULL,
  `stage_id` varchar(10) NOT NULL,
  `emp_id` varchar(50) DEFAULT NULL,
  `prod_date` date NOT NULL,
  `prod_shift` varchar(5) NOT NULL,
  `dropped_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reason` text,
  `rework_progress` enum('NOT_ACK','PROCESSING','COMPLETED') DEFAULT 'NOT_ACK',
  `drop_date` date GENERATED ALWAYS AS (cast(`dropped_at` as date)) STORED,
  `acknowledged_by` varchar(50) DEFAULT NULL,
  `acknowledged_at` datetime DEFAULT NULL,
  `completed_by` varchar(50) DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `rework_notes` text,
  `created_date` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `master_id` (`master_id`),
  KEY `sequence_id` (`sequence_id`),
  KEY `stage_id` (`stage_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `drop_log`
--

INSERT INTO `drop_log` (`id`, `master_id`, `sequence_id`, `stage_id`, `emp_id`, `prod_date`, `prod_shift`, `dropped_at`, `reason`, `rework_progress`, `acknowledged_by`, `acknowledged_at`, `completed_by`, `completed_at`, `rework_notes`, `created_date`) VALUES
(1, 5, 158, '1R', NULL, '2025-12-10', 'C', '2025-12-09 18:34:51', NULL, 'COMPLETED', 'REWORK_TEAM', '2025-12-10 00:11:46', 'REWORK_TEAM', '2025-12-10 00:11:55', NULL, '2025-12-10'),
(2, 2, 78, '13INSP', 'Assembly Head', '2025-12-10', 'C', '2025-12-09 18:40:10', 'Assembly Head Sent to Rework', 'PROCESSING', 'REWORK_TEAM', '2025-12-10 00:13:49', NULL, NULL, NULL, '2025-12-10'),
(3, 3, 117, '13INSP', 'Assembly Head', '2025-12-10', 'C', '2025-12-09 18:40:16', 'Assembly Head Sent to Rework', 'COMPLETED', 'REWORK_TEAM', '2025-12-10 00:12:55', 'REWORK_TEAM', '2025-12-10 00:13:26', NULL, '2025-12-10'),
(4, 4, 156, '13INSP', 'Assembly Head', '2025-12-10', 'C', '2025-12-09 18:40:21', 'Assembly Head Sent to Rework', 'NOT_ACK', NULL, NULL, NULL, NULL, NULL, '2025-12-10');

-- --------------------------------------------------------

--
-- Table structure for table `not_ok_log`
--

DROP TABLE IF EXISTS `not_ok_log`;
CREATE TABLE IF NOT EXISTS `not_ok_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `master_id` int NOT NULL,
  `stage_id` varchar(10) NOT NULL,
  `task_no` int NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `logged_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_date` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `not_ok_log`
--

INSERT INTO `not_ok_log` (`id`, `master_id`, `stage_id`, `task_no`, `description`, `status`, `logged_at`, `created_date`) VALUES
(4, 3, '1L', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'no', '2025-12-09 18:32:48', '2025-12-10'),
(3, 2, '1L', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'no', '2025-12-09 18:32:24', '2025-12-10');

-- --------------------------------------------------------

--
-- Table structure for table `rearframeassymaster`
--

DROP TABLE IF EXISTS `rearframeassymaster`;
CREATE TABLE IF NOT EXISTS `rearframeassymaster` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stage_id` varchar(10) DEFAULT NULL,
  `prod_date` date DEFAULT NULL,
  `prod_shift` varchar(5) DEFAULT NULL,
  `date_shift` varchar(255) DEFAULT NULL,
  `axle_serial_no` varchar(255) DEFAULT NULL,
  `axle_spec` varchar(255) DEFAULT NULL,
  `axle_casing_part_no` varchar(255) DEFAULT NULL,
  `brake_part_no_lh` varchar(255) DEFAULT NULL,
  `brake_part_no_rh` varchar(255) DEFAULT NULL,
  `cwp_diff_carrier_no` varchar(255) DEFAULT NULL,
  `axle_qr` varchar(500) DEFAULT NULL,
  `brake_qr` varchar(500) DEFAULT NULL,
  `hub_qr` varchar(500) DEFAULT NULL,
  `abs_qr` varchar(500) DEFAULT NULL,
  `rework_status` enum('CLEAR','PENDING') DEFAULT 'CLEAR',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rearframeassymaster`
--

INSERT INTO `rearframeassymaster` (`id`, `stage_id`, `prod_date`, `prod_shift`, `date_shift`, `axle_serial_no`, `axle_spec`, `axle_casing_part_no`, `brake_part_no_lh`, `brake_part_no_rh`, `cwp_diff_carrier_no`, `axle_qr`, `brake_qr`, `hub_qr`, `abs_qr`, `rework_status`, `created_at`) VALUES
(1, '1L', '2025-12-10', 'C', NULL, '1', '1', '1', '1', '1', '1', 'https://scan.page/21FqRj', '', '', '', 'CLEAR', '2025-12-09 18:32:00'),
(2, '1L', '2025-12-10', 'C', NULL, '2', '2', '2', '2', '2', '2', '', '', '', '', 'PENDING', '2025-12-09 18:32:24'),
(3, '1L', '2025-12-10', 'C', NULL, '3', '3', '3', '3', '3', '3', '', '', '', '', 'CLEAR', '2025-12-09 18:32:48'),
(4, '1L', '2025-12-10', 'C', NULL, '4', '4', '4', '4', '4', '4', '', '', '', '', 'PENDING', '2025-12-09 18:33:06'),
(5, '1L', '2025-12-10', 'C', NULL, '5', '5', '5', '5', '5', '5', '', '', '', '', 'CLEAR', '2025-12-09 18:33:22'),
(6, '1L', '2025-12-10', 'C', NULL, '6', '6', '6', '6', '6', '6', '', '', '', '', 'CLEAR', '2025-12-09 18:35:13');

-- --------------------------------------------------------

--
-- Table structure for table `rearframeassystagetasks`
--

DROP TABLE IF EXISTS `rearframeassystagetasks`;
CREATE TABLE IF NOT EXISTS `rearframeassystagetasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `master_id` int NOT NULL,
  `stage_id` varchar(10) DEFAULT NULL,
  `task_no` int NOT NULL,
  `description` text NOT NULL,
  `status` enum('yes','no') NOT NULL,
  `audio` longtext,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_date` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rearframeassystagetasks`
--

INSERT INTO `rearframeassystagetasks` (`id`, `master_id`, `stage_id`, `task_no`, `description`, `status`, `audio`, `created_at`, `created_date`) VALUES
(1, 1, '1L', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:32:00', '2025-12-10'),
(2, 1, '1L', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'yes', NULL, '2025-12-09 18:32:00', '2025-12-10'),
(3, 1, '1L', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'yes', NULL, '2025-12-09 18:32:00', '2025-12-10'),
(4, 1, '1L', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:32:00', '2025-12-10'),
(5, 2, '1L', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:32:24', '2025-12-10'),
(6, 2, '1L', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'no', 'data:audio/mp3;base64,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', '2025-12-09 18:32:24', '2025-12-10'),
(7, 2, '1L', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'yes', NULL, '2025-12-09 18:32:24', '2025-12-10'),
(8, 2, '1L', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:32:24', '2025-12-10'),
(9, 3, '1L', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:32:48', '2025-12-10'),
(10, 3, '1L', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'yes', NULL, '2025-12-09 18:32:48', '2025-12-10'),
(11, 3, '1L', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'yes', NULL, '2025-12-09 18:32:48', '2025-12-10'),
(12, 3, '1L', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:32:48', '2025-12-10');
INSERT INTO `rearframeassystagetasks` (`id`, `master_id`, `stage_id`, `task_no`, `description`, `status`, `audio`, `created_at`, `created_date`) VALUES
(13, 4, '1L', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:33:06', '2025-12-10'),
(14, 4, '1L', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'yes', NULL, '2025-12-09 18:33:06', '2025-12-10'),
(15, 4, '1L', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'yes', NULL, '2025-12-09 18:33:06', '2025-12-10'),
(16, 4, '1L', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:33:06', '2025-12-10'),
(17, 5, '1L', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:33:22', '2025-12-10'),
(18, 5, '1L', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'yes', NULL, '2025-12-09 18:33:22', '2025-12-10'),
(19, 5, '1L', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'yes', NULL, '2025-12-09 18:33:22', '2025-12-10'),
(20, 5, '1L', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:33:22', '2025-12-10'),
(21, 1, '1R', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:33:47', '2025-12-10'),
(22, 1, '1R', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'yes', NULL, '2025-12-09 18:33:47', '2025-12-10'),
(23, 1, '1R', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'yes', NULL, '2025-12-09 18:33:47', '2025-12-10'),
(24, 1, '1R', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:33:47', '2025-12-10'),
(25, 2, '1R', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:33:58', '2025-12-10'),
(26, 2, '1R', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'yes', NULL, '2025-12-09 18:33:58', '2025-12-10'),
(27, 2, '1R', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'yes', NULL, '2025-12-09 18:33:58', '2025-12-10'),
(28, 2, '1R', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:33:58', '2025-12-10'),
(29, 3, '1R', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:34:17', '2025-12-10'),
(30, 3, '1R', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'yes', NULL, '2025-12-09 18:34:17', '2025-12-10'),
(31, 3, '1R', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'yes', NULL, '2025-12-09 18:34:17', '2025-12-10'),
(32, 3, '1R', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:34:17', '2025-12-10'),
(33, 4, '1R', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:34:37', '2025-12-10'),
(34, 4, '1R', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'yes', NULL, '2025-12-09 18:34:37', '2025-12-10'),
(35, 4, '1R', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'no', 'data:audio/mp3;base64,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', '2025-12-09 18:34:37', '2025-12-10'),
(36, 4, '1R', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:34:37', '2025-12-10'),
(37, 6, '1L', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:35:14', '2025-12-10'),
(38, 6, '1L', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'yes', NULL, '2025-12-09 18:35:14', '2025-12-10'),
(39, 6, '1L', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'yes', NULL, '2025-12-09 18:35:14', '2025-12-10'),
(40, 6, '1L', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:35:14', '2025-12-10'),
(41, 6, '1R', 1, 'பேடஸ்டல்களில் ஆக்ஸ்ல் கேஸ்சிங்கை ஏற்றி, RH மற்றும் LH பக்கங்களின் சரியான நிலையை உறுதிப்படுத்தவும்', 'yes', NULL, '2025-12-09 18:35:30', '2025-12-10'),
(42, 6, '1R', 2, 'கட்டு கம்பியை அகற்றி, ஆக்ஸல் ஷாஃப்ட்களை அகற்றி அவற்றை சறுக்கலில் வைக்கவும்', 'yes', NULL, '2025-12-09 18:35:30', '2025-12-10'),
(43, 6, '1R', 3, 'பிரேக் ஷீக்களில் டஸ்ட் கவர்களை அசெம்பிள் செய்து இருக்கவும்', 'yes', NULL, '2025-12-09 18:35:30', '2025-12-10'),
(44, 6, '1R', 4, 'LH & RH பூஸ்டர்/பிளம்பர் பிராக்கெட் பொருத்துதல் (Boss / Cargo / Stag)', 'yes', NULL, '2025-12-09 18:35:30', '2025-12-10'),
(45, 1, '2L', 1, 'இருபுறமும் ஒரே மாதிரியான பிரேக் ஷீவை ஏற்றவும்', 'yes', NULL, '2025-12-09 18:35:42', '2025-12-10'),
(46, 1, '2L', 2, 'போல்ட் மற்றும் நட்டுகளுடன் பிரேக்கை அசெம்பிள் செய்யவும்', 'yes', NULL, '2025-12-09 18:35:42', '2025-12-10'),
(47, 2, '2L', 1, 'இருபுறமும் ஒரே மாதிரியான பிரேக் ஷீவை ஏற்றவும்', 'yes', NULL, '2025-12-09 18:35:50', '2025-12-10'),
(48, 2, '2L', 2, 'போல்ட் மற்றும் நட்டுகளுடன் பிரேக்கை அசெம்பிள் செய்யவும்', 'yes', NULL, '2025-12-09 18:35:50', '2025-12-10'),
(49, 3, '2L', 1, 'இருபுறமும் ஒரே மாதிரியான பிரேக் ஷீவை ஏற்றவும்', 'yes', NULL, '2025-12-09 18:35:58', '2025-12-10'),
(50, 3, '2L', 2, 'போல்ட் மற்றும் நட்டுகளுடன் பிரேக்கை அசெம்பிள் செய்யவும்', 'yes', NULL, '2025-12-09 18:35:58', '2025-12-10'),
(51, 4, '2L', 1, 'இருபுறமும் ஒரே மாதிரியான பிரேக் ஷீவை ஏற்றவும்', 'yes', NULL, '2025-12-09 18:36:07', '2025-12-10'),
(52, 4, '2L', 2, 'போல்ட் மற்றும் நட்டுகளுடன் பிரேக்கை அசெம்பிள் செய்யவும்', 'yes', NULL, '2025-12-09 18:36:07', '2025-12-10'),
(53, 6, '2L', 1, 'இருபுறமும் ஒரே மாதிரியான பிரேக் ஷீவை ஏற்றவும்', 'yes', NULL, '2025-12-09 18:36:24', '2025-12-10'),
(54, 6, '2L', 2, 'போல்ட் மற்றும் நட்டுகளுடன் பிரேக்கை அசெம்பிள் செய்யவும்', 'yes', NULL, '2025-12-09 18:36:24', '2025-12-10');

-- --------------------------------------------------------

--
-- Table structure for table `rework_log`
--

DROP TABLE IF EXISTS `rework_log`;
CREATE TABLE IF NOT EXISTS `rework_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `master_id` int NOT NULL,
  `stage_id` varchar(10) NOT NULL,
  `task_no` int NOT NULL,
  `old_status` enum('yes','no') DEFAULT NULL,
  `new_status` enum('yes','no') NOT NULL,
  `audio` longtext,
  `updated_by` varchar(100) DEFAULT 'REWORK_TEAM',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_date` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rework_log`
--

INSERT INTO `rework_log` (`id`, `master_id`, `stage_id`, `task_no`, `old_status`, `new_status`, `audio`, `updated_by`, `updated_at`, `created_date`) VALUES
(1, 5, 'ALL', 0, '', '', NULL, 'REWORK_TEAM', '2025-12-10 00:11:55', '2025-12-10'),
(2, 3, '1L', 3, 'no', 'yes', NULL, 'REWORK_TEAM', '2025-12-10 00:13:14', '2025-12-10'),
(3, 3, '1R', 1, 'no', 'yes', NULL, 'REWORK_TEAM', '2025-12-10 00:13:22', '2025-12-10'),
(4, 3, 'ALL', 0, '', '', NULL, 'REWORK_TEAM', '2025-12-10 00:13:26', '2025-12-10');

-- --------------------------------------------------------

--
-- Table structure for table `workplan`
--

DROP TABLE IF EXISTS `workplan`;
CREATE TABLE IF NOT EXISTS `workplan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `shift` varchar(20) NOT NULL,
  `count` int NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `workplan`
--

INSERT INTO `workplan` (`id`, `date`, `shift`, `count`, `created_at`) VALUES
(2, '2025-12-09', 'Shift 1', 3, '2025-12-08 20:51:16'),
(3, '2025-12-09', 'Shift 2', 45, '2025-12-09 23:21:42'),
(4, '2025-12-10', 'Shift 1', 20, '2025-12-10 00:00:26');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
