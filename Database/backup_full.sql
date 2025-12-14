-- MySQL dump 10.13  Distrib 9.5.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: web_security_db
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `web_security_db`
--

/*!40000 DROP DATABASE IF EXISTS `web_security_db`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `web_security_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `web_security_db`;

--
-- Table structure for table `community_solutions`
--

DROP TABLE IF EXISTS `community_solutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_solutions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('Approved','Pending','Rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `upvotes` int DEFAULT NULL,
  `write_up_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `youtube_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lab_id` int NOT NULL,
  `user_id` int NOT NULL,
  `feedback` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1w318s7t9645oes30c0a7754i` (`lab_id`),
  KEY `FK1hcgsuufjte399dqikwsdbpwu` (`user_id`),
  CONSTRAINT `FK1hcgsuufjte399dqikwsdbpwu` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK1w318s7t9645oes30c0a7754i` FOREIGN KEY (`lab_id`) REFERENCES `labs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_solutions`
--

LOCK TABLES `community_solutions` WRITE;
/*!40000 ALTER TABLE `community_solutions` DISABLE KEYS */;
INSERT INTO `community_solutions` VALUES (1,'2025-11-08 18:10:57.121782','Rejected',NULL,'https://hackmd.io/OUi-IGk6TSq1451KD6_2KQ','https://www.youtube.com/watch?v=kV3famkRaA4',7,2,NULL),(2,'2025-11-11 18:30:36.924269','Pending',NULL,'xxxxx.com',NULL,5,2,NULL),(3,'2025-11-12 03:02:29.214122','Rejected',NULL,'nothing','https://www.youtube.com/watch?v=IcUrbX8d0yk',1,2,NULL),(4,'2025-11-19 09:13:48.219547','Rejected',NULL,'aaaa','xxxxx',8,2,'no gôd');
/*!40000 ALTER TABLE `community_solutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_group`
--

DROP TABLE IF EXISTS `email_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_group` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKfopgbke13r8b5lskh8ngsgmn3` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_group`
--

LOCK TABLES `email_group` WRITE;
/*!40000 ALTER TABLE `email_group` DISABLE KEYS */;
INSERT INTO `email_group` VALUES (1,'Group test broadcast for 10k-like flow','test-broadcast'),(2,'Only selected users','vip-users');
/*!40000 ALTER TABLE `email_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_group_member`
--

DROP TABLE IF EXISTS `email_group_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_group_member` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKr8i613p4qtm26tftlv9cl8d1x` (`group_id`,`user_id`),
  KEY `idx_egm_group` (`group_id`),
  KEY `idx_egm_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_group_member`
--

LOCK TABLES `email_group_member` WRITE;
/*!40000 ALTER TABLE `email_group_member` DISABLE KEYS */;
INSERT INTO `email_group_member` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,6),(6,1,7),(9,2,2),(10,2,3);
/*!40000 ALTER TABLE `email_group_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_job`
--

DROP TABLE IF EXISTS `email_job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_job` (
  `id` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `failed` int NOT NULL,
  `finished_at` datetime(6) DEFAULT NULL,
  `group_id` bigint NOT NULL,
  `last_error` varchar(2000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sent` int NOT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `status` enum('CANCELED','COMPLETED','FAILED','PAUSED','QUEUED','RUNNING') COLLATE utf8mb4_general_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `template_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `total` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_job_status` (`status`),
  KEY `idx_job_group` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_job`
--

LOCK TABLES `email_job` WRITE;
/*!40000 ALTER TABLE `email_job` DISABLE KEYS */;
INSERT INTO `email_job` VALUES ('JOB-1765651316693-000001','2025-12-14 01:41:56.695127',0,'2025-12-14 01:42:16.500062',1,NULL,6,'2025-12-14 01:41:56.733037','CANCELED','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all',6),('JOB-1765689934263-000001','2025-12-14 12:25:34.269134',0,'2025-12-14 12:25:47.227186',2,NULL,3,'2025-12-14 12:25:34.317652','COMPLETED','🎉 Welcome to Lockbyte','welcome',3);
/*!40000 ALTER TABLE `email_job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_logs`
--

DROP TABLE IF EXISTS `email_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bcc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `error_message` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `metadata_json` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `status` enum('FAILED','SENT') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `template_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `to_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_logs`
--

LOCK TABLES `email_logs` WRITE;
/*!40000 ALTER TABLE `email_logs` DISABLE KEYS */;
INSERT INTO `email_logs` VALUES (1,NULL,NULL,'Failed to render PDF',NULL,'2025-10-22 17:47:20.157816','FAILED','🎉 Chào mừng bạn đến Web Security Platform','welcome','phantoan3009@gmail.com'),(2,NULL,NULL,'Failed to render PDF',NULL,'2025-10-22 17:47:45.612826','FAILED','🎉 Chào mừng bạn đến Web Security Platform','welcome','phantoan3009@gmail.com'),(3,NULL,NULL,'I/O error on GET request for \"https://pub-...r2.dev/uploads/...-demon-slayer-i2.jpg\": pub-...r2.dev',NULL,'2025-10-22 17:52:50.274919','FAILED','🎉 Chào mừng bạn đến Web Security Platform','welcome','phantoan3009@gmail.com'),(4,NULL,NULL,NULL,NULL,'2025-10-22 17:53:50.888239','SENT','🎉 Chào mừng bạn đến Web Security Platform','welcome','phantoan3009@gmail.com'),(5,NULL,NULL,'Failed to render PDF',NULL,'2025-10-22 17:57:10.209953','FAILED','🎉 Chào mừng bạn đến Web Security Platform','welcome','phantoan3009@gmail.com'),(6,NULL,NULL,'I/O error on GET request for \"https://pub-...r2.dev/uploads/...jpg\": pub-...r2.dev',NULL,'2025-10-22 18:05:51.618941','FAILED','🎓 Chứng chỉ & Kích hoạt','welcome','phantoan3009@gmail.com'),(7,NULL,NULL,NULL,NULL,'2025-10-22 18:06:38.706945','SENT','🎓 Chứng chỉ & Kích hoạt','welcome','phantoan3009@gmail.com'),(8,NULL,NULL,NULL,NULL,'2025-10-23 10:32:10.505802','SENT','🎓 Chứng chỉ & Kích hoạt','welcome','phantoan3009@gmail.com'),(9,'phantoan3009@gmail.com','phantoan3009@gmail.com',NULL,NULL,'2025-10-23 14:35:36.236818','SENT','🎉 Welcome to Lockbyte','welcome','phantoan3009@gmail.com'),(10,'phantoan3009@gmail.com','phantoan3009@gmail.com',NULL,NULL,'2025-10-23 14:50:23.655530','SENT','Your Weekly Digest','digest','phantoan3009@gmail.com'),(11,'phantoan3009@gmail.com','phantoan3009@gmail.com',NULL,NULL,'2025-10-29 09:14:45.212363','SENT','🎉 Welcome to Lockbyte','welcome','phantoan3009@gmail.com'),(12,NULL,NULL,NULL,NULL,'2025-10-31 00:42:01.795436','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','pt@gmail.com'),(13,NULL,NULL,NULL,NULL,'2025-10-31 00:56:36.409070','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','phantoan3009@gmail.com'),(14,NULL,NULL,NULL,NULL,'2025-10-31 01:00:00.094369','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','phantoan3009@gmail.com'),(15,NULL,NULL,NULL,NULL,'2025-10-31 01:55:41.298601','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','phantoan3009@gmail.com'),(16,NULL,NULL,NULL,NULL,'2025-10-31 02:01:40.864233','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','phantoan3009@gmail.com'),(17,NULL,NULL,NULL,NULL,'2025-10-31 02:05:30.164776','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','phantoan3009@gmail.com'),(18,NULL,NULL,NULL,NULL,'2025-10-31 02:23:29.273092','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','phantoan3009@gmail.com'),(19,NULL,NULL,NULL,NULL,'2025-10-31 02:29:39.292181','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','phantoan3009@gmail.com'),(20,NULL,NULL,NULL,NULL,'2025-11-05 09:04:42.453518','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','phantoan3009@gmail.com'),(21,NULL,NULL,NULL,NULL,'2025-11-06 11:15:54.029021','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','huyhoangngu2912@gmail.com'),(22,NULL,NULL,NULL,NULL,'2025-11-06 16:44:21.354980','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','trunghoangdz134@gmail.com'),(23,NULL,NULL,NULL,NULL,'2025-11-06 16:51:32.742600','SENT','🎉 Hoàn thành lab: Path Traversal Ver 2','lab-solved','trunghoangdz134@gmail.com'),(24,NULL,NULL,NULL,NULL,'2025-11-06 16:53:36.723116','SENT','🎉 Hoàn thành lab: Path Traversal Ver 2','lab-solved','trunghoangdz134@gmail.com'),(25,NULL,NULL,NULL,NULL,'2025-11-08 18:10:57.165774','SENT','🎉 Pending Community Solution for JWT Authentication Bypass via alg=none','community-solution-pending','phantoan3009@gmail.com'),(26,NULL,NULL,NULL,NULL,'2025-11-08 18:19:23.032510','SENT','🎉 Accepted Community Solution for JWT Authentication Bypass via alg=none','comunity-solution-accept','phantoan3009@gmail.com'),(27,NULL,NULL,NULL,NULL,'2025-11-08 18:20:00.602308','SENT','Rejected Community Solution for JWT Authentication Bypass via alg=none','community-solution-rejected','phantoan3009@gmail.com'),(28,NULL,NULL,NULL,NULL,'2025-11-08 18:29:46.013258','SENT','🎉 Accepted Community Solution for JWT Authentication Bypass via alg=none','comunity-solution-accept','phantoan3009@gmail.com'),(29,NULL,NULL,NULL,NULL,'2025-11-08 19:24:16.548452','SENT','Rejected Community Solution for JWT Authentication Bypass via alg=none','community-solution-rejected','phantoan3009@gmail.com'),(30,NULL,NULL,NULL,NULL,'2025-11-08 19:24:23.330940','SENT','🎉 Accepted Community Solution for JWT Authentication Bypass via alg=none','comunity-solution-accept','phantoan3009@gmail.com'),(31,NULL,NULL,NULL,NULL,'2025-11-11 18:30:13.692464','SENT','🎉 Hoàn thành lab: JWT Authentication Bypass via alg=none','lab-solved','phantoan3009@gmail.com'),(32,NULL,NULL,NULL,NULL,'2025-11-11 18:30:36.934348','SENT','🎉 Pending Community Solution for Insecure','community-solution-pending','phantoan3009@gmail.com'),(33,NULL,NULL,NULL,NULL,'2025-11-12 02:56:22.885083','SENT','🎉 Approved Community Solution: JWT Authentication Bypass via alg=none','comunity-solution-accept','phantoan3009@gmail.com'),(34,NULL,NULL,NULL,NULL,'2025-11-12 03:02:29.282486','SENT','🎉 Pending Community Solution: New XSS Lab','community-solution-pending','phantoan3009@gmail.com'),(35,NULL,NULL,NULL,NULL,'2025-11-12 03:04:04.990879','SENT','🎉 Approved Community Solution: New XSS Lab','comunity-solution-accept','phantoan3009@gmail.com'),(36,NULL,NULL,NULL,NULL,'2025-11-12 03:07:40.506094','SENT','🎉 Rejected Community Solution: New XSS Lab','community-solution-rejected','phantoan3009@gmail.com'),(37,NULL,NULL,NULL,NULL,'2025-11-19 09:13:48.263885','SENT','🎉 Pending Community Solution: Path Traversal Ver 2','community-solution-pending','phantoan3009@gmail.com'),(38,NULL,NULL,NULL,NULL,'2025-11-19 09:20:11.674703','SENT','🎉 Rejected Community Solution: Path Traversal Ver 2','community-solution-rejected','phantoan3009@gmail.com'),(39,NULL,NULL,NULL,NULL,'2025-12-02 18:09:05.702887','SENT','🎉 Approved Community Solution: Path Traversal Ver 2','comunity-solution-accept','phantoan3009@gmail.com'),(40,NULL,NULL,NULL,NULL,'2025-12-02 18:09:13.623472','SENT','🎉 Rejected Community Solution: Path Traversal Ver 2','community-solution-rejected','phantoan3009@gmail.com'),(41,NULL,NULL,NULL,NULL,'2025-12-02 18:43:23.822900','SENT','🎉 Approved Community Solution: JWT Authentication Bypass via alg=none','comunity-solution-accept','phantoan3009@gmail.com'),(42,NULL,NULL,NULL,NULL,'2025-12-02 18:43:34.397932','SENT','🎉 Rejected Community Solution: JWT Authentication Bypass via alg=none','email_templates_community-solution-rejected','phantoan3009@gmail.com'),(43,NULL,NULL,NULL,NULL,'2025-12-02 18:50:53.566700','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng','async-all','vipvainoi123@gmail.com'),(44,NULL,NULL,NULL,NULL,'2025-12-02 18:50:53.566410','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng','async-all','phantoan3009@gmail.com'),(45,NULL,NULL,NULL,NULL,'2025-12-02 18:50:53.566023','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng','async-all','ptt.hust.dev@gmail.com'),(46,NULL,NULL,NULL,NULL,'2025-12-02 20:11:57.360143','SENT','🎉 Approved Community Solution: Path Traversal Ver 2','comunity-solution-accept','phantoan3009@gmail.com'),(47,NULL,NULL,NULL,NULL,'2025-12-02 20:12:05.769706','SENT','🎉 Rejected Community Solution: Path Traversal Ver 2','email_templates_community-solution-rejected','phantoan3009@gmail.com'),(48,NULL,NULL,NULL,NULL,'2025-12-02 21:02:32.089709','SENT','🎉 Approved Community Solution: Path Traversal Ver 2','comunity-solution-accept','phantoan3009@gmail.com'),(49,NULL,NULL,NULL,NULL,'2025-12-10 02:32:44.286211','SENT','🎉 Hoàn thành lab: Path Traversal Ver 2','lab-solved','phantoan3009@gmail.com'),(50,NULL,NULL,NULL,NULL,'2025-12-10 09:09:58.943950','SENT','🎉 Rejected Community Solution: Path Traversal Ver 2','email_templates_community-solution-rejected','phantoan3009@gmail.com'),(51,NULL,NULL,NULL,NULL,'2025-12-10 09:13:46.518333','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng','async-all','ptt.hust.dev@gmail.com'),(52,NULL,NULL,NULL,NULL,'2025-12-10 09:13:46.518470','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng','async-all','phantoan3009@gmail.com'),(53,NULL,NULL,NULL,NULL,'2025-12-10 09:13:46.518537','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng','async-all','vipvainoi123@gmail.com'),(54,NULL,NULL,NULL,NULL,'2025-12-14 00:49:41.591050','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','ptt.hust.dev@gmail.com'),(55,NULL,NULL,NULL,NULL,'2025-12-14 00:49:45.909741','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','phantoan3009@gmail.com'),(56,NULL,NULL,NULL,NULL,'2025-12-14 00:49:48.660682','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','vipvainoi123@gmail.com'),(57,NULL,NULL,NULL,NULL,'2025-12-14 00:49:51.783786','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','test@gmail.com'),(58,NULL,NULL,NULL,NULL,'2025-12-14 00:49:54.318638','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','huyhoangngu2912@gmail.com'),(59,NULL,NULL,NULL,NULL,'2025-12-14 00:49:57.103768','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','trunghoangds34@gmail.com'),(60,NULL,NULL,NULL,NULL,'2025-12-14 01:41:56.743212','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','ptt.hust.dev@gmail.com'),(61,NULL,NULL,NULL,NULL,'2025-12-14 01:42:00.561719','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','phantoan3009@gmail.com'),(62,NULL,NULL,NULL,NULL,'2025-12-14 01:42:03.907183','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','vipvainoi123@gmail.com'),(63,NULL,NULL,NULL,NULL,'2025-12-14 01:42:07.001550','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','test@gmail.com'),(64,NULL,NULL,NULL,NULL,'2025-12-14 01:42:10.240219','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','huyhoangngu2912@gmail.com'),(65,NULL,NULL,NULL,NULL,'2025-12-14 01:42:13.452179','SENT','🔔 CyberLock – Thông báo mới cho tất cả người dùng (Group Broadcast)','async-all','trunghoangds34@gmail.com'),(66,NULL,NULL,NULL,NULL,'2025-12-14 12:25:34.380350','SENT','🎉 Welcome to Lockbyte','welcome','ptt.hust.dev@gmail.com'),(67,NULL,NULL,NULL,NULL,'2025-12-14 12:25:39.024986','SENT','🎉 Welcome to Lockbyte','welcome','phantoan3009@gmail.com'),(68,NULL,NULL,NULL,NULL,'2025-12-14 12:25:42.819282','SENT','🎉 Welcome to Lockbyte','welcome','vipvainoi123@gmail.com');
/*!40000 ALTER TABLE `email_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_sessions`
--

DROP TABLE IF EXISTS `lab_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `completed_at` datetime(6) DEFAULT NULL,
  `container_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `flag_submitted` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `port` int DEFAULT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `status` enum('EXPIRED','RUNNING','SOLVED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lab_id` int NOT NULL,
  `user_id` int NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `counter_error_flag` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FKmlpxcefhignd6tmvyedi6tvyt` (`lab_id`),
  KEY `FKrlj7gyn3y529npcdvamq8f9gg` (`user_id`),
  CONSTRAINT `FKmlpxcefhignd6tmvyedi6tvyt` FOREIGN KEY (`lab_id`) REFERENCES `labs` (`id`),
  CONSTRAINT `FKrlj7gyn3y529npcdvamq8f9gg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=281 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_sessions`
--

LOCK TABLES `lab_sessions` WRITE;
/*!40000 ALTER TABLE `lab_sessions` DISABLE KEYS */;
INSERT INTO `lab_sessions` VALUES (125,NULL,'a0da4a91f2b39edd88a84ac9e224bbeaf3c638e35bc8c48fde7a27ff229db6ad','2025-11-07 12:33:32.000000',NULL,30000,'2025-09-23 01:35:51.000000','EXPIRED',6,4,'http://localhost:30000',3),(126,'2025-08-08 11:05:15.000000','ecbfe910f059361ea3e43fe76b50bb4d726ebd4475f7d7e36d8e8ce638126a7c','2025-08-08 11:10:15.000000','CYLOCK{FLAG_093527}',30001,'2025-08-08 10:34:15.000000','SOLVED',3,6,'http://localhost:30001',1),(127,NULL,'aa45f2b6230251c41bde6b3f74e4ce3db35d204778a8aa06b4aebe29ebfeb2f6','2025-08-09 23:26:58.000000',NULL,30002,'2025-08-09 23:13:58.000000','EXPIRED',5,7,'http://localhost:30002',0),(128,'2025-07-28 04:29:45.000000','609ba0d97503db26cd0bccd63fa13775e3c831f2cba1ec246d0ebb0920a2dedc','2025-07-28 04:33:45.000000','CYLOCK{FLAG_908278}',30003,'2025-07-28 03:54:45.000000','SOLVED',5,3,'http://localhost:30003',0),(129,NULL,'148bd32a0a7002ee2c3541663a42551c91be36c2f20b5b5ac75e3642064c3d7b','2025-11-07 13:18:32.000000',NULL,30004,'2025-10-06 13:52:16.000000','EXPIRED',1,3,'http://localhost:30004',1),(130,'2025-09-28 11:35:51.000000','4be6493a423fdb57ec2a0901788819884c0dfeff8e7a1526371c9b060165e2aa','2025-09-28 11:42:51.000000','CYLOCK{FLAG_319986}',30005,'2025-09-28 11:06:51.000000','SOLVED',1,4,'http://localhost:30005',0),(131,NULL,'5eeb2cba45c8ad34db0d04181a4c5216285dfe1d153800a94a541b7b4ce6015d','2025-09-10 13:15:19.000000',NULL,30006,'2025-09-10 12:40:19.000000','EXPIRED',2,6,'http://localhost:30006',0),(132,'2025-08-03 17:51:32.000000','e6368fc0fc800eec27a3a6c1c55cbd8040841a60be17e5a1fb583a569b25cc24','2025-08-03 17:56:32.000000','CYLOCK{FLAG_779827}',30007,'2025-08-03 17:47:32.000000','SOLVED',2,1,'http://localhost:30007',0),(133,NULL,'721b138522a6e7528042d3c30bc535393d3afc4b730b44190d4f53a677b52b7d','2025-11-07 12:50:32.000000',NULL,30008,'2025-08-09 01:38:48.000000','EXPIRED',7,6,'http://localhost:30008',0),(134,'2025-10-13 14:15:06.000000','d042d113443a06e162295f9ae5140169add02fa7d747bce1aff15eeed41715e4','2025-10-13 14:22:06.000000','CYLOCK{FLAG_997003}',30009,'2025-10-13 14:02:06.000000','SOLVED',7,3,'http://localhost:30009',2),(135,'2025-09-15 19:42:44.000000','f2c601ad454cb21112b155bd92ddbdbdb49e33102bee473b8ceec497a2c931a8','2025-09-15 19:48:44.000000','CYLOCK{FLAG_649868}',30010,'2025-09-15 19:28:44.000000','SOLVED',5,2,'http://localhost:30010',0),(136,NULL,'71fb41b4eecd8668cedbbbf77a70fd9eebe79ef4ef7aea4630462eb8a82a119c','2025-10-24 02:55:43.000000',NULL,30011,'2025-10-24 02:38:43.000000','EXPIRED',8,7,'http://localhost:30011',0),(137,'2025-08-01 13:16:39.000000','12c88739fc7095678ac423c5a1f4b37d4bb408f5e8e31ad3a336db5ba2aab07a','2025-08-01 13:18:39.000000','CYLOCK{FLAG_160455}',30012,'2025-08-01 12:54:39.000000','SOLVED',4,4,'http://localhost:30012',2),(138,'2025-08-03 17:51:32.000000','8757098ac44363bf7595c8512f2c912ba80f5c3d195ef9c49bf7fbf97c2171bc','2025-08-03 17:56:32.000000','CYLOCK{FLAG_865809}',30013,'2025-08-03 17:47:32.000000','SOLVED',2,6,'http://localhost:30013',1),(139,NULL,'14df516c4208402025eba4ca4e964f4291ff5aa72ff24a7ebbe4643b3695dcaf','2025-08-03 03:36:58.000000',NULL,30014,'2025-08-03 02:56:58.000000','EXPIRED',4,4,'http://localhost:30014',1),(140,NULL,'81ac4f44344454267a4ec64e5eb23c7acb967f770092e21dae3b8ff1e5276b12','2025-09-30 21:58:37.000000',NULL,30015,'2025-09-30 21:42:37.000000','EXPIRED',8,6,'http://localhost:30015',1),(141,NULL,'82c1416cb73df1e15e3e185adc0990c1badd4e1e4566703c79fc05815b9e9dcf','2025-09-02 18:25:41.000000',NULL,30016,'2025-09-02 17:34:41.000000','EXPIRED',5,3,'http://localhost:30016',2),(142,NULL,'0c13f29e97684601d3a469d16c7a34b8e44c9845b024b1567f6b932b568488f4','2025-08-02 18:39:28.000000',NULL,30017,'2025-08-02 18:01:28.000000','EXPIRED',6,6,'http://localhost:30017',4),(143,NULL,'2b13bfb692f955c3c261fc1466c4db685b394e39544773c444737396ce6f82b8','2025-09-28 00:14:40.000000',NULL,30018,'2025-09-27 23:33:40.000000','EXPIRED',3,2,'http://localhost:30018',2),(144,NULL,'29aa7a8b7f14891c4ca274eb68a80d939768cca9ea2843cf40591a108b53be96','2025-11-07 12:07:32.000000',NULL,30019,'2025-10-03 11:19:54.000000','EXPIRED',5,1,'http://localhost:30019',0),(145,'2025-08-13 21:07:16.000000','87a8e5b8b03ee52b89afb6eb6d0d0719b041156bfd7cb5f40eeeeff42253e35b','2025-08-13 21:09:16.000000','CYLOCK{FLAG_113533}',30020,'2025-08-13 20:31:16.000000','SOLVED',4,1,'http://localhost:30020',2),(146,NULL,'a2f3d12b467fe898b161eca2606943fe9484cfd146fd645897f91f42c6a81ba5','2025-11-07 12:21:32.000000',NULL,30021,'2025-07-14 13:14:17.000000','EXPIRED',3,6,'http://localhost:30021',1),(147,NULL,'8d243a2bec10b0254027a54e70d132771b1b0786fdb44f98963f375f50634350','2025-07-19 17:30:04.000000',NULL,30022,'2025-07-19 17:18:04.000000','EXPIRED',2,4,'http://localhost:30022',0),(148,NULL,'7b1c6019d8cb9b37c876df4c21296f871c0d369794750e435fe40476c86b5771','2025-09-15 17:29:41.000000',NULL,30023,'2025-09-15 17:00:41.000000','EXPIRED',3,7,'http://localhost:30023',1),(149,NULL,'fb716f0c3e32672370bab13d64ba55adb49c021753a7c7669fd70aebce2c5ecd','2025-07-11 12:16:31.000000',NULL,30024,'2025-07-11 11:51:31.000000','EXPIRED',8,4,'http://localhost:30024',1),(150,NULL,'aaca492c02bf3cc9f26d3ec5ce129c010cb33246b6ffa467d22b356eb5639bac','2025-09-05 06:50:58.000000',NULL,30025,'2025-09-05 06:23:58.000000','EXPIRED',1,3,'http://localhost:30025',1),(151,'2025-09-09 04:42:14.000000','a8cf95b2f68250af67d71028270e6f127639b7e6282c0cd599ce017e6b58756c','2025-09-09 04:49:14.000000','CYLOCK{FLAG_589667}',30026,'2025-09-09 03:54:14.000000','SOLVED',3,4,'http://localhost:30026',2),(152,'2025-07-29 03:53:47.000000','bd3ed01a3ca756be4719fcca7ebaf91cab9d1f7a3953332b293af6e7bf0eae70','2025-07-29 04:00:47.000000','CYLOCK{FLAG_494948}',30027,'2025-07-29 03:03:47.000000','SOLVED',8,2,'http://localhost:30027',1),(153,'2025-08-31 15:41:10.000000','05e4965b80e582ab15ee6d7e1adaaf0b15fa08bcbb52f394430d7041fd8c5cff','2025-08-31 15:42:10.000000','CYLOCK{FLAG_237817}',30028,'2025-08-31 15:17:10.000000','SOLVED',8,4,'http://localhost:30028',0),(154,'2025-10-23 11:59:32.000000','fd1b18c3a6a40f1e3694f51ecab8182057a195d781fe94ef85ad6885b11f4065','2025-10-23 12:07:32.000000','CYLOCK{FLAG_029353}',30029,'2025-10-23 11:12:32.000000','SOLVED',4,6,'http://localhost:30029',0),(155,'2025-08-13 06:15:23.000000','1db0e6c50b1a115d0eb920dd11010c5caa5e96ec3041278fa01003ee650eec13','2025-08-13 06:18:23.000000','CYLOCK{FLAG_039014}',30030,'2025-08-13 05:19:23.000000','SOLVED',1,4,'http://localhost:30030',2),(156,NULL,'d701e72888344ba06ea231d6de14d6f15d8f443f97724ac4b12e869f05a8ee06','2025-07-14 02:06:13.000000',NULL,30031,'2025-07-14 01:44:13.000000','EXPIRED',2,3,'http://localhost:30031',0),(157,'2025-07-29 03:53:47.000000','027932ac62205b94303b08fd3ba889cbaba994acd794937cb0513817c63a8a36','2025-07-29 04:00:47.000000','CYLOCK{FLAG_494948}',30032,'2025-07-29 03:03:47.000000','SOLVED',5,2,'http://localhost:30032',1),(158,'2025-09-09 10:34:15.000000','acbe5816dec2547a9c9f2e37ccfc5b848acfb48396ca10ddce14939087e2a8e6','2025-09-09 10:35:15.000000','CYLOCK{FLAG_881610}',30033,'2025-09-09 10:10:15.000000','SOLVED',1,2,'http://localhost:30033',1),(159,NULL,'3b457488c2a5462d770008560781c3f2515cf611e2f0819256b72cf07e88397b','2025-08-18 12:29:52.000000',NULL,30034,'2025-08-18 12:20:52.000000','EXPIRED',8,1,'http://localhost:30034',0),(160,'2025-10-11 04:10:56.000000','bf13bf20da5dcf644c9c3fe9a7c7f2f2b5b745f64c591852de812fcd780d9ca9','2025-10-11 04:17:56.000000','CYLOCK{FLAG_338142}',30035,'2025-10-11 03:56:56.000000','SOLVED',2,6,'http://localhost:30035',1),(161,NULL,'67400ec956bbb65ac499e658b8cf8f03df7b098db6ec72bd3637b4ec12a11791','2025-11-07 12:08:32.000000',NULL,30036,'2025-07-24 02:50:44.000000','EXPIRED',3,3,'http://localhost:30036',2),(162,NULL,'e1d246842adea7df5be7666a6d364eadb4091cbf09968c8164d54b29d92095a6','2025-07-28 19:26:24.000000',NULL,30037,'2025-07-28 19:01:24.000000','EXPIRED',2,2,'http://localhost:30037',1),(163,NULL,'5c077830738669fbda3a5441bbcea022a958382a57c95f6b14c0b34d3950db25','2025-09-24 16:09:03.000000',NULL,30038,'2025-09-24 15:19:03.000000','EXPIRED',8,2,'http://localhost:30038',1),(164,NULL,'19e10ba2909c67047b335eba298e9764668a1a32ebd3df522aaf32cd3b2f5e2c','2025-11-03 15:58:45.000000',NULL,30039,'2025-11-03 15:35:45.000000','EXPIRED',8,4,'http://localhost:30039',1),(165,NULL,'f9d0328a9e41e604755d8cae30c5d06a9bbb8722a5cbb0d94ee4871ee73ea2b3','2025-10-01 10:37:52.000000',NULL,30040,'2025-10-01 09:37:52.000000','EXPIRED',3,2,'http://localhost:30040',1),(166,NULL,'822584fc01e319ef672443f1e18265af47a201d843eb011b3f66922b4a6e8933','2025-10-10 02:59:11.000000',NULL,30041,'2025-10-10 02:34:11.000000','EXPIRED',3,2,'http://localhost:30041',1),(167,'2025-08-07 16:21:30.000000','c79e96314bf3e8c7425adb87f877827c67731e0c2c088a51811623089b90d3cb','2025-08-07 16:24:30.000000','CYLOCK{FLAG_923845}',30042,'2025-08-07 14:44:30.000000','SOLVED',3,7,'http://localhost:30042',1),(168,'2025-08-15 11:16:00.000000','a76555f2479947611c3a00b3f38a1f012d19f8d5a7785b7da093a8e515638707','2025-08-15 11:19:00.000000','CYLOCK{FLAG_259039}',30043,'2025-08-15 10:43:00.000000','SOLVED',1,2,'http://localhost:30043',2),(169,NULL,'bb533f7e86e8a2658be8af5605e4c2c586ab90c9ff6df4f36f1088b2c9ed4c8c','2025-10-13 18:26:44.000000',NULL,30044,'2025-10-13 17:37:44.000000','EXPIRED',3,2,'http://localhost:30044',1),(170,'2025-07-11 02:19:15.000000','a1e9b238d52117758801d3ba276e885b5816b236ead80c9817f072d52b23ba15','2025-07-11 02:23:15.000000','CYLOCK{FLAG_037920}',30045,'2025-07-11 01:45:15.000000','SOLVED',4,6,'http://localhost:30045',1),(171,NULL,'dfd384d552032ee1a3f7607dcb6a626e448c4e85ca5bba29e71a9ac925ff5024','2025-11-07 12:29:32.000000',NULL,30046,'2025-08-23 09:51:50.000000','EXPIRED',2,3,'http://localhost:30046',1),(172,'2025-08-22 21:45:19.000000','dafcd890f9b044b04ff6ba3b0dba54425712b08eaf3802ceac063df93bfa6755','2025-08-22 21:49:19.000000','CYLOCK{FLAG_528239}',30047,'2025-08-22 21:15:19.000000','SOLVED',4,6,'http://localhost:30047',1),(173,'2025-11-01 21:15:25.000000','40fc8e665982b1bd7768a9c4fc23b3d49fffd9d7e1cbc84b61d009834b67f030','2025-11-01 21:21:25.000000','CYLOCK{FLAG_814451}',30048,'2025-11-01 20:53:25.000000','SOLVED',4,7,'http://localhost:30048',0),(174,'2025-07-27 19:19:45.000000','477b4a0e5bedc71cbd464d202b78c444766a96663fa56e1784d2623ea44ef356','2025-07-27 19:27:45.000000','CYLOCK{FLAG_962471}',30049,'2025-07-27 19:05:45.000000','SOLVED',8,3,'http://localhost:30049',0),(175,'2025-10-06 09:09:04.000000','1ab08b7f2f2060d8f778e87d1ce61fd22d68944bbba3b595bb05004857ec0c9f','2025-10-06 09:11:04.000000','CYLOCK{FLAG_640221}',30050,'2025-10-06 08:55:04.000000','SOLVED',8,7,'http://localhost:30050',0),(176,'2025-10-22 11:36:45.000000','5f491598b6012c6691cbaad655e99df6f71d7405bb26d80dac635e4204c1ef04','2025-10-22 11:38:45.000000','CYLOCK{FLAG_265322}',30051,'2025-10-22 10:47:45.000000','SOLVED',8,3,'http://localhost:30051',1),(177,NULL,'62a411a1d5c2f25c659287176ab9a272cd431fef86117afd530677156574e5c5','2025-11-07 12:51:32.000000',NULL,30052,'2025-07-26 02:27:43.000000','EXPIRED',7,2,'http://localhost:30052',2),(178,'2025-08-10 09:45:46.000000','658e05cf289396573dd7f9e1208a5f2730b9c4b9172c32ab6bb862cc70ab3a81','2025-08-10 09:48:46.000000','CYLOCK{FLAG_497211}',30053,'2025-08-10 09:26:46.000000','SOLVED',5,3,'http://localhost:30053',0),(179,NULL,'9365f370b884a7ffdaa409582aa1b253e0ddbff7b65abf13d91be30aa74f0f22','2025-07-11 05:46:48.000000',NULL,30054,'2025-07-11 04:19:48.000000','EXPIRED',6,7,'http://localhost:30054',6),(180,'2025-09-23 08:28:26.000000','4f8d534b87f8f023d1c37c0700d165b9e42e93ac5958d29d6d504c3341789921','2025-09-23 08:32:26.000000','CYLOCK{FLAG_721208}',30055,'2025-09-23 08:07:26.000000','SOLVED',5,2,'http://localhost:30055',1),(181,NULL,'410958b7d09fc101d70ff832d6a133d8e54ff9e5c3d5584edb09b00c9501e738','2025-07-12 04:41:58.000000',NULL,30056,'2025-07-12 04:21:58.000000','EXPIRED',2,6,'http://localhost:30056',0),(182,NULL,'c4faf18c3f102e511d36c8ef3ba347ae5a4543ddc1a79c46bfefb215679399d2','2025-11-07 12:34:32.000000',NULL,30057,'2025-09-23 19:19:39.000000','EXPIRED',3,6,'http://localhost:30057',1),(183,'2025-09-17 16:06:39.000000','8fb5833ebfff57b2aae93c52990b70b48a2f8356d4cb8ed5317f93b1c5a4201b','2025-09-17 16:07:39.000000','CYLOCK{FLAG_551291}',30058,'2025-09-17 15:17:39.000000','SOLVED',8,2,'http://localhost:30058',1),(184,NULL,'a38d378c984c644ecab86bd95f5fd0d1a44311098cef672ff0dbff5b63deaf38','2025-11-07 12:58:32.000000',NULL,30059,'2025-07-27 20:16:29.000000','EXPIRED',4,3,'http://localhost:30059',2),(185,'2025-09-12 13:43:07.000000','dc6796f6958e37046467c0312fa72a88cb72915f2eca060e85daaa952bea0681','2025-09-12 13:51:07.000000','CYLOCK{FLAG_646963}',30060,'2025-09-12 13:13:07.000000','SOLVED',7,3,'http://localhost:30060',2),(186,NULL,'875ee43c26ab294ac2a3eb6fbca2496c2a910be428345a29fbb0f34739637bce','2025-11-07 12:46:32.000000',NULL,30061,'2025-08-20 10:40:21.000000','EXPIRED',6,7,'http://localhost:30061',2),(187,NULL,'c8032f387137bd85d0a2e8a9f3e8e834b9c374b5c02259706d9179ae20e3b209','2025-08-10 14:37:56.000000',NULL,30062,'2025-08-10 14:23:56.000000','EXPIRED',8,6,'http://localhost:30062',0),(188,NULL,'b1f2b4a926eba9bbe0939642b5822e47528960b8e106f40fcc909eb37a2a285c','2025-07-16 04:50:16.000000',NULL,30063,'2025-07-16 03:54:16.000000','EXPIRED',6,2,'http://localhost:30063',2),(189,'2025-09-14 14:27:39.000000','df3ab2fc0e4623d32747dd67e39443b2c99f3373ea945044c454eb8792ace149','2025-09-14 14:34:39.000000','CYLOCK{FLAG_618536}',30064,'2025-09-14 14:19:39.000000','SOLVED',1,4,'http://localhost:30064',1),(190,'2025-08-29 15:12:43.000000','938b49c327266840b81e4924d2ef1f5baee6ddb1dabb68f69e9ec12270f358e7','2025-08-29 15:15:43.000000','CYLOCK{FLAG_410197}',30065,'2025-08-29 15:10:43.000000','SOLVED',8,3,'http://localhost:30065',0),(191,NULL,'eb259fca20671b44a02b602124da52d398ae9095c9fefb612236ddd34d4fb6f7','2025-10-16 23:09:37.000000',NULL,30066,'2025-10-16 22:32:37.000000','EXPIRED',1,3,'http://localhost:30066',2),(192,'2025-08-07 18:10:05.000000','69d4b821a5f7ddc7152bec32f2027508b902bdd657b78342ee121f8310699be5','2025-08-07 18:18:05.000000','CYLOCK{FLAG_415390}',30067,'2025-08-07 17:49:05.000000','SOLVED',5,6,'http://localhost:30067',1),(193,NULL,'41d01f534fe222272adf60f3ef593cf222b47e0c9637d91328751d6a29c6fe7b','2025-11-07 13:03:32.000000',NULL,30068,'2025-10-27 21:56:39.000000','EXPIRED',5,6,'http://localhost:30068',1),(194,NULL,'3b7a86a52baaa82f3a5a5742da1df05e134ad4f657d35e13eef8dad977b063a7','2025-07-17 07:32:02.000000',NULL,30069,'2025-07-17 05:52:02.000000','EXPIRED',6,1,'http://localhost:30069',4),(195,NULL,'a12b5b8e9fa137522be8e3a8c49fb3dd671ebaddda2536307105369f307b93ce','2025-09-04 21:36:30.000000',NULL,30070,'2025-09-04 21:10:30.000000','EXPIRED',8,7,'http://localhost:30070',0),(196,'2025-09-25 12:23:23.000000','ecef35f254d4505573c25296ff96d38364c1fd6f409b6ecddbbf5160aff1227d','2025-09-25 12:29:23.000000','CYLOCK{FLAG_703433}',30071,'2025-09-25 11:46:23.000000','SOLVED',1,3,'http://localhost:30071',0),(197,NULL,'aef7e410ac4c91dc09b85ba396a24ad1b54ea1e7577c7a3824276d1692dd05a4','2025-10-25 21:17:56.000000',NULL,30072,'2025-10-25 20:33:56.000000','EXPIRED',7,1,'http://localhost:30072',1),(198,'2025-08-26 16:29:31.000000','c6b57273801ea2d717d5e5e0b57823e91667873fda675d3e6d79e2a567a85691','2025-08-26 16:34:31.000000','CYLOCK{FLAG_911129}',30073,'2025-08-26 15:27:31.000000','SOLVED',2,7,'http://localhost:30073',1),(199,'2025-08-21 05:20:39.000000','4de0bb1c3af4e33859063495a4886ff92c300ec8aa7ba1ee9eb081467b429709','2025-08-21 05:27:39.000000','CYLOCK{FLAG_149833}',30074,'2025-08-21 04:32:39.000000','SOLVED',3,7,'http://localhost:30074',3),(200,NULL,'e084d54c5acb68cae61c6060b6bf803aec76861d9412ded5aadb97fb3610f16f','2025-09-23 11:02:32.000000',NULL,30075,'2025-09-23 09:55:32.000000','EXPIRED',4,1,'http://localhost:30075',1),(201,'2025-10-06 21:58:02.000000','a1a2b75387592b075ad75af4878e2adcac5126ba6b7b72d1dd74013b26fe6de4','2025-10-06 22:06:02.000000','CYLOCK{FLAG_628266}',30076,'2025-10-06 21:24:02.000000','SOLVED',7,3,'http://localhost:30076',0),(202,'2025-07-16 04:40:19.000000','9eeb62f115415ac7a5b5bfe16f4bc964e165f205f7c639e5a7121d0780001d2f','2025-07-16 04:43:19.000000','CYLOCK{FLAG_202536}',30077,'2025-07-16 04:10:19.000000','SOLVED',1,7,'http://localhost:30077',0),(203,NULL,'cf44ba8ad0ad6f640bea89a0f5126085c4b7025ed9e75c123ea781259f4ba8c6','2025-09-09 07:03:12.000000',NULL,30078,'2025-09-09 06:15:12.000000','EXPIRED',2,3,'http://localhost:30078',0),(204,'2025-08-01 18:26:38.000000','45a7a4fa58b70859ea86e6b5dadd64d5a3e203f075d4b7dda23983c28c48af99','2025-08-01 18:27:38.000000','CYLOCK{FLAG_430787}',30079,'2025-08-01 18:02:38.000000','SOLVED',8,6,'http://localhost:30079',1),(205,NULL,'da303286178016d16895119635cc9b1f0abe5c8fc88f4118afb134ea5fe7adca','2025-09-16 16:12:35.000000',NULL,30080,'2025-09-16 15:11:35.000000','EXPIRED',5,6,'http://localhost:30080',1),(206,NULL,'7f0b7495619d15250bbec5dc3c775cf6d66afcada22be4be86da942e5392ed92','2025-09-05 00:16:32.000000',NULL,30081,'2025-09-05 00:09:32.000000','EXPIRED',8,4,'http://localhost:30081',0),(207,NULL,'ab1e210652f4d0b20db7f65ed2c54259bfb28fc7ab2dcfeb218453fc95c09182','2025-08-03 09:17:33.000000',NULL,30082,'2025-08-03 09:11:33.000000','EXPIRED',8,6,'http://localhost:30082',0),(208,NULL,'84e36b34aa19f4fcc12a6ec284d72cec43907080c3df8f7517557bf684ce0c40','2025-11-07 13:14:32.000000',NULL,30083,'2025-07-27 21:21:54.000000','EXPIRED',3,4,'http://localhost:30083',4),(209,NULL,'d2537f7e6f3d86c5e22d02d17a287b6048b6c63d9183b7da5deaf86b31c71c0c','2025-10-09 09:06:20.000000',NULL,30084,'2025-10-09 07:54:20.000000','EXPIRED',1,2,'http://localhost:30084',1),(210,'2025-07-11 09:34:32.000000','084522d83338ba024dd785cca15cba6c665d5cee8506d4478986ad1e11574c3e','2025-07-11 09:37:32.000000','CYLOCK{FLAG_029264}',30085,'2025-07-11 09:23:32.000000','SOLVED',8,3,'http://localhost:30085',0),(211,'2025-07-21 06:27:32.000000','c61e7ebf31775add3164c39d4d164aea5abfcf212bf79a77df89b387214a8c35','2025-07-21 06:31:32.000000','CYLOCK{FLAG_137133}',30086,'2025-07-21 06:07:32.000000','SOLVED',3,6,'http://localhost:30086',1),(212,'2025-10-12 20:32:23.000000','d2d8a99a1f5a12185ef6275865b0e037afab994ee135eeeb2fa143a7836d15db','2025-10-12 20:35:23.000000','CYLOCK{FLAG_682680}',30087,'2025-10-12 20:14:23.000000','SOLVED',3,4,'http://localhost:30087',1),(213,NULL,'1fea10e2b7d74adabd4690859901827dfd10187f2cf647fc7cb6be4e0a9423dc','2025-11-07 12:02:32.000000',NULL,30088,'2025-09-24 22:12:00.000000','EXPIRED',2,3,'http://localhost:30088',0),(214,NULL,'00ba7b2013c648b446ecaab5195b0db51dc7c5438c1998c237a1df2c229595a9','2025-08-26 02:45:19.000000',NULL,30089,'2025-08-26 02:16:19.000000','EXPIRED',4,6,'http://localhost:30089',2),(215,NULL,'b9552a8f5f7f65928b41076f3fba5ee8c3a1c602d01418063b9a6915a766bfb5','2025-10-04 08:02:45.000000',NULL,30090,'2025-10-04 07:22:45.000000','EXPIRED',3,1,'http://localhost:30090',1),(216,NULL,'0806cddf0fda68168c2bacf65340811a59e4ac6da4e492387557ccf7c0a4e22f','2025-11-07 12:20:32.000000',NULL,30091,'2025-08-23 09:53:57.000000','EXPIRED',8,3,'http://localhost:30091',1),(217,'2025-09-24 04:49:54.000000','398f074e8a3c14cf27d5ceca70df89055513e88a847e5bbdbc8338e864e59872','2025-09-24 04:53:54.000000','CYLOCK{FLAG_307561}',30092,'2025-09-24 04:20:54.000000','SOLVED',8,1,'http://localhost:30092',1),(218,'2025-07-23 09:58:23.000000','727d8807953f4e9816d3fb86517783c370d71634beb393fbc5681af0b9372770','2025-07-23 10:02:23.000000','CYLOCK{FLAG_343270}',30093,'2025-07-23 09:15:23.000000','SOLVED',8,3,'http://localhost:30093',0),(219,'2025-07-23 16:20:58.000000','a208ef450e71c8da9f8b85d00cdf1d5bae918f43a2791646c88187f595eb9c85','2025-07-23 16:25:58.000000','CYLOCK{FLAG_900315}',30094,'2025-07-23 15:37:58.000000','SOLVED',5,7,'http://localhost:30094',2),(220,'2025-09-26 20:24:17.000000','a99d64f625a51bffdccd89c7201b10b7f018a23412b52ad5a07e1a7df856500d','2025-09-26 20:29:17.000000','CYLOCK{FLAG_688399}',30095,'2025-09-26 19:48:17.000000','SOLVED',7,1,'http://localhost:30095',1),(221,NULL,'9e5af8e69c35201eb1524326d88d2bf50b21ef4d055dcce8b38d436078475740','2025-11-07 13:12:32.000000',NULL,30096,'2025-09-20 05:53:23.000000','EXPIRED',3,3,'http://localhost:30096',2),(222,NULL,'653108ad4e8c10f671597b4a5eeb5cd818c2bd55483ea019ec2230be1834e683','2025-07-28 12:56:14.000000',NULL,30097,'2025-07-28 12:37:14.000000','EXPIRED',5,4,'http://localhost:30097',1),(223,'2025-07-27 06:46:39.000000','cb000ba656a811594a55b2038804e2a633a1acd959024ebb797b24c1cbd0e2d1','2025-07-27 06:52:39.000000','CYLOCK{FLAG_361137}',30098,'2025-07-27 06:20:39.000000','SOLVED',6,3,'http://localhost:30098',4),(224,'2025-08-24 13:45:26.000000','211b005aaf104eb5b0845b1094d6041ef43dfa5b1da3ad5dd795224ccfa76d30','2025-08-24 13:47:26.000000','CYLOCK{FLAG_092567}',30099,'2025-08-24 13:41:26.000000','SOLVED',8,1,'http://localhost:30099',1),(225,NULL,'afbc9d34ad4e80b53b4d248a2cdd34e10580f82739cb7158bc01252013b97ac1','2025-07-16 02:36:26.000000',NULL,30100,'2025-07-16 01:09:26.000000','EXPIRED',3,1,'http://localhost:30100',1),(226,'2025-08-07 21:28:30.000000','a4dd3b8ee4510daa5fbe9ee833ea0d09e43d70fc36e5ea87e7f79e11a487dfaa','2025-08-07 21:36:30.000000','CYLOCK{FLAG_816274}',30101,'2025-08-07 20:38:30.000000','SOLVED',6,1,'http://localhost:30101',2),(227,NULL,'bb54b2b91e9dac135df5680aa890142f7321abec5aaeaea4bea01427c3bb1dfd','2025-09-28 07:38:08.000000',NULL,30102,'2025-09-28 07:16:08.000000','EXPIRED',8,6,'http://localhost:30102',0),(228,'2025-07-21 14:55:47.000000','1bd973e91bef64b7198a92bd9626d1b6f7e6f47eaa819f9f89da5b2c3b087237','2025-07-21 15:02:47.000000','CYLOCK{FLAG_690716}',30103,'2025-07-21 14:45:47.000000','SOLVED',2,3,'http://localhost:30103',0),(229,NULL,'9f389bafaf933d5dbc0b5f02be5a9552653a301270ca6f88289ff8b964310f1f','2025-08-11 00:48:14.000000',NULL,30104,'2025-08-11 00:31:14.000000','EXPIRED',2,6,'http://localhost:30104',1),(230,'2025-07-19 18:50:24.000000','e09c71e796a9de758401881a6130450283f193924bb942b7bab6c882808b5cca','2025-07-19 18:56:24.000000','CYLOCK{FLAG_184569}',30105,'2025-07-19 18:36:24.000000','SOLVED',3,3,'http://localhost:30105',1),(231,'2025-07-20 12:55:48.000000','04ac02bc43d8c5ae1169022818063c715c30d3e6a41f521b2ca11fdb291c980b','2025-07-20 12:59:48.000000','CYLOCK{FLAG_172256}',30106,'2025-07-20 12:19:48.000000','SOLVED',5,6,'http://localhost:30106',0),(232,'2025-08-18 22:57:33.000000','183b598517536c0eff6e2ec1181a8d00fcff9abc6b8bd74d52c6f837e026321b','2025-08-18 22:58:33.000000','CYLOCK{FLAG_804227}',30107,'2025-08-18 22:18:33.000000','SOLVED',7,3,'http://localhost:30107',1),(233,'2025-09-15 17:16:55.000000','c060a514de0e24c8898ea3cead0161ca4fffa8601f0479c142ec4b0acd658fb0','2025-09-15 17:21:55.000000','CYLOCK{FLAG_976780}',30108,'2025-09-15 17:03:55.000000','SOLVED',5,3,'http://localhost:30108',0),(234,'2025-08-21 15:08:06.000000','7ded978dd127b7c33d70509a333f969c01495964d1266c2bf55908d694981684','2025-08-21 15:13:06.000000','CYLOCK{FLAG_316943}',30109,'2025-08-21 14:05:06.000000','SOLVED',8,6,'http://localhost:30109',0),(235,'2025-10-08 19:06:06.000000','0776c14e41f13ce30c8b81031782a2051f99cf22f7663d0c4773c531ce6c0621','2025-10-08 19:13:06.000000','CYLOCK{FLAG_509990}',30110,'2025-10-08 18:40:06.000000','SOLVED',8,6,'http://localhost:30110',0),(236,'2025-10-01 05:10:29.000000','9a74654a42600a1973ec518a276a30f6bb4ae628eb244443be740d66498b4d0b','2025-10-01 05:12:29.000000','CYLOCK{FLAG_213342}',30111,'2025-10-01 04:34:29.000000','SOLVED',8,7,'http://localhost:30111',1),(237,NULL,'00d43b972713766e597959db15c0453e8194d78dc4c814c26013a3ffb3eb5be5','2025-11-07 13:18:32.000000',NULL,30112,'2025-08-17 18:34:12.000000','EXPIRED',2,4,'http://localhost:30112',0),(238,NULL,'10919b55d96ec1cfac889c3b5087ac46ae2c6e75c9a59f6ab1f28125ce488596','2025-11-07 13:15:32.000000',NULL,30113,'2025-09-10 11:16:44.000000','EXPIRED',3,4,'http://localhost:30113',4),(239,NULL,'5e5132aadcfacba822e28bda3b03edb2ff49bf2e4f83914118495b6e656a580a','2025-09-03 20:41:26.000000',NULL,30114,'2025-09-03 19:51:26.000000','EXPIRED',3,7,'http://localhost:30114',4),(240,'2025-08-22 06:26:22.000000','3f2e0e04859cb38d1a9d1e2379602a23eac4c56c0616681200163fb478758c31','2025-08-22 06:30:22.000000','CYLOCK{FLAG_156148}',30115,'2025-08-22 06:05:22.000000','SOLVED',7,6,'http://localhost:30115',2),(241,'2025-08-08 08:12:56.000000','116ae35174c9d6a6b5be6d784206e80ae6a73e3e9374843bd35a6c6d130979a1','2025-08-08 08:17:56.000000','CYLOCK{FLAG_383800}',30116,'2025-08-08 08:02:56.000000','SOLVED',8,3,'http://localhost:30116',0),(242,'2025-10-31 02:11:50.000000','140874010015dd2746609072885ad6dc864d296be1678384c349379a31b07575','2025-10-31 02:17:50.000000','CYLOCK{FLAG_214598}',30117,'2025-10-31 01:53:50.000000','SOLVED',7,6,'http://localhost:30117',1),(243,NULL,'1c8c3b1ac6b75f69635cb6ac16e2d758c4b56e16376612dca08eabb36a348009','2025-08-04 04:30:03.000000',NULL,30118,'2025-08-04 04:11:03.000000','EXPIRED',8,1,'http://localhost:30118',1),(244,NULL,'cfc4fbf1ce77a12b18e2deb63b51e8889359a355de53c8224462121a312c21f9','2025-11-07 13:11:32.000000',NULL,30119,'2025-08-31 03:54:48.000000','EXPIRED',8,1,'http://localhost:30119',0),(245,NULL,'2d92d90e0762a06a49a538c4e40d10a41cb638e529c56421d508c01a8a06c89c','2025-11-07 13:05:32.000000',NULL,30120,'2025-07-24 02:36:48.000000','EXPIRED',1,7,'http://localhost:30120',1),(246,NULL,'39c3b51b9cd313814c1f594e91379787f978169486f9dca1c667a4352ecbf8d6','2025-11-07 12:32:32.000000',NULL,30121,'2025-10-18 22:46:51.000000','EXPIRED',8,2,'http://localhost:30121',0),(247,'2025-08-29 14:18:17.000000','c39b9e32f99218aed4e6630e217cf8b56376d14de770bb3f6b9fd8a050123a16','2025-08-29 14:25:17.000000','CYLOCK{FLAG_920751}',30122,'2025-08-29 13:51:17.000000','SOLVED',4,1,'http://localhost:30122',1),(248,NULL,'afb48806d90e950130116d59287d2da587c72f8fadac00ae7259fc995562f085','2025-11-07 13:08:32.000000',NULL,30123,'2025-07-16 15:19:53.000000','EXPIRED',1,4,'http://localhost:30123',0),(249,'2025-08-12 18:19:48.000000','6ab25f8d724a225ec3c46d12847bff52dcc230d4d8ffc4c2591ecd39f0059e04','2025-08-12 18:22:48.000000','CYLOCK{FLAG_591072}',30124,'2025-08-12 17:23:48.000000','SOLVED',8,6,'http://localhost:30124',1),(250,NULL,'f68cec50fcc2fded383b5736c6dfc0d00b75457b4f9aae34e7620b4945fa9e8a','2025-08-26 14:37:16.000000',NULL,30125,'2025-08-26 13:13:16.000000','EXPIRED',3,3,'http://localhost:30125',1),(251,'2025-10-09 20:45:02.000000','48b5be8c54ff1545d319b7cdaf5e98ce20f96ade0f3d816880ad553e8c7388f7','2025-10-09 20:48:02.000000','CYLOCK{FLAG_500436}',30126,'2025-10-09 19:55:02.000000','SOLVED',3,1,'http://localhost:30126',3),(252,'2025-07-19 13:44:28.000000','0e7f74535aeefbe92ead86bfcd1f643f5ae6c0046a784249285c0e6725d43924','2025-07-19 13:50:28.000000','CYLOCK{FLAG_760431}',30127,'2025-07-19 13:29:28.000000','SOLVED',2,7,'http://localhost:30127',0),(253,NULL,'0530f462c1c959c79ffb8f188da934aa3324dd9aca6c4bead5dbe35d618f4f3e','2025-09-22 00:06:17.000000',NULL,30128,'2025-09-21 23:30:17.000000','EXPIRED',5,3,'http://localhost:30128',2),(254,'2025-08-28 14:32:58.000000','f070c8329f5770d207e1dbc4561e09c36b9574c0a2fdbf9aa7e37ad294ead666','2025-08-28 14:34:58.000000','CYLOCK{FLAG_823068}',30129,'2025-08-28 13:10:58.000000','SOLVED',6,1,'http://localhost:30129',5),(255,NULL,'e1aa7592301a3978128fcaec24b538e83667e0f88a49a440bb16a2b1dae59790','2025-07-29 18:17:20.000000',NULL,30130,'2025-07-29 17:32:20.000000','EXPIRED',2,2,'http://localhost:30130',1),(256,'2025-07-29 09:19:06.000000','ad5505fbe4e1374292bf4ef4ba5d7fe5449db9f80f0d2228504012aeef753979','2025-07-29 09:27:06.000000','CYLOCK{FLAG_322901}',30131,'2025-07-29 07:56:06.000000','SOLVED',5,6,'http://localhost:30131',0),(257,NULL,'8a454e82252a1fa192832ad32ac4cd8360a13081a3cfe4aee69823d0398ece0f','2025-11-07 12:25:32.000000',NULL,30132,'2025-10-15 03:02:52.000000','EXPIRED',8,3,'http://localhost:30132',1),(258,'2025-08-01 16:04:35.000000','95768d7c37e4c3ee3f8c451073af75d2665b7d689b9c2e985fa9d832a92ee066','2025-08-01 16:12:35.000000','CYLOCK{FLAG_273228}',30133,'2025-08-01 15:20:35.000000','SOLVED',3,7,'http://localhost:30133',4),(259,'2025-08-22 00:27:02.000000','2d656886ecd79eecd3a92d8418e0ad5b2f8658fc930eedab8f5ddc2359173b28','2025-08-22 00:30:02.000000','CYLOCK{FLAG_455056}',30134,'2025-08-21 23:24:02.000000','SOLVED',3,2,'http://localhost:30134',4),(260,NULL,'78b8ad7150f53657a842ad447ec748fe82c08f86d8fb2aca72352f8b081b6a25','2025-11-07 12:18:32.000000',NULL,30135,'2025-10-17 03:46:11.000000','EXPIRED',7,2,'http://localhost:30135',2),(261,NULL,'37304af97faa89ed7c5a68d9045a9846e6c5b31d8c46c277bbc1bbdbbbd4af7f','2025-07-25 01:46:51.000000',NULL,30136,'2025-07-25 01:15:51.000000','EXPIRED',3,1,'http://localhost:30136',4),(262,'2025-07-19 20:38:42.000000','7b0e406d84cd13f2456b47ba93a25b62ba57f7b5e61b2af9939e70d42545484a','2025-07-19 20:46:42.000000','CYLOCK{FLAG_977059}',30137,'2025-07-19 19:53:42.000000','SOLVED',3,1,'http://localhost:30137',2),(263,NULL,'4c9213c7b1dcc775402461155e54122619fc9c0b4c2b3702c13d466c425e1f46','2025-08-26 07:50:58.000000',NULL,30138,'2025-08-26 07:13:58.000000','EXPIRED',7,4,'http://localhost:30138',0),(264,NULL,'fec2dd3b1b0f342d2eb595516798a85b925edc918d7a18291ae05b218e58f34f','2025-11-03 05:39:18.000000',NULL,30139,'2025-11-03 05:27:18.000000','EXPIRED',5,1,'http://localhost:30139',0),(265,NULL,'a9b2f9bd8e0c5e76214e6b1bd65bb0200b9d96cf1cb61b99f55382a8b4fe55d5','2025-07-29 20:16:00.000000',NULL,30140,'2025-07-29 19:53:00.000000','EXPIRED',2,7,'http://localhost:30140',1),(266,'2025-09-07 12:16:41.000000','a020aa1a6072d05d06b0231db41aa54af2581348081bc3fe56bfc843f62f192e','2025-09-07 12:24:41.000000','CYLOCK{FLAG_331817}',30141,'2025-09-07 11:54:41.000000','SOLVED',7,2,'http://localhost:30141',2),(267,'2025-07-25 17:52:30.000000','e1f19f46fd076bb994ce6a9a7e0c47ec519bcad2d2cf2315e369daea8ec4d0e9','2025-07-25 17:55:30.000000','CYLOCK{FLAG_376049}',30142,'2025-07-25 17:36:30.000000','SOLVED',8,7,'http://localhost:30142',0),(268,'2025-08-02 11:45:14.000000','ffd22eca9f290878d5984d85bf8129fa3dffcb15c160ca237a80d5b8dc59f5a6','2025-08-02 11:47:14.000000','CYLOCK{FLAG_418010}',30143,'2025-08-02 11:36:14.000000','SOLVED',8,4,'http://localhost:30143',0),(269,'2025-08-05 12:15:39.000000','db7152cb8148d5ab3945bbfdeb77ac05c3dd6812ff1108deef1fb0ffd15c5e94','2025-08-05 12:18:39.000000','CYLOCK{FLAG_057069}',30144,'2025-08-05 11:33:39.000000','SOLVED',5,3,'http://localhost:30144',0),(270,'2025-10-28 07:03:42.000000','edbedb91c4d115fafe57b25a2c9fe7e4643076349d9386e3111ab423ebed48cf','2025-10-28 07:07:42.000000','CYLOCK{FLAG_690079}',30145,'2025-10-28 05:35:42.000000','SOLVED',7,7,'http://localhost:30145',1),(271,NULL,'d9cf10bb859d1ad97cf0086db34c6ef0ec48ce4bf3763eed175d5b586dce9d28','2025-07-23 10:47:17.000000',NULL,30146,'2025-07-23 09:00:17.000000','EXPIRED',6,3,'http://localhost:30146',6),(272,NULL,'efb3e20a4efb2ab6495151e24d4303e8ad684cdc3de673812811c5d41482bddf','2025-09-10 07:07:42.000000',NULL,30147,'2025-09-10 06:03:42.000000','EXPIRED',5,3,'http://localhost:30147',1),(273,'2025-07-20 07:32:59.000000','fee462a35e410b413eab85372c5a5e84794e26b1e6de28f726ca564f2b3712ce','2025-07-20 07:34:59.000000','CYLOCK{FLAG_086250}',30148,'2025-07-20 07:13:59.000000','SOLVED',3,7,'http://localhost:30148',2),(274,'2025-08-23 02:32:07.000000','090eb0b0f5213a09214170a1afbdd49de5086c43ac38724586ad3c9de6d84e93','2025-08-23 02:36:07.000000','CYLOCK{FLAG_636694}',30149,'2025-08-23 02:21:07.000000','SOLVED',2,3,'http://localhost:30149',1),(275,'2025-11-11 11:30:13.597355','deb02d4136f78d04d5982fa6420519f2914aef22f732baabdc36914c085c3087','2025-11-11 11:30:28.637745','CYLOCK{FAKE_FLAG_FAKE_FLAG}',32768,'2025-11-11 11:29:28.693239','SOLVED',7,2,'http://localhost:32768',NULL),(276,'2025-11-11 14:12:30.000000','a4f0bca2c9a647a9b9e5f2f3d3c41a11f8b97b2c7f3146b19d8a7f2f0c11aa01','2025-11-11 14:40:30.000000','CYLOCK{FAKE_FLAG_FAKE_FLAG}',32773,'2025-11-11 14:10:30.000000','SOLVED',4,2,'http://localhost:32773',1),(277,'2025-11-11 15:05:45.000000','b2f7c9d1e83f4a62a0c9d67a4ebc2e90d5ac4e7183b04b8cbb9a0fa0f2debb12','2025-11-11 15:35:45.000000','CYLOCK{FAKE_FLAG_FAKE_FLAG}',32774,'2025-11-11 15:02:15.000000','SOLVED',5,2,'http://localhost:32774',0),(278,NULL,'b00e05f3bfa4092670bbab535cac15d89eb0bc830479074e07d5eeec1667684b','2025-11-19 02:26:47.665043',NULL,32768,'2025-11-19 02:16:47.503340','EXPIRED',8,2,'http://localhost:32768',NULL),(279,NULL,'3fe5bc9b4099912de7b509d839fe8ba3806f64a578a7f9a2ffa05de7c415cc5b','2025-12-09 19:20:32.597573',NULL,59340,'2025-12-09 19:19:32.559096','EXPIRED',7,2,'http://localhost:59340',NULL),(280,'2025-12-09 19:32:44.259995','b85fbb82f5a0608cb5fca203ae3460b4cb222605eb753f9a8f9e19761f3fdd11','2025-12-09 19:39:51.366354',NULL,59640,'2025-12-09 19:29:51.369258','SOLVED',8,2,'http://localhost:59640',NULL);
/*!40000 ALTER TABLE `lab_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_tags`
--

DROP TABLE IF EXISTS `lab_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_tags` (
  `lab_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`lab_id`,`tag_id`),
  KEY `FKpg1ggtmdi2shh4vf71ybtnfqo` (`tag_id`),
  CONSTRAINT `FK7a7eau64dpm13wggo9emywue2` FOREIGN KEY (`lab_id`) REFERENCES `labs` (`id`),
  CONSTRAINT `FKpg1ggtmdi2shh4vf71ybtnfqo` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_tags`
--

LOCK TABLES `lab_tags` WRITE;
/*!40000 ALTER TABLE `lab_tags` DISABLE KEYS */;
INSERT INTO `lab_tags` VALUES (1,2),(3,2),(4,2),(7,2),(2,3),(5,3),(6,4),(1,5),(2,5),(7,5),(2,7),(2,8),(7,8),(8,8);
/*!40000 ALTER TABLE `lab_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labs`
--

DROP TABLE IF EXISTS `labs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `labs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `difficulty` enum('Easy','Hard','Insane','Medium') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `docker_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fix_vulnerabilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `hint` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `solution` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` enum('Archived','Draft','Published') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `timeout_minutes` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `author_id` int NOT NULL,
  `link_source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `flag` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpninc9fla2hpjd2y63m5d7grf` (`author_id`),
  CONSTRAINT `FKpninc9fla2hpjd2y63m5d7grf` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labs`
--

LOCK TABLES `labs` WRITE;
/*!40000 ALTER TABLE `labs` DISABLE KEYS */;
INSERT INTO `labs` VALUES (1,'2025-10-03 19:04:37.315232','A lab to practice reflected XSS.\n- a\n- a\n\nokok\n\n# a\n### aaa\n- ok\n```\nint a\n```\ns\n\n---\n','Medium','my-repo/xss-lab:latest','Sanitize user input...','Check the search parameter.','New XSS Lab','The solution is...','Published',60,'2025-11-11 23:16:29.818851',2,'','CYLOCK{FAKE_FLAG_FAKE_FLAG}'),(2,'2025-10-03 19:14:39.402753','*Hãy tìm flag* trong mã nguồn sau:\n\n```\nint x= 1;\n```','Easy','my-repo/xss-lab:latest','Sanitize user input... hãy vào facebook tôi [Toàn Phan](https://www.facebook.com/lozenkyo.a/)\n\n','Check the search parameter. `sxxx` trong bài','New Labs Lab','The solution is.. hiển thị ở ![a](https://pub-0a371eaab58e4c38876f01ff32a8fb2f.r2.dev/uploads/2025/10/2b3c2d0e-ca45-49f0-b763-f6afdbcd11b0-Screenshot_2025-10-28_185148.png)\nMã nguồn mô tả\n```\n\nxxxx\n```\n\n---\n**Trình bày**\n','Published',60,'2025-11-11 23:16:26.680294',2,'','CYLOCK{FAKE_FLAG_FAKE_FLAG}'),(3,'2025-10-08 09:22:49.326652','A lab to practice reflected SQL.','Hard','my-repo/sql-lab:latest','Sanitize user input...','Check the search parameter.','Lab 1','The solution is...','Published',60,'2025-11-11 23:16:35.812498',2,'','CYLOCK{FAKE_FLAG_FAKE_FLAG}'),(4,'2025-10-09 18:48:24.639822','A lab to practice reflected SQL.','Medium','my-repo/sql-lab:latest','Sanitize user input...','Check the search parameter.','Lab 12','The solution is...','Published',60,'2025-10-09 18:48:24.640009',2,NULL,''),(5,'2025-10-10 14:42:28.059279','```\nNothing in the house\n\n```','Medium','my-repo/xss-lab:latests','','','Insecure','','Published',60,'2025-11-11 23:16:38.498671',2,'','CYLOCK{FAKE_FLAG_FAKE_FLAG}'),(6,'2025-10-15 09:15:40.583671','A lab to practice reflected XSS.\n- a\n- a\n\nokok\n\n# a\n### aaa\n- ok\n```\nint a\n```\ns\n\n---\n','Insane','my-repo/xss-lab:latest','','','Test 15/10','','Published',60,'2025-10-15 09:15:40.584231',2,NULL,''),(7,'2025-10-28 22:50:34.087285','Trong bài lab này, hệ thống sử dụng **JWT (JSON Web Token)** để quản lý phiên người dùng. Tuy nhiên, quá trình xác thực JWT không được cấu hình đúng — server có thể chấp nhận các token có `alg: none`, dẫn tới việc kẻ tấn công có thể giả mạo quyền hạn bằng cách chỉnh sửa payload.\n\n**Mục tiêu:** Truy cập trang quản trị `/admin` và xóa tài khoản `carlos` bằng cách lợi dụng lỗ hổng `alg=none`.','Medium','phantoan3009/path-traversal-1:latest','1. Tuyệt đối không chấp nhận `alg: none`. Kiểm tra và reject mọi token có thuật toán này.\n2. Luôn xác minh chữ ký với secret key/khóa công khai phù hợp. Dùng thư viện JWT chính thống và cập nhật bản vá.\n3. Cấu hình server để chỉ chấp nhận một danh sách thuật toán đã biết (ví dụ: HS256, RS256) và không cho phép thay đổi thuật toán từ client.\n4. Thực hiện kiểm tra bổ sung: token phải có `iss`, `aud`, `exp` hợp lệ và các claim quan trọng phải được xác thực quyền hạn tại server.\n5. Logging và monitoring: ghi lại các token thất bại/không hợp lệ để phát hiện thử nghiệm tấn công.\n\n**Ví dụ (Java, sử dụng jjwt):**\n\n```java\nJwts.parserBuilder()\n    .setSigningKey(secretKey)\n    .build()\n    .parseClaimsJws(token); // sẽ ném exception nếu chữ ký không hợp lệ\n```\n','* JWT có cấu trúc `header.payload.signature`.\n* `alg: none` có nghĩa là token **không được ký** — nếu server không kiểm tra chặt chẽ, nó có thể chấp nhận token đã bị sửa.\n* Không cần tạo token mới; chỉnh token hiện tại là đủ.\n* Đừng quên giữ dấu `.` sau payload khi xóa signature.','JWT Authentication Bypass via alg=none','1. Đăng nhập bằng tài khoản thường (ví dụ: `wiener` hoặc tài khoản lab cung cấp).\n2. Mở **Burp → Proxy → HTTP history**, tìm request `GET /my-account` sau khi đăng nhập. Quan sát cookie phiên — đó là một **JWT**.\n3. Double-click phần payload của token trong Burp Inspector để xem JSON đã decode. Chú ý trường `sub` chứa username hiện tại.\n4. Gửi request đó đến **Burp Repeater** và đổi đường dẫn thành `/admin`.\n5. Trong payload, thay giá trị `sub` thành `\"administrator\"` và **Apply changes**.\n6. Chọn phần header của JWT và thay `alg` thành `\"none\"`. Click **Apply changes**.\n7. Trong message editor, **xóa phần signature** (phần sau dấu `.` thứ hai) — nhưng giữ lại dấu `.` ở cuối payload (ví dụ: `header.payload.`).\n8. Gửi request đến `/admin` — nếu thành công bạn sẽ thấy giao diện quản trị.\n9. Tìm trong response đường dẫn xóa người dùng: `/admin/delete?username=carlos` và gửi request đó để hoàn tất lab.\n\nẢnh minh họa\n![Ảnh 1](https://pub-0a371eaab58e4c38876f01ff32a8fb2f.r2.dev/uploads/2025/11/a8c30c50-43fc-48d7-8186-c39c43906156-jwt-infographic.jpg)','Published',1,'2025-11-12 03:18:05.969455',2,'https://pub-0a371eaab58e4c38876f01ff32a8fb2f.r2.dev/uploads/2025/10/8cdfcc51-f5d9-4bf0-8f1a-1c24089886f1-User_Presets.zip','CYLOCK{FAKE_FLAG_FAKE_FLAG}'),(8,'2025-11-06 16:47:36.810402','```\n\nokoko\n```\n\nNothing','Easy','phantoan3009/path-traversal-2:latest','```\n\nokoko\n```\n\nNothing','```\n\nokoko\n```\n\nNothing','Path Traversal Ver 2','```\n\nokoko\n```\n\nNothing','Published',10,'2025-11-06 16:47:36.810497',2,'https://pub-0a371eaab58e4c38876f01ff32a8fb2f.r2.dev/uploads/2025/10/8cdfcc51-f5d9-4bf0-8f1a-1c24089886f1-User_Presets.zip','CYLOCK{FAKE_FLAG_FAKE_FLAG}');
/*!40000 ALTER TABLE `labs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` enum('ROLE_ADMIN','ROLE_USER') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_USER'),(2,'ROLE_ADMIN');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt48xdq560gs3gap9g7jg36kgc` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (4,'CSRF'),(3,'IDOR'),(5,'Java'),(7,'PHP'),(8,'Protype'),(2,'XSS');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic_labs`
--

DROP TABLE IF EXISTS `topic_labs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic_labs` (
  `topic_id` int NOT NULL,
  `lab_id` int NOT NULL,
  PRIMARY KEY (`topic_id`,`lab_id`),
  KEY `FKtbnsc1wivu2xn35y8jfh3v1dt` (`lab_id`),
  CONSTRAINT `FKc6c99v6ocn8ywc4olkjpdbk2g` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`),
  CONSTRAINT `FKtbnsc1wivu2xn35y8jfh3v1dt` FOREIGN KEY (`lab_id`) REFERENCES `labs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic_labs`
--

LOCK TABLES `topic_labs` WRITE;
/*!40000 ALTER TABLE `topic_labs` DISABLE KEYS */;
INSERT INTO `topic_labs` VALUES (1,2),(2,2),(3,7),(4,7),(4,8);
/*!40000 ALTER TABLE `topic_labs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic_tags`
--

DROP TABLE IF EXISTS `topic_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic_tags` (
  `topic_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`topic_id`,`tag_id`),
  KEY `FK4p9qq4u9hug6ov0f6xfcnbweb` (`tag_id`),
  CONSTRAINT `FK4p9qq4u9hug6ov0f6xfcnbweb` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`),
  CONSTRAINT `FK96swgfxw6li63uo1mjm1kiuhy` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic_tags`
--

LOCK TABLES `topic_tags` WRITE;
/*!40000 ALTER TABLE `topic_tags` DISABLE KEYS */;
INSERT INTO `topic_tags` VALUES (1,2),(4,2),(1,8);
/*!40000 ALTER TABLE `topic_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topics`
--

DROP TABLE IF EXISTS `topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('Archived','Draft','Published') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `author_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7xkxef4fwbjec06isf4ims4gr` (`author_id`),
  CONSTRAINT `FK7xkxef4fwbjec06isf4ims4gr` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topics`
--

LOCK TABLES `topics` WRITE;
/*!40000 ALTER TABLE `topics` DISABLE KEYS */;
INSERT INTO `topics` VALUES (1,'# Lab02\nHãy thử thách bản thân với [New Labs Lab](/labs/2)\n\n\n\n# ok\n## okok\n#### 11112x\nKhá ok rồi đó ae `int` `xx`\n\n\n\n![ảnh mèo](https://tse3.mm.bing.net/th/id/OIP.Fb9TlA92Z8VTbWXSNfvWIAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3)\n\n\n\n### 4. Trang Quản lý Người dùng (User Management)\n\nNơi Admin quản lý tất cả tài khoản trên nền tảng.\n\n- **Mục đích:** Theo dõi, hỗ trợ và quản lý cộng đồng người dùng.\n- **Các thành phần chính:**\n    - **Bảng danh sách người dùng:** Hiển thị thông tin như: User ID, Tên người dùng, Email, Ngày đăng ký, Số Labs đã giải, Vai trò (User/Admin), Trạng thái (Hoạt động/Bị cấm).\n    - **Hành động trên mỗi người dùng:**\n        - **Xem chi tiết (View Profile):** Xem trang dashboard của người dùng đó.\n        - **Chỉnh sửa (Edit):** Thay đổi thông tin, đặt lại mật khẩu.\n        - **Thay đổi vai trò `(Change Role)`:** Nâng cấp một người dùng thành Admin.\n        - **Cấm/Bỏ cấm (Ban/Unban):** Vô hiệu hóa hoặc kích hoạt lại tài khoản.\n\n\n\n```\nint main(){\n\ncout << 1 << endl;\n}\n\n```\n\nGiờ tôi sẽ `test thử` xem được không\n\nok chưa `:)`\nmoi ban test labs','2025-10-12 22:04:28.028057','Published','Topics 1','2025-10-28 20:19:25.478674',2),(2,'`xxxâ` okok [XSS Attack Vectors](/labs/LAB002)\n`okokok`\n\nHôm nay tôi vui\n```\nint main(){\n   int x = 1;\n}\n```','2025-10-14 19:46:18.553083','Published','Topics 2','2025-10-15 00:43:09.189881',2),(3,'# 🧩JWTs là gì?\n\n---\n\nJSON Web Token (JWT) là một định dạng tiêu chuẩn để truyền dữ liệu JSON được ký bằng mật mã giữa các hệ thống. Về lý thuyết, chúng có thể chứa bất kỳ loại dữ liệu nào, nhưng thường được dùng để gửi thông tin (“claims”) về người dùng như một phần của các cơ chế xác thực, quản lý phiên và kiểm soát truy cập.\n\n![What is JWT?](https://pub-0a371eaab58e4c38876f01ff32a8fb2f.r2.dev/uploads/2025/10/d36a464c-77c2-4133-a514-84a5ccd11574-jwt-infographic.jpg)\n\nKhác với token phiên truyền thống, toàn bộ dữ liệu mà máy chủ cần đều được lưu ở phía client trong chính JWT. Điều này khiến JWT trở thành lựa chọn phổ biến cho các website phân tán cao, nơi người dùng cần tương tác liền mạch với nhiều máy chủ back-end.\n\n## 💡JWT format\n\n---\n\nMột JWT gồm 3 phần: một header (tiêu đề), một payload (phần tải), và một signature (chữ ký). Các phần này được phân tách bằng dấu chấm, như trong ví dụ sau:\n\n```json\neyJraWQiOiI5MTM2ZGRiMy1jYjBhLTRhMTktYTA3ZS1lYWRmNWE0NGM4YjUiLCJhbGciOiJSUzI1NiJ9.\neyJpc3MiOiJwb3J0c3dpZ2dlciIsImV4cCI6MTY0ODAzNzE2NCwibmFtZSI6IkNhcmxvcyBNb250b3lhIiwic3ViIjoiY2FybG9zIiwicm9sZSI6ImJsb2dfYXV0aG9yIiwiZW1haWwiOiJjYXJsb3NAY2FybG9zLW1vbnRveWEubmV0IiwiaWF0IjoxNTE2MjM5MDIyfQ.\nSYZBPIBg2CRjXAJ8vCER0LA_ENjII1JakvNQoP-Hw6GG1zfl4JyngsZReIfqRvIAEi5L4HV0q7_9qGhQZvy9ZdxEJbwTxRs_6Lb-fZTDpW6lKYNdMyjw45_alSCZ1fypsMWz_2mTpQzil0lOtps5Ei_z7mM7M8gCwe_AGpI53JxduQOaB5HkT5gVrv9cKu9CsW5MS6ZbqYXpGyOG5ehoxqm8DL5tFYaW3lB50ELxi0KsuTKEbD0t5BCl0aCR2MBJWAbN-xeLwEenaqBiwPVvKixYleeDQiBEIylFdNNIMviKRgXiYuAvMziVPbwSgkZVHeEdF5MQP1Oe2Spac-6IfA\n```\n\nCác phần header và payload của JWT chỉ là các đối tượng JSON được mã hóa theo base64url. Header chứa siêu dữ liệu về chính token, trong khi payload chứa các “claims” (tuyên bố) thực tế về người dùng. Ví dụ, bạn có thể giải mã payload từ token ở trên để thấy các claims sau:\n\n```json\n{\n	\"iss\": \"portswigger\",\n	\"exp\": 1648037164,\n	\"name\": \"Carlos Montoya\",\n	\"sub\": \"carlos\",\n	\"role\": \"blog_author\",\n	\"email\": \"carlos@carlos-montoya.net\",\n	\"iat\": 1516239022\n}\n```\n\nTrong hầu hết các trường hợp, dữ liệu này có thể được bất kỳ ai có quyền truy cập vào token đọc hoặc sửa đổi một cách dễ dàng. Do đó, tính bảo mật của bất kỳ cơ chế dựa trên JWT nào phụ thuộc nặng nề vào chữ ký mật mã.\n\n# 🔧 Chấp nhận không chữ ký\nTrong số những thứ khác, header của JWT chứa một tham số `alg`. Tham số này cho máy chủ biết thuật toán nào đã được dùng để ký token và do đó thuật toán nào cần dùng khi xác minh chữ ký.\n\n```json\n{\n    \"alg\": \"HS256\",\n    \"typ\": \"JWT\"\n}\n```\n\nThiết kế này vốn đã có vấn đề vì máy chủ buộc phải ngầm tin vào dữ liệu do người dùng điều khiển trong token, mà tại thời điểm đó dữ liệu chưa được xác minh. Nói cách khác, kẻ tấn công có thể trực tiếp ảnh hưởng đến cách máy chủ kiểm tra tính tin cậy của token.\n\nJWT có thể được ký bằng nhiều thuật toán khác nhau, nhưng cũng có thể để không ký. Trong trường hợp này tham số `alg` được đặt thành `none`, biểu thị một JWT “không được bảo vệ” (unsecured JWT). Do những mối nguy rõ ràng của việc này, máy chủ thường từ chối các token không có chữ ký. Tuy nhiên, vì kiểu lọc này dựa trên phân tích chuỗi, đôi khi bạn có thể vượt qua các bộ lọc bằng các kỹ thuật ẩn danh cổ điển, chẳng hạn như chữ hoa/chữ thường hỗn hợp hoặc các kiểu mã hóa không ngờ tới.\n> Lưu ý\n> \n> \n> Ngay cả khi token không được ký, phần payload vẫn phải kết thúc bằng một dấu chấm ở cuối.\n\n```\nheader.payload.\n```\n> Không có phần `signature` nhưng vẫn cần dấu `.` ở cuối để đúng cấu trúc của `JWT`\n> \n[Lab: JWT Authentication Bypass via alg=none](/labs/7)\n\n---\n\n','2025-10-28 22:52:38.104955','Published','JWT Attack','2025-11-06 10:22:26.479692',2),(4,'# File LFI\n\nNothing\n[Path Traversal Ver 2](/labs/8)\n\n\n# JWT\n\nNothing[JWT Authentication Bypass via alg=none](/labs/7)\n\n\n\nPreview\n\n![Image](https://pub-0a371eaab58e4c38876f01ff32a8fb2f.r2.dev/uploads/2025/11/ccba9f0e-63ef-4ed7-833f-f492306d611e-rainbow-glacier-vt.jpg)','2025-11-06 16:50:05.966970','Published','Path Traversal','2025-12-13 23:57:43.032446',2);
/*!40000 ALTER TABLE `topics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1),(3,1),(4,1),(6,1),(7,1),(2,2);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_star`
--

DROP TABLE IF EXISTS `user_star`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_star` (
  `id` int NOT NULL AUTO_INCREMENT,
  `completed_at` datetime(6) DEFAULT NULL,
  `error_count` int DEFAULT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `time_solved` int DEFAULT NULL,
  `lab_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1a9vuy3u3t6l4hnxydf2rw1ji` (`lab_id`),
  KEY `FKgrum1thpbhptwm5jx8gufedsj` (`user_id`),
  CONSTRAINT `FK1a9vuy3u3t6l4hnxydf2rw1ji` FOREIGN KEY (`lab_id`) REFERENCES `labs` (`id`),
  CONSTRAINT `FKgrum1thpbhptwm5jx8gufedsj` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_star`
--

LOCK TABLES `user_star` WRITE;
/*!40000 ALTER TABLE `user_star` DISABLE KEYS */;
INSERT INTO `user_star` VALUES (1,'2025-07-21 06:27:32.000000',1,'2025-07-21 06:07:32.000000',20,3,6),(2,'2025-07-28 04:29:45.000000',0,'2025-07-28 03:54:45.000000',35,5,3),(3,'2025-08-13 06:15:23.000000',2,'2025-08-13 05:19:23.000000',56,1,4),(4,'2025-08-03 17:51:32.000000',0,'2025-08-03 17:47:32.000000',4,2,1),(5,'2025-08-18 22:57:33.000000',1,'2025-08-18 22:18:33.000000',39,7,3),(6,'2025-07-29 03:53:47.000000',1,'2025-07-29 03:03:47.000000',50,5,2),(7,'2025-08-01 13:16:39.000000',2,'2025-08-01 12:54:39.000000',22,4,4),(8,'2025-08-03 17:51:32.000000',1,'2025-08-03 17:47:32.000000',4,2,6),(9,'2025-08-13 21:07:16.000000',2,'2025-08-13 20:31:16.000000',36,4,1),(10,'2025-09-09 04:42:14.000000',2,'2025-09-09 03:54:14.000000',48,3,4),(11,'2025-07-29 03:53:47.000000',1,'2025-07-29 03:03:47.000000',50,8,2),(12,'2025-08-02 11:45:14.000000',0,'2025-08-02 11:36:14.000000',9,8,4),(13,'2025-07-11 02:19:15.000000',1,'2025-07-11 01:45:15.000000',34,4,6),(14,'2025-08-15 11:16:00.000000',2,'2025-08-15 10:43:00.000000',33,1,2),(15,'2025-07-20 07:32:59.000000',2,'2025-07-20 07:13:59.000000',19,3,7),(16,'2025-11-01 21:15:25.000000',0,'2025-11-01 20:53:25.000000',22,4,7),(17,'2025-07-11 09:34:32.000000',0,'2025-07-11 09:23:32.000000',11,8,3),(18,'2025-07-25 17:52:30.000000',0,'2025-07-25 17:36:30.000000',16,8,7),(19,'2025-07-20 12:55:48.000000',0,'2025-07-20 12:19:48.000000',36,5,6),(20,'2025-09-25 12:23:23.000000',0,'2025-09-25 11:46:23.000000',37,1,3),(21,'2025-07-19 13:44:28.000000',0,'2025-07-19 13:29:28.000000',15,2,7),(22,'2025-07-16 04:40:19.000000',0,'2025-07-16 04:10:19.000000',30,1,7),(23,'2025-08-01 18:26:38.000000',1,'2025-08-01 18:02:38.000000',24,8,6),(24,'2025-08-24 13:45:26.000000',1,'2025-08-24 13:41:26.000000',4,8,1),(25,'2025-07-23 16:20:58.000000',2,'2025-07-23 15:37:58.000000',43,5,7),(26,'2025-09-26 20:24:17.000000',1,'2025-09-26 19:48:17.000000',36,7,1),(27,'2025-07-27 06:46:39.000000',4,'2025-07-27 06:20:39.000000',26,6,3),(28,'2025-08-07 21:28:30.000000',2,'2025-08-07 20:38:30.000000',50,6,1),(29,'2025-07-21 14:55:47.000000',0,'2025-07-21 14:45:47.000000',10,2,3),(30,'2025-07-19 18:50:24.000000',1,'2025-07-19 18:36:24.000000',14,3,3),(31,'2025-08-22 06:26:22.000000',2,'2025-08-22 06:05:22.000000',21,7,6),(32,'2025-07-19 20:38:42.000000',2,'2025-07-19 19:53:42.000000',45,3,1),(33,'2025-08-22 00:27:02.000000',4,'2025-08-21 23:24:02.000000',63,3,2),(34,'2025-09-07 12:16:41.000000',2,'2025-09-07 11:54:41.000000',22,7,2),(35,'2025-10-28 07:03:42.000000',1,'2025-10-28 05:35:42.000000',88,7,7),(36,'2025-11-11 14:12:30.000000',1,'2025-11-11 14:10:30.000000',2,4,2);
/*!40000 ALTER TABLE `user_star` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_stats`
--

DROP TABLE IF EXISTS `user_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_stats` (
  `user_id` int NOT NULL,
  `labs_solved` int NOT NULL,
  `total_errors` int NOT NULL,
  `total_time_minutes` bigint NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FKj277c5rcqlsvwkk3hj39e2b74` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_stats`
--

LOCK TABLES `user_stats` WRITE;
/*!40000 ALTER TABLE `user_stats` DISABLE KEYS */;
INSERT INTO `user_stats` VALUES (1,6,8,175),(2,6,11,220),(3,7,6,172),(4,4,6,135),(6,6,6,139),(7,7,5,233);
/*!40000 ALTER TABLE `user_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` tinyint NOT NULL,
  `status` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  CONSTRAINT `users_chk_1` CHECK ((`gender` between 0 and 2)),
  CONSTRAINT `users_chk_2` CHECK ((`status` between 0 and 4))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'ptt.hust.dev@gmail.com','Phan Toan','$2a$10$Fr5DB24xW9PZaLeuPEh4au0n9osltzUbdWCxPcQxMpL/1DyCSVj2m','phantoan_user','2025-10-31',0,3),(2,NULL,'phantoan3009@gmail.com','Phan The Toan','$2a$10$TgExCvPvI8ioSmE4OT0hg.pY/ejHY0LTBuxQAMGayRCYk.4mqNX4W','phantoan','2004-09-30',0,3),(3,NULL,'vipvainoi123@gmail.com','Phan_Toan','$2a$10$6FsPZ7TcZL1O2ZYQ7NmnHuy6xQbCpjYm.ZOxrTyPlo77eZmtmtx9K','phantoan_u','2003-09-30',0,3),(4,NULL,'test@gmail.com','tes1','$2a$10$4kn/QTGxHgFqhy8v2hIIXuY9RyHTsa2zMqc1h3Vq3iIJIDFgzLYKu','test1','2025-01-09',0,3),(6,NULL,'huyhoangngu2912@gmail.com','cytest','$2a$10$uFbDYXM0ulwcpT3YbIL/i.W2NVzzIJuoI.ZPyRoLA2EDqxXPAq/V6','cytest','2025-10-30',0,3),(7,NULL,'trunghoangds34@gmail.com','trunghoang','$2a$10$81kkKnqaj6Twd7nHS8v7.u.K/XcMEWRCsNdjn2D4AYomI46b.LmVG','trunghoang','2025-12-04',0,3);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'web_security_db'
--

--
-- Dumping routines for database 'web_security_db'
--
/*!50003 DROP PROCEDURE IF EXISTS `seed_lab_sessions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`admin_gxyt`@`localhost` PROCEDURE `seed_lab_sessions`()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE random_user INT;
    DECLARE random_lab INT;
    DECLARE base_port INT DEFAULT 40000;
    DECLARE random_status VARCHAR(10);
    DECLARE start_time DATETIME;
    DECLARE expire_time DATETIME;
    DECLARE complete_time DATETIME;
    DECLARE container_id VARCHAR(100);
    DECLARE fake_flag VARCHAR(255);

    WHILE i <= 100 DO
        
        -- random pick user 1..7
        SET random_user = FLOOR(1 + (RAND() * 7));

        -- random pick lab 1..8
        SET random_lab = FLOOR(1 + (RAND() * 8));

        -- random pick status
        SET random_status = ELT(FLOOR(1 + RAND()*3), 'RUNNING', 'SOLVED', 'EXPIRED');

        -- started_at: 1 - 90 days ago
        SET start_time = DATE_SUB(NOW(), INTERVAL FLOOR(1 + RAND()*90) DAY);

        -- expires_at = start + (5-90 min)
        SET expire_time = DATE_ADD(start_time, INTERVAL FLOOR(5 + RAND()*90) MINUTE);

        -- if solved → completed_at within 1-5 min before expire_time
        IF random_status = 'SOLVED' THEN
            SET complete_time = DATE_SUB(expire_time, INTERVAL FLOOR(1 + RAND()*5) MINUTE);
            SET fake_flag = CONCAT('CYLOCK{FLAG_', LPAD(FLOOR(RAND()*999999),6,'0'), '}');
        ELSE
            SET complete_time = NULL;
            SET fake_flag = NULL;
        END IF;

        -- container id
        SET container_id = SUBSTRING(MD5(RAND()),1,64);

        INSERT INTO lab_sessions(
            container_id, port, started_at, expires_at, completed_at,
            flag_submitted, status, lab_id, user_id, url, counter_error_flag
        )
        VALUES (
            container_id,
            base_port + i,
            start_time,
            expire_time,
            complete_time,
            fake_flag,
            random_status,
            random_lab,
            random_user,
            CONCAT('http://localhost:', base_port + i),
            FLOOR(RAND()*5)
        );

        SET i = i + 1;
    END WHILE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-14 14:50:32
