-- SQL script to create database and user for local development (MariaDB / MySQL)
-- Password set to 1234 for local testing (change in production!)

CREATE DATABASE IF NOT EXISTS `events_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'events_user'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON `events_db`.* TO 'events_user'@'localhost';
FLUSH PRIVILEGES;

-- You can run this in phpMyAdmin (Import) or from the mysql client shipped with XAMPP:
-- c:\xampp\mysql\bin\mysql.exe -u root < create_db.sql
