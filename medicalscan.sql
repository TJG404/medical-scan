-- CREATE TABLE users (
-- user_code INT AUTO_INCREMENT PRIMARY KEY,
-- account_type ENUM('admin', 'user', 'temporary') DEFAULT 'temporary',
-- userid VARCHAR(20) NOT NULL UNIQUE CHECK(username REGEXP '^[a-zA-Z0-9-_]{6,20}$'),
-- password VARCHAR(255) NOT NULL CHECK(password REGEXP '^[A-Za-z0-9]*[!@#$%^&*][A-Za-z0-9]*$'),
-- hospital_name VARCHAR(40),
-- department VARCHAR(20),
-- name VARCHAR(10) NOT NULL CHECK (name REGEXP '^[가-힣]{2,5}$'),
-- email VARCHAR(40) NOT NULL UNIQUE CHECK (email REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
-- phone CHAR(13) NOT NULL UNIQUE,
-- otp_key VARCHAR(255) NOT NULL UNIQUE,
-- status ENUM('active', 'pending', 'suspended') DEFAULT 'pending',
-- fail_count TINYINT DEFAULT 0,
-- reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- )AUTO_INCREMENT=1001;

select database();
show tables;

-- users 테이블 생성
create table users(
	id					varchar(50)		primary key,
	pwd				varchar(100)  not null,
	hospital			varchar(40),
	department		varchar(20),
	name				varchar(10)		not null,
	email				varchar(40)		not null,
	phone			char(13)			not null,
	regdate			timestamp 	default CURRENT_TIMESTAMP(),
	role				ENUM('admin', 'user', 'temporary') DEFAULT 'temporary'	
);

desc users;
select * from users;





