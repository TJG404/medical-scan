
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
-- delete from users where id = 'df';

select count(*) as count, id, role 
	from users 
	where id='test' and pwd='dfdfdfdfdf' 
	group by id, role ;






