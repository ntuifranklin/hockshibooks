-- Dropping all the views first
DROP VIEW IF EXISTS SecureCustomerOrders;
DROP VIEW IF EXISTS SecureCustomers;
DROP VIEW IF EXISTS SecureInventory;

-- Drop Tables with IF EXISTS, Dropping Slave Tables First
DROP TABLE IF EXISTS Book_Reviews;
DROP TABLE IF EXISTS Order_Items;
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Promotions;
DROP TABLE IF EXISTS Shipping_Carriers;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Provinces_States;
DROP TABLE IF EXISTS Countries;

-- Customers Table
CREATE TABLE Customers (
    customer_id VARCHAR(64) PRIMARY KEY,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL,
    salt VARCHAR(16) NOT NULL,
    password VARCHAR(256) NOT NULL,
    street_address VARCHAR(256) NOT NULL,
    city VARCHAR(128) NOT NULL,
    state_province VARCHAR(128) NOT NULL,
    postal_zipcode VARCHAR(32) NOT NULL,
    phone VARCHAR(32) NOT NULL
);

-- Books Table
CREATE TABLE Books (
    book_id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    author VARCHAR(256) NOT NULL,
    ISBN VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    genre VARCHAR(128),
    publication_date DATE,
    language VARCHAR(64),
    cover_image_url VARCHAR(1024)
);

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
    postal_code
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
    book_id,
    title,
    author,
    description,
    price,
    quantity_available
FROM Inventory;


