-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2016 at 12:29 PM
-- Server version: 5.7.9
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `geniuses`
--
CREATE DATABASE IF NOT EXISTS `geniuses` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `geniuses`;

-- --------------------------------------------------------

--
-- Table structure for table `school`
--

DROP TABLE IF EXISTS `school`;
CREATE TABLE IF NOT EXISTS `school` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `school`
--

INSERT INTO `school` (`id`, `name`, `address`, `location`) VALUES
(1, 'Doregos', NULL, 'Lagos'),
(2, 'Ifako (Agege)', NULL, 'Lagos'),
(3, 'Honeyland', NULL, 'Lagos'),
(4, 'Faith Academy (Gowon)', NULL, 'Lagos'),
(5, 'Faith Academy(Ota)', NULL, 'Ogun'),
(6, 'Chrisland College', NULL, 'Lagos'),
(7, 'Roshallom', NULL, 'Lagos'),
(8, 'Lagooz', NULL, 'Lagos'),
(9, 'Dansol', NULL, 'Lagos'),
(10, 'Legacy', NULL, 'Lagos'),
(11, 'MayFlower', NULL, 'Lagos'),
(12, 'TopGrade', NULL, 'Lagos'),
(13, 'Ferscoat Comprehensive Academy', NULL, 'Lagos'),
(14, 'Queens college', NULL, 'Lagos'),
(15, 'Saving Grace', NULL, 'Lagos'),
(16, 'Brain Builders', NULL, 'Lagos'),
(17, 'Skylight', NULL, 'Lagos'),
(18, 'Kings College', NULL, 'Lagos');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
