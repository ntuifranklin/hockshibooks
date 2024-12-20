/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.6.2-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: hockshidbdev
-- ------------------------------------------------------
-- Server version	11.6.2-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Book_Reviews`
--

DROP TABLE IF EXISTS `Book_Reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Books` (
  `book_id` varchar(64) NOT NULL,
  `title` varchar(512) NOT NULL,
  `seo_friendly_title` varchar(1024) NOT NULL,
  `author` varchar(256) NOT NULL,
  `ISBN` varchar(32) NOT NULL,
  `description` varchar(1536) NOT NULL,
  `book_condition` enum('New','Like New','Good','Fair','Poor') NOT NULL DEFAULT 'Like New',
  `format` enum('Hardcover','Paperback','Ebook') NOT NULL DEFAULT 'Paperback',
  `number_of_pages` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `publication_date` date DEFAULT NULL,
  `language` varchar(64) DEFAULT NULL,
  `cover_image_url` varchar(1024) DEFAULT NULL,
  `cover_image_url_small` varchar(1024) DEFAULT NULL,
  `cover_image_url_medium` varchar(1024) DEFAULT NULL,
  `cover_image_url_large` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`book_id`),
  UNIQUE KEY `ISBN` (`ISBN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Books`
--

LOCK TABLES `Books` WRITE;
/*!40000 ALTER TABLE `Books` DISABLE KEYS */;
INSERT INTO `Books` VALUES
('03b88b284b846a222b26610ef6500781','LLC or Corporation? How to Choose the Right Form for Your Business','llc-or-corporation-anthony-mancuso-9781413328004','Anthony Mancuso','9781413328004','LLC or Corporation? How to Choose the Right Form for Your Business by Anthony Mancuso is a practical guide designed to help entrepreneurs and small business owners make informed decisions about the legal structure of their businesses. The book provides clear, concise explanations of the key differences between Limited Liability Companies (LLCs) and Corporations, including factors like taxation, liability protection, management flexibility, and operational requirements.\nMancuso uses plain language to break down complex legal concepts, offering real-world examples, detailed comparisons, and checklists to help readers evaluate which structure best suits their needs. Topics covered include the pros and cons of each business entity, how to handle startup formalities, and strategies for protecting personal assets. Whether you\'re starting a new business or restructuring an existing one, this guide empowers you with the knowledge to choose a structure that aligns with your goals, minimizing risks and maximizing benefits.','Good','Paperback',296,9.99,'2020-01-01','English','llc-or-corporation-anthony-mancuso-9781413328004-large-cover.jpg','llc-or-corporation-anthony-mancuso-9781413328004-small-cover.jpg','llc-or-corporation-anthony-mancuso-9781413328004-medium-cover.jpg','llc-or-corporation-anthony-mancuso-9781413328004-large-cover.jpg'),
('174763f85d88946cd39622464e0a532c','The Whole: Rethinking the Science of Nutrition','whole-t-colin-campbell-9781937856243','T. Colin Campbell','9781937856243','The China Study revealed what we should eat and provided the powerful empirical support for this answer. \"Whole\" answers the question of why. Why does a whole-food, plant-based diet provide optimal nutrition? \"Whole\" demonstrates how far the scientific reductionism of the nutrition orthodoxy has gotten offtrack and reveals the elegant wonders of the true holistic workings of nutrition, from the cellular level to the operation of the entire organism.','Good','Paperback',328,9.68,'2013-01-01','English','https://covers.openlibrary.org/b/id/12647639-L.jpg','https://covers.openlibrary.org/b/id/12647639-S.jpg','https://covers.openlibrary.org/b/id/12647639-M.jpg','https://covers.openlibrary.org/b/id/12647639-L.jpg'),
('1cc7ae0ffe2654c00763e21f0e587f97','How to break up with your phone','how-to-break-up-with-your-phone-catherine-price-9780399581120','Catherine Price','9780399581120','Award-winning journalist Catherine Price presents a practical, hands-on plan to break up and then make up with your phone. The goal? A long-term relationship that actually feels good. You\'ll discover how phones and apps are designed to be addictive and how the time we spend on them damages our abilities to focus, think deeply, and form new memories. You\'ll then make customized changes to your settings, apps, environment, and mindset that will enable you to take back control of your life : both on your phone and off.\nThe book is a self-help book that offers practical advice for those seeking to reduce their dependence on smartphones. It combines scientific research with actionable strategies to help readers recognize the negative effects of excessive phone use and provides a step-by-step guide to regain control of their time. Through a mix of exercises, insights, and tips, Price encourages readers to break free from mindless scrolling and create healthier habits, fostering a more balanced and fulfilling life.','Good','Paperback',184,6.05,'2018-01-01','English','https://covers.openlibrary.org/b/id/13160188-L.jpg','https://covers.openlibrary.org/b/id/13160188-S.jpg','https://covers.openlibrary.org/b/id/13160188-M.jpg','https://covers.openlibrary.org/b/id/13160188-L.jpg'),
('4eb0e6c8ae771e9622f8b79fe4e9029f','Serious Cryptography: A Practical Introduction to Modern Encryption','serious-cryptography-jean-philippe-aumasson-9781593278267','Jean-Philippe Aumasson','9781593278267','Serious Cryptography: A Practical Introduction to Modern Encryption by Jean-Philippe Aumasson is an accessible yet detailed exploration of the principles and practices behind modern cryptography. Designed for readers with a technical background, the book covers the foundational concepts of encryption, providing insights into how cryptographic algorithms work and why they are secure.\nThe author explains complex topics such as symmetric encryption, public-key cryptography, hashing, digital signatures, and random number generation, with clarity and precision. Aumasson delves into real-world applications of cryptography, discussing protocols, attacks, and practical considerations that highlight the importance of secure implementations. The book also provides historical context and commentary on the evolution of cryptographic systems.\nWith its balance of theory and hands-on examples, *Serious Cryptography* is an invaluable resource for software developers, security professionals, and anyone interested in understanding the inner workings of encryption systems. Its practical approach ensures readers gain both the knowledge and the tools needed to apply cryptography securely in real-world scenarios.','Good','Paperback',312,13.89,'2017-11-01','English','https://covers.openlibrary.org/b/id/8232506-L.jpg','https://covers.openlibrary.org/b/id/8232506-S.jpg','https://covers.openlibrary.org/b/id/8232506-M.jpg','https://covers.openlibrary.org/b/id/8232506-L.jpg'),
('58146e3b39b2ad96c8b268fdda267356','Last Woman Standing','last-woman-standing-amy-gentry-9780358108535','Amy Gentry','9780358108535','Last Woman Standing by Amy Gentry is a gripping psychological thriller that blends suspense, revenge, and dark humor. The story follows Dana Diaz, a stand-up comedian struggling to make a name for herself in the male-dominated comedy world of Austin, Texas. After a brutal encounter with sexism and harassment, Dana forms an unlikely bond with Amanda Dorn, a tech-savvy woman with her own traumatic past.\nAs their friendship deepens, Amanda proposes a pact: they will help each other take revenge on the men who have wronged them. Initially, the plan seems empowering, but as the acts of vengeance escalate, Dana begins to question Amanda’s true intentions and her grip on reality. With twists and turns that challenge perceptions of morality, trust, and justice, *Last Woman Standing* explores the darker sides of ambition and the consequences of retribution. It’s a sharp and thought-provoking novel that keeps readers guessing until the very end.','Good','Paperback',336,5.99,'2019-01-01','English','last-woman-standing-amy-gentry-9780358108535-large-cover.jpg','last-woman-standing-amy-gentry-9780358108535-small-cover.jpg','last-woman-standing-amy-gentry-9780358108535-medium-cover.jpg','last-woman-standing-amy-gentry-9780358108535-large-cover.jpg'),
('58b8eac08d738216aa904b80d45c1f9e','Christmas Comes to Morning Star','christmas-comes-to-morning-star-charlotte-hubbard-9781420151831','Charlotte Hubbard','9781420151831','Christmas Comes to Morning Star by Charlotte Hubbard is a heartwarming Amish holiday romance set in the close-knit community of Morning Star, Missouri. The story revolves around the lives of two main characters, Esther and Jeb, as they navigate the challenges of faith, family, and love during the Christmas season. Esther, a kind-hearted Amish woman, is struggling with the loss of her parents and the weight of running the family farm. Jeb, a widowed father, returns to Morning Star to start fresh, but he finds his heart tugged by Esther’s strength and warmth. As Christmas approaches, both Esther and Jeb must overcome their personal fears and the lingering scars of their pasts to open their hearts to the love and joy that the holiday season can bring. Filled with themes of community, forgiveness, and second chances, *Christmas Comes to Morning Star* is a sweet, uplifting tale of love blossoming amid the peaceful simplicity of Amish life.','Good','Paperback',0,8.79,'2021-01-01','English','https://covers.openlibrary.org/b/id/12397403-L.jpg','https://covers.openlibrary.org/b/id/12397403-S.jpg','https://covers.openlibrary.org/b/id/12397403-M.jpg','https://covers.openlibrary.org/b/id/12397403-L.jpg'),
('74d9ac32f1123501cad04cf59af00018','Growing Great Employees','growing-great-employees-erika-andersen-9781591841906','Erika Andersen','9781591841906','Growing Great Employees: Turning Ordinary People into Extraordinary Performers is a book by Erika Anderson, published in 2010. The book focuses on how managers and leaders can foster the development of their employees, transforming them into high-performing individuals. Anderson presents practical strategies for managers to help their employees grow professionally by providing the right kind of feedback, support, and opportunities for development.\nThe key idea in the book is that great employees aren’t born—they’re made through thoughtful, proactive leadership. Anderson emphasizes that effective management involves not just oversight but active participation in the growth of employees, helping them reach their full potential through personalized development.\nThe ISBN-13 for the book is **978-0814416523**. It is a helpful resource for leaders and managers looking to improve team performance by focusing on employee development and creating an environment that nurtures growth.','Good','Paperback',304,7.39,'2007-12-18','English','https://covers.openlibrary.org/b/id/1977235-L.jpg','https://covers.openlibrary.org/b/id/1977235-S.jpg','https://covers.openlibrary.org/b/id/1977235-M.jpg','https://covers.openlibrary.org/b/id/1977235-L.jpg'),
('77a9d51f79fe60f38af743412f521c07','Good Girl\'s Guide to Rakes','good-girls-guide-to-rakes-eva-leigh-9780063086272','Eva Leigh','9780063086272','*The Good Girl\'s Guide to Rakes* by Eva Leigh is a charming historical romance that blends wit, passion, and a touch of rebellion. Set in Regency-era London, the story follows Lady Grace Wyatt, a proper young woman who has always adhered to society\'s strict rules. However, her world is turned upside down when she crosses paths with the infamous and charismatic rake, Tristan, the Duke of Rothbury. Despite their differences, Tristan\'s magnetic presence and Grace’s growing desire for adventure push them into a passionate and unexpected affair. As Grace and Tristan navigate their contrasting worlds, their chemistry builds, challenging both their beliefs about love, duty, and freedom. With themes of personal growth, love beyond societal expectations, and the transformative power of breaking free from convention, *The Good Girl\'s Guide to Rakes* is a captivating story of a woman’s journey toward embracing her desires and defying tradition for the sake of love.','Good','Paperback',0,9.78,'2022-01-01','English','https://covers.openlibrary.org/b/id/12723049-L.jpg','https://covers.openlibrary.org/b/id/12723049-S.jpg','https://covers.openlibrary.org/b/id/12723049-M.jpg','https://covers.openlibrary.org/b/id/12723049-L.jpg'),
('95c24aa6852153af3aaa06198088045e','Naya Nuki: Shoshoni Girl Who Ran','naya-nuki-kenneth-thomasma-9781880114001','Kenneth Thomasma','9781880114001','Naya Nuki: Shoshoni Girl Who Ran (ISBN: 9781880114001) is a historical novel written by Kenneth Thomasma. It tells the story of Naya Nuki, a young Shoshoni girl who, in the early 1800s, is captured by a group of Hidatsa warriors. After her capture, she manages to escape and embarks on a remarkable journey across the wilderness in an effort to reunite with her tribe. The novel follows her determination, bravery, and survival skills as she faces the challenges of the natural world and encounters various tribes. It is an inspiring tale of courage and resilience.','Good','Paperback',175,7.89,'2000-04-01','English','https://covers.openlibrary.org/b/id/926325-L.jpg','https://covers.openlibrary.org/b/id/926325-S.jpg','https://covers.openlibrary.org/b/id/926325-M.jpg','https://covers.openlibrary.org/b/id/926325-L.jpg'),
('d1a747b08743a5d18053e0e5c114c158','Oh, the places you\'ll go!','oh-the-places-youll-go-dr-seuss-0679805273','Dr. Seuss','0679805273','\"Oh, the Places You\'ll Go!\" by Dr. Seuss is an uplifting and whimsical tale that celebrates life’s journey and its inevitable ups and downs. The story follows an unnamed protagonist as they embark on an adventure filled with excitement, challenges, and uncertainty. Through playful rhymes and vibrant illustrations, Dr. Seuss explores themes of ambition, resilience, and self-discovery. The book encourages readers to embrace change, take risks, and persevere through obstacles like loneliness, confusion, and fear. It acknowledges moments of setbacks—like the dreaded \"Waiting Place\" where nothing seems to happen—but reassures readers that they have the ability to overcome difficulties and achieve great things. Ultimately, it’s a heartwarming reminder that life is full of possibilities, and with determination and an open heart, there are no limits to what one can achieve. Loved by readers of all ages, this timeless classic serves as a popular gift for graduations and life milestones, inspiring confidence and hope for the future.','Good','Paperback',48,8.26,'1990-01-01','English','https://covers.openlibrary.org/b/id/423771-L.jpg','https://covers.openlibrary.org/b/id/423771-S.jpg','https://covers.openlibrary.org/b/id/423771-M.jpg','https://covers.openlibrary.org/b/id/423771-L.jpg'),
('d22a87459b8289c75b6f47472bcc5318','Enhancing the Postdoctoral Experience','enhancing-the-postdoctoral-experience-national-academy-of-sciences-us-9780309069960','National Academy of Sciences U.S.','9780309069960','Enhancing the Postdoctoral Experience by the National Academy of Sciences is a comprehensive report that explores the challenges and opportunities faced by postdoctoral researchers in the United States. The report emphasizes the importance of improving the postdoctoral experience to enhance scientific discovery and support career development. It addresses the evolving role of postdocs in academia, industry, and other sectors, highlighting issues such as mentorship, career guidance, compensation, and work-life balance. The document provides recommendations for institutions, funding agencies, and policymakers to foster a more supportive and equitable environment for postdoctoral scholars. By focusing on career development, skill-building, and professional networking, the report aims to elevate the status and impact of postdoctoral researchers, ultimately contributing to a stronger, more sustainable research ecosystem. It underscores the need for structural changes to ensure postdocs are well-prepared for the next steps in their careers, whether in academia or beyond.','Good','Paperback',105,13.99,'2000-09-01','English','https://covers.openlibrary.org/b/id/2362604-L.jpg','https://covers.openlibrary.org/b/id/2362604-S.jpg','https://covers.openlibrary.org/b/id/2362604-M.jpg','https://covers.openlibrary.org/b/id/2362604-L.jpg'),
('d9412f53ae33c8fe99d4e3cbbf97cad1','Lean In For Graduates','lean-in-for-graduates-sheryl-sandberg-9780385353670','Sheryl Sandberg','9780385353670','Lean In for Graduates by Sheryl Sandberg is an empowering guide aimed at helping recent graduates navigate the complexities of the professional world, particularly for women. Based on Sandberg\'s original bestselling book *Lean In*, this edition is specifically tailored to address the challenges young women face as they start their careers. It offers practical advice on how to take on leadership roles, build confidence, negotiate salary, and deal with workplace bias. Sandberg encourages women to \"lean in\" to opportunities and take ownership of their careers, providing insights into balancing ambition with personal life and fostering supportive relationships in the workplace. Through a mix of personal stories, research, and actionable tips, the book inspires graduates to challenge societal expectations, embrace their ambitions, and build a path to success while overcoming obstacles in male-dominated fields. Ultimately, *Lean In for Graduates* serves as a motivational tool for young women to build a strong foundation for their careers.','Good','Paperback',406,11.49,'2014-01-01','English','https://covers.openlibrary.org/b/id/7852100-L.jpg','https://covers.openlibrary.org/b/id/7852100-S.jpg','https://covers.openlibrary.org/b/id/7852100-M.jpg','https://covers.openlibrary.org/b/id/7852100-L.jpg'),
('dbed93d2ad7c739ff1eb527afb701ff0','Learning Selenium Testing Tools with Python','learning-selenium-testing-tools-with-python-unmesh-gundecha-9781783983506','Unmesh Gundecha','9781783983506','No description available','Good','Paperback',216,8.45,'2014-12-30','English','learning-selenium-testing-tools-with-python-unmesh-gundecha-9781783983506-large-cover.jpg','learning-selenium-testing-tools-with-python-unmesh-gundecha-9781783983506-small-cover.jpg','learning-selenium-testing-tools-with-python-unmesh-gundecha-9781783983506-medium-cover.jpg','learning-selenium-testing-tools-with-python-unmesh-gundecha-9781783983506-large-cover.jpg'),
('e2ebddddcdaef4cd209308f51cfdb598','Lunch Money','lunch-money-rise-and-shine-andrew-clements-9780689866852','Andrew Clements','9780689866852','Lunch Money by Andrew Clements is a clever and humorous middle-grade novel that explores entrepreneurship, competition, and collaboration. The story centers around Greg Kenton, a sixth-grader with a knack for earning money and an entrepreneurial spirit. Greg discovers that selling miniature comic books, called Chunky Comics, to his classmates could be a profitable venture. However, his business faces unexpected challenges, including a rivalry with his classmate Maura Shaw, who starts her own comic book enterprise. \nAs their competition heats up, school rules, ethical dilemmas, and personal conflicts arise. Eventually, Greg and Maura realize that working together might be more rewarding than competing, and they join forces to make their comic book business successful. Through engaging dialogue and relatable characters, Andrew Clements weaves an entertaining story that emphasizes teamwork, creativity, and the value of learning from others. Lunch Money is both a fun read and an insightful look at the dynamics of entrepreneurship and friendship.','Good','Paperback',222,6.99,'2007-06-26','English','https://covers.openlibrary.org/b/id/8741740-L.jpg','https://covers.openlibrary.org/b/id/8741740-S.jpg','https://covers.openlibrary.org/b/id/8741740-M.jpg','https://covers.openlibrary.org/b/id/8741740-L.jpg'),
('ee1791d35fe1dcee8126db3254d478e2','The Essential fundraising handbook for small nonprofits','the-essential-fundraising-handbook-for-small-nonprofits-betsy-baker-9780989600804','Betsy Baker','9780989600804','No description available','Good','Paperback',269,6.99,'2014-01-01','English','https://covers.openlibrary.org/b/id/12597440-L.jpg','https://covers.openlibrary.org/b/id/12597440-S.jpg','https://covers.openlibrary.org/b/id/12597440-M.jpg','https://covers.openlibrary.org/b/id/12597440-L.jpg'),
('f806a7102c92400b8b0044f643ac60b3','Transforming professional development into student results','transforming-professional-development-into-student-results-douglas-b-reeves-9781416609490','Douglas B. Reeves','9781416609490','Transforming Professional Development into Student Results is a book by Douglas B. Reeves, published in 2008. This book focuses on how schools and educators can turn professional development (PD) efforts into tangible improvements in student performance. Reeves argues that for professional development to be effective, it must be directly tied to student outcomes and provide teachers with the tools and strategies they need to impact student learning.\nThe book provides practical strategies for transforming PD into real results by focusing on evidence-based practices, aligning teacher development with curriculum goals, and creating a culture of continuous improvement. Reeves emphasizes the importance of ensuring that professional development is not just an isolated activity, but an ongoing process that engages teachers in reflection, collaboration, and the application of new skills in the classroom.\nWhile the ISBN-13 for the book is **978-1416606009**, it is generally used by educators and school leaders looking to make professional development a more impactful and results-driven endeavor.','Good','Paperback',0,9.34,'2010-01-01','English','https://covers.openlibrary.org/b/id/6721304-L.jpg','https://covers.openlibrary.org/b/id/6721304-S.jpg','https://covers.openlibrary.org/b/id/6721304-M.jpg','https://covers.openlibrary.org/b/id/6721304-L.jpg'),
('fbf4b2cdc0341672f468d484d7f082cd','Adviser, Teacher, Role Model, Friend','adviser-teacher-role-model-friend-national-academy-of-sciences-us-9780309063630','National Academy of Sciences U.S.','9780309063630','The book Adviser, Teacher, Role Model, Friend: On Being a Mentor to Students in Science and Engineering is published by the National Academy of Sciences. The ISBN-13 for this book is 978-0309070141.\nThis book offers guidance for mentors in science and engineering, emphasizing the crucial role of mentorship in the academic and professional development of students. It explores the responsibilities of being an adviser, teacher, role model, and friend to students, providing practical advice on how to support students in their academic journeys. The text is designed to help mentors understand their influence on the personal and professional growth of their students, and it highlights effective mentorship practices, ethical considerations, and the challenges and rewards of guiding young scientists.\nThe book is a valuable resource for anyone involved in mentoring students, offering insights into how to create a positive, supportive, and productive relationship with students in science and engineering fields.','Good','Paperback',96,12.41,'1997-07-23','English','https://covers.openlibrary.org/b/id/2362262-L.jpg','https://covers.openlibrary.org/b/id/2362262-S.jpg','https://covers.openlibrary.org/b/id/2362262-M.jpg','https://covers.openlibrary.org/b/id/2362262-L.jpg');
/*!40000 ALTER TABLE `Books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Countries`
--

DROP TABLE IF EXISTS `Countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
INSERT INTO `Countries` VALUES
('CA','Canada'),
('US','United States');
/*!40000 ALTER TABLE `Countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customers`
--

DROP TABLE IF EXISTS `Customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
INSERT INTO `Customers` VALUES
('bef83529ed50930af04dc874741dbb9c','Franklin Nkokam Ngongang','Franklin Nkokam Ngongang','ntuifranklin2005@gmail.com','',0,'10901 Little Patuxent Parkway','Columbia','MD','US','21044',NULL);
/*!40000 ALTER TABLE `Customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Genres`
--

DROP TABLE IF EXISTS `Genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
INSERT INTO `Genres` VALUES
('1','Science'),
('2','Fiction'),
('3','Non-Fiction');
/*!40000 ALTER TABLE `Genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Inventory`
--

DROP TABLE IF EXISTS `Inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
INSERT INTO `Inventory` VALUES
('03b88b284b846a222b26610ef6500781',1,'warehouse'),
('174763f85d88946cd39622464e0a532c',0,'warehouse'),
('1cc7ae0ffe2654c00763e21f0e587f97',1,'warehouse'),
('4eb0e6c8ae771e9622f8b79fe4e9029f',1,'warehouse'),
('58146e3b39b2ad96c8b268fdda267356',1,'warehouse'),
('58b8eac08d738216aa904b80d45c1f9e',1,'warehouse'),
('74d9ac32f1123501cad04cf59af00018',1,'warehouse'),
('77a9d51f79fe60f38af743412f521c07',1,'warehouse'),
('95c24aa6852153af3aaa06198088045e',1,'warehouse'),
('d1a747b08743a5d18053e0e5c114c158',1,'warehouse'),
('d22a87459b8289c75b6f47472bcc5318',1,'warehouse'),
('d9412f53ae33c8fe99d4e3cbbf97cad1',1,'warehouse'),
('dbed93d2ad7c739ff1eb527afb701ff0',1,'warehouse'),
('e2ebddddcdaef4cd209308f51cfdb598',1,'warehouse'),
('ee1791d35fe1dcee8126db3254d478e2',1,'warehouse'),
('f806a7102c92400b8b0044f643ac60b3',1,'warehouse'),
('fbf4b2cdc0341672f468d484d7f082cd',1,'warehouse');
/*!40000 ALTER TABLE `Inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order_Items`
--

DROP TABLE IF EXISTS `Order_Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
INSERT INTO `Order_Items` VALUES
('c6257e918ea0bb6ad0827b6141e995e5','a1366e41-51a8-4dbe-907f-d290387b9bcd','174763f85d88946cd39622464e0a532c',1,9.68,9.68);
/*!40000 ALTER TABLE `Order_Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
INSERT INTO `Orders` VALUES
('a1366e41-51a8-4dbe-907f-d290387b9bcd','bef83529ed50930af04dc874741dbb9c','2024-12-20',9.68,'Pending','10901 Little Patuxent Parkway Student Service Hall Rm 242','Columbia','MD','US','21044','Processing');
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
INSERT INTO `Payment` VALUES
('e01771c746a8efc539a13fc791b00214','a1366e41-51a8-4dbe-907f-d290387b9bcd','2024-12-20','card',9.68,'cs_test_a1om3QGoq1MzbuBpe9DsRqj4hydOxDuaDQxo5LPEwo52bPoX1eX3lSuvic');
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
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
INSERT INTO `Provinces_States` VALUES
('00803803e8847fa9c407b241e5f44441','US','District of Columbia'),
('09d4b1eb243d3674ebc943c80a5e01d2','US','Arizona'),
('0e0b62fa12846bd2780ffec2385861e0','US','Nevada'),
('195be49489400dd84a7ade4563302a56','US','Ohio'),
('1b01ac02d6e7936a5854ae91cf257874','US','Vermont'),
('1d5d58b126423bca5edae6ea5d20aac5','US','West Virginia'),
('1f4fa2696777632dd59e1e75eed20186','US','New Hampshire'),
('21cb23bf364f48febc19a01b8f8b817c','US','Missouri'),
('28c14e223f83133a8f4309eed504cf92','US','Mississippi'),
('305db7c0237ce1ef23a3db6691ec70d3','US','Kentucky'),
('38615c9f27d2b96e3689e8cded5500f3','US','Connecticut'),
('398dac3a13497c98bfc34579296f1038','US','Rhode Island'),
('3a5f6ffdf06b709cbdd62c2c3ca40212','US','New Mexico'),
('479c02e2ca1406f43f56991e48732538','CA','British Columbia'),
('4e09304b6a34916ed7e3525c3bf46054','CA','Manitoba'),
('508f9aa1a7338218893c237a8fb801ba','CA','Ontario'),
('53ef0730e3d4cfdea6f0da40e63ce0c1','US','Kansas'),
('560adbcbef4e386d8739ea9762c65005','US','Alaska'),
('5bc1b77470c5846e45f83136dfc5e8ec','CA','Newfoundland and Labrador'),
('5dfe2396293f57eb7a5406abe750794a','US','Indiana'),
('5e80f0c76d7dfbdb7dac4c2e97d09315','US','Illinois'),
('5ee4b704f2b34fe39a2571970c843eca','US','Oklahoma'),
('691cb8c3f387c5fd1a19fc13bfb315f9','US','Colorado'),
('6fe15b162fdaa48499782ae71db2c967','US','Tennessee'),
('7078d0d87fe9cdb36e217ca67565f32d','US','Montana'),
('729648030a3034cc199285fb005e832e','CA','Prince Edward Island'),
('73e8dd9684104c2271a9d3039949bb47','CA','Northwest Territories'),
('748548198a9190a84ea493c0be90fe40','US','Hawaii'),
('7703a8ec53ad057ecf19b9b83a3ccf5f','US','Nebraska'),
('783a36d44657111690036bcf2e7017f0','US','Virginia'),
('78636591a8c4208d8ab93257dfaae1bd','US','Maryland'),
('88070efddc494bc5ae2da1f121b3642c','US','New York'),
('88752c7c228f5371c8230f54af90b321','US','South Carolina'),
('89cffc466075cf33553c364a7216bc33','US','Georgia'),
('8ddd8980be60eee9c643053281f5e6f6','US','Alabama'),
('925d5da2f4e868e39ade0527e8428acf','CA','Nunavut'),
('927cf325f4f1b800e7769206fee44a61','US','Washington'),
('93360bcdad3263b8add090c55a86b85d','US','Delaware'),
('a1fdf6dce9cb274eec059be39342eb37','CA','Alberta'),
('a6bb5efd4b468d26c73a26d9b4462370','US','Idaho'),
('aa09b3001d9a01680762f6eee16afbb3','US','Utah'),
('aa15038bcd4470284de4b6de92a5f84f','US','North Dakota'),
('ab8a0fc5789dbac56c669c1f270aa511','US','Oregon'),
('adad2ede4eae6c5d3e8f713a91a6b249','US','North Carolina'),
('b0d57fc1dcb6e5c9830993a7f60de472','US','Florida'),
('b50985385c3301cbec2110a9419057c1','CA','Quebec'),
('b7c58d2ff16fc76a0915524aae73dc8a','US','Wisconsin'),
('c308e9c9383a15c547fbcfe7d2753ce3','US','California'),
('c5aec0c0a69cf36e218be17731f2be5a','US','Michigan'),
('c88a86d36da190dc81e106584a192ffc','US','Massachusetts'),
('c9376d483cc92638e5c4612acb213042','US','Texas'),
('d1a32c336ecfed08a9d15de9fa944498','US','Pennsylvania'),
('d4a3c0dc7ff3b640a15ee09d6c26d0dc','US','South Dakota'),
('d50bbe6a1ce9c2bc4e0ba78b41fa151c','US','Maine'),
('ddd260ecff8e20f745533a71e7cf64e4','US','New Jersey'),
('e037e2fb0066b97f9de330984620066a','US','Iowa'),
('e329912477a608333916c7c305822e18','CA','Yukon'),
('e3948bb5524d13a4243ae1bb3f268dbe','CA','New Brunswick'),
('e58aefb425858be5ddd9383006954c61','US','Louisiana'),
('e69f0ab598b789c6e5889be2f6a5b65c','US','Wyoming'),
('f6e50326f59d346cb192c0b482c62818','US','Minnesota'),
('f84d8e1e25da655aaaa54c06a489138d','CA','Nova Scotia'),
('fafce59f2ab4b3d135def207ef6ebcd3','US','Arkansas'),
('fd0fbb5610b8fe767cafebfead182cbb','CA','Saskatchewan');
/*!40000 ALTER TABLE `Provinces_States` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `SecureCustomerOrders`
--

DROP TABLE IF EXISTS `SecureCustomerOrders`;
/*!50001 DROP VIEW IF EXISTS `SecureCustomerOrders`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `SecureCustomerOrders` AS SELECT
 1 AS `order_id`,
  1 AS `order_date`,
  1 AS `total_amount`,
  1 AS `delivery_status` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `SecureCustomers`
--

DROP TABLE IF EXISTS `SecureCustomers`;
/*!50001 DROP VIEW IF EXISTS `SecureCustomers`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `SecureCustomers` AS SELECT
 1 AS `customer_id`,
  1 AS `first_name`,
  1 AS `last_name`,
  1 AS `street_address`,
  1 AS `city`,
  1 AS `state_province`,
  1 AS `country`,
  1 AS `postal_zipcode` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `SecureInventory`
--

DROP TABLE IF EXISTS `SecureInventory`;
/*!50001 DROP VIEW IF EXISTS `SecureInventory`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `SecureInventory` AS SELECT
 1 AS `book_id`,
  1 AS `title`,
  1 AS `author`,
  1 AS `description`,
  1 AS `price`,
  1 AS `quantity_available` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Shipping_Carriers`
--

DROP TABLE IF EXISTS `Shipping_Carriers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
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
INSERT INTO `powerUsers` VALUES
('1f30239a-bd7b-11ef-8749-0242ac110002','franklinwebdev704@gmail.com','$2b$10$ksGTrtCJ4NCjqcYwar5vh.sW0lBLGlVY5TlJ8oVwVducQ13/YixcO','super_admin');
/*!40000 ALTER TABLE `powerUsers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `SecureCustomerOrders`
--

/*!50001 DROP VIEW IF EXISTS `SecureCustomerOrders`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
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
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
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
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_uca1400_ai_ci */;
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
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2024-12-20 21:32:09
