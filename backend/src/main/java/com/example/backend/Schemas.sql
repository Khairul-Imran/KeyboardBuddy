drop database if exists keyboardbuddy;

create database keyboardbuddy;
use keyboardbuddy;

create table users (
    user_id int auto_increment not null,
    joined_date timestamp default current_timestamp not null,
    username varchar(64) unique not null,
    email varchar(128) unique not null,
    password varchar(128) not null,

    primary key(user_id)
);

-- One to one
create table user_profiles (
    profile_id int auto_increment not null,
    tests_completed int not null,
    time_spent_typing int not null,
    current_streak int not null,
    selected_theme varchar(64),
    has_premium boolean default false,
    user_id int not null,

    primary key(profile_id),
    foreign key(user_id) references users(user_id)
);

-- One to many
create table test_data (
    test_data_id int auto_increment not null,
    test_date timestamp default current_timestamp not null,
    test_type varchar(64),
    words_per_minute int,
    accuracy int,
    time_taken int,
    user_id int not null,

    primary key(test_data_id),
    foreign key(user_id) references users(user_id)
);

-- One to many
-- To be used for leaderboards too
create table personal_records (
    personal_records_id int auto_increment not null,
    test_date timestamp default current_timestamp not null,
    test_type varchar(64),
    words_per_minute int,
    accuracy int,
    time_taken int,
    user_id int not null,

    primary key(personal_records_id),
    foreign key(user_id) references users(user_id)
);

