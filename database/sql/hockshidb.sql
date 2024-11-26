use hockshi;

-- Dropping all the views first
DROP VIEW IF EXISTS SecureCustomerOrders;
DROP VIEW IF EXISTS SecureCustomers;
DROP VIEW IF EXISTS SecureInventory;

-- Drop Tables with IF EXISTS, Dropping Slave Tables First
DROP TABLE IF EXISTS SequelizeMeta;

DROP TABLE IF EXISTS Book_Reviews;

DROP TABLE IF EXISTS customerOtpTable;

DROP TABLE IF EXISTS otpTable;


DROP TABLE IF EXISTS powerUsers;


DROP TABLE IF EXISTS Order_Items;
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Promotions;
DROP TABLE IF EXISTS Shipping_Carriers;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Provinces_States;
DROP TABLE IF EXISTS Countries;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS categories;


-- Customers Table


CREATE TABLE Genres (
    genre_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);


-- Books Table
CREATE TABLE Books (
    book_id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    author VARCHAR(256) NOT NULL,
    ISBN VARCHAR(32) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    publication_date DATE,
    language VARCHAR(64),
    cover_image_url VARCHAR(1024)
);



LOCK TABLES `Books` WRITE;
/*!40000 ALTER TABLE `Books` DISABLE KEYS */;
INSERT INTO `Books` VALUES 
('00e0f6a58952dcc1ffa8b24e70d05e89','LLC or Corporation?','Anthony Mancuso','9781413328004','No description available',35.00,NULL,NULL,''),
('2cebacb6ebead74e807d2f738081ffcb','Oh, the places you\'ll go!','Dr. Seuss','0679805273','Advice in rhyme for proceeding in life; weathering fear, loneliness, and confusion; and being in charge of your actions.',12.00,NULL,NULL,'https://covers.openlibrary.org/b/id/423771-M.jpg'),
('42f21078fe73c24641aff796e8c03323','Transforming professional development into student results','Douglas B. Reeves','9781416609490','No description available',19.00,NULL,NULL,'https://covers.openlibrary.org/b/id/6721304-M.jpg'),
('6216d3a41653d3f969f5dbab6dbd75be','Lunch Money (Rise and Shine)','Andrew Clements','9780689866852','No description available',5.00,NULL,NULL,'https://covers.openlibrary.org/b/id/8741740-M.jpg'),
('65c2b47a70ebfcf5433620a29e4c9d04','How to break up with your phone','Catherine Price','9780399581120','\"Award-winning journalist Catherine Price presents a practical, hands-on plan to break up -- and then make up -- with your phone. The goal? A long-term relationship that actually feels good. You\'ll discover how phones and apps are designed to be addictive and how the time we spend on them damages our abilities to focus, think deeply, and form new memories. You\'ll then make customized changes to your settings, apps, environment, and mindset that will enable you to take back control of your life -- both on your phone and off.\"--Back cover.',8.00,NULL,NULL,'https://covers.openlibrary.org/b/id/13160188-M.jpg'),
('697bed51542154d3627d3111df750fa6','Enhancing the Postdoctoral Experience','National Academy of Sciences U.S.','9780309069960','No description available',66.00,NULL,NULL,'https://covers.openlibrary.org/b/id/2362604-M.jpg'),
('86ef4d77cfa6e7cea4afff9a5ca66f3b','Growing Great Employees','Erika Andersen','9781591841906','No description available',35.00,NULL,NULL,'https://covers.openlibrary.org/b/id/1977235-M.jpg'),
('916e645416b4f0103e1d56ee09a4c39e','Adviser, Teacher, Role Model, Friend','National Academy of Sciences U.S.','9780309063630','No description available',45.00,NULL,NULL,'https://covers.openlibrary.org/b/id/2362262-M.jpg'),
('9fae2b168156306e50d3062db27cc82e','Last Woman Standing','Amy Gentry','9780358108535','No description available',6.00,NULL,NULL,''),
('b20fcc7b3ae1319cdadd96e39059b4a9','Christmas Comes to Morning Star','Charlotte Hubbard','9781420151831','No description available',9.00,NULL,NULL,'https://covers.openlibrary.org/b/id/12397403-M.jpg'),
('ce29c94d7cf1f075614d6a58a6088e4f','Whole','T. Colin Campbell','9781937856243','\"The China Study\" revealed what we should eat and provided the powerful empirical support for this answer. \"Whole\" answers the question of why. Why does a whole-food, plant-based diet provide optimal nutrition? \"Whole\" demonstrates how far the scientific reductionism of the nutrition orthodoxy has gotten offtrack and reveals the elegant wonders of the true holistic workings of nutrition, from the cellular level to the operation of the entire organism.',5.00,NULL,NULL,'https://covers.openlibrary.org/b/id/12647639-M.jpg'),
('db3a1093221dfe60d86ba08f4ea4bb58','Serious Cryptography','Jean-Philippe Aumasson','9781593278267','No description available',25.00,NULL,NULL,'https://covers.openlibrary.org/b/id/8232506-M.jpg'),
('ea48a2e9581949fb9813f2c83b07521d','Good Girl\'s Guide to Rakes','Eva Leigh','9780063086272','No description available',7.00,NULL,NULL,'https://covers.openlibrary.org/b/id/12723049-M.jpg');
/*!40000 ALTER TABLE `Books` ENABLE KEYS */;
UNLOCK TABLES;


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
CREATE TABLE `categories` (
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
    FOREIGN KEY (`category`) REFERENCES `categories`(`category_id`)
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
    state_province VARCHAR(128)  NULL,
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
    FOREIGN KEY (country_code) REFERENCES Countries(country_code)
);

-- Insert data for the US and Canada into the Countries Table
INSERT INTO Countries (country_code, country_name) VALUES ('US', 'United States'), ('CA', 'Canada');

-- Insert US states into the Provinces_States Table with random province_state_id
INSERT INTO Provinces_States (province_state_id, country_code, province_state_name) VALUES
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Alabama'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Alaska'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Arizona'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Arkansas'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'California'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Colorado'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Connecticut'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Delaware'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Florida'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Georgia'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Hawaii'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Idaho'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Illinois'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Indiana'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Iowa'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Kansas'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Kentucky'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Louisiana'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Maine'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Maryland'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Massachusetts'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Michigan'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Minnesota'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Mississippi'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Missouri'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Montana'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Nebraska'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Nevada'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'New Hampshire'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'New Jersey'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'New Mexico'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'New York'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'North Carolina'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'North Dakota'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Ohio'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Oklahoma'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Oregon'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Pennsylvania'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Rhode Island'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'South Carolina'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'South Dakota'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Tennessee'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Texas'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Utah'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Vermont'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Virginia'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Washington'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'District of Columbia'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'West Virginia'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Wisconsin'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'US', 'Wyoming');

-- Insert Canadian provinces into the Provinces_States Table with random province_state_id
INSERT INTO Provinces_States (province_state_id, country_code, province_state_name) VALUES
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Alberta'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'British Columbia'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Manitoba'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'New Brunswick'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Newfoundland and Labrador'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Nova Scotia'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Ontario'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Prince Edward Island'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Quebec'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Saskatchewan'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Northwest Territories'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Nunavut'),
(SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'CA', 'Yukon');

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
    state_province,
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


INSERT INTO Genres (genre_id, name) VALUES ('1', 'Science'),('2', 'Fiction'),('3', 'Non-Fiction');
INSERT INTO powerUsers (email,password,role) VALUES ('juniorhoza56@gmail.com','$2b$10$ksGTrtCJ4NCjqcYwar5vh.sW0lBLGlVY5TlJ8oVwVducQ13/YixcO',"super_admin");
INSERT INTO powerUsers ( email,password,role) VALUES ( 'franklinwebdev704@gmail.com','$2b$10$ksGTrtCJ4NCjqcYwar5vh.sW0lBLGlVY5TlJ8oVwVducQ13/YixcO',"super_admin");

-- password = plaintextpassword
