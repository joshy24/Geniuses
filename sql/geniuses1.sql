-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2016 at 04:50 PM
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
-- Table structure for table `question_interaction`
--

DROP TABLE IF EXISTS `question_interaction`;
CREATE TABLE IF NOT EXISTS `question_interaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(20) NOT NULL,
  `subject_id` int(2) NOT NULL,
  `helpful_count` int(20) NOT NULL,
  `views_count` int(20) NOT NULL,
  `share_count` int(20) NOT NULL,
  `comment_count` int(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question_interaction`
--

INSERT INTO `question_interaction` (`id`, `question_id`, `subject_id`, `helpful_count`, `views_count`, `share_count`, `comment_count`) VALUES
(4, 101, 4, 2, 24, 0, 0),
(5, 218, 4, 3, 13, 0, 0),
(6, 153, 2, 2, 10, 0, 0),
(7, 155, 2, 3, 23, 0, 4),
(8, 51, 2, 3, 17, 0, 0),
(9, 170, 4, 3, 16, 0, 1),
(10, 85, 1, 3, 9, 0, 0),
(11, 192, 4, 1, 16, 0, 0),
(12, 200, 1, 3, 12, 0, 0),
(13, 168, 2, 3, 36, 0, 3),
(14, 6, 1, 2, 18, 0, 0),
(15, 54, 1, 2, 29, 0, 0),
(16, 109, 4, 3, 20, 0, 1),
(17, 211, 4, 2, 17, 0, 0),
(18, 111, 4, 2, 7, 0, 0),
(19, 106, 4, 2, 7, 0, 0),
(20, 82, 2, 2, 5, 0, 0),
(21, 100, 1, 2, 5, 0, 0),
(22, 16, 1, 2, 6, 0, 0),
(23, 1, 1, 2, 3, 0, 0),
(24, 82, 1, 2, 7, 0, 0),
(25, 58, 1, 2, 13, 0, 0),
(26, 67, 1, 1, 2, 0, 0),
(27, 62, 1, 1, 1, 0, 0),
(28, 61, 1, 0, 0, 0, 0),
(29, 20, 1, 0, 0, 0, 0),
(30, 5, 4, 3, 39, 0, 5),
(31, 200, 2, 4, 54, 0, 17),
(32, 151, 4, 2, 4, 0, 2),
(33, 200, 4, 1, 8, 0, 2);

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

DROP TABLE IF EXISTS `topics`;
CREATE TABLE IF NOT EXISTS `topics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) NOT NULL,
  `topic` varchar(255) CHARACTER SET utf8 NOT NULL,
  `class` varchar(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=195 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `subject_id`, `topic`, `class`) VALUES
(1, 1, 'Measurement of Physical Quantities', 'SSS1'),
(2, 1, 'Motion', 'SSS1'),
(3, 1, 'Pressure', 'SSS2'),
(4, 1, 'Light', 'SSS2'),
(5, 1, 'Electric Field', 'SSS3'),
(6, 1, 'Magnetism', 'SSS3'),
(13, 1, 'Projectiles', 'SSS1'),
(14, 1, 'Forces', 'SSS1'),
(15, 1, 'Mass, Weight and Density', 'SSS1'),
(16, 1, 'Equilibrium of forces', 'SSS1'),
(17, 1, 'Linear momentum', 'SSS1'),
(18, 1, 'Work, Energy and Power', 'SSS1'),
(19, 1, 'Properties of Matter', 'SSS1'),
(20, 1, 'Elastic Properties of Solids', 'SSS1'),
(21, 1, 'Simple Harmonic Motion', 'SSS1'),
(22, 1, 'Fluids at Rest and in Motion', 'SSS2'),
(23, 1, 'Measurement of Temperature', 'SSS1'),
(24, 1, 'Thermal Expansion of Solids and Liquids', 'SSS1'),
(25, 1, 'The Gas Laws', 'SSS1'),
(26, 1, 'Heat capacity', 'SSS1'),
(27, 1, 'Change of State', 'SSS1'),
(28, 1, 'Transfer of Thermal Energy', 'SSS2'),
(29, 1, 'General Wave Properties', 'SSS2'),
(30, 1, 'Light', 'SSS2'),
(31, 1, 'Application of Light Waves', 'SSS2'),
(32, 1, 'Gravitational Field', 'SSS2'),
(33, 1, 'Electrostatics', 'SSS3'),
(34, 1, 'Current Electricity', 'SSS3'),
(35, 1, 'Electromagnetic Effects', 'SSS3'),
(36, 1, 'Simple A.C. Circuits', 'SSS3'),
(37, 1, 'Introductory Electronics', 'SSS3'),
(38, 1, 'Radioactivity and The Nuclear Atom', 'SSS3'),
(39, 1, 'Energy Quantisation', 'SSS3'),
(40, 1, 'Wave-Particle Duality', 'SSS3'),
(41, 1, 'Physics & the real World', 'SSS3'),
(42, 2, '﻿Indices & Logarithms', 'SSS1'),
(43, 2, 'Geometry I. Triangles and Polygons', 'SSS1'),
(44, 2, 'Fractions. Decimals. Percentages. Number Bases', 'SSS1'),
(45, 2, 'Simplification and Substitution', 'SSS1'),
(46, 2, 'Sets I ', 'SSS1'),
(47, 2, 'Equations & Formula ', 'SSS1'),
(48, 2, 'Linear and Quadratic graphs', 'SSS1'),
(49, 2, 'Sets II. ', 'SSS1'),
(50, 2, 'Simple & Compound Statements ', 'SSS1'),
(51, 2, 'Quadratic Equations', 'SSS1'),
(52, 2, 'Solving Right-angled triangles', 'SSS1'),
(53, 2, 'Plane Shapes', 'SSS1'),
(54, 2, 'Ratio. Rate. Proportion', 'SSS1'),
(55, 2, 'Data presentation', 'SSS1'),
(56, 2, 'Solid Shapes', 'SSS1'),
(57, 2, 'Construction and Locus', 'SSS1'),
(58, 2, 'Angles between 0° and 360°', 'SSS1'),
(59, 2, 'Variation', 'SSS1'),
(60, 2, 'Tax and Monetary Exchange', 'SSS1'),
(61, 2, 'Modular Arithmetic', 'SSS1'),
(62, 2, '﻿Indices and Logarithms II', 'SSS2'),
(63, 2, 'Circle Geometry ', 'SSS2'),
(64, 2, 'Quadratic equations', 'SSS2'),
(65, 2, 'Approximations and Errors', 'SSS2'),
(66, 2, 'Trigonometry', 'SSS2'),
(67, 2, 'Geometrical Ratios', 'SSS2'),
(68, 2, 'Simultaneous Equations', 'SSS2'),
(69, 2, 'Tax and exchange Rates', 'SSS2'),
(70, 2, 'Trigonometry', 'SSS2'),
(71, 2, 'Inequalities', 'SSS2'),
(72, 2, 'Probabilities ', 'SSS2'),
(73, 2, 'Circle Geometry II', 'SSS2'),
(74, 2, 'Vectors', 'SSS2'),
(75, 2, 'Surds', 'SSS2'),
(76, 2, 'Geometrical transformation', 'SSS2'),
(77, 2, 'Gradients & Lines', 'SSS2'),
(78, 2, 'Fractions in algebra', 'SSS2'),
(79, 2, 'Sequence & series', 'SSS2'),
(80, 2, 'Geometrical transformation II', 'SSS2'),
(81, 2, 'Relations & Functions', 'SSS2'),
(82, 2, '﻿Surds', 'SSS3'),
(83, 2, 'Indices and Logarithms III', 'SSS3'),
(84, 2, 'Linear and Quadratic equations', 'SSS3'),
(85, 2, 'Length. Area. Volume', 'SSS3'),
(86, 2, 'Commercial arithmetic', 'SSS3'),
(87, 2, 'Geometry and Trigonometry', 'SSS3'),
(88, 2, 'Latitude and Longitude', 'SSS3'),
(89, 2, 'Matrices', 'SSS3'),
(90, 2, 'Coordinate geometry of straight lines', 'SSS3'),
(91, 2, 'Calculus. Differentiation', 'SSS3'),
(92, 2, 'Calculus. Integration', 'SSS3'),
(93, 2, 'Mean and standard deviation', 'SSS3'),
(94, 4, 'Atomic Structure', 'SSS1'),
(95, 4, 'Chemical Combination', 'SSS1'),
(96, 4, 'Kinetic Theory of Matter', 'SSS1'),
(97, 4, 'Stoichiometry of Reactions', 'SSS1'),
(98, 4, 'Avogadro''s Law', 'SSS1'),
(99, 4, 'Balancing Chemical Equations', 'SSS1'),
(100, 4, 'Naming Chemical Compounds', 'SSS1'),
(101, 4, 'Nature of matter', 'SSS1'),
(102, 4, 'Types of Bonding', 'SSS1'),
(103, 4, 'Acids. Bases. Salts', 'SSS1'),
(104, 4, 'Carbon & its compounds', 'SSS1'),
(105, 4, 'Volumetric Analysis', 'SSS1'),
(106, 4, 'Separation Techniques', 'SSS1'),
(107, 4, 'Periodic Table', 'SSS2'),
(108, 4, 'Radioactivity', 'SSS2'),
(109, 4, 'Halogens', 'SSS2'),
(110, 4, 'Shapes of molecules', 'SSS2'),
(111, 4, 'Energy & Chemical Reactions', 'SSS2'),
(112, 4, 'Chlorine & its Compounds', 'SSS2'),
(113, 4, 'Electrochemical Series', 'SSS2'),
(114, 4, 'Chemical Equilibrium', 'SSS2'),
(115, 4, 'Solvents & Solutions', 'SSS2'),
(116, 4, 'Solubility', 'SSS2'),
(117, 4, 'Rates of Reactions', 'SSS2'),
(118, 4, 'Electrochemical Cells', 'SSS2'),
(119, 4, 'Types of Reactions', 'SSS2'),
(120, 4, 'Types of Crystalline Solids', 'SSS2'),
(121, 4, 'Electrolysis', 'SSS2'),
(122, 4, 'Oxygen & its compounds', 'SSS2'),
(123, 4, 'Nitrogen & its compounds', 'SSS2'),
(124, 4, 'Air & Air Pollution', 'SSS2'),
(125, 4, 'Qualitative Analysis', 'SSS2'),
(126, 4, 'Water | Water Pollution', 'SSS2'),
(127, 4, 'Hydrogen & its compounds', 'SSS2'),
(128, 4, 'Metals', 'SSS3'),
(129, 4, 'Naming of Organic Compounds', 'SSS3'),
(130, 4, 'Organic Chemistry(II)', 'SSS3'),
(131, 4, 'Organic Chemistry(I)', 'SSS3'),
(132, 4, 'Industrial Chemistry', 'SSS3'),
(133, 3, 'Science of Living Things. Introduction to Biology', 'SSS1'),
(134, 3, 'Classification. Organisation of Life', 'SSS1'),
(135, 3, 'Nutrition. Photosynthesis. Food Substances', 'SSS1'),
(136, 3, 'Agriculture. Food Supply. Population Growth', 'SSS1'),
(137, 3, 'Basic Ecological Concepts', 'SSS1'),
(138, 3, 'Functioning Ecosystem', 'SSS1'),
(139, 3, 'Ecological Management', 'SSS1'),
(140, 3, 'Introduction to Micro-organisms', 'SSS1'),
(141, 3, 'Micro-organisms and Health', 'SSS1'),
(142, 3, 'Cell I. Living Unit. Structure', 'SSS2'),
(143, 3, 'Cell II. Properties and Functions', 'SSS2'),
(144, 3, 'Supporting Tissues and Systems', 'SSS2'),
(145, 3, 'Feeding Mechanisms. Digestive Systems', 'SSS2'),
(146, 3, 'Transport Systems and Mechanisms', 'SSS2'),
(147, 3, 'Gaseous Exchange. Respiratory Systems', 'SSS2'),
(148, 3, 'Excretory Systems and Mechanisms', 'SSS2'),
(149, 3, 'Aquatic and Terrestrial Habitats', 'SSS2'),
(150, 3, 'Ecology of Populations', 'SSS2'),
(151, 3, 'Regulation of the Internal Environment', 'SSS3'),
(152, 3, 'Nervous Co-ordination', 'SSS3'),
(153, 3, 'Sensory Receptors and Organs', 'SSS3'),
(154, 3, 'Sexual Reproduction: Systems and Behaviours', 'SSS3'),
(155, 3, 'Development of New Organisms. Fruits', 'SSS3'),
(156, 3, 'Variation. Adaptation for Survival. Evolution', 'SSS3'),
(157, 3, 'Genetics: The Science of Heredity', 'SSS3'),
(158, 7, '﻿Agricultural Development in West Africa', 'SSS1'),
(159, 7, 'Husbandry of selected Crops', 'SSS1'),
(160, 7, 'Anatomy and Physiology of Farm Animals', 'SSS1'),
(161, 7, 'Animal Reproduction', 'SSS1'),
(162, 7, 'Livestock Management', 'SSS1'),
(163, 7, 'Land and Its Uses', 'SSS1'),
(164, 7, 'Rock Formation', 'SSS1'),
(165, 7, 'Formation, Composition and Properties of Soil', 'SSS1'),
(166, 7, 'Sources of Farm Power', 'SSS1'),
(167, 7, 'Problems and Prospects of Mechanisation', 'SSS1'),
(168, 7, 'Factors of Production', 'SSS1'),
(169, 7, 'Agricultural Financing', 'SSS1'),
(170, 7, '﻿Agricultural Laws and Reforms', 'SSS2'),
(171, 7, 'Forest Management', 'SSS2'),
(172, 7, 'Diseases and Pest of Crops', 'SSS2'),
(173, 7, 'Pasture and Forage Crops', 'SSS2'),
(174, 7, 'Floriculture', 'SSS2'),
(175, 7, 'Common Weeds found in Farms', 'SSS2'),
(176, 7, 'Animal Nutrition', 'SSS2'),
(177, 7, 'Range and Pasture Management and Improvement', 'SSS2'),
(178, 7, 'Environmental Physiology', 'SSS2'),
(179, 7, 'Environmental Factors affecting Agricultural Production', 'SSS2'),
(180, 7, 'Plant Nutrients and Nutrient Cycles', 'SSS2'),
(181, 7, 'Effects of Some Farming Practices on the soil', 'SSS2'),
(182, 7, 'Farm Machinery and Implements', 'SSS2'),
(183, 7, 'Surveying and Planning of Farmstead', 'SSS2'),
(184, 7, 'Basic Economic Principles of Demand and Supply', 'SSS2'),
(185, 7, 'Farm Accounts', 'SSS2'),
(186, 7, '﻿Crop Improvement', 'SSS3'),
(187, 7, 'Principles of Animal Health Management', 'SSS3'),
(188, 7, 'Fish Farming', 'SSS3'),
(189, 7, 'Animal Improvement', 'SSS3'),
(190, 7, 'Animal By-Products', 'SSS3'),
(191, 7, 'Routine Management Practices of Farm Animals', 'SSS3'),
(192, 7, 'Irrigation and Drainage', 'SSS3'),
(193, 7, 'Marketing of Agricultural Produce', 'SSS3'),
(194, 7, 'Agricultural Extension ', 'SSS3');

-- --------------------------------------------------------

--
-- Table structure for table `user_helpful`
--

DROP TABLE IF EXISTS `user_helpful`;
CREATE TABLE IF NOT EXISTS `user_helpful` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(20) NOT NULL,
  `subject_id` int(2) NOT NULL,
  `user_id` int(20) NOT NULL,
  `status` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_helpful`
--

INSERT INTO `user_helpful` (`id`, `question_id`, `subject_id`, `user_id`, `status`) VALUES
(3, 153, 2, 27, 1),
(4, 155, 2, 28, 1),
(5, 51, 2, 28, 1),
(6, 218, 4, 28, 1),
(7, 155, 2, 27, 1),
(8, 218, 4, 27, 1),
(9, 170, 4, 27, 1),
(10, 155, 2, 32, 1),
(11, 51, 2, 32, 1),
(12, 218, 4, 32, 1),
(13, 170, 4, 32, 1),
(14, 5, 4, 32, 1),
(15, 200, 2, 32, 1),
(16, 85, 1, 32, 1),
(17, 192, 4, 32, 1),
(18, 200, 1, 32, 1),
(19, 168, 2, 32, 1),
(20, 6, 1, 32, 1),
(21, 54, 1, 32, 1),
(22, 109, 4, 32, 1),
(23, 211, 4, 32, 1),
(24, 109, 4, 28, 1),
(25, 168, 2, 28, 1),
(26, 5, 4, 28, 1),
(27, 200, 2, 28, 1),
(28, 85, 1, 28, 1),
(29, 200, 1, 28, 1),
(30, 153, 2, 28, 1),
(31, 6, 1, 28, 1),
(32, 111, 4, 28, 1),
(33, 106, 4, 28, 1),
(34, 101, 4, 28, 1),
(35, 82, 2, 28, 1),
(36, 100, 1, 28, 1),
(37, 16, 1, 28, 1),
(38, 82, 1, 28, 1),
(39, 58, 1, 28, 1),
(40, 1, 1, 28, 1),
(41, 109, 4, 29, 1),
(42, 5, 4, 29, 1),
(43, 85, 1, 29, 1),
(44, 200, 1, 29, 1),
(45, 54, 1, 29, 1),
(46, 211, 4, 29, 1),
(47, 111, 4, 29, 1),
(48, 106, 4, 29, 1),
(49, 101, 4, 29, 1),
(50, 82, 2, 29, 1),
(51, 100, 1, 29, 1),
(52, 16, 1, 29, 1),
(53, 1, 1, 29, 1),
(54, 82, 1, 29, 1),
(55, 58, 1, 29, 1),
(56, 67, 1, 29, 1),
(57, 62, 1, 29, 1),
(58, 168, 2, 29, 1),
(59, 51, 2, 29, 1),
(60, 170, 4, 29, 1),
(61, 200, 2, 29, 1),
(62, 200, 2, 27, 1),
(63, 151, 4, 27, 1),
(64, 200, 4, 32, 1),
(65, 151, 4, 32, 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
