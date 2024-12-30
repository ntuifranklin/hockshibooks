-- Dropping all the views first
DROP VIEW IF EXISTS SecureCustomerOrders;
DROP VIEW IF EXISTS SecureCustomers;
DROP VIEW IF EXISTS SecureInventory;

-- Drop Tables with IF EXISTS, Dropping Slave Tables First
DROP TABLE IF EXISTS SequelizeMeta;

DROP TABLE IF EXISTS Book_Reviews;

DROP TABLE IF EXISTS customerOtpTable;
DROP TABLE IF EXISTS Customer_password_reset_requests;

DROP TABLE IF EXISTS otpTable;

-- Then Dropping Main Table.
DROP TABLE IF EXISTS powerUsers;
DROP TABLE IF EXISTS Order_Items;
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Promotions;
DROP TABLE IF EXISTS Shipping_Carriers;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Email_Subscriber;
DROP TABLE IF EXISTS Provinces_States;
DROP TABLE IF EXISTS Countries;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Categories;

-- email subscriber table
CREATE TABLE Email_Subscriber (
    subscriber_id VARCHAR(64) PRIMARY KEY, -- Unique identifier for each subscriber
    email VARCHAR(255) NOT NULL UNIQUE, -- Email address of the subscriber
    full_name VARCHAR(255), -- Full name of the subscriber
    signup_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date and time of signup
    subscription_status ENUM('Active', 'Unsubscribed', 'Pending') NOT NULL DEFAULT 'Pending', -- Status of the subscription
    preferred_frequency ENUM('Daily', 'Weekly', 'Monthly') DEFAULT 'Weekly', -- Frequency of email notifications
    preferred_genres VARCHAR(255), -- Subscriber's preferred book genres (e.g., 'Fiction, Mystery, Sci-Fi')
    language_preference VARCHAR(50) DEFAULT 'English', -- Preferred language for emails
    last_email_sent DATETIME, -- Timestamp of the last email sent
    open_rate FLOAT DEFAULT 0.0, -- Percentage of emails opened by the subscriber
    click_rate FLOAT DEFAULT 0.0, -- Percentage of links clicked in emails
    bounce_status ENUM('None', 'Soft Bounce', 'Hard Bounce') DEFAULT 'None', -- Email bounce status
    ip_address_signup VARCHAR(45), -- IP address from which the user signed up
    signup_source VARCHAR(255), -- Source of the signup (e.g., website, social media, ad campaign)
    unsubscribe_reason VARCHAR(255), -- Reason provided by the subscriber for unsubscribing
    gdpr_consent BOOLEAN DEFAULT FALSE, -- Whether the subscriber has provided GDPR consent
    tags VARCHAR(255) -- Additional tags for categorizing the subscriber (e.g., 'VIP', 'Frequent Buyer')
);

-- Customers Table
CREATE TABLE Genres (
    genre_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);

INSERT INTO Genres (genre_id, name) VALUES 
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Science, Math, and Engineering'),
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Computer and Technology'),
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Finance'),
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Personal Development'),
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Business');

-- Books Table
CREATE TABLE Books (
    book_id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    seo_friendly_title VARCHAR(1024) NOT NULL,
    author VARCHAR(256) NOT NULL,
    ISBN VARCHAR(32) NOT NULL UNIQUE,
    description VARCHAR(1536) NOT NULL,/*1024 + 512 = 1536*/
    book_condition ENUM('New','Like New','Good','Fair','Poor') NOT NULL DEFAULT 'Like New',
    format ENUM('Hardcover','Paperback','Ebook') NOT NULL DEFAULT 'Paperback',
    number_of_pages INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    publication_date DATE,
    language VARCHAR(64),
    cover_image_url VARCHAR(1024),
    cover_image_url_small VARCHAR(1024),
    cover_image_url_medium VARCHAR(1024),
    cover_image_url_large VARCHAR(1024)
);


/*!40000 ALTER TABLE `Books` DISABLE KEYS */;
INSERT INTO `Books` VALUES
('03b88b284b846a222b26610ef6500781',
	'LLC or Corporation? How to Choose the Right Form for Your Business',
	'llc-or-corporation-anthony-mancuso-9781413328004',
	'Anthony Mancuso',
	'9781413328004',
	'LLC or Corporation? How to Choose the Right Form for Your Business by Anthony Mancuso is a practical guide designed to help entrepreneurs and small business owners make informed decisions about the legal structure of their businesses. The book provides clear, concise explanations of the key differences between Limited Liability Companies (LLCs) and Corporations, including factors like taxation, liability protection, management flexibility, and operational requirements.\nMancuso uses plain language to break down complex legal concepts, offering real-world examples, detailed comparisons, and checklists to help readers evaluate which structure best suits their needs. Topics covered include the pros and cons of each business entity, how to handle startup formalities, and strategies for protecting personal assets. Whether you\'re starting a new business or restructuring an existing one, this guide empowers you with the knowledge to choose a structure that aligns with your goals, minimizing risks and maximizing benefits.',
	'Good',
	'Paperback',296,9.99,'2020-01-01',
	'English',
	'llc-or-corporation-anthony-mancuso-9781413328004-large-cover.jpg',
	'llc-or-corporation-anthony-mancuso-9781413328004-small-cover.jpg',
	'llc-or-corporation-anthony-mancuso-9781413328004-medium-cover.jpg',
	'llc-or-corporation-anthony-mancuso-9781413328004-large-cover.jpg'),
('174763f85d88946cd39622464e0a532c',
	'The Whole: Rethinking the Science of Nutrition',
	'whole-t-colin-campbell-9781937856243',
	'T. Colin Campbell',
	'9781937856243',
	'The China Study revealed what we should eat and provided the powerful empirical support for this answer. \"Whole\" answers the question of why. Why does a whole-food, plant-based diet provide optimal nutrition? \"Whole\" demonstrates how far the scientific reductionism of the nutrition orthodoxy has gotten offtrack and reveals the elegant wonders of the true holistic workings of nutrition, from the cellular level to the operation of the entire organism.',
	'Good',
	'Paperback',328,9.68,'2013-01-01',
	'English',
	'https://covers.openlibrary.org/b/id/12647639-L.jpg',
	'https://covers.openlibrary.org/b/id/12647639-S.jpg',
	'https://covers.openlibrary.org/b/id/12647639-M.jpg',
	'https://covers.openlibrary.org/b/id/12647639-L.jpg'),
('1cc7ae0ffe2654c00763e21f0e587f97',
	'How to break up with your phone',
	'how-to-break-up-with-your-phone-catherine-price-9780399581120',
	'Catherine Price',
	'9780399581120',
	'Award-winning journalist Catherine Price presents a practical, hands-on plan to break up and then make up with your phone. The goal? A long-term relationship that actually feels good. You\'ll discover how phones and apps are designed to be addictive and how the time we spend on them damages our abilities to focus, think deeply, and form new memories. You\'ll then make customized changes to your settings, apps, environment, and mindset that will enable you to take back control of your life : both on your phone and off.\nThe book is a self-help book that offers practical advice for those seeking to reduce their dependence on smartphones. It combines scientific research with actionable strategies to help readers recognize the negative effects of excessive phone use and provides a step-by-step guide to regain control of their time. Through a mix of exercises, insights, and tips, Price encourages readers to break free from mindless scrolling and create healthier habits, fostering a more balanced and fulfilling life.',
	'Good',
	'Paperback',184,6.05,'2018-01-01',
	'English',
	'https://covers.openlibrary.org/b/id/13160188-L.jpg',
	'https://covers.openlibrary.org/b/id/13160188-S.jpg',
	'https://covers.openlibrary.org/b/id/13160188-M.jpg',
	'https://covers.openlibrary.org/b/id/13160188-L.jpg'),
('4eb0e6c8ae771e9622f8b79fe4e9029f',
	'Serious Cryptography: A Practical Introduction to Modern Encryption',
	'serious-cryptography-jean-philippe-aumasson-9781593278267',
	'Jean-Philippe Aumasson',
	'9781593278267',
	'Serious Cryptography: A Practical Introduction to Modern Encryption by Jean-Philippe Aumasson is an accessible yet detailed exploration of the principles and practices behind modern cryptography. Designed for readers with a technical background, the book covers the foundational concepts of encryption, providing insights into how cryptographic algorithms work and why they are secure.\nThe author explains complex topics such as symmetric encryption, public-key cryptography, hashing, digital signatures, and random number generation, with clarity and precision. Aumasson delves into real-world applications of cryptography, discussing protocols, attacks, and practical considerations that highlight the importance of secure implementations. The book also provides historical context and commentary on the evolution of cryptographic systems.\nWith its balance of theory and hands-on examples, *Serious Cryptography* is an invaluable resource for software developers, security professionals, and anyone interested in understanding the inner workings of encryption systems. Its practical approach ensures readers gain both the knowledge and the tools needed to apply cryptography securely in real-world scenarios.',
	'Good',
	'Paperback',312,13.89,'2017-11-01',
	'English',
	'https://covers.openlibrary.org/b/id/8232506-L.jpg',
	'https://covers.openlibrary.org/b/id/8232506-S.jpg',
	'https://covers.openlibrary.org/b/id/8232506-M.jpg',
	'https://covers.openlibrary.org/b/id/8232506-L.jpg'),
('58146e3b39b2ad96c8b268fdda267356',
	'Last Woman Standing',
	'last-woman-standing-amy-gentry-9780358108535',
	'Amy Gentry',
	'9780358108535',
	'Last Woman Standing by Amy Gentry is a gripping psychological thriller that blends suspense, revenge, and dark humor. The story follows Dana Diaz, a stand-up comedian struggling to make a name for herself in the male-dominated comedy world of Austin, Texas. After a brutal encounter with sexism and harassment, Dana forms an unlikely bond with Amanda Dorn, a tech-savvy woman with her own traumatic past.\nAs their friendship deepens, Amanda proposes a pact: they will help each other take revenge on the men who have wronged them. Initially, the plan seems empowering, but as the acts of vengeance escalate, Dana begins to question Amanda’s true intentions and her grip on reality. With twists and turns that challenge perceptions of morality, trust, and justice, *Last Woman Standing* explores the darker sides of ambition and the consequences of retribution. It’s a sharp and thought-provoking novel that keeps readers guessing until the very end.',
	'Good',
	'Paperback',
	336,
	5.99,
	'2019-01-01',
	'English',
	'last-woman-standing-amy-gentry-9780358108535-large-cover.jpg',
	'last-woman-standing-amy-gentry-9780358108535-small-cover.jpg',
	'last-woman-standing-amy-gentry-9780358108535-medium-cover.jpg',
	'last-woman-standing-amy-gentry-9780358108535-large-cover.jpg'),
('58b8eac08d738216aa904b80d45c1f9e',
	'Christmas Comes to Morning Star',
	'christmas-comes-to-morning-star-charlotte-hubbard-9781420151831',
	'Charlotte Hubbard',
	'9781420151831',
	'Christmas Comes to Morning Star by Charlotte Hubbard is a heartwarming Amish holiday romance set in the close-knit community of Morning Star, Missouri. The story revolves around the lives of two main characters, Esther and Jeb, as they navigate the challenges of faith, family, and love during the Christmas season. Esther, a kind-hearted Amish woman, is struggling with the loss of her parents and the weight of running the family farm. Jeb, a widowed father, returns to Morning Star to start fresh, but he finds his heart tugged by Esther’s strength and warmth. As Christmas approaches, both Esther and Jeb must overcome their personal fears and the lingering scars of their pasts to open their hearts to the love and joy that the holiday season can bring. Filled with themes of community, forgiveness, and second chances, *Christmas Comes to Morning Star* is a sweet, uplifting tale of love blossoming amid the peaceful simplicity of Amish life.',
	'Good',
	'Paperback',
	336,
	8.79,
	'2021-01-01',
	'English',
	'https://covers.openlibrary.org/b/id/12397403-L.jpg',
	'https://covers.openlibrary.org/b/id/12397403-S.jpg',
	'https://covers.openlibrary.org/b/id/12397403-M.jpg',
	'https://covers.openlibrary.org/b/id/12397403-L.jpg'),
('74d9ac32f1123501cad04cf59af00018',
	'Growing Great Employees',
	'growing-great-employees-erika-andersen-9781591841906',
	'Erika Andersen',
	'9781591841906',
	'Growing Great Employees: Turning Ordinary People into Extraordinary Performers is a book by Erika Anderson, published in 2010. The book focuses on how managers and leaders can foster the development of their employees, transforming them into high-performing individuals. Anderson presents practical strategies for managers to help their employees grow professionally by providing the right kind of feedback, support, and opportunities for development.\nThe key idea in the book is that great employees aren’t born—they’re made through thoughtful, proactive leadership. Anderson emphasizes that effective management involves not just oversight but active participation in the growth of employees, helping them reach their full potential through personalized development.\nThe ISBN-13 for the book is **978-0814416523**. It is a helpful resource for leaders and managers looking to improve team performance by focusing on employee development and creating an environment that nurtures growth.',
	'Good',
	'Paperback',
	304,
	7.39,
	'2007-12-18',
	'English',
	'https://covers.openlibrary.org/b/id/1977235-L.jpg',
	'https://covers.openlibrary.org/b/id/1977235-S.jpg',
	'https://covers.openlibrary.org/b/id/1977235-M.jpg',
	'https://covers.openlibrary.org/b/id/1977235-L.jpg'),
('77a9d51f79fe60f38af743412f521c07',
	'Good Girl\'s Guide to Rakes',
	'good-girls-guide-to-rakes-eva-leigh-9780063086272',
	'Eva Leigh',
	'9780063086272',
	'*The Good Girl\'s Guide to Rakes* by Eva Leigh is a charming historical romance that blends wit, passion, and a touch of rebellion. Set in Regency-era London, the story follows Lady Grace Wyatt, a proper young woman who has always adhered to society\'s strict rules. However, her world is turned upside down when she crosses paths with the infamous and charismatic rake, Tristan, the Duke of Rothbury. Despite their differences, Tristan\'s magnetic presence and Grace’s growing desire for adventure push them into a passionate and unexpected affair. As Grace and Tristan navigate their contrasting worlds, their chemistry builds, challenging both their beliefs about love, duty, and freedom. With themes of personal growth, love beyond societal expectations, and the transformative power of breaking free from convention, *The Good Girl\'s Guide to Rakes* is a captivating story of a woman’s journey toward embracing her desires and defying tradition for the sake of love.',
	'Good',
	'Paperback',
	 384,
	 9.78,
	 '2022-01-01',
	'English',
	'https://covers.openlibrary.org/b/id/12723049-L.jpg',
	'https://covers.openlibrary.org/b/id/12723049-S.jpg',
	'https://covers.openlibrary.org/b/id/12723049-M.jpg',
	'https://covers.openlibrary.org/b/id/12723049-L.jpg'),
('95c24aa6852153af3aaa06198088045e',
	'Naya Nuki: Shoshoni Girl Who Ran',
	'naya-nuki-kenneth-thomasma-9781880114001',
	'Kenneth Thomasma',
	'9781880114001',
	'Naya Nuki: Shoshoni Girl Who Ran (ISBN: 9781880114001) is a historical novel written by Kenneth Thomasma. It tells the story of Naya Nuki, a young Shoshoni girl who, in the early 1800s, is captured by a group of Hidatsa warriors. After her capture, she manages to escape and embarks on a remarkable journey across the wilderness in an effort to reunite with her tribe. The novel follows her determination, bravery, and survival skills as she faces the challenges of the natural world and encounters various tribes. It is an inspiring tale of courage and resilience.',
	'Good',
	'Paperback',175,7.89,'2000-04-01',
	'English',
	'https://covers.openlibrary.org/b/id/926325-L.jpg',
	'https://covers.openlibrary.org/b/id/926325-S.jpg',
	'https://covers.openlibrary.org/b/id/926325-M.jpg',
	'https://covers.openlibrary.org/b/id/926325-L.jpg'),
('d1a747b08743a5d18053e0e5c114c158',
	'Oh, the places you\'ll go!',
	'oh-the-places-youll-go-dr-seuss-0679805273',
	'Dr. Seuss',
	'0679805273',
	'\"Oh, the Places You\'ll Go!\" by Dr. Seuss is an uplifting and whimsical tale that celebrates life’s journey and its inevitable ups and downs. The story follows an unnamed protagonist as they embark on an adventure filled with excitement, challenges, and uncertainty. Through playful rhymes and vibrant illustrations, Dr. Seuss explores themes of ambition, resilience, and self-discovery. The book encourages readers to embrace change, take risks, and persevere through obstacles like loneliness, confusion, and fear. It acknowledges moments of setbacks—like the dreaded \"Waiting Place\" where nothing seems to happen—but reassures readers that they have the ability to overcome difficulties and achieve great things. Ultimately, it’s a heartwarming reminder that life is full of possibilities, and with determination and an open heart, there are no limits to what one can achieve. Loved by readers of all ages, this timeless classic serves as a popular gift for graduations and life milestones, inspiring confidence and hope for the future.',
	'Good',
	'Paperback',48,8.26,'1990-01-01',
	'English',
	'https://covers.openlibrary.org/b/id/423771-L.jpg',
	'https://covers.openlibrary.org/b/id/423771-S.jpg',
	'https://covers.openlibrary.org/b/id/423771-M.jpg',
	'https://covers.openlibrary.org/b/id/423771-L.jpg'),
('d22a87459b8289c75b6f47472bcc5318',
	'Enhancing the Postdoctoral Experience',
	'enhancing-the-postdoctoral-experience-national-academy-of-sciences-us-9780309069960',
	'National Academy of Sciences U.S.',
	'9780309069960',
	'Enhancing the Postdoctoral Experience by the National Academy of Sciences is a comprehensive report that explores the challenges and opportunities faced by postdoctoral researchers in the United States. The report emphasizes the importance of improving the postdoctoral experience to enhance scientific discovery and support career development. It addresses the evolving role of postdocs in academia, industry, and other sectors, highlighting issues such as mentorship, career guidance, compensation, and work-life balance. The document provides recommendations for institutions, funding agencies, and policymakers to foster a more supportive and equitable environment for postdoctoral scholars. By focusing on career development, skill-building, and professional networking, the report aims to elevate the status and impact of postdoctoral researchers, ultimately contributing to a stronger, more sustainable research ecosystem. It underscores the need for structural changes to ensure postdocs are well-prepared for the next steps in their careers, whether in academia or beyond.',
	'Good',
	'Paperback',
	105,
	13.99,
	'2000-09-01',
	'English',
	'https://covers.openlibrary.org/b/id/2362604-L.jpg',
	'https://covers.openlibrary.org/b/id/2362604-S.jpg',
	'https://covers.openlibrary.org/b/id/2362604-M.jpg',
	'https://covers.openlibrary.org/b/id/2362604-L.jpg'),
('d9412f53ae33c8fe99d4e3cbbf97cad1',
	'Lean In For Graduates',
	'lean-in-for-graduates-sheryl-sandberg-9780385353670',
	'Sheryl Sandberg',
	'9780385353670',
	'Lean In for Graduates by Sheryl Sandberg is an empowering guide aimed at helping recent graduates navigate the complexities of the professional world, particularly for women. Based on Sandberg\'s original bestselling book *Lean In*, this edition is specifically tailored to address the challenges young women face as they start their careers. It offers practical advice on how to take on leadership roles, build confidence, negotiate salary, and deal with workplace bias. Sandberg encourages women to \"lean in\" to opportunities and take ownership of their careers, providing insights into balancing ambition with personal life and fostering supportive relationships in the workplace. Through a mix of personal stories, research, and actionable tips, the book inspires graduates to challenge societal expectations, embrace their ambitions, and build a path to success while overcoming obstacles in male-dominated fields. Ultimately, *Lean In for Graduates* serves as a motivational tool for young women to build a strong foundation for their careers.',
	'Good',
	'Paperback',
	406,
	11.49,
	'2014-01-01',
	'English',
	'https://covers.openlibrary.org/b/id/7852100-L.jpg',
	'https://covers.openlibrary.org/b/id/7852100-S.jpg',
	'https://covers.openlibrary.org/b/id/7852100-M.jpg',
	'https://covers.openlibrary.org/b/id/7852100-L.jpg'),
('dbed93d2ad7c739ff1eb527afb701ff0',
	'Learning Selenium Testing Tools with Python','learning-selenium-testing-tools-with-python-unmesh-gundecha-9781783983506',
	'Unmesh Gundecha',
	'9781783983506',
	'*Learning Selenium Testing Tools with Python* is a practical guide to using Selenium WebDriver for automated web testing with Python. The book covers key concepts and tools required to build effective Selenium-based test scripts. It introduces Selenium WebDriver and Python\'s testing frameworks, such as unittest and pytest, and provides insights into writing and executing test cases.\n\nKey highlights of the book include:\n1. **Introduction to Selenium**: Understanding the core concepts of Selenium, including setting up and configuring it with Python.\n2. **Test Automation Fundamentals**: Creating automated tests for web applications, including handling browsers, interacting with elements, and verifying expected outcomes.\n3. **Advanced Selenium Features**: Using advanced techniques like handling dynamic content, waiting mechanisms, and cross-browser testing.\n4. **Integrating with Python Testing Frameworks**: Writing tests using Python\'s unittest and pytest frameworks and integrating Selenium with Continuous Integration (CI) systems.\n5. **Real-World Examples**: Practical examples to help readers develop functional and maintainable test scripts.\n\nOverall, the book aims to provide readers with the tools and knowledge to perform automated web testing efficiently using Selenium and Python.',
	'Good',
	'Paperback',
	216,
	8.45,
	'2014-12-30',
	'English',
	'learning-selenium-testing-tools-with-python-unmesh-gundecha-9781783983506-large-cover.jpg',
	'learning-selenium-testing-tools-with-python-unmesh-gundecha-9781783983506-small-cover.jpg',
	'learning-selenium-testing-tools-with-python-unmesh-gundecha-9781783983506-medium-cover.jpg',
	'learning-selenium-testing-tools-with-python-unmesh-gundecha-9781783983506-large-cover.jpg'),

('e2ebddddcdaef4cd209308f51cfdb598',
	'Lunch Money',
	'lunch-money-rise-and-shine-andrew-clements-9780689866852',
	'Andrew Clements',
	'9780689866852',
	'Lunch Money by Andrew Clements is a clever and humorous middle-grade novel that explores entrepreneurship, competition, and collaboration. The story centers around Greg Kenton, a sixth-grader with a knack for earning money and an entrepreneurial spirit. Greg discovers that selling miniature comic books, called Chunky Comics, to his classmates could be a profitable venture. However, his business faces unexpected challenges, including a rivalry with his classmate Maura Shaw, who starts her own comic book enterprise. \nAs their competition heats up, school rules, ethical dilemmas, and personal conflicts arise. Eventually, Greg and Maura realize that working together might be more rewarding than competing, and they join forces to make their comic book business successful. Through engaging dialogue and relatable characters, Andrew Clements weaves an entertaining story that emphasizes teamwork, creativity, and the value of learning from others. Lunch Money is both a fun read and an insightful look at the dynamics of entrepreneurship and friendship.',
	'Good',
	'Paperback',
	222,
	6.99,
	'2007-06-26',
	'English',
	'https://covers.openlibrary.org/b/id/8741740-L.jpg',
	'https://covers.openlibrary.org/b/id/8741740-S.jpg',
	'https://covers.openlibrary.org/b/id/8741740-M.jpg',
	'https://covers.openlibrary.org/b/id/8741740-L.jpg'),
('ee1791d35fe1dcee8126db3254d478e2',
	'The Essential fundraising handbook for small nonprofits',
	'the-essential-fundraising-handbook-for-small-nonprofits-betsy-baker-9780989600804',
	'Betsy Baker',
	'9780989600804',
	'No description available',
	'Good',
	'Paperback',
	269,
	6.99,'2014-01-01',
	'English',
	'https://covers.openlibrary.org/b/id/12597440-L.jpg',
	'https://covers.openlibrary.org/b/id/12597440-S.jpg',
	'https://covers.openlibrary.org/b/id/12597440-M.jpg',
	'https://covers.openlibrary.org/b/id/12597440-L.jpg'),
('f806a7102c92400b8b0044f643ac60b3',
	'Transforming professional development into student results',
	'transforming-professional-development-into-student-results-douglas-b-reeves-9781416609490',
	'Douglas B. Reeves',
	'9781416609490',
	'Transforming Professional Development into Student Results is a book by Douglas B. Reeves, published in 2008. This book focuses on how schools and educators can turn professional development (PD) efforts into tangible improvements in student performance. Reeves argues that for professional development to be effective, it must be directly tied to student outcomes and provide teachers with the tools and strategies they need to impact student learning.\nThe book provides practical strategies for transforming PD into real results by focusing on evidence-based practices, aligning teacher development with curriculum goals, and creating a culture of continuous improvement. Reeves emphasizes the importance of ensuring that professional development is not just an isolated activity, but an ongoing process that engages teachers in reflection, collaboration, and the application of new skills in the classroom.\nWhile the ISBN-13 for the book is **978-1416606009**, it is generally used by educators and school leaders looking to make professional development a more impactful and results-driven endeavor.',
	'Good',
	'Paperback',
	156,
	9.34,'2010-01-01',
	'English',
	'https://covers.openlibrary.org/b/id/6721304-L.jpg',
	'https://covers.openlibrary.org/b/id/6721304-S.jpg',
	'https://covers.openlibrary.org/b/id/6721304-M.jpg',
	'https://covers.openlibrary.org/b/id/6721304-L.jpg'),
('fbf4b2cdc0341672f468d484d7f082cd',
	'Adviser, Teacher, Role Model, Friend',
	'adviser-teacher-role-model-friend-national-academy-of-sciences-us-9780309063630',
	'National Academy of Sciences U.S.',
	'9780309063630',
	'The book Adviser, Teacher, Role Model, Friend: On Being a Mentor to Students in Science and Engineering is published by the National Academy of Sciences. The ISBN-13 for this book is 978-0309070141.\nThis book offers guidance for mentors in science and engineering, emphasizing the crucial role of mentorship in the academic and professional development of students. It explores the responsibilities of being an adviser, teacher, role model, and friend to students, providing practical advice on how to support students in their academic journeys. The text is designed to help mentors understand their influence on the personal and professional growth of their students, and it highlights effective mentorship practices, ethical considerations, and the challenges and rewards of guiding young scientists.\nThe book is a valuable resource for anyone involved in mentoring students, offering insights into how to create a positive, supportive, and productive relationship with students in science and engineering fields.',
	'Good',
	'Paperback',
	96,
	12.41,
	'1997-07-23',
	'English',
	'https://covers.openlibrary.org/b/id/2362262-L.jpg',
	'https://covers.openlibrary.org/b/id/2362262-S.jpg',
	'https://covers.openlibrary.org/b/id/2362262-M.jpg',
	'https://covers.openlibrary.org/b/id/2362262-L.jpg');
/*!40000 ALTER TABLE `Books` ENABLE KEYS */;

-- Promotions Table
CREATE TABLE Promotions (
    promo_id VARCHAR(64) PRIMARY KEY,
    promo_code VARCHAR(64) NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Inventory Table
CREATE TABLE Inventory (
    book_id VARCHAR(64) PRIMARY KEY,
    quantity_available INT NOT NULL,
    location VARCHAR(256) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
    ON delete CASCADE
    ON update CASCADE
);

INSERT INTO `Inventory` VALUES
('03b88b284b846a222b26610ef6500781',1,'warehouse'),
('174763f85d88946cd39622464e0a532c',1,'warehouse'),
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
('e2ebddddcdaef4cd209308f51cfdb598',1,'warehouse'),
('ee1791d35fe1dcee8126db3254d478e2',1,'warehouse'),
('f806a7102c92400b8b0044f643ac60b3',1,'warehouse'),
('fbf4b2cdc0341672f468d484d7f082cd',1,'warehouse'),
('dbed93d2ad7c739ff1eb527afb701ff0',1,'warehouse');

CREATE TABLE powerUsers (
     id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('basic_admin', 'super_admin') NOT NULL DEFAULT 'basic_admin'
);


CREATE TABLE otpTable (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    otp VARCHAR(255),
    expiration_time DATETIME,
    powerUserId CHAR(36),
    FOREIGN KEY (powerUserId) REFERENCES powerUsers(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);


-- category table
CREATE TABLE `Categories` (
    `category_id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    `name` VARCHAR(128) NOT NULL
);
-- products table
CREATE TABLE `Products` (
    `product_id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    `name` VARCHAR(512) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `product_image_url` VARCHAR(1024),
    `category` VARCHAR(64),
    FOREIGN KEY (`category`) REFERENCES `Categories`(`category_id`)
);

-- Customers Table
CREATE TABLE Customers (
    customer_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(64)  NULL,
    last_name VARCHAR(64)  NULL,
    email VARCHAR(64) UNIQUE NOT NULL ,
    password VARCHAR(256)  NULL,
    guest boolean default (0),
    street_address VARCHAR(256)  NULL,
    city VARCHAR(128)  NULL,
    state_province_id VARCHAR(128)  NULL,
    country VARCHAR(128)  NULL,
    postal_zipcode VARCHAR(32)  NULL,
    phone VARCHAR(32)  NULL
);

CREATE TABLE customerOtpTable (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    otp VARCHAR(255),
    expiration_time DATETIME,
    customerId CHAR(36),
    FOREIGN KEY (customerId) REFERENCES Customers(customer_id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

-- Password Reset Request Table
CREATE TABLE Customer_password_reset_requests (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36) NOT NULL,
    token VARCHAR(64) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) 
	ON DELETE CASCADE 
	ON UPDATE CASCADE
);

-- Countries Table
CREATE TABLE Countries (
    country_code VARCHAR(4) PRIMARY KEY,
    country_name VARCHAR(128) NOT NULL
);

-- Provinces_States Table
CREATE TABLE Provinces_States (
    province_state_id VARCHAR(64) PRIMARY KEY,
    country_code VARCHAR(4) NOT NULL,
    province_state_name VARCHAR(128) NOT NULL,
    province_state_code VARCHAR(2) NOT NULL,
    FOREIGN KEY (country_code) REFERENCES Countries(country_code)
);

-- Insert data for the US and Canada into the Countries Table
INSERT INTO Countries (country_code, country_name) VALUES ('US', 'United States'), ('CA', 'Canada');

-- Insert US states into the Provinces_States Table with random province_state_id
INSERT INTO Provinces_States (province_state_id, country_code, province_state_name, province_state_code) VALUES
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Alabama', 'AL'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Alaska', 'AK'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Arizona', 'AZ'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Arkansas', 'AR'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'California', 'CA'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Colorado', 'CO'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Connecticut', 'CT'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Delaware', 'DE'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Florida', 'FL'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Georgia', 'GA'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Hawaii', 'HI'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Idaho', 'ID'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Illinois', 'IL'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Indiana', 'IN'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Iowa', 'IA'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Kansas', 'KS'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Kentucky', 'KY'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Louisiana', 'LA'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Maine', 'ME'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Maryland', 'MD'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Massachusetts', 'MA'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Michigan', 'MI'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Minnesota', 'MN'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Mississippi', 'MS'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Missouri', 'MO'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Montana', 'MT'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Nebraska', 'NE'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Nevada', 'NV'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'New Hampshire', 'NH'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'New Jersey', 'NJ'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'New Mexico', 'NM'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'New York', 'NY'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'North Carolina', 'NC'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'North Dakota', 'ND'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Ohio', 'OH'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Oklahoma', 'OK'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Oregon', 'OR'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Pennsylvania', 'PA'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Rhode Island', 'RI'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'South Carolina', 'SC'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'South Dakota', 'SD'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Tennessee', 'TN'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Texas', 'TX'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Utah', 'UT'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Vermont', 'VT'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Virginia', 'VA'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Washington', 'WA'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'District of Columbia', 'DC'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'West Virginia', 'WV'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Wisconsin', 'WI'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Wyoming', 'WY');

-- Insert Canadian provinces into the Provinces_States Table with random province_state_id
INSERT INTO Provinces_States (province_state_id, country_code, province_state_name, province_state_code) VALUES
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Alberta','AB'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'British Columbia','BC'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Manitoba','MB'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'New Brunswick','NB'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Newfoundland and Labrador','NF'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Nova Scotia','NS'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Ontario','ON'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Prince Edward Island', 'PE'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Quebec','QC'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Saskatchewan','SK'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Northwest Territories','NT'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Nunavut','NU'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Yukon','YT');

-- Orders Table
CREATE TABLE Orders (
    order_id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Cancelled') NOT NULL,
    shipping_address VARCHAR(256) NOT NULL,
    shipping_city VARCHAR(128) NOT NULL,
    shipping_state_province VARCHAR(128) NOT NULL,
    shipping_country VARCHAR(128) NOT NULL,
    shipping_postal_code VARCHAR(32) NOT NULL,
    delivery_status ENUM('Processing', 'Shipped', 'Delivered') NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Order_Items Table
CREATE TABLE Order_Items (
    order_item_id VARCHAR(64),
    order_id VARCHAR(64) NOT NULL,
    book_id VARCHAR(64) NOT NULL,
    quantity INT NOT NULL,
    item_price DECIMAL(16, 2) NOT NULL,
    subtotal DECIMAL(16, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);

-- Payment Table
CREATE TABLE Payment (
    payment_id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(128) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(128) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- Shipping_Carriers Table
CREATE TABLE Shipping_Carriers (
    carrier_id VARCHAR(64) PRIMARY KEY,
    carrier_name VARCHAR(128) NOT NULL,
    tracking_url VARCHAR(512) NOT NULL
);

-- Book_Reviews Table
CREATE TABLE Book_Reviews (
    review_id VARCHAR(64) PRIMARY KEY,
    book_id VARCHAR(64) NOT NULL,
    customer_id VARCHAR(64) NOT NULL,
    rating VARCHAR(64) NOT NULL,
    review_text TEXT,
    review_date DATE NOT NULL,
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Some views :
CREATE VIEW SecureCustomers AS
SELECT 
    customer_id,
    first_name,
    last_name,
    street_address,
    city,
    state_province_id,
    country,
    postal_zipcode
FROM Customers;

CREATE VIEW SecureCustomerOrders AS
SELECT 
    order_id,
    order_date,
    total_amount,
    delivery_status
FROM Orders;

CREATE VIEW SecureInventory AS
SELECT 
    i.book_id as book_id,
    b.title as title,
    b.author as author,
    b.description as description,
    b.price as price,
    i.quantity_available as quantity_available
FROM Inventory as i
LEFT JOIN Books as b
ON i.book_id = b.book_id;


INSERT INTO powerUsers ( email,password,role) VALUES ( 'franklinwebdev704@gmail.com','$2b$10$ksGTrtCJ4NCjqcYwar5vh.sW0lBLGlVY5TlJ8oVwVducQ13/YixcO',"super_admin");

