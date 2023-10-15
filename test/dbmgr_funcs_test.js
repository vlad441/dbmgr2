let DBMgr = require("../dbmgr.js"); const performance = require("perf_hooks").performance; let dbmgr=[],collection=[];

dbmgr.push(DBMgr()); // ram engine (default)
// mongo engine
dbmgr.push(DBMgr("mongodb", require("./auth_testdata.confg.js")));
for(let i in dbmgr){ console.log("dbmgr"+i, dbmgr[i].engine); }
let stats={ok:0,errors:0,expected:{ok:0,neok:0}};

async function multiexec(methodname, margs, options={}){ let time1, resp, summoner=dbmgr; if(options.summoner){ summoner=options.summoner; }
	margs1=[]; for(let i=0;i<dbmgr.length;i++){ margs1[i]=JSON.parse(JSON.stringify(margs)); }
	for(let i in summoner){ try{ time1=performance.now(); resp = await summoner[i][methodname](...margs1[i]); stats.ok+=1; }
		catch(err){ resp="(Error:"+err+")"; if(options.detail){ console.log(err); } stats.errors+=1; }
		console.log(TimeToMs(performance.now()-time1), dbmgr[i].engine+":", methodname
			+"("+(()=>{ if(options.showargs){ return JSON.stringify(margs); } return ""; })()+")", resp); } console.log();
	if(JSON.stringify(margs)===JSON.stringify(options.expected)){ stats.expected.ok+=1; }else{ stats.expected.neok+=1;} }
	
async function perfbench(methodname, margs, options={}){ let time1, resp, summoner=dbmgr[0]; if(options.summoner){ summoner=options.summoner; }
	console.log("perfbench ------> ", methodname, "("+(()=>{ if(options.showargs){ return JSON.stringify(margs); } return ""; })()+") ------");
	try{ time1=performance.now(); resp = await summoner[i][methodname](margs); }
	catch(err){ resp="(Error:"+err+")"; if(options.detail){ console.log(err); } stats.errors+=1; }
	console.log(summoner.engine+":", TimeToMs(performance.now()-time1), resp); console.log(); }

async function test_funcs(){ let methodname=""; console.log("dbmgr functions test...");
	let methods=[["connect",{args:[],expected:true}], ["listDatabases",{args:[],expected:['admin','config','local','testdb']}], ["listCollections",{args:[],expected:['users','tabletest']}],
		["createCollection", {args:["suka"],expected:"", showargs:true}],
		["createCollection", {args:["suka"],expected:"", showargs:true}],
		["dropCollection", {args:["suka"],expected:"", showargs:true}],
		["dropCollection", {args:["suka22"],expected:"", showargs:true}],
		["stats", {args:[],expected:""}],
	];
	for(let i in methods){ await multiexec(methods[i][0], methods[i][1].args, {expected: methods[i][1].expected, showargs: methods[i][1].showargs, detail: false}); }

	for(let i in dbmgr){ collection.push(dbmgr[i].collection("tabletest")); }
	methods=[["elemsCount",{args:[],}],
		["insert", {args:[{test:"12ggf", hji:"1212", kk:0, cash: {"USD":0.44,"UAH":0.15}, hunta:{erase:{vavan:12, sup:{a:214}}, vava:11}}],expected:""}],
		["insertOne", {args:[{_id:"sdsd2", test:"1223", hji:"1212", kk:0, cash: {"USD":0.46,"UAH":0.16}, hunta:{erase:{vavan:1, sup:{a:22}}, vava:89}}],expected:""}],
		["insertMany", {args:[[{_id:1, test:"12", hji:"1212", kk:0, cash: {"USD":0.41,"UAH":0.55}, hunta:{erase:{vavan:1, sup:{a:2}}, vava:1}},
			{_id:2, test:"15", hji:"189", kk:5, cash: {"USD":0.12,"UAH":0.99}, hunta:{erase:{vavan:1, sup:{a:89}}, vava:0}},
			{_id:3, test:"14", hji:"119", kk:12, cash: {"USD":0.02,"UAH":0.12}, hunta:{erase:{vavan:4, sup:{a:89}}, vava:1}},
			{_id:5, test:"19", hji:"149", kk:5, cash: {"USD":0.03,"UAH":0.21}, hunta:{erase:{vavan:1, sup:{a:89}}, vava:7}},
			{_id:"sd23ds", test:"19", hji:"149", kk:5, cash: {"USD":0.06,"UAH":0.33}, hunta:{erase:{vavan:1, sup:{a:89}}, vava:7}},
			{test:"19", hji:"149", kk:5, cash: {"USD":0.04,"UAH":0.34}, hunta:{erase:{vavan:1, sup:{a:89}}, vava:7}}]],expected:""}],
		["findOne", {args:[{_id:{$type:"number"}}, {sort:{_id:-1},fields:{_id:1}}],expected:"", showargs:true}],
		["get", {args:[1, {"cash.UAH":1}]}],
		["set", {args:["sd23ds", {"raz": "dva"}], showargs:true}],
		["set", {args:["nemae_takogo_id", {"tut": "nichego net"}], showargs:true}],
		["find", {args:[{"cash.UAH": {$gt:0.5}}, {fields:{"cash.UAH":1}}], showargs:true}],
		["findOne", {args:[],expected:""}],
		["update", {args:[{},{$set: {vasso:1212}}],expected:"", showargs:true}],
		["updateOne", {args:[{},{$set: {vasso:1212}}],expected:"", showargs:true}],
		["updateMany", {args:[],expected:"", showargs:true}],
		["replace", {args:[],expected:""}],
		["replaceOne", {args:[],expected:""}],
		["deleteOne", {args:[],expected:""}],
		["stats", {args:[],expected:""}],
		["deleteMany", {args:[],expected:""},],
	];

	for(let i in methods){ await multiexec(methods[i][0], methods[i][1].args, {summoner:collection,expected: methods[i][1].expected, showargs: methods[i][1].showargs, detail: true}); }


	console.log("==== Results ====", stats);
	for(let i in dbmgr){ if(dbmgr[i].engine==="mongodb"){ dbmgr[i].dbclient.close(); }; }
}

async function test_spec(){ let methodname=""; console.log("dbmgr special function test...");
	await multiexec("connect", [], {});
	
	for(let i in dbmgr){ collection.push(dbmgr[i].collection("tabletest")); }
	methods=[["insertMany", {args:[[{_id:1, test:"12", hji:"1212", kk:0, cash: {"USD":0.41,"UAH":0.55}, hunta:{erase:{vavan:1, sup:{a:2}}, vava:1}},
			{_id:2, test:"15", hji:"189", kk:5, cash: {"USD":0.12,"UAH":0.99}, hunta:{erase:{vavan:1, sup:{a:89}}, vava:0}},
			{_id:3, test:"14", hji:"119", kk:12, cash: {"USD":0.02,"UAH":0.12}, hunta:{erase:{vavan:4, sup:{a:89}}, vava:1}},
			{_id:5, test:"19", hji:"149", kk:5, cash: {"USD":0.03,"UAH":0.21}, hunta:{erase:{vavan:1, sup:{a:89}}, vava:7}},
			{_id:"sd23ds", test:"19", hji:"149", kk:5, cash: {"USD":0.06,"UAH":0.33}, hunta:{erase:{vavan:1, sup:{a:89}}, vava:7}},
			{test:"19", hji:"149", kk:5, cash: {"USD":0.04,"UAH":0.34}, hunta:{erase:{vavan:1, sup:{a:89}}, vava:7}}]],expected:""}],
		["deleteMany", {args:[],expected:""},],
	];
	for(let i in methods){ await multiexec(methods[i][0], methods[i][1].args, {summoner:collection,expected: methods[i][1].expected, showargs: methods[i][1].showargs, detail: true}); }


	console.log("==== Results ====", stats);
	for(let i in dbmgr){ if(dbmgr[i].engine==="mongodb"){ dbmgr[i].dbclient.close(); }; }
}
test_funcs();
//test_spec();

function TimeToMs(time){ return Number((time).toFixed(3)); }
function BytesToMB(bytes){ return Number((bytes/1024/1024).toFixed(3)); }
