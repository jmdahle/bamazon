drop database if exists bamazon;
create database bamazon;
use bamazon;

create table products (
    item_id int not null auto_increment,
    product_name varchar(100) not null,
    department_name varchar(50),
    price decimal(6,2) not null,
    stock_quantity int not null default 0,
    primary key(item_id)
);


insert into products (product_name, department_name, price, stock_quantity)
values
    ('widget', 'general', 14.99, 12),
    ('thingamajiggy', 'general', 12.49, 10),
    ('whats-its', 'sports', 9.99, 45),
    ('doodads', 'sports', 12.49, 6),
    ('toothpaste', 'home', 4.99, 45),
    ('toothbrush', 'home', 8.99, 24),
    ('dental floss', 'home', 2.99, 20),
    ('mouthwash', 'home', 15.99, 12),
    ('bar soap', 'home', 8.99, 23),
    ('bath towel', 'home', 12.99, 10);

select * from products;
