DROP DATABASE IF EXISTS hockshisessions;

CREATE DATABASE IF NOT EXISTS hockshisessions;
USE hockshisessions;

DROP TABLE IF EXISTS sessions;

CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data TEXT
);