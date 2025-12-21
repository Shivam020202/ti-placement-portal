-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: portal
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applied_to_job`
--

DROP TABLE IF EXISTS `applied_to_job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applied_to_job` (
  `cover_letter` text,
  `resume` varchar(255) NOT NULL,
  `personal_email` varchar(255) NOT NULL,
  `std_cgpa` float NOT NULL,
  `sent_to_recruiter` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `student_roll_number` varchar(255) NOT NULL,
  `job_listing_id` int NOT NULL,
  PRIMARY KEY (`student_roll_number`,`job_listing_id`),
  KEY `job_listing_id` (`job_listing_id`),
  CONSTRAINT `applied_to_job_ibfk_1` FOREIGN KEY (`student_roll_number`) REFERENCES `students` (`roll_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `applied_to_job_ibfk_2` FOREIGN KEY (`job_listing_id`) REFERENCES `job_listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applied_to_job`
--

LOCK TABLES `applied_to_job` WRITE;
/*!40000 ALTER TABLE `applied_to_job` DISABLE KEYS */;
/*!40000 ALTER TABLE `applied_to_job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES ('CSE','Computer Science and Engineering');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coding_rounds`
--

DROP TABLE IF EXISTS `coding_rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coding_rounds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue` enum('online','offline') NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `coding_round_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `coding_round_id` (`coding_round_id`),
  CONSTRAINT `coding_rounds_ibfk_1` FOREIGN KEY (`coding_round_id`) REFERENCES `hiring_processes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coding_rounds`
--

LOCK TABLES `coding_rounds` WRITE;
/*!40000 ALTER TABLE `coding_rounds` DISABLE KEYS */;
/*!40000 ALTER TABLE `coding_rounds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `head_office_address` varchar(255) DEFAULT NULL,
  `head_office_phone` varchar(255) DEFAULT NULL,
  `head_office_email` varchar(255) DEFAULT NULL,
  `website` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `is_blacklisted` tinyint(1) DEFAULT '0',
  `blacklisted_reason` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'Google','1600 Amphitheatre Parkway, Mountain View, CA','+1-650-253-0000','contact@google.com','https://www.google.com','google-logo.png','Global technology company',0,NULL,'2025-12-10 09:49:10','2025-12-10 09:49:10'),(2,'Microsoft','One Microsoft Way, Redmond, WA','+1-425-882-8080','contact@microsoft.com','https://www.microsoft.com','microsoft-logo.png','Technology corporation',0,NULL,'2025-12-10 09:49:10','2025-12-10 09:49:10'),(3,'Amazon','410 Terry Avenue North, Seattle, WA','+1-206-266-1000','contact@amazon.com','https://www.amazon.com','amazon-logo.png','E-commerce and cloud computing',0,NULL,'2025-12-10 09:49:10','2025-12-10 09:49:10');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `google_tokens`
--

DROP TABLE IF EXISTS `google_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `google_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `refresh_token` varchar(255) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  CONSTRAINT `google_tokens_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `google_tokens`
--

LOCK TABLES `google_tokens` WRITE;
/*!40000 ALTER TABLE `google_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `google_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_discussions`
--

DROP TABLE IF EXISTS `group_discussions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_discussions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue` enum('online','offline') NOT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `group_discussion_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_discussion_id` (`group_discussion_id`),
  CONSTRAINT `group_discussions_ibfk_1` FOREIGN KEY (`group_discussion_id`) REFERENCES `hiring_processes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_discussions`
--

LOCK TABLES `group_discussions` WRITE;
/*!40000 ALTER TABLE `group_discussions` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_discussions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hiring_processes`
--

DROP TABLE IF EXISTS `hiring_processes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hiring_processes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `index` int NOT NULL,
  `type` enum('ppt','group-discussion','coding-round','interview') DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `start_date_time` datetime DEFAULT NULL,
  `end_date_time` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `job_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `hiring_processes_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job_listings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hiring_processes`
--

LOCK TABLES `hiring_processes` WRITE;
/*!40000 ALTER TABLE `hiring_processes` DISABLE KEYS */;
INSERT INTO `hiring_processes` VALUES (1,0,'ppt','Molestiae sit omnis','2011-10-10 20:23:00','1982-08-15 22:10:00','2025-12-12 19:50:41','2025-12-12 19:50:41',2),(2,0,'interview','Laborum tempor volup','1991-09-21 11:31:00','2021-07-12 23:24:00','2025-12-12 19:53:07','2025-12-12 19:53:07',3),(3,1,'interview','1','2025-12-21 18:48:50','2025-12-21 18:48:50','2025-12-21 18:49:18','2025-12-21 18:49:18',7),(4,1,'interview','1','2025-12-21 18:57:27','2025-12-21 18:57:27','2025-12-21 18:57:37','2025-12-21 18:57:37',8),(5,0,'ppt','Eos autem distinctio','2011-09-19 01:03:00','1982-11-15 20:36:00','2025-12-21 19:02:27','2025-12-21 19:02:27',9);
/*!40000 ALTER TABLE `hiring_processes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interviews`
--

DROP TABLE IF EXISTS `interviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue` enum('online','offline') NOT NULL,
  `type` enum('technical','hr') NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `interview_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `interview_id` (`interview_id`),
  CONSTRAINT `interviews_ibfk_1` FOREIGN KEY (`interview_id`) REFERENCES `hiring_processes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interviews`
--

LOCK TABLES `interviews` WRITE;
/*!40000 ALTER TABLE `interviews` DISABLE KEYS */;
INSERT INTO `interviews` VALUES (1,'offline','hr',NULL,'2025-12-12 19:53:08','2025-12-12 19:53:08',2),(2,'online','technical','2','2025-12-21 18:49:18','2025-12-21 18:49:18',3),(3,'online','technical','2','2025-12-21 18:57:37','2025-12-21 18:57:37',4);
/*!40000 ALTER TABLE `interviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_branch`
--

DROP TABLE IF EXISTS `job_branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_branch` (
  `min_cgpa` float NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `branch_code` varchar(255) NOT NULL,
  `job_listing_id` int NOT NULL,
  PRIMARY KEY (`branch_code`,`job_listing_id`),
  KEY `job_listing_id` (`job_listing_id`),
  CONSTRAINT `job_branch_ibfk_1` FOREIGN KEY (`branch_code`) REFERENCES `branches` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_branch_ibfk_2` FOREIGN KEY (`job_listing_id`) REFERENCES `job_listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_branch`
--

LOCK TABLES `job_branch` WRITE;
/*!40000 ALTER TABLE `job_branch` DISABLE KEYS */;
INSERT INTO `job_branch` VALUES (1.9,'2025-12-21 18:49:18','2025-12-21 18:49:18','CSE',7),(2,'2025-12-21 18:57:37','2025-12-21 18:57:37','CSE',8);
/*!40000 ALTER TABLE `job_branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_listings`
--

DROP TABLE IF EXISTS `job_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_listings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `requirements` varchar(255) NOT NULL,
  `responsibilities` varchar(255) NOT NULL,
  `description_text` text NOT NULL,
  `description_file` varchar(255) NOT NULL,
  `web_links` varchar(255) NOT NULL,
  `role` enum('FTE','Internship','Internship + FTE','Internship + PPO') DEFAULT NULL,
  `grad_year` varchar(255) NOT NULL,
  `failed_subjects` int NOT NULL,
  `active_backlogs_acceptable` tinyint(1) NOT NULL,
  `application_deadline` datetime NOT NULL,
  `bond_in_yrs` int NOT NULL,
  `location_options` varchar(255) DEFAULT NULL,
  `ctc` int NOT NULL,
  `ctc_breakup` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `company_id` int NOT NULL,
  `added_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `added_by` (`added_by`),
  CONSTRAINT `job_listings_ibfk_13` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_listings_ibfk_14` FOREIGN KEY (`added_by`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_listings`
--

LOCK TABLES `job_listings` WRITE;
/*!40000 ALTER TABLE `job_listings` DISABLE KEYS */;
INSERT INTO `job_listings` VALUES (1,'Et maxime voluptas v','Recusandae Suscipit','Dolore iure expedita','Hic qui voluptatem q','Fugiat voluptates ve','Dolore ad voluptas h','FTE','Ex iusto voluptatem',61,1,'2025-06-08 04:40:00',87,'Magna eu deserunt si',55,'In qui saepe sit sit','2025-12-12 19:32:49','2025-12-12 19:32:49',1,'charlieshivam70@gmail.com'),(2,'Adipisicing veritati','Ad ut fuga In quos ','Laudantium odit cup','Tenetur aut consequa','Eu velit hic sed nul','Repellendus Ut sapi','Internship + FTE','Quae molestias ipsum',19,0,'1997-11-26 20:44:00',66,'Eius irure aut nulla',63,'Tenetur est excepte','2025-12-12 19:50:41','2025-12-12 19:50:41',1,'charlieshivam70@gmail.com'),(3,'Dolor non in quibusd','Est et aliquip conse','Itaque mollitia porr','Laudantium sed nost','Quo totam velit ut v','Illo est unde fuga','FTE','Velit voluptatem acc',49,1,'1979-11-25 05:31:00',0,'Qui exercitationem c',83,'Omnis voluptas nesci','2025-12-12 19:53:07','2025-12-12 19:53:07',1,'charlieshivam70@gmail.com'),(4,'Okay','idk','sit','<p>Duis obcaecati quia .</p>','','','FTE','2027',2,0,'2025-12-21 14:30:00',0,'kolkata',1,'','2025-12-21 14:37:39','2025-12-21 14:37:39',2,'shivam.work222@gmail.com'),(5,'Okay','idk','sit','<p>Duis obcaecati quia .</p>','','','FTE','2027',0,1,'2025-12-21 18:15:00',0,'kolkata',1,'','2025-12-21 15:52:27','2025-12-21 15:52:27',2,'shivam.work222@gmail.com'),(6,'should be','Reprehenderit labor\nNode.js','Non elit ullam offi\nReact','<p>Ad facilis ab aliqua.</p>','','','FTE','2025,2027,2026,2028',40,1,'2025-12-22 16:45:00',0,'Delhi',83,'','2025-12-21 16:03:15','2025-12-21 16:03:15',1,'shivam.work222@gmail.com'),(7,'Proident','Sunt sint voluptat','Accusantium magni er','<p>Aperiam consectetur.</p>','','','FTE','2025',0,0,'2025-12-26 19:15:00',0,'Chhapra',101,'','2025-12-21 18:49:18','2025-12-21 18:49:18',3,'shivam.work222@gmail.com'),(8,'Okay','Sit neque consequat','Impedit et et sint','<p>Quis adipisicing del.</p>','','[object Object]','FTE','2026',75,1,'2026-01-01 19:00:00',38,'Delhi',234,'','2025-12-21 18:57:37','2025-12-21 18:57:37',1,'shivam.work222@gmail.com'),(9,'Quidem numquam iusto','Quia distinctio Nul','Voluptatem natus aut','Ullamco tempora eaqu','Voluptatem nulla seq','Labore perspiciatis','Internship','Ad quia eu quas aliq',94,0,'1990-08-12 05:05:00',4,'Ex aut eum esse volu',87,'Modi voluptatem nis','2025-12-21 19:02:27','2025-12-21 19:02:27',1,'charlieshivam70@gmail.com');
/*!40000 ALTER TABLE `job_listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing_reviews`
--

DROP TABLE IF EXISTS `listing_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('under_review','changes_requested','approved','rejected') NOT NULL,
  `status_reason` varchar(255) DEFAULT NULL,
  `chat_ref` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `job_listing_id` int DEFAULT NULL,
  `assigned_to` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_listing_id` (`job_listing_id`),
  KEY `assigned_to` (`assigned_to`),
  CONSTRAINT `listing_reviews_ibfk_13` FOREIGN KEY (`job_listing_id`) REFERENCES `job_listings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `listing_reviews_ibfk_14` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_reviews`
--

LOCK TABLES `listing_reviews` WRITE;
/*!40000 ALTER TABLE `listing_reviews` DISABLE KEYS */;
INSERT INTO `listing_reviews` VALUES (1,'changes_requested','Status updated by Shivam Kumar',NULL,'2025-12-12 19:32:49','2025-12-21 11:45:00',1,NULL),(2,'approved','Approved by Shivam Kumar',NULL,'2025-12-12 19:50:41','2025-12-21 10:57:25',2,NULL),(3,'approved','Approved by Shivam Kumar',NULL,'2025-12-12 19:53:07','2025-12-19 08:02:10',3,NULL),(4,'approved',NULL,NULL,'2025-12-21 14:37:40','2025-12-21 14:37:40',4,'shivam.work222@gmail.com'),(5,'approved',NULL,NULL,'2025-12-21 15:52:27','2025-12-21 15:52:27',5,'shivam.work222@gmail.com'),(6,'approved',NULL,NULL,'2025-12-21 16:03:15','2025-12-21 16:03:15',6,'shivam.work222@gmail.com'),(7,'approved',NULL,NULL,'2025-12-21 18:49:18','2025-12-21 18:49:18',7,'shivam.work222@gmail.com'),(8,'approved',NULL,NULL,'2025-12-21 18:57:37','2025-12-21 18:57:37',8,'shivam.work222@gmail.com'),(9,'changes_requested','Status updated by Shivam Kumar',NULL,'2025-12-21 19:02:27','2025-12-21 19:03:35',9,'shivam.work222@gmail.com');
/*!40000 ALTER TABLE `listing_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listingperm`
--

DROP TABLE IF EXISTS `listingperm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listingperm` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `listing_review_id` int NOT NULL,
  PRIMARY KEY (`user_email`,`listing_review_id`),
  KEY `listing_review_id` (`listing_review_id`),
  CONSTRAINT `listingperm_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `listingperm_ibfk_2` FOREIGN KEY (`listing_review_id`) REFERENCES `listing_reviews` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listingperm`
--

LOCK TABLES `listingperm` WRITE;
/*!40000 ALTER TABLE `listingperm` DISABLE KEYS */;
/*!40000 ALTER TABLE `listingperm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ppts`
--

DROP TABLE IF EXISTS `ppts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ppts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue` enum('online','offline') NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `p_p_t_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `p_p_t_id` (`p_p_t_id`),
  CONSTRAINT `ppts_ibfk_1` FOREIGN KEY (`p_p_t_id`) REFERENCES `hiring_processes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ppts`
--

LOCK TABLES `ppts` WRITE;
/*!40000 ALTER TABLE `ppts` DISABLE KEYS */;
INSERT INTO `ppts` VALUES (1,'offline',NULL,'2025-12-21 19:02:27','2025-12-21 19:02:27',5);
/*!40000 ALTER TABLE `ppts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruiter`
--

DROP TABLE IF EXISTS `recruiter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruiter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user` varchar(255) NOT NULL,
  `company_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `recruiter_ibfk_13` FOREIGN KEY (`user`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recruiter_ibfk_14` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruiter`
--

LOCK TABLES `recruiter` WRITE;
/*!40000 ALTER TABLE `recruiter` DISABLE KEYS */;
INSERT INTO `recruiter` VALUES (1,'2025-12-10 10:08:16','2025-12-10 10:08:16','charlieshivam70@gmail.com',1);
/*!40000 ALTER TABLE `recruiter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resumes`
--

DROP TABLE IF EXISTS `resumes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resumes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `mime_type` varchar(255) DEFAULT 'application/pdf',
  `file_data` mediumblob,
  `file_size` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  CONSTRAINT `resumes_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resumes`
--

LOCK TABLES `resumes` WRITE;
/*!40000 ALTER TABLE `resumes` DISABLE KEYS */;
/*!40000 ALTER TABLE `resumes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `name` varchar(255) NOT NULL,
  `category` enum('languages','frameworks','tools','databases','libraries','soft-skills') NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `roll_number` varchar(255) NOT NULL,
  `grad_year` int NOT NULL,
  `program` enum('ug','pg') NOT NULL,
  `course` enum('btech','be','mtech','phd') NOT NULL,
  `cgpa` float NOT NULL,
  `subjects_failed` int NOT NULL,
  `class10_score_type` enum('percentage','cgpa') NOT NULL,
  `class10_score` float NOT NULL,
  `class10_board` varchar(255) NOT NULL,
  `class12_score_type` enum('percentage','cgpa') DEFAULT NULL,
  `class12_score` float DEFAULT NULL,
  `class12_board` varchar(255) DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `diploma_score_type` enum('percentage','cgpa') DEFAULT NULL,
  `diploma_score` float DEFAULT NULL,
  `diploma_grad_year` int DEFAULT NULL,
  `is_placed` tinyint(1) DEFAULT '0',
  `is_spr` tinyint(1) DEFAULT '0',
  `is_sic` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user` varchar(255) NOT NULL,
  `branch_code` varchar(255) NOT NULL,
  PRIMARY KEY (`roll_number`),
  KEY `user` (`user`),
  KEY `branch_code` (`branch_code`),
  CONSTRAINT `students_ibfk_13` FOREIGN KEY (`user`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `students_ibfk_14` FOREIGN KEY (`branch_code`) REFERENCES `branches` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('102203222',2026,'ug','btech',8.5,0,'percentage',92.5,'CBSE','percentage',88,'CBSE','2003-01-15',NULL,NULL,NULL,0,0,0,'2025-12-21 10:52:26','2025-12-21 10:52:26','shivam.gem222@gmail.com','CSE');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentskill`
--

DROP TABLE IF EXISTS `studentskill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentskill` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `skill_name` varchar(255) NOT NULL,
  `student_roll_number` varchar(255) NOT NULL,
  PRIMARY KEY (`skill_name`,`student_roll_number`),
  KEY `student_roll_number` (`student_roll_number`),
  CONSTRAINT `studentskill_ibfk_1` FOREIGN KEY (`skill_name`) REFERENCES `skills` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `studentskill_ibfk_2` FOREIGN KEY (`student_roll_number`) REFERENCES `students` (`roll_number`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentskill`
--

LOCK TABLES `studentskill` WRITE;
/*!40000 ALTER TABLE `studentskill` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentskill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `super_admins`
--

DROP TABLE IF EXISTS `super_admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `super_admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  CONSTRAINT `super_admins_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `super_admins`
--

LOCK TABLES `super_admins` WRITE;
/*!40000 ALTER TABLE `super_admins` DISABLE KEYS */;
INSERT INTO `super_admins` VALUES (1,'2025-12-10 09:27:47','2025-12-10 09:27:47','shivam.work222@gmail.com');
/*!40000 ALTER TABLE `super_admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `role` enum('super-admin','admin','student','recruiter') NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `added_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`email`),
  KEY `added_by` (`added_by`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`added_by`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('charlieshivam70@gmail.com','Charlie','Shivam','recruiter','2025-12-10 10:07:11','2025-12-10 10:07:11',NULL),('shivam.gem222@gmail.com','Shivam','Sharma','student','2025-12-21 10:52:26','2025-12-21 10:52:26',NULL),('shivam.work222@gmail.com','Shivam','Kumar','super-admin','2025-12-10 09:27:47','2025-12-10 09:27:47',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-22  1:20:40
