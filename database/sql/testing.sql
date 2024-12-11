
--
-- Table structure for table `Book_Reviews`
--
use hockshi;

DROP TABLE IF EXISTS `Book_Reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Book_Reviews` (
  `review_id` varchar(64) NOT NULL,
  `book_id` varchar(64) NOT NULL,
  `customer_id` varchar(64) NOT NULL,
  `rating` varchar(64) NOT NULL,
  `review_text` text DEFAULT NULL,
  `review_date` date NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `book_id` (`book_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `Book_Reviews_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `Books` (`book_id`),
  CONSTRAINT `Book_Reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Book_Reviews`
--

LOCK TABLES `Book_Reviews` WRITE;
/*!40000 ALTER TABLE `Book_Reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `Book_Reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Books`
--

DROP TABLE IF EXISTS `Books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Books` (
  `book_id` varchar(64) NOT NULL,
  `title` varchar(512) NOT NULL,
  `author` varchar(256) NOT NULL,
  `ISBN` varchar(32) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `publication_date` date DEFAULT NULL,
  `language` varchar(64) DEFAULT NULL,
  `cover_image_url` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`book_id`),
  UNIQUE KEY `ISBN` (`ISBN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Books`
--

LOCK TABLES `Books` WRITE;
/*!40000 ALTER TABLE `Books` DISABLE KEYS */;
INSERT INTO `Books` VALUES ('00e0f6a58952dcc1ffa8b24e70d05e89','LLC or Corporation?','Anthony Mancuso','9781413328004','No description available',35.00,NULL,NULL,''),('2cebacb6ebead74e807d2f738081ffcb','Oh, the places you\'ll go!','Dr. Seuss','0679805273','Advice in rhyme for proceeding in life; weathering fear, loneliness, and confusion; and being in charge of your actions.',12.00,NULL,NULL,'https://covers.openlibrary.org/b/id/423771-M.jpg'),('42f21078fe73c24641aff796e8c03323','Transforming professional development into student results','Douglas B. Reeves','9781416609490','No description available',19.00,NULL,NULL,'https://covers.openlibrary.org/b/id/6721304-M.jpg'),('6216d3a41653d3f969f5dbab6dbd75be','Lunch Money (Rise and Shine)','Andrew Clements','9780689866852','No description available',5.00,NULL,NULL,'https://covers.openlibrary.org/b/id/8741740-M.jpg'),('65c2b47a70ebfcf5433620a29e4c9d04','How to break up with your phone','Catherine Price','9780399581120','\"Award-winning journalist Catherine Price presents a practical, hands-on plan to break up -- and then make up -- with your phone. The goal? A long-term relationship that actually feels good. You\'ll discover how phones and apps are designed to be addictive and how the time we spend on them damages our abilities to focus, think deeply, and form new memories. You\'ll then make customized changes to your settings, apps, environment, and mindset that will enable you to take back control of your life -- both on your phone and off.\"--Back cover.',8.00,NULL,NULL,'https://covers.openlibrary.org/b/id/13160188-M.jpg'),('697bed51542154d3627d3111df750fa6','Enhancing the Postdoctoral Experience','National Academy of Sciences U.S.','9780309069960','No description available',66.00,NULL,NULL,'https://covers.openlibrary.org/b/id/2362604-M.jpg'),('86ef4d77cfa6e7cea4afff9a5ca66f3b','Growing Great Employees','Erika Andersen','9781591841906','No description available',35.00,NULL,NULL,'https://covers.openlibrary.org/b/id/1977235-M.jpg'),('916e645416b4f0103e1d56ee09a4c39e','Adviser, Teacher, Role Model, Friend','National Academy of Sciences U.S.','9780309063630','No description available',45.00,NULL,NULL,'https://covers.openlibrary.org/b/id/2362262-M.jpg'),('9fae2b168156306e50d3062db27cc82e','Last Woman Standing','Amy Gentry','9780358108535','No description available',6.00,NULL,NULL,''),('b20fcc7b3ae1319cdadd96e39059b4a9','Christmas Comes to Morning Star','Charlotte Hubbard','9781420151831','No description available',9.00,NULL,NULL,'https://covers.openlibrary.org/b/id/12397403-M.jpg'),('ce29c94d7cf1f075614d6a58a6088e4f','Whole','T. Colin Campbell','9781937856243','\"The China Study\" revealed what we should eat and provided the powerful empirical support for this answer. \"Whole\" answers the question of why. Why does a whole-food, plant-based diet provide optimal nutrition? \"Whole\" demonstrates how far the scientific reductionism of the nutrition orthodoxy has gotten offtrack and reveals the elegant wonders of the true holistic workings of nutrition, from the cellular level to the operation of the entire organism.',5.00,NULL,NULL,'https://covers.openlibrary.org/b/id/12647639-M.jpg'),('db3a1093221dfe60d86ba08f4ea4bb58','Serious Cryptography','Jean-Philippe Aumasson','9781593278267','No description available',25.00,NULL,NULL,'https://covers.openlibrary.org/b/id/8232506-M.jpg'),('ea48a2e9581949fb9813f2c83b07521d','Good Girl\'s Guide to Rakes','Eva Leigh','9780063086272','No description available',7.00,NULL,NULL,'https://covers.openlibrary.org/b/id/12723049-M.jpg');
/*!40000 ALTER TABLE `Books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Countries`
--

DROP TABLE IF EXISTS `Countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Countries` (
  `country_code` varchar(4) NOT NULL,
  `country_name` varchar(128) NOT NULL,
  PRIMARY KEY (`country_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Countries`
--

LOCK TABLES `Countries` WRITE;
/*!40000 ALTER TABLE `Countries` DISABLE KEYS */;
INSERT INTO `Countries` VALUES ('CA','Canada'),('US','United States');
/*!40000 ALTER TABLE `Countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customers`
--

DROP TABLE IF EXISTS `Customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customers` (
  `customer_id` char(36) NOT NULL DEFAULT uuid(),
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `email` varchar(64) NOT NULL,
  `password` varchar(256) DEFAULT NULL,
  `guest` tinyint(1) DEFAULT 0,
  `street_address` varchar(256) DEFAULT NULL,
  `city` varchar(128) DEFAULT NULL,
  `state_province` varchar(128) DEFAULT NULL,
  `country` varchar(128) DEFAULT NULL,
  `postal_zipcode` varchar(32) DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customers`
--

LOCK TABLES `Customers` WRITE;
/*!40000 ALTER TABLE `Customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `Customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Genres`
--

DROP TABLE IF EXISTS `Genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Genres` (
  `genre_id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`genre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Genres`
--

LOCK TABLES `Genres` WRITE;
/*!40000 ALTER TABLE `Genres` DISABLE KEYS */;
INSERT INTO `Genres` VALUES ('1','Science'),('2','Fiction'),('3','Non-Fiction');
/*!40000 ALTER TABLE `Genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Inventory`
--

DROP TABLE IF EXISTS `Inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Inventory` (
  `book_id` varchar(64) NOT NULL,
  `quantity_available` int(11) NOT NULL,
  `location` varchar(256) NOT NULL,
  PRIMARY KEY (`book_id`),
  CONSTRAINT `Inventory_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `Books` (`book_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Inventory`
--

LOCK TABLES `Inventory` WRITE;
/*!40000 ALTER TABLE `Inventory` DISABLE KEYS */;
INSERT INTO `Inventory` VALUES ('00e0f6a58952dcc1ffa8b24e70d05e89',10,'warehouse'),('2cebacb6ebead74e807d2f738081ffcb',10,'warehouse'),('42f21078fe73c24641aff796e8c03323',10,'warehouse'),('6216d3a41653d3f969f5dbab6dbd75be',10,'warehouse'),('65c2b47a70ebfcf5433620a29e4c9d04',10,'warehouse'),('697bed51542154d3627d3111df750fa6',10,'warehouse'),('86ef4d77cfa6e7cea4afff9a5ca66f3b',10,'warehouse'),('916e645416b4f0103e1d56ee09a4c39e',10,'warehouse'),('9fae2b168156306e50d3062db27cc82e',10,'warehouse'),('b20fcc7b3ae1319cdadd96e39059b4a9',10,'warehouse'),('ce29c94d7cf1f075614d6a58a6088e4f',10,'warehouse'),('db3a1093221dfe60d86ba08f4ea4bb58',10,'warehouse'),('ea48a2e9581949fb9813f2c83b07521d',10,'warehouse');
/*!40000 ALTER TABLE `Inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order_Items`
--

DROP TABLE IF EXISTS `Order_Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order_Items` (
  `order_item_id` varchar(64) DEFAULT NULL,
  `order_id` varchar(64) NOT NULL,
  `book_id` varchar(64) NOT NULL,
  `quantity` int(11) NOT NULL,
  `item_price` decimal(16,2) NOT NULL,
  `subtotal` decimal(16,2) NOT NULL,
  KEY `order_id` (`order_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `Order_Items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`),
  CONSTRAINT `Order_Items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `Books` (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order_Items`
--

LOCK TABLES `Order_Items` WRITE;
/*!40000 ALTER TABLE `Order_Items` DISABLE KEYS */;
/*!40000 ALTER TABLE `Order_Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `order_id` varchar(64) NOT NULL,
  `customer_id` varchar(64) NOT NULL,
  `order_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('Pending','Paid','Cancelled') NOT NULL,
  `shipping_address` varchar(256) NOT NULL,
  `shipping_city` varchar(128) NOT NULL,
  `shipping_state_province` varchar(128) NOT NULL,
  `shipping_country` varchar(128) NOT NULL,
  `shipping_postal_code` varchar(32) NOT NULL,
  `delivery_status` enum('Processing','Shipped','Delivered') NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payment` (
  `payment_id` varchar(64) NOT NULL,
  `order_id` varchar(64) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` varchar(128) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_id` varchar(128) NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `Payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payment`
--

LOCK TABLES `Payment` WRITE;
/*!40000 ALTER TABLE `Payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `product_id` varchar(36) NOT NULL DEFAULT uuid(),
  `name` varchar(512) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `product_image_url` varchar(1024) DEFAULT NULL,
  `category` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `category` (`category`),
  CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`category`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Promotions`
--

DROP TABLE IF EXISTS `Promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Promotions` (
  `promo_id` varchar(64) NOT NULL,
  `promo_code` varchar(64) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`promo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Promotions`
--

LOCK TABLES `Promotions` WRITE;
/*!40000 ALTER TABLE `Promotions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Provinces_States`
--

DROP TABLE IF EXISTS `Provinces_States`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Provinces_States` (
  `province_state_id` varchar(64) NOT NULL,
  `country_code` varchar(4) NOT NULL,
  `province_state_name` varchar(128) NOT NULL,
  PRIMARY KEY (`province_state_id`),
  KEY `country_code` (`country_code`),
  CONSTRAINT `Provinces_States_ibfk_1` FOREIGN KEY (`country_code`) REFERENCES `Countries` (`country_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Provinces_States`
--

LOCK TABLES `Provinces_States` WRITE;
/*!40000 ALTER TABLE `Provinces_States` DISABLE KEYS */;
INSERT INTO `Provinces_States` VALUES ('0092279df2efd57c511570d1a92bfeb7','US','California'),('00c3dee32892bf30d1cb7be3e8665386','US','Washington'),('00ca038c48aa86994d67289cc9d900d9','US','Michigan'),('02132005a490ff931180c640ae7b14ac','US','South Dakota'),('039eb7f34b681c0c8dc633231f29d749','US','Kansas'),('0600e958af0bbeb836a96d48b68c5c0b','US','Oklahoma'),('06b74bd114babbe2e4d8d40b79ce8bb5','US','Missouri'),('076e6365240213ea952763fd7f6f8137','US','Georgia'),('0793a846fa8c57205edfbb954d9214bf','US','Texas'),('0ac6d09f252faae3b8cdaf9eea43d617','CA','Alberta'),('0d76a5ff59dc20fb521ac4ecaa8482e0','US','Massachusetts'),('11de86900781491147512b5c4df8359b','US','Rhode Island'),('12c863e4a661613f9f8b2636a62acc26','US','Delaware'),('13e854b2eee16e7b90311015ddef3928','US','Florida'),('15ad35e82a01336c1eb9b56c2e01dafd','CA','Newfoundland and Labrador'),('172257a42c1978316c370ebc7d1d97c6','US','Wisconsin'),('1df921f0b250421e4ff74c822b3e005b','US','Idaho'),('22e0d352ab901afc82abdaf866536ba7','US','New Mexico'),('2523eaa2f894bf8792e189860c75a0ed','CA','Saskatchewan'),('2b558d3b0d87014fef8f19a3dc9b600e','US','Arizona'),('33c92bcb2bbd289c7ac8d97a6b6b7726','US','Illinois'),('3f41c9d19376a209314c82dbcdf20d56','CA','Quebec'),('3f888815e5a03c9efae8bcc663d8a873','US','West Virginia'),('3feb624580f85a422b0fa142465924b0','CA','Nunavut'),('40e57b447cb4d707e71788655724868b','US','Utah'),('4d7110c5c1fc5dc637b4634751a68f64','US','Virginia'),('5839b3ca318b5f8f6d90f839edada883','US','Minnesota'),('62adf57c75dc5ebd06edd4bf5b290914','US','North Dakota'),('6330d15530df770262d5ff6003e56054','US','Ohio'),('68114724638239ae4f523d97d5dffdf8','US','Pennsylvania'),('74d573b7f41719a9dda2deadd20359a3','US','New Hampshire'),('77c34297f5371a2102506b3a85c80456','US','Iowa'),('831ffcf610a32dec9d13993fb0801243','US','North Carolina'),('8632a6ac2494a04a6b1854e6aefcb78f','US','Alaska'),('898e2ae37e1aa9efa0ee9fe6f9eaa9d7','US','Wyoming'),('8baad3408398866641eda79cfacca2b2','CA','Ontario'),('99e46325b088bcb8d74314e508b840c9','CA','Northwest Territories'),('9f73e185401b8b1c75498b3463419b5b','US','Maryland'),('a0f337d8c41f8b1fc877d1348698e722','US','Vermont'),('a4be5a85f50d7e69ce9dee9b1bd7cd26','CA','Yukon'),('a860b24533aeb8fb4afcb3e590a48215','US','Louisiana'),('b0765e983a72a8d621e11829ffc00183','CA','British Columbia'),('b14b5388173c5c50f887da78d85210ac','US','Mississippi'),('b3230f0ea361d7d62c29d3cc70155dd6','US','Maine'),('b4e9d33c7be8ac355eec0347305736e3','US','Oregon'),('c157173d4a01143347861b234311ca34','US','Arkansas'),('c18119fd785ef01e4210d18abadc2bbd','US','New York'),('c250d689a4e0bf3bba51767173940528','US','Hawaii'),('c8238ef4df056c0d6d0ffe91c47ef4cc','US','South Carolina'),('c8ab4af4c64be2861dd21a073c23c9bf','US','Kentucky'),('cc4aedba9c1e8eacc2cd72679b1117c8','CA','Manitoba'),('cdd8e4878faf38821ae2a697dc174913','US','Connecticut'),('d5b944fbb6fd52a8bb0836367444f421','US','Nebraska'),('d681da1259d70420ef5776fb586ec433','US','Indiana'),('dbc21472388847356dfd6a1937142433','CA','Prince Edward Island'),('e0288c3411c885f74ef06c04a89e8884','CA','Nova Scotia'),('e48ae9adc0b56c9cffc1e3d6ca2d9c60','US','Alabama'),('e586a93320fc373eef925922179938ae','US','Nevada'),('ed5cbaad58c423ab9aa6a60a0b1523c6','US','Montana'),('ef54a231c7d67bed6f286c543a425c36','US','District of Columbia'),('fc089ab4b34bac3de77721eb4b95a441','US','Colorado'),('fca9a44b3fb37c63e21fdfd8d140ea75','CA','New Brunswick'),('fcd93f197c0d994a80d4d4918a5c8878','US','New Jersey'),('ff4c6a20ccec098011dc0b8e36da0bb2','US','Tennessee');
/*!40000 ALTER TABLE `Provinces_States` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `SecureCustomerOrders`
--

DROP TABLE IF EXISTS `SecureCustomerOrders`;
/*!50001 DROP VIEW IF EXISTS `SecureCustomerOrders`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `SecureCustomerOrders` AS SELECT 
 1 AS `order_id`,
 1 AS `order_date`,
 1 AS `total_amount`,
 1 AS `delivery_status`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `SecureCustomers`
--

DROP TABLE IF EXISTS `SecureCustomers`;
/*!50001 DROP VIEW IF EXISTS `SecureCustomers`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `SecureCustomers` AS SELECT 
 1 AS `customer_id`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `street_address`,
 1 AS `city`,
 1 AS `state_province`,
 1 AS `country`,
 1 AS `postal_zipcode`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `SecureInventory`
--

DROP TABLE IF EXISTS `SecureInventory`;
/*!50001 DROP VIEW IF EXISTS `SecureInventory`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `SecureInventory` AS SELECT 
 1 AS `book_id`,
 1 AS `title`,
 1 AS `author`,
 1 AS `description`,
 1 AS `price`,
 1 AS `quantity_available`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Shipping_Carriers`
--

DROP TABLE IF EXISTS `Shipping_Carriers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Shipping_Carriers` (
  `carrier_id` varchar(64) NOT NULL,
  `carrier_name` varchar(128) NOT NULL,
  `tracking_url` varchar(512) NOT NULL,
  PRIMARY KEY (`carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Shipping_Carriers`
--

LOCK TABLES `Shipping_Carriers` WRITE;
/*!40000 ALTER TABLE `Shipping_Carriers` DISABLE KEYS */;
/*!40000 ALTER TABLE `Shipping_Carriers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` varchar(36) NOT NULL DEFAULT uuid(),
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customerOtpTable`
--

DROP TABLE IF EXISTS `customerOtpTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customerOtpTable` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `otp` varchar(255) DEFAULT NULL,
  `expiration_time` datetime DEFAULT NULL,
  `customerId` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `customerOtpTable_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `Customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerOtpTable`
--

LOCK TABLES `customerOtpTable` WRITE;
/*!40000 ALTER TABLE `customerOtpTable` DISABLE KEYS */;
/*!40000 ALTER TABLE `customerOtpTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otpTable`
--

DROP TABLE IF EXISTS `otpTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otpTable` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `otp` varchar(255) DEFAULT NULL,
  `expiration_time` datetime DEFAULT NULL,
  `powerUserId` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `powerUserId` (`powerUserId`),
  CONSTRAINT `otpTable_ibfk_1` FOREIGN KEY (`powerUserId`) REFERENCES `powerUsers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otpTable`
--

LOCK TABLES `otpTable` WRITE;
/*!40000 ALTER TABLE `otpTable` DISABLE KEYS */;
/*!40000 ALTER TABLE `otpTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `powerUsers`
--

DROP TABLE IF EXISTS `powerUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `powerUsers` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('basic_admin','super_admin') NOT NULL DEFAULT 'basic_admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `powerUsers`
--

LOCK TABLES `powerUsers` WRITE;
/*!40000 ALTER TABLE `powerUsers` DISABLE KEYS */;
INSERT INTO `powerUsers` VALUES ('b42383b1-aba3-11ef-b29c-0242ac110002','juniorhoza56@gmail.com','$2b$10$ksGTrtCJ4NCjqcYwar5vh.sW0lBLGlVY5TlJ8oVwVducQ13/YixcO','super_admin'),('b4239145-aba3-11ef-b29c-0242ac110002','franklinwebdev704@gmail.com','$2b$10$ksGTrtCJ4NCjqcYwar5vh.sW0lBLGlVY5TlJ8oVwVducQ13/YixcO','super_admin');
/*!40000 ALTER TABLE `powerUsers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `SecureCustomerOrders`
--

/*!50001 DROP VIEW IF EXISTS `SecureCustomerOrders`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `SecureCustomerOrders` AS select `Orders`.`order_id` AS `order_id`,`Orders`.`order_date` AS `order_date`,`Orders`.`total_amount` AS `total_amount`,`Orders`.`delivery_status` AS `delivery_status` from `Orders` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `SecureCustomers`
--

/*!50001 DROP VIEW IF EXISTS `SecureCustomers`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `SecureCustomers` AS select `Customers`.`customer_id` AS `customer_id`,`Customers`.`first_name` AS `first_name`,`Customers`.`last_name` AS `last_name`,`Customers`.`street_address` AS `street_address`,`Customers`.`city` AS `city`,`Customers`.`state_province` AS `state_province`,`Customers`.`country` AS `country`,`Customers`.`postal_zipcode` AS `postal_zipcode` from `Customers` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `SecureInventory`
--

/*!50001 DROP VIEW IF EXISTS `SecureInventory`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `SecureInventory` AS select `i`.`book_id` AS `book_id`,`b`.`title` AS `title`,`b`.`author` AS `author`,`b`.`description` AS `description`,`b`.`price` AS `price`,`i`.`quantity_available` AS `quantity_available` from (`Inventory` `i` left join `Books` `b` on(`i`.`book_id` = `b`.`book_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-26  4:05:59
