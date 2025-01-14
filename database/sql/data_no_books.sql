INSERT INTO Genres (genre_id, name, seo_friendly_title) VALUES 
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Science, Math, and Engineering', 'science-math-engineering'),
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Computer and Technology', 'computer-technology'),
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Finance', 'finance'),
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Personal Development', 'personal-development'),
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Investing', 'investing'),
    (SUBSTRING(MD5(RAND()) FROM 1 FOR 64), 'Business', 'business');



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


INSERT INTO powerUsers ( email,password,role) VALUES 
( 'franklinwebdev704@gmail.com','$2b$10$ksGTrtCJ4NCjqcYwar5vh.sW0lBLGlVY5TlJ8oVwVducQ13/YixcO',"super_admin");

