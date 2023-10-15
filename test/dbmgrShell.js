const rl = require('readline').createInterface({input: process.stdin}); let DBMgr = require("../dbmgr.js");

let dbparams =
{   engine: "ram",
	host: "",
	port: 27017,
	dbname: "testdb",
	login: "",
	pass: "", }
let dbmgr = DBMgr(dbparams); let db={};
console.log("Test dbmgr Shell. Engine:", dbmgr.engine);

(async function(){
	console.log("["+dbmgr.engine+"] Подключение по uri:", dbmgr.settings.uri);
	try{await dbmgr.connect();}catch(err){ console.log("Connect Error: ", err.message); process.exit(); }
	console.log("Connected."); if(dbmgr.dbclient){ db = dbmgr.dbclient.db(dbparams.dbname); }
	rl.prompt(); rl.on('line', (input) => { oninput(input); });
})();

async function oninput(msg){ evalfunc(msg).then(function(result){ console.log("> ", result); }); }

async function evalfunc(code){ let result = "";
  try{ result = await eval(code); }
  catch(err){ result = err.name+": "+err.message; } return result; }

async function UsersInfo(dbname)
{ let resp; try{ if(dbname===undefined){ resp = await dbclient.db().admin().command({usersInfo: 1 }); }else{  resp = await dbclient.db(dbname).command({usersInfo: 1 }); } }
	catch(err){ console.log("Ошибка выполнения UsersInfo:", err.message); }
	for(let key in resp.users){ console.log(key, "| "+resp.users[key].user+" (db:"+resp.users[key].db+") | roles:", resp.users[key].roles); } }

async function WriteTest()
{ let tasks=[]; let time1 = new Date().getTime(); for(let i=0;i<10000;i++){ tasks.push(db.collection("crashtest").insertOne({_id:i, data:ObjectId().toString(), tmp1: "sdsdsdsccccccccssdsdsdsdreddfdfdf", tmp2: { tempest: "tempest", t2:"Суперприставка Т2, покупайте."}})); }
	let resp = await Promise.all(tasks); console.log("Время: ", new Date().getTime()-time1); }
