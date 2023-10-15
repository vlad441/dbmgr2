[![Version npm](https://img.shields.io/npm/v/dbmgr2.svg?logo=npm)](https://www.npmjs.com/package/dbmgr2) [![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README-EN.md) [![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README.md) [![Github link](https://img.shields.io/badge/github-gray)](https://github.com/vlad441/dbmgr2)

Эта библиотека является попыткой релизации универсальной обертки для хранения и работы с данными, и стремится содержать в себе методы распространенных баз данных, к примеру `mongodb`.
Эта обертка стремится упростить работу с базами данных, предоставляя единую оберку для работы с ними, дополнительно предоставляя собственные решения.

- [Поддерживаемые реализации](#поддерживаемые-реализации)
- [Поддерживаемые API](#поддерживаемые-api)

## Поддерживаемые реализации
dbmgr2 позволяет подключать внешние модули `engine`, которые импортируются из `./engines`. 
В любом из этих модулей должны быть реализованы методы из [Поддерживаемые API](#поддерживаемые-api)
На данный момент, реализованы следующие решения:
- `ram` - реализация для работы в оперативной памяти, в основном имитирует поведение MongoDB.
- `mongodb` - содержит обертки над методами драйвера MongoDB.

## Пример
```js
let DBMgr = require("dbmgr2"); 
const performance = require("perf_hooks").performance; 

dbmgr = DBMgr(); // по умолчанию используется движок "ram"

let mongo_conn = { //ваши данные для подключения к базе mongodb;
	host: "", port: 27017, dbname: "",
	login: "", pass: "", };

(async function(){
	await example(); // выполняем операции прямо в памяти
	dbmgr = DBMgr("mongodb", mongo_conn); // меняем базу данных
	example(); // методы обертки остаются прежними
})();

async function example(){ console.log("============ Engine: ", dbmgr.engine); let time1=performance.now();
	let resp = await dbmgr.connect(); console.log(TimeToMs(performance.now()-time1), "connect:", resp); time1=performance.now();
	resp = await dbmgr.createCollection("test1"); console.log(TimeToMs(performance.now()-time1), "createCollection:", resp); time1=performance.now();
	resp = await dbmgr.insert("test1", {value: "test33", values:{subvalue:33}}); console.log(TimeToMs(performance.now()-time1), "insert:", resp);
	let collection = dbmgr.collection("test1"); time1=performance.now();
	resp = await collection.insert({value: "thevalue", values:{subvalue:13}}); console.log(TimeToMs(performance.now()-time1), "insert:", resp); time1=performance.now();
	resp = await collection.find({"values.subvalue":{$gt:30}}); time1=performance.now(); console.log(TimeToMs(performance.now()-time1), "find:", resp); time1=performance.now();
	resp = await collection.find({value:{$regex:"the"}}); time1=performance.now(); console.log(TimeToMs(performance.now()-time1), "find:", resp); time1=performance.now();
	resp = await dbmgr.dropCollection("test1"); console.log(TimeToMs(performance.now()-time1), "dropCollection:", resp);
	resp = await dbmgr.close(); console.log(TimeToMs(performance.now()-time1), "disconnected:", resp);
}

function TimeToMs(time){ return Number((time).toFixed(3)); }
```

## Поддерживаемые API
На данный момент поддерживается только частичная реализация [спецификации](https://mongodb.github.io/node-mongodb-native/6.1/classes/Db.html) MongoDB API.
Более подробно с реализованными методами вы можете ознакомиться в [документации](docs/dbmgr-ru.md)