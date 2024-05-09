create table blogs (
  id serial primary key,
  author text,
  url text not null,
  title text not null,
  likes integer default 0
);

insert into blogs (url, title) values ('https://simonplend.com/deploying-a-node-app-and-postgres-database-to-fly-io/','Deploying a Node App and Postgres Database to fly.io');
insert into blogs (author, url, title, likes) values ('Simon Plenderleith', 'https://simonplend.com/command-line-argument-parsing-with-node-js-core/', 'Command-line argument parsing with Node.js core', 5);