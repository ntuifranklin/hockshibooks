-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: 172.17.0.2    Database: hockshi
-- ------------------------------------------------------
-- Server version	11.5.2-MariaDB-ubu2404

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
-- Dumping data for table `Book_Reviews`
--

LOCK TABLES `Book_Reviews` WRITE;
/*!40000 ALTER TABLE `Book_Reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `Book_Reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Books`
--

LOCK TABLES `Books` WRITE;
/*!40000 ALTER TABLE `Books` DISABLE KEYS */;
/*!40000 ALTER TABLE `Books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Countries`
--

LOCK TABLES `Countries` WRITE;
/*!40000 ALTER TABLE `Countries` DISABLE KEYS */;
INSERT INTO `Countries` VALUES ('CA','Canada'),('US','United States');
/*!40000 ALTER TABLE `Countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Customers`
--

LOCK TABLES `Customers` WRITE;
/*!40000 ALTER TABLE `Customers` DISABLE KEYS */;
INSERT INTO `Customers` VALUES ('443e32a4df6024f7dd5c14883eb62b36','UUMannyJBfMTexI','BbVIqiHpQfH','mozessonlonsdale@yahoo.com','$2b$10$Ssr3XIEOn2OllmUGZsCFAu/7I1CtyECdYHQU3Ki.qw5Kk81iTeEtG',0,'IeiANpsU','pkPczIgbLHMLVE','3a5e25d8e50e651b556f5d90b8dd20fd','CA','BWBCJbfCGPsOfx','7685644886');
/*!40000 ALTER TABLE `Customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Genres`
--

LOCK TABLES `Genres` WRITE;
/*!40000 ALTER TABLE `Genres` DISABLE KEYS */;
INSERT INTO `Genres` VALUES ('1','Science'),('2','Fiction'),('3','Non-Fiction');
/*!40000 ALTER TABLE `Genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Inventory`
--

LOCK TABLES `Inventory` WRITE;
/*!40000 ALTER TABLE `Inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `Inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Order_Items`
--

LOCK TABLES `Order_Items` WRITE;
/*!40000 ALTER TABLE `Order_Items` DISABLE KEYS */;
/*!40000 ALTER TABLE `Order_Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Payment`
--

LOCK TABLES `Payment` WRITE;
/*!40000 ALTER TABLE `Payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Promotions`
--

LOCK TABLES `Promotions` WRITE;
/*!40000 ALTER TABLE `Promotions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Provinces_States`
--

LOCK TABLES `Provinces_States` WRITE;
/*!40000 ALTER TABLE `Provinces_States` DISABLE KEYS */;
INSERT INTO `Provinces_States` VALUES ('03af2309ed359f2ecb975edb3a886ae0','US','Iowa'),('093b77cb149f22c4b05efb1688dd5cb3','CA','Nova Scotia'),('0fce9c4b6b65548847e34572213623ef','US','Maryland'),('1f34a022cd5103ad477fd2558ceb775e','US','Utah'),('20470e42a293a7b675cce9564060c894','CA','Northwest Territories'),('220ada984c2b1aa6c60b5783b357080f','US','Wisconsin'),('249e2052e0376e3b706786f43cec36bb','US','Minnesota'),('2747f3ad4d2971865ee9929338f0db8e','US','Oregon'),('28b844208b76167aa70b8d4bcc62853d','US','Michigan'),('2e5a347f404a2fa7f125031090944578','US','Alabama'),('3008f2b1e8631d786cd41ed517094b5a','US','New Jersey'),('3a5e25d8e50e651b556f5d90b8dd20fd','CA','Yukon'),('3af17cdd5fa77be682b90ba7d48ed88a','US','Mississippi'),('3f512dc182d75d5334cc3c434e4e9e0b','CA','New Brunswick'),('41097ea46ad94c07b0c58394feef68de','CA','Nunavut'),('49f52d91dcd91cdbc6e1afebc3c31069','CA','Alberta'),('525117ccfbb2f19d0174b80c758a1af1','CA','Manitoba'),('5af6169f4f9bdbd632db679d5af3f8f4','US','Kentucky'),('605eef384d5c7460e9f16383309b5a65','US','Rhode Island'),('6c9f1732e17f44485ee6e5a612379062','US','South Carolina'),('6dd6221173200e6bdf03c6c1f5db2252','US','Colorado'),('6e47e407073660850a14e4bdfce7ec9b','CA','British Columbia'),('6fa8fd9a93ce6b23edcc8546a9001793','US','Washington'),('702f71beaebf1a4014e2975fb3dbc7c7','US','North Dakota'),('70c20b7496b085b43a61946ff2150f11','US','Virginia'),('7128170b69078903b7b8153a93e56dbe','US','Montana'),('75c0f310c128c422ced6bc5246799e07','US','Ohio'),('7c15b56c8ee24a1ea180f6ed3c10663c','US','Arkansas'),('80d349edbbbdc02a4c14e7faf6a829b0','CA','Prince Edward Island'),('863e38b0d3e2283c0f3f016b4c3e91c8','CA','Saskatchewan'),('8afafe3e7d51a206681b8fc5a2271416','US','New Hampshire'),('8b40e3352a981844e81ec3251edb8d8d','US','Idaho'),('8e03c86208b2fed9bd4ddbcaba35b1ae','US','West Virginia'),('90432cfc4175c1d22111c1c5ef654f10','US','Nevada'),('97631d1282ad30214ea1db60de722938','US','New York'),('986e3cb2bf6fe840b1b6adabba11bfdb','CA','Ontario'),('99a5b310400936ca1beba9c69da9c09f','CA','Quebec'),('a2507ceaaaba6f22a92e5b367823433b','US','Florida'),('a42d97dbb66ead19a9657f2a3e102b94','US','Missouri'),('a7a7f979775b13c35d17fe3285f4a0f1','US','Delaware'),('a912bd4554fd8cd63c19fc6c5bfdeecd','US','Nebraska'),('b1dbc21f750be2daae62bd9f71012a60','US','Indiana'),('b38ad6c6649677c3cee06a948e4d2d51','US','Illinois'),('b9b0d2075a56aac960a64f29cb3cd681','US','New Mexico'),('bc73ee3acb90a84d6eede8dcec20c279','US','Pennsylvania'),('c180173d78c5c60a8f1f02b8c6cd5720','US','Connecticut'),('c497bed0059414e61eb4cd7d188c965e','US','Massachusetts'),('c675459f1f5838b2226f8d3cd6195e1c','US','Maine'),('c8b8cfefd7240452b62ebe77c300b9ad','US','Texas'),('cb5c3bf74e96c9934c07031e52ae7d2e','US','Alaska'),('d26a4e15f4dd9a84e4d8e2f86b4f1639','US','Vermont'),('d6cbf898f832c04ccff7649518869b84','US','Wyoming'),('d81e1467e4544c09d95a733c166a2be3','US','South Dakota'),('da92b4d41a19e66e312377792378f34a','US','North Carolina'),('dad7f5c7953995636a694bcb3ae2bac2','US','Georgia'),('dd44e7f8502fdcfb8dec3fd26a0b10a0','US','Kansas'),('df0f07537a22afd0dbd2f0063060b99e','CA','Newfoundland and Labrador'),('e13938988de6db5afdb5d4767054f132','US','California'),('e7f48217d87c5b325fd6299bea8637e8','US','Tennessee'),('f084be435c5c81939702e906e29876fb','US','Oklahoma'),('f0e453f02a1fea066ef22df4aab5ab10','US','District of Columbia'),('f2c7fd509e98da573b5a0c21d8c5a39f','US','Louisiana'),('f6334ff296a24ad99cd9c998822a7c3b','US','Hawaii'),('f9c144cdac2f20e2dd1343229457a393','US','Arizona');
/*!40000 ALTER TABLE `Provinces_States` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Shipping_Carriers`
--

LOCK TABLES `Shipping_Carriers` WRITE;
/*!40000 ALTER TABLE `Shipping_Carriers` DISABLE KEYS */;
/*!40000 ALTER TABLE `Shipping_Carriers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `customerOtpTable`
--

LOCK TABLES `customerOtpTable` WRITE;
/*!40000 ALTER TABLE `customerOtpTable` DISABLE KEYS */;
/*!40000 ALTER TABLE `customerOtpTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `otpTable`
--

LOCK TABLES `otpTable` WRITE;
/*!40000 ALTER TABLE `otpTable` DISABLE KEYS */;
/*!40000 ALTER TABLE `otpTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `powerUsers`
--

LOCK TABLES `powerUsers` WRITE;
/*!40000 ALTER TABLE `powerUsers` DISABLE KEYS */;
INSERT INTO `powerUsers` VALUES ('c1aa67c5-ab7d-11ef-92a9-0242ac110002','juniorhoza56@gmail.com','$2b$10$ksGTrtCJ4NCjqcYwar5vh.sW0lBLGlVY5TlJ8oVwVducQ13/YixcO','super_admin'),('c1aa759a-ab7d-11ef-92a9-0242ac110002','franklinwebdev704@gmail.com','$2b$10$ksGTrtCJ4NCjqcYwar5vh.sW0lBLGlVY5TlJ8oVwVducQ13/YixcO','super_admin');
/*!40000 ALTER TABLE `powerUsers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-26  0:40:21
