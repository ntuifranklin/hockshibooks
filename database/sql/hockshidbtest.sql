-- Dropping all the views first
DROP VIEW IF EXISTS SecureCustomerOrders;
DROP VIEW IF EXISTS SecureCustomers;
DROP VIEW IF EXISTS SecureInventory;

-- Drop Tables with IF EXISTS, Dropping Slave Tables First
DROP TABLE IF EXISTS SequelizeMeta;

DROP TABLE IF EXISTS Book_Reviews;

DROP TABLE IF EXISTS BooksGenres;

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

-- Genres Table
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


/*!40000 ALTER TABLE `Books` ENABLE KEYS */;

CREATE TABLE BooksGenres (
	book_genre_id VARCHAR(64) PRIMARY KEY,
    book_id VARCHAR(64) NOT NULL,
    genre_id VARCHAR(64) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)   
);

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

