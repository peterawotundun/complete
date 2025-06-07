CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0;
UPDATE users SET is_admin = 1 WHERE email = 'drrexgadgets@gmail.com';