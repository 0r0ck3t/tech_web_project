-- Script to create admin users for Disney Characters Application
-- Run this after starting the application for the first time

-- Create default admin user
-- Username: admin
-- Password: admin123
-- Email: admin@disney.com
INSERT INTO users (username, password, email, role, enabled) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye/Ci7nU0PX1azXTXrg.kFk9D4dFo0NQy', 'admin@disney.com', 'ADMIN', true)
ON DUPLICATE KEY UPDATE username = username;

-- Create default employee user
-- Username: employee
-- Password: employee123
-- Email: employee@disney.com
INSERT INTO users (username, password, email, role, enabled) 
VALUES ('employee', '$2a$10$dXJ3SW6G7P50lGFveLufXOYxYjS.oW.Tg.k1brS7.mJgUh0UZ/Lty', 'employee@disney.com', 'EMPLOYEE', true)
ON DUPLICATE KEY UPDATE username = username;

-- Create default regular user
-- Username: user
-- Password: user123
-- Email: user@disney.com
INSERT INTO users (username, password, email, role, enabled) 
VALUES ('user', '$2a$10$E0RV5N8DQnH9qHR8zwCcC.HcX9LqHBVN7yQ6qh3UvWL8gP6LqT3ea', 'user@disney.com', 'USER', true)
ON DUPLICATE KEY UPDATE username = username;

-- Display created users
SELECT id, username, email, role, enabled FROM users;

-- To promote an existing user to admin, use:
-- UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';

-- To promote an existing user to employee, use:
-- UPDATE users SET role = 'EMPLOYEE' WHERE username = 'your_username';

