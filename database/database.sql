
create table towns(
	id serial primary key,
	town text not null,
    town_tag text not null
);

create table numbers (
    plate_numbers text not null,
	town_id int not null references towns (id)
);