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
    ('Widget', 'general', 14.99, 12),
    ('Thingamajiggy', 'general', 12.49, 10),
    ('Whats-its', 'sports', 9.99, 45),
    ('Doodads', 'sports', 12.49, 6),
    ('Toothpaste', 'home', 4.99, 5),
    ('Toothbrush', 'home', 8.99, 2),
    ('Dental floss', 'home', 2.99, 20),
    ('Mouthwash', 'home', 15.99, 12),
    ('Bar soap', 'home', 8.99, 23),
    ('Bath towel', 'home', 12.99, 10);

select * from products;

create table departments (
    department_id int not null auto_increment,
    department_name varchar(50),
    over_head_costs decimal(11,2) default 10000,
    primary key(department_id)
);

select * from departments;

# populate departments with any departments from products
insert into departments (department_name) select distinct department_name from products;

select * from departments;

# add product_sales to products table
alter table products add column product_sales decimal (11,2) default 0;


# test new department
insert into departments (department_name, over_head_costs) values ('grocery', 10000);

#test department sales
select departments.department_id, departments.department_name, departments.over_head_costs, 
	sum(ifnull(products.product_sales,0)) as total_sales, sum(ifnull(products.product_sales,0)) - over_head_costs as total_profit 
    from departments left join products 
		on departments.department_name = products.department_name 
	group by department_id;
