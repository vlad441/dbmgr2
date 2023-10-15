const MongoClient = require('mongodb').MongoClient;
const rl = require('readline').createInterface({input: process.stdin});
const ObjectId = require('mongodb').ObjectId;

let dbparams = require("./auth_testdata.confg.js");
// Connection URI
let uri = "mongodb://"+dbparams.host+":"+dbparams.port;
if(dbparams.login){ uri = "mongodb://"+dbparams.login+":"+dbparams.pass+"@"+dbparams.host+":"+dbparams.port+"?ssl="+dbparams.ssl; if(dbparams.replicaSet){ uri+="&replicaSet="+dbparams.replicaSet; } if(dbparams.tlsAllowInvalidCertificates){ uri+="&tlsAllowInvalidCertificates="+dbparams.tlsAllowInvalidCertificates; } }
//if(dbparams.login){ uri = "mongodb+srv://"+dbparams.login+":"+dbparams.pass+"@mycluster.iokvq.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"; }
//if(dbparams.login){ uri = "mongodb://root:"+dbparams.pass+"@mycluster-shard-00-00.iokvq.gcp.mongodb.net:27017,mycluster-shard-00-01.iokvq.gcp.mongodb.net:27017,mycluster-shard-00-02.iokvq.gcp.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-fbvi50-shard-0&authSource=admin&retryWrites=true&w=majority"; }
const dbclient = new MongoClient(uri, { useUnifiedTopology : true });
let db; console.log("Test MongoDB Shell.");

(async function(){
	console.log("Подключение по uri:", uri);
	try{await dbclient.connect();}catch(err){ console.log("Ошибка подключения к базе: ", err.message); process.exit(); }
	console.log("Подключено. Грузим базу "+dbparams.dbname);
	db = dbclient.db(dbparams.dbname);
	console.log("Загружено. ожидаем команды...");
	//let collection = db.collection('documents');
	//console.log(collection);
	rl.prompt(); rl.on('line', (input) => { oninput(input); });
})();

async function oninput(msg){ evalfunc(msg).then(function(result){ console.log("> ", result); }); }

async function evalfunc(code){ let result = "";
  try{ result = await eval(code); }
  catch(err){ result = err.name+": "+err.message; } return result; }

async function WriteTest()
{ let tasks=[]; let time1 = new Date().getTime(); for(let i=0;i<10000;i++){ tasks.push(db.collection("crashtest").insertOne({_id:i, data:ObjectId().toString(), tmp1: "sdsdsdsccccccccssdsdsdsdreddfdfdf", tmp2: { tempest: "tempest", t2:"Суперприставка Т2, покупайте."}})); }
	let resp = await Promise.all(tasks); console.log("Время: ", new Date().getTime()-time1); }

// dbclient.db().admin().listDatabases()
// db.stats() - Размер базы в байтах.
// db.command({usersInfo: 1 }); - локальный список юзверей выбр. базы
// dbclient.db().admin().command({usersInfo: 1 }); - Список юзверей в admin db
// db.listCollections().toArray(); -  список коллекций
// db.collection("test1").find().toArray(); - список документов
// db.collection("test1").findOne(); - найти один документ
// db.collection("test1").insertOne().insertedCount; - вставить один документ
// db.collection("test1").countDocuments() - кол-во документов;
// dbclient.db().admin().addUser("adm", "123", { roles: [ { role: "root", db: "admin" } ]});
// dbclient.db().admin().removeUser("adm");


// (async function(){ let time1 = new Date().getTime(); db.collection("test1").find().toArray(); console.log(time1 = new Date().getTime()-time1, "msec"); })();
// (async function(){ let time1 = new Date().getTime(); let collection = db.collection("test1"); collection = await collection.find(); console.log(new Date().getTime()-time1, "msec", collection); })();
// test req time
// (function(){ let time1 = new Date().getTime(); db.collection("test1").find().toArray().then(function(resp){ console.log((new Date().getTime()-time1), "msec", resp); }); })();
