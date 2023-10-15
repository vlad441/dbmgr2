[![Version npm](https://img.shields.io/npm/v/dbmgr2.svg?logo=npm)](https://www.npmjs.com/package/dbmgr2) [![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README-EN.md) [![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README.md) [![Github link](https://img.shields.io/badge/github-gray)](https://github.com/vlad441/dbmgr2)

This library is an attempt to implement a universal wrapper for storing and working with data, aiming to include methods from popular databases, for example `mongodb`.
This wrapper aims to simplify working with databases by providing a unified interface, while also offering its own solutions.

- [Supported Implementations](#supported-implementations)
- [Supported APIs](#supported-apis)

## Supported Implementations
dbmgr2 allows the inclusion of external `engine` modules, imported from `./engines`. 
Each of these modules should implement methods from [Supported APIs](#supported-apis)
At the moment, the following solutions are implemented:
- `ram` - an implementation for working in RAM, primarily emulating MongoDB behavior.
- `mongodb` - provides wrappers over MongoDB driver methods.

## Example
```js
let DBMgr = require("dbmgr2"); 
const performance = require("perf_hooks").performance; 

dbmgr = DBMgr(); // "ram" engine is used by default

let mongo_conn = { // your mongodb connection data;
	host: "", port: 27017, dbname: "",
	login: "", pass: "", };

(async function(){
	await example(); // operations are performed directly in memory
	dbmgr = DBMgr("mongodb", mongo_conn); // switching the database
	example(); // wrapper methods remain the same
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
```

## Supported APIs
At the moment, only a partial implementation of the [specification](https://mongodb.github.io/node-mongodb-native/6.1/classes/Db.html) of the MongoDB API is supported.
You can learn more about the implemented methods in the [documentation](docs/dbmgr-en.md).