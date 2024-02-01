-- schema.sql

drop database if exists divisin;
drop user if exists 'divisin-user'@'localhost';

create database divisin;

use divisin;

create user 'divisin-user'@'localhost' identified by 'divisin-pass';
alter user 'divisin-user'@'localhost' identified with mysql_native_password by 'divisin-pass';
grant select, insert, update, delete on divisin.* to 'divisin-user'@'localhost';

create table users (
    `id` varchar(100) not null,
    `email` varchar(100) not null,
    `password` varchar(100) not null,
    `created_at` datetime not null,
    unique key `idx_email` (`email`),
    primary key (`id`)
) engine=innodb default charset=utf8;

create table images (
    `id` varchar(100) not null,
    `user_id` varchar(100) not null,
    `url` varchar(500) not null,
    `created_at` datetime not null,
    primary key (`id`),
    foreign key (`user_id`) references users(`id`)

) engine=innodb default charset=utf8;