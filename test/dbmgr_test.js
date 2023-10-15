let DBMgr = require("../dbmgr.js"); let rl = require('readline').createInterface({input: process.stdin}); 
const performance = require("perf_hooks").performance; let dbmgr=[]; engines=["ram","mongodb"];
for(let i in engines){ let dbconn = require("./auth_testdata.confg.js"); dbmgr.push(DBMgr(engines[i], dbconn)); }
let collection=[]; let stats={ok:0,errors:0};

(async function(){
	for(let i in dbmgr){ console.log("dbmgr"+i, dbmgr[i].engine); dbmgr[i].settings.debug=true;
	await dbmgr[i].connect(); }
	test1(); })();

async function multiexec(methodname, margs, options={}){ let time1, resp, summoner=dbmgr; if(options.summoner){ summoner=options.summoner; }
	margs1=[]; for(let i=0;i<dbmgr.length;i++){ margs1[i]=JSON.parse(JSON.stringify(margs)); }
	for(let i in summoner){ try{ time1=performance.now(); resp = await summoner[i][methodname](...margs1[i]); stats.ok+=1; }
		catch(err){ resp="(Error:"+err+")"; if(options.detail){ console.log(err); } stats.errors+=1; }
		console.log(TimeToMs(performance.now()-time1), dbmgr[i].engine+":", methodname
			+"("+(()=>{ if(options.showargs){ return JSON.stringify(margs); } return ""; })()+")", resp); } console.log(); }
		
async function perfbench(methodname, margs, options={showargs:true}){ let time1, resp, summoner=dbmgr[0]; if(options.summoner){ summoner=options.summoner; }
	console.log("perfbench ------> ", methodname, "("+(()=>{ if(options.showargs){ return JSON.stringify(margs); } return ""; })()+") ------");
	try{ time1=performance.now(); resp = await summoner[methodname](...margs); }
	catch(err){ resp="(Error:"+err+")"; if(options.detail){ console.log(err); } stats.errors+=1; }
	console.log(summoner.engine+":", TimeToMs(performance.now()-time1), resp); console.log(); }

async function test1(){

	for(let i in collection){
		await collection[i].insertMany([{_id:1, test:"12", hji:"1212", kk:0, cash: {"USD":0.41,"UAH":0.55}, hunta:{erase:{vavan:1, sup:{a:2}}, vava:1}},
		{_id:2, test:"15", hji:"189", kk:5, cash: {"USD":0.12,"UAH":0.46}, hunta:{erase:{vavan:1, sup:{a:89}}, vava:0}},
		{_id:3, test:"14", hji:"119", kk:12, cash: {"USD":0.02,"UAH":0.12}, hunta:{erase:{vavan:4, sup:{a:89}}, vava:1}},
		{_id:5, test:"19", hji:"149", kk:5, cash: {"USD":0.6,"UAH":0.66}, hunta:{erase:{vavan:1, sup:{a:89}}, vava:7}}]);
	}

    let methods=[["find", {args:[{"cash.UAH": {$gt:0.5}}, {fields:{"cash.UAH":1}}]}],["elemsCount",{args:[]}],];
	for(let i in methods){ await multiexec(collection, methods[i][0], methods[i][1].args, {expected: methods[i][1].expected, showargs: methods[i][1].showargs, detail: true}); }

	console.log("==== Results ====", stats);
	//for(let i in collection){ await collection[i].deleteMany(); } for(let i in dbmgr){ if(dbmgr[i].engine==="mongodb"){ dbmgr[i].dbclient.close(); }; }
}

async function FillTest(collectionName="suka", document={tests:"expects"}, count=1000000, summoner=dbmgr[0])
{ let tasks=[]; await summoner.createCollection(collectionName); let time1 = performance.now();
	for(let i=0;i<count;i++){ tasks.push(summoner.insertOne(collectionName,document)); }
	let resp = await Promise.all(tasks); 
	for(let i in resp){ if(!resp[i].ok){ console.log("FillTest err:", resp[i].reason); } }
	console.log("FillTest: ", TimeToMs(performance.now()-time1)); }
	
async function FillTest_v2(collectionName="suka", count=1000000, summoner=dbmgr[0])
{ let docks=[]; await summoner.createCollection(collectionName); let time1 = performance.now();
	for(let i=0;i<count;i++){ docks.push({_id:i,value:Math.random()*100,opts:{val:Math.random(),name:"vasso"}}); }
	let resp = await summoner.insertMany(collectionName, docks); 
	if(!resp.ok){ console.log("FillTest_v2 err:", resp.reason); }
	console.log("FillTest_v2: ", TimeToMs(performance.now()-time1)); }
	
async function DBSize(summoner=dbmgr[0])
{ let stats = await summoner.stats(); console.log("Данных в базеечке:", BytesToMB(stats.dataSize), "Mb"); }

rl.prompt(); rl.on('line', (input) => { oninput(input); });

async function oninput(msg){ evalfunc(msg).then(function(result){ console.log("> ", result); }); }
async function evalfunc(code){ let result = ""; try{ result = await eval(code); }catch(err){ result = err; } return result; }

function TimeToMs(time){ return Number((time).toFixed(3)); }
function BytesToMB(bytes){ return Number((bytes/1024/1024).toFixed(3)); }
