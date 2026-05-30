CREATE DATABASE IF NOT EXISTS hospital_safety
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

DROP USER IF EXISTS 'hospital_user'@'localhost';
DROP USER IF EXISTS 'hospital_user'@'127.0.0.1';

CREATE USER 'hospital_user'@'localhost'
  IDENTIFIED WITH caching_sha2_password
  BY 'Jaso#1087046900';

CREATE USER 'hospital_user'@'127.0.0.1'
  IDENTIFIED WITH caching_sha2_password
  BY 'Jaso#1087046900';

GRANT ALL PRIVILEGES ON hospital_safety.* TO 'hospital_user'@'localhost';
GRANT ALL PRIVILEGES ON hospital_safety.* TO 'hospital_user'@'127.0.0.1';

GRANT CREATE, DROP, ALTER, REFERENCES ON *.* TO 'hospital_user'@'localhost';
GRANT CREATE, DROP, ALTER, REFERENCES ON *.* TO 'hospital_user'@'127.0.0.1';

FLUSH PRIVILEGES;
