
create table towns(
	id serial primary key,
	town text not null,
    town_tag text not null
);

create table numbers (
	id serial primary key,
    plate_numbers text not null,
	town_id int not null references towns (id)
);

create table tags(
	id serial primary key,
	starts_with_tags text not null,
	ends_with text not null,
	numbers_id int not null references numbers (id)
);