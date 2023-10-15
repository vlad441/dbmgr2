const fs = require('fs'); module.exports = dbmgr_create;

function dbmgr_create(useengine="ram",connection={},options={}){
	let dbmgr={engine:useengine, connected:false, connection:{}, settings:{}, collections:{},}; dbmgr.connection=
	{   host: "localhost", port: 27017,
		dbname: "admin", login: "", pass: "",
		tls: true, tlsAllowInvalidCertificates:true,
		replicaSet: "", debug:false, uri:null, }; //require("./engines/"+dbmgr.engine+".js");
	for(let key in connection){ dbmgr.connection[key]=connection[key]; }
	let engine; try{ engine = require("./engines/"+dbmgr.engine+".js"); }catch{} if(engine===undefined){ throw "[dbmgr Error] Engine \""+dbmgr.engine+"\" not found"; return; }
	Object.assign(dbmgr, engine, {get, set, collection, getCollection:collection, import:dbmgr_import, setCollectionOpts, 
		_assignID, _CalcNextID, _newCollection}); return dbmgr;
}

function collection(name){ if(this.engine==="ram"){ if(!this.collections[name]){ this.createCollection(name); } }
	return {
		get: (id, fields) => this.get(name, id, fields),
		set: (id, document) => this.set(name, id, document),
		find: (filter, options) => this.find(name, filter, options),
		findOne: (filter, options) => this.findOne(name, filter, options),
		update: (filter, update) => this.updateOne(name, filter, update),
		updateOne: (filter, update) => this.updateOne(name, filter, update),
		updateMany: (filter, update) => this.updateMany(name, filter, update),
		replace: (filter, replacement, options) => this.replaceOne(name, filter, replacement, options),
		replaceOne: (filter, replacement, options) => this.replaceOne(name, filter, replacement, options),
		insert: (document, options) => this.insertOne(name, document, options),
		insertOne: (document, options) => this.insertOne(name, document, options),
		insertMany: (documents, options) => this.insertMany(name, documents),
		delete: (filter) => this.deleteOne(name, filter),
		deleteOne: (filter) => this.deleteOne(name, filter),
		deleteMany: (filter) => this.deleteMany(name, filter), elemsCount: (filter) => this.elemsCount(name, filter),
		countDocuments: (filter) => this.elemsCount(name, filter), count: (filter) => this.elemsCount(name, filter),
		stats: () => this.stats(name),
	};
};

function get(collectionName, id, fields={}){ return this.findOne(collectionName, {_id:id}, {projection:fields}); };
function set(collectionName, id, document){ return this.replaceOne(collectionName, {_id:id}, document, {upsert:true}); };

async function dbmgr_import(sourceMgr, options={}){ let targetMgr=this; let resp={collections:0,elems:0};
    if(!sourceMgr){ return Promise.reject("Both source dbmgr must be provided."); }

    if(typeof sourceMgr.listCollections !== 'function' || typeof sourceMgr.find !== 'function' || typeof targetMgr.insertMany !== 'function'){
		return Promise.reject("Either source or target wrapper doesn't have the necessary methods for importing."); }

    const collections = await sourceMgr.listCollections(); 
    const importPromises = collections.map(async (collectionName) => { resp.collections++;
        try { let data = await sourceMgr.find(collectionName, {}); resp.elems+=data.length;
			await targetMgr.createCollection(collectionName); await targetMgr.insertMany(collectionName, data);
        }catch (error){ return Promise.reject("Error importing from collection \""+collectionName+"\": "+error); }
    });
    await Promise.all(importPromises).catch(function(err){ return Promise.reject(err); });
	return resp;
}

function setCollectionOpts(collectionName, opts={}){ if(!this.collections[collectionName]){ this.collections[collectionName] = this._newCollection(); }
	for(let key in opts){ this.collections[collectionName].opts[key]=opts[key]; } return true; };

function _assignID(name){ if(this.collections[name]&&this.collections[name].opts.autoincrement){
	return this.collections[name].opts.nextid++; }else{ 
		if(this.engine==="ram"){ return "i"+Math.random().toString(36).substr(2, 9); }else{ return; } } }
	
async function _CalcNextID(name){ if(!this.collections[name]){ this.collections[name] = this._newCollection(); }
	let lastdoc = await this.findOne(name, {_id:{$type:"number"}}, {sort:{_id:-1},fields:{_id:1}});
	if(lastdoc){ this.collections[name].opts.nextid=++lastdoc._id; return; }
	else{ return "i"+Math.random().toString(36).substr(2, 9); } }
	
function _newCollection(options={}){ if(options.autoincrement===undefined){ options.autoincrement=true; }
	return { opts:{autoincrement:options.autoincrement,nextid:0}, indexes:{}, data:{}, }; }

// === other ===

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
