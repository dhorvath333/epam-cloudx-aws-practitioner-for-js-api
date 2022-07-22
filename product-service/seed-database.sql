create extension if not exists "uuid-ossp";

create table product (
	id uuid not null default uuid_generate_v4() primary key,
	title text not null,
	description text not null,
	price integer not null
);

create table stock (
	product_id uuid not null primary key,
	count integer not null default 0,
	foreign key (product_id) references product(id)
);

insert into product (title, description, price) values ('Fender Stratocaster', '', 800);
insert into product (title, description, price) values ('Gibson Les Paul', '', 2500);
insert into product (title, description, price) values ('Fender Telecaster', '', 900);
insert into product (title, description, price) values ('PRS Custom 24', '', 930);
insert into product (title, description, price) values ('Gibson SG', '', 1300);
insert into product (title, description, price) values ('Jackson Soloist', '', 1200);
insert into product (title, description, price) values ('Ibanez RG', '', 450);
insert into product (title, description, price) values ('Epiphone Casino', '', 700);
insert into product (title, description, price) values ('Gibson Flying V', '', 2000);

insert into stock (product_id, count) values ((select id from product where title = 'Fender Stratocaster'), 17);
insert into stock (product_id, count) values ((select id from product where title = 'Gibson Les Paul'), 3);
insert into stock (product_id, count) values ((select id from product where title = 'Fender Telecaster'), 19);
insert into stock (product_id, count) values ((select id from product where title = 'PRS Custom 24'), 15);
insert into stock (product_id, count) values ((select id from product where title = 'Gibson SG'), 17);
insert into stock (product_id, count) values ((select id from product where title = 'Jackson Soloist'), 5);
insert into stock (product_id, count) values ((select id from product where title = 'Ibanez RG'), 25);
insert into stock (product_id, count) values ((select id from product where title = 'Epiphone Casino'), 20);
insert into stock (product_id, count) values ((select id from product where title = 'Gibson Flying V'), 7);
