module.exports = {

    'url' : 'mongodb://localhost:27017' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};

//create table todo(id int not null auto_increment, text varchar(1024), createdOn timestamp, endDate date, done tinyint(1), primary key(id));
//drop table todo;
//insert into todo(text,createdOn, endDate, done) values('Node.js',now(), '2015-11-29', 0);
//select * from todo;