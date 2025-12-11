
select database();
show tables;

-- users 테이블 생성
-- 회원가입 → pending(승인,대기), 관리자 승인 → active(정상), 규정 위반 → suspended(정지)
create table users(
	id					varchar(50)		primary key,
	pwd				varchar(100)  not null,
	hospital			varchar(40),
	department		varchar(20),
	name				varchar(10)		not null,
	email				varchar(40)		not null,
	phone			char(13)			not null,
	regdate			timestamp 	default CURRENT_TIMESTAMP(),
	status 			ENUM('active', 'pending', 'suspended') DEFAULT 'pending',  
	role				ENUM('admin', 'user', 'temporary') DEFAULT 'temporary'	
);

drop table users;

desc users;
select * from users;
-- delete from users where id = 'df';

select count(*) as count, id, role, status 
                from users 
                where id='test' and pwd='1234' 
                group by id, role, status;
update users set status='active', role='admin' where id='medical';
select * from users;
select * from users where role != 'admin';
desc users;








