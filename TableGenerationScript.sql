/* 
This script is used to generate the tables for the database in the case of a fresh install or if the db is lost.
create a database called 6003_CW and run this script to generate the tables needed for the API to work.
then run the insert data scripts to populate the tables with data.
*/

USE `6003_CW`;

create table addresses
(
    id            int auto_increment
        primary key,
    user_id       int                                 not null,
    address_line1 varchar(255)                        not null,
    address_line2 varchar(255)                        null,
    city          varchar(100)                        not null,
    postcode      varchar(15)                         not null,
    country       varchar(50)                         not null,
    created_at    timestamp default CURRENT_TIMESTAMP null,
    updated_at    timestamp                           null on update CURRENT_TIMESTAMP,
    constraint addresses_ibfk_1
        foreign key (user_id) references `6003_CW`.users (id)
);

create index user_id
    on addresses (user_id);

create table categories
(
    id          int auto_increment
        primary key,
    name        varchar(255)                        not null,
    description text                                null,
    created_at  timestamp default CURRENT_TIMESTAMP null,
    updated_at  timestamp                           null on update CURRENT_TIMESTAMP,
    constraint name
        unique (name)
);

create table orders
(
    id          int auto_increment
        primary key,
    user_id     int                                   not null,
    product_id  int                                   not null,
    total_price float(10, 2)                          not null,
    status      varchar(50) default 'pending'         not null,
    address_id  int                                   null,
    created_at  timestamp   default CURRENT_TIMESTAMP null,
    updated_at  timestamp                             null on update CURRENT_TIMESTAMP,
    constraint orders_ibfk_1
        foreign key (user_id) references `6003_CW`.users (id),
    constraint orders_ibfk_2
        foreign key (address_id) references `6003_CW`.addresses (id)
);

create index address_id
    on orders (address_id);

create index user_id
    on orders (user_id);

create table products
(
    id          int auto_increment
        primary key,
    name        varchar(255)                         not null,
    description text                                 null,
    creator     varchar(255)                         null,
    price       float(10, 2)                         not null,
    sold        tinyint(1) default 0                 not null,
    category_id int                                  null,
    image_url   varchar(255)                         null,
    created_at  timestamp  default CURRENT_TIMESTAMP null,
    updated_at  timestamp                            null on update CURRENT_TIMESTAMP,
    constraint products_ibfk_1
        foreign key (category_id) references `6003_CW`.categories (id)
);

create index category_id
    on products (category_id);

create table roles
(
    name        varchar(16) not null
        primary key,
    description text        null,
    constraint name
        unique (name)
);

create table users
(
    id           int auto_increment
        primary key,
    role         varchar(16) default 'user'            not null,
    username     varchar(20)                           not null,
    first_name   varchar(255)                          not null,
    last_name    varchar(255)                          not null,
    email        varchar(255)                          not null,
    password     varchar(255)                          not null,
    phone_number varchar(255)                          null,
    created_at   timestamp   default CURRENT_TIMESTAMP null,
    updated_at   timestamp                             null on update CURRENT_TIMESTAMP,
    constraint email
        unique (email),
    constraint username
        unique (username),
    constraint users_ibfk_1
        foreign key (role) references `6003_CW`.roles (name)
);

create index role
    on users (role);


