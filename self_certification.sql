SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+05:30";


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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `device_master`;
CREATE TABLE IF NOT EXISTS `device_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` varchar(50) NOT NULL,
  `device_mac` varchar(100) NOT NULL,
  `stage` varchar(5) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `device_master` (`id`, `emp_id`, `device_mac`, `stage`, `created_at`) VALUES
(1, '538', 'A4:C3:33:22:E1', '1R', '2025-11-20 14:14:13'),
(2, '506', 'A4:C3:33:22:E2', '1L', '2025-11-20 14:14:13'),
(3, '495', 'A4:C3:33:22:E3', '2L', '2025-11-20 14:14:13');


DROP TABLE IF EXISTS `rearframeassymaster`;
CREATE TABLE IF NOT EXISTS `rearframeassymaster` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stage_id` varchar(10) DEFAULT NULL,
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;
