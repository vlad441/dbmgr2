let MongoClient, ObjectId, libpath="../lib/mongodb@3.7.4.min.js";
try{ MongoClient = require(libpath).MongoClient; ObjectId = require(libpath).ObjectId; }
catch(err){ throw new Error("[dbmgr Error] Engine \"mongodb\" required npm libary \""+libpath+"\""); }

let engine = {
	async connect(){ debug=this.debug;
		if(MongoClient===undefined){ return Promise.reject("[dbmgr Error] Engine \"mongodb\" required npm libary \""+libpath+"\""); }
		// Connection URI
		let uri=this.connection.uri; if(uri===null){ uri = "mongodb://"+this.connection.host+":"+this.connection.port+"?tls="+this.connection.tls;
			if(this.connection.login){ uri = "mongodb://"+this.connection.login+":"+this.connection.pass+"@"+this.connection.host+":"+this.connection.port+"?tls="+this.connection.tls;
			if(this.connection.replicaSet){ uri+="&replicaSet="+this.connection.replicaSet; }
		  if(this.connection.tlsAllowInvalidCertificates){ uri+="&tlsAllowInvalidCertificates="+this.connection.tlsAllowInvalidCertificates; } } }
		this.dbclient = new MongoClient(uri, { useUnifiedTopology: true });

		if(debug){ console.log("[mongodb] Подключение по uri:", uri); }
		try{await this.dbclient.connect();}catch(err){ return Promise.reject("Error connect to database: "+err.message); }
		this.db = this.dbclient.db(this.connection.dbname); this.connected=true;
		if(debug){ console.log("Подключено. Подгружена база "+this.connection.dbname); } return true; },
	async close(){ return this.dbclient.close(); },

	async listDatabases(){ let db = this.db; let err={};
		let resp = await db.admin().listDatabases().catch(function(err){ err={err:true, reason:err}; });
		if(err.err){ return Promise.reject(err.reason); } let resp1=[];
		for(let key in resp.databases){ resp1.push(resp.databases[key].name); } return resp1;
		// Resp: [ 'admin', 'local', 'db1', ... , "dbN" ];
	},

	async listCollections(){ let db = this.db; let err={};
		let resp = await db.listCollections().toArray().catch(function(err){ return Promise.reject(err); });
		if(err.err){ return Promise.reject(err.reason); } let resp1=[];
		for(let key in resp){ resp1.push(resp[key].name); } return resp1;
		// Resp: [ 'collection1', ... , "collectionN" ];
	},
	// ====== mongodb wrapper ======
	async createCollection(collectionName, options={}){ try{ await this.db.createCollection(collectionName, options); return true; }catch{ return false; } },
	async dropCollection(collectionName, options={}){ try{ await this.db.dropCollection(collectionName, options); return true; }catch{ return false; } },

	async find(collectionName, filter={}, options={}){ let db = this.db; let resp={};
		if(options.fields){ options.projection=options.fields; delete options.fields; }
		resp = await db.collection(collectionName).find(filter, options); return resp.toArray(); },

	async findOne(collectionName, filter={}, options={}){ let db = this.db;
		if(options.fields){ options.projection=options.fields; delete options.fields; }
		return db.collection(collectionName).findOne(filter, options); },

	update(collectionName, filter, update){ return this.updateOne(collectionName, filter, update); },
	async updateMany(collectionName, filter={}, update={}){ let db = this.db;
		try{ let resp = await db.collection(collectionName).updateMany(filter, update); return ParseSimpleValues(resp); } 
		catch(err){ return {matchedCount: 0, modifiedCount: 0, ok:false, reason: "("+err+")"}; } },
	async updateOne(collectionName, filter={}, update={}){ let db = this.db;
		try{ let resp = await db.collection(collectionName).updateOne(filter, update); return ParseSimpleValues(resp); }
		catch(err){ return {matchedCount: 0, modifiedCount: 0, ok:false, reason: "("+err+")"}; } },

	replace(collectionName, filter={}, replacement={}, options={}){ return this.replaceOne(collectionName, filter, replacement, options={}); },
	async replaceOne(collectionName, filter={}, replacement={}, options={}){ let db = this.db, resp={modifiedCount: 0, upsertedCount: 0, matchedCount: 0, ok:false};
		let resp1={}; try{ resp1 = await db.collection(collectionName).replaceOne(filter, replacement, options); resp=ParseSimpleValues(resp1); }
		catch(err){ resp.reason="("+err+")"; return resp; } if(resp1.upsertedId){ resp.upsertedId=resp1.upsertedId._id; } return resp; },

	insert(collectionName, document){ return this.insertOne(collectionName, document); },
	async insertMany(collectionName, documents, options={}, trys=0){ let db = this.db;
		if(this.collections[collectionName]&&this.collections[collectionName].opts.autoincrement){  
			for(let doc of documents){ if(!("_id" in doc)||trys>=1){ doc._id=this._assignID(collectionName); } } }
			
		try{ let resp1 = await db.collection(collectionName).insertMany(documents); let resp=ParseSimpleValues(resp1); 
			if(resp1.insertedIds){ resp.insertedIds=Object.entries(resp1.insertedIds).map(r=>r[1]); } return resp; }
		catch(err){ if(this.collections[collectionName]&&this.collections[collectionName].opts.autoincrement&&trys<1){ 
				await this._CalcNextID(collectionName); return this.insertMany(collectionName, documents, {}, ++trys); } 
			return {insertedCount: 0, insertedIds:[], ok:false, reason:"("+err+")"}; } }, 
	async insertOne(collectionName, document, options={}, trys=0){ let db = this.db;
		if(this.collections[collectionName]&&this.collections[collectionName].opts.autoincrement){  
			if(!("_id" in document)||trys>=1){ document._id=this._assignID(collectionName); } }
			
		try{ let resp1 = await db.collection(collectionName).insertOne(document); let resp = ParseSimpleValues(resp1);
			resp.insertedId=resp1.insertedId; return resp; }
		catch(err){ if(this.collections[collectionName]&&this.collections[collectionName].opts.autoincrement&&trys<1){ 
				await this._CalcNextID(collectionName); return this.insertOne(collectionName, document, {}, ++trys); }
			return {insertedCount: 0, ok:false, reason:"("+err+")"}; } },

	async deleteMany(collectionName, filter={}){ let db = this.db;
		try{ let resp = await db.collection(collectionName).deleteMany(filter); return ParseSimpleValues(resp); }
		catch(err){ return {deletedCount: 0, ok:false, reason:"("+err+")"}; } },
	async deleteOne(collectionName, filter={}){ let db = this.db;
		try{ let resp = await db.collection(collectionName).deleteOne(filter); return ParseSimpleValues(resp); }
		catch(err){ return {deletedCount: 0, ok:false, reason:"("+err+")"}; } },
	countDocuments: (collectionName, filter) => this.elemsCount(collectionName, filter),
	async stats(collectionName){ let db = this.db; let resp;
		if(collectionName===undefined){ resp = await db.stats(); }
		else{ resp = await db.collection(collectionName).stats(); }
		return ParseSimpleValues(resp); },
	// ====== other functions =====
	count: (collectionName, filter) => this.elemsCount(collectionName, filter),
	async elemsCount(collectionName, filter={}){ let db = this.db; return await db.collection(collectionName).countDocuments(filter); },
	users:{
		async list(dbname, options={}) { let resp, users=[];
			try{ if(dbname===undefined||dbname===null){ resp = await this.dbclient.db().admin().command({usersInfo: 1 }); }else{  resp = await this.dbclient.db(dbname).command({usersInfo: 1 }); } }
			catch(err){ return Promise.reject(err); }
			if(options.extended){ for(let key in resp.users){ users.push({user: resp.users[key].user, db:resp.users[key].db, roles: resp.users[key].roles}); } }
			else{ for(let key in resp.users){ users.push(resp.users[key].user); } } return users;
		},
	},
};

// === other ===

function ParseSimpleValues(resp1){ let resp={}; for(let key in resp1){
	if(typeof(resp1[key])==="string"||typeof(resp1[key])==="number"){ resp[key]=resp1[key]; } } if(!("ok" in resp)){resp.ok=true;} return resp; }

module.exports=engine;
