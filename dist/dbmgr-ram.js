// dbmgr v0.0.2, contains only "ram" engine
const fs = require('fs'); module.exports = dbmgr_create;

function dbmgr_create(useengine="ram",connection={},options={}){
	let dbmgr={engine:useengine, connected:false, connection:{}, settings:{}, collections:{},}; dbmgr.connection=
	{   host: "localhost", port: 27017,
		dbname: "admin", login: "", pass: "",
		tls: true, tlsAllowInvalidCertificates:true,
		replicaSet: "", debug:false, uri:null, };
	for(let key in connection){ dbmgr.connection[key]=connection[key]; }
	if(engine===undefined){ throw "[dbmgr Error] Engine \""+dbmgr.engine+"\" not found"; return; }
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

// ============ ram engine ============
let engine = {
	async connect(){ this.connected=true; return true; },
	async close(){ this.connected=false; return true; },
	async listDatabases(){ return []; }, // Resp: [ 'admin', 'local', 'db1', ... , "dbN" ];
	async listCollections(){ let resp1=[]; for(let key in this.collections){ resp1.push(key); } return resp1;
	}, // Resp: [ 'collection1', ... , "collectionN" ];
	// ====== mongodb wrapper (partial specification) ======
	async createCollection(name, options={}){ if(!this.collections[name]){ this.collections[name] = this._newCollection(options); return true; }else{ return false; } },
	async dropCollection(name, options={}){ if(this.collections[name]){ delete this.collections[name]; return true; }else{ return false; } },

    async find(collectionName, filter={}, options={}){ let result = []; if(options.fields){ options.projection=options.fields; delete options.fields; }
		if(!this.collections[collectionName]){ throw "Collection \""+collectionName+"\" not exists"; return; }
		if(typeof(filter._id)==="number"||typeof(filter._id)==="string"){ if(this.collections[collectionName].data[filter._id]){
			result.push(this.collections[collectionName].data[filter._id]); }else{ return []; } }
		else{
			for (let key in this.collections[collectionName].data){
				if (mongo_match(this.collections[collectionName].data[key], filter)){ if(options.skip && options.skip>0){ options.skip--; continue; }
					result.push(this.collections[collectionName].data[key]); 
					if(options.limit&&result.length>=options.limit&&!("sort" in options)&&!("nativesort" in options)){ break; } }
			}
			if(options.sort){ let [sortField, sortOrder] = Object.entries(options.sort)[0]; quickSortv2_1(result, sortField.split("."), sortOrder); }
			if(options.nativesort){ let [sortField, sortOrder] = Object.entries(options.nativesort)[0]; sortField=sortField.split(".");
				result.sort((a, b) => { let valueA = _getNestedValue(a, sortField); let valueB = _getNestedValue(b, sortField);
					if (valueA < valueB) return sortOrder === -1 ? 1 : -1;
					if (valueA > valueB) return sortOrder === -1 ? -1 : 1; return 0; });
			}
		}
		if(options.limit&&result.length>options.limit){ result=result.slice(0, options.limit); }
		if(options.projection){ result = result.map(doc => mongo_projectFields(doc, options.projection)); } return result;
	},

	async findOne(collectionName, filter, options={}){ options.limit=1;
		let resp = await this.find(collectionName, filter, options); if(resp.length<=0){ return null; }else{ return resp[0]; } },

	update(collectionName, filter, update){ return this.updateOne(collectionName, filter, update); },
	async updateMany(collectionName, filter, update){ return this._updateDocuments(collectionName, filter, update, false); },
    async updateOne(collectionName, filter, update){ return this._updateDocuments(collectionName, filter, update, true); },
	_updateDocuments(collectionName, filter, update, updateOnlyOne = false){ let matchedCount = 0, modifiedCount = 0;
		if(!this.collections[collectionName]){ throw "Collection \""+collectionName+"\" not exists"; return; }
		for (let key in this.collections[collectionName].data){
		    if (mongo_match(this.collections[collectionName].data[key], filter)){ matchedCount++;
			  if(mongo_applyUpdate(this.collections[collectionName].data[key], update)){ modifiedCount++; } if(updateOnlyOne) break;
		    }
		}
		return { matchedCount, modifiedCount };
    },
	
 	replace(collectionName, filter={}, replacement={}, options={}){ return this.replaceOne(collectionName, filter, replacement, options={}); },
	replaceOne(collectionName, filter={}, replacement={}, options={}){ return this._replaceDocuments(collectionName, filter, replacement, options, true); },
	async _replaceDocuments(collectionName, filter={}, replacement={}, options={}, replaceOnlyOne=false){ let resp={ modifiedCount:0, upsertedCount:0, matchedCount:0, ok:false };
		if(!this.collections[collectionName]){ throw "Collection \""+collectionName+"\" not exists"; return; }
        for (let key in this.collections[collectionName].data){
			if (mongo_match(this.collections[collectionName].data[key], filter)){
				if(replacement._id && replacement._id !== key){ resp.reason="Cannot replace the _id field of the document"; return resp; }
				replacement._id = key; this.collections[collectionName].data[key] = replacement;
				resp.matchedCount++; resp.modifiedCount++; if (replaceOnlyOne) break;
			}
		}
		if(resp.matchedCount === 0 && options.upsert){ if(filter._id &&!("_id" in replacement)){ replacement._id=filter._id; }
			let resp1 = await this._insertDocuments(collectionName, [replacement], false); resp.upsertedCount=resp1.insertedCount;
			resp.upsertedIds=resp1.insertedIds; if(resp1.insertedIds.length===1){ resp.upsertedId=resp1.insertedId; } }
		resp.ok=true; return resp;
    },

	insert(collectionName, document, options={}){ return this._insertDocuments(collectionName, [document], {}, false); },
    insertMany(collectionName, documents, options={}){ return this._insertDocuments(collectionName, documents, {}, true); },
    insertOne(collectionName, document, options={}){ return this._insertDocuments(collectionName, [document], {}, false); },
	async _insertDocuments(collectionName, documents=[], options={}, insertMany = false){ resp={insertedCount:0, insertedIds:[], ok:false};
	    if(!this.collections[collectionName]){ throw "Collection \""+collectionName+"\" not exists"; return; }
	    for(let doc of documents){ doc=JSON.parse(JSON.stringify(doc)); //Cloning an object to eliminate potential problems with references
			let id = doc._id; if(id===undefined){ id=this._assignID(collectionName); }
			if(id in this.collections[collectionName].data){ 
				if(this.collections[collectionName].opts.autoincrement&&!("_id" in doc)){
					await this._CalcNextID(collectionName); id=this._assignID(collectionName); }
				if(id in this.collections[collectionName].data){ resp.reason="duplicate _id in collection "+collectionName+": (_id: "+id+")"; return resp; } }
			if(id!==undefined){ doc._id = id; } this.collections[collectionName].data[id] = doc; resp.insertedIds.push(id); 
			resp.insertedCount++; if(!insertMany) break;
	    } if(resp.insertedIds.length===1){ resp.insertedId=resp.insertedIds[0]; } resp.ok=true; return resp;
	},

	async deleteOne(collectionName, filter={}){ return this._deleteDocuments(collectionName, filter={}, true); },
    async deleteMany(collectionName, filter={}){ return this._deleteDocuments(collectionName, filter={}, false); },
    _deleteDocuments(collectionName, filter={}, isdeleteOne = false){ let deletedCount = 0;
	    if(!this.collections[collectionName]){ throw "Collection \""+collectionName+"\" not exists"; return; }
        for (let key in this.collections[collectionName].data){
            if (mongo_match(this.collections[collectionName].data[key], filter)){
                delete this.collections[collectionName].data[key]; deletedCount++; if(isdeleteOne){ break; }
            }
        } return { deletedCount, ok:true };
    },
	countDocuments(collectionName, filter={}){ return this.elemsCount(collectionName, filter={}); },

	async stats(collectionName){ if(collectionName===undefined||collectionName===null){ return this._CalcStats(); }
		else{ return this._CalcCollectionStats(collectionName); } return resp; },

	// ====== other functions =====
	count(collectionName, filter={}){ return this.elemsCount(collectionName, filter={}); },
	async elemsCount(collectionName, filter={}){ let counter=0;
		if(!this.collections[collectionName]){ throw "Collection \""+collectionName+"\" not exists"; return; }
		for (let key in this.collections[collectionName].data){
			if(mongo_match(this.collections[collectionName].data[key], filter)){ counter++; }
		} return counter; },
	_CalcCollectionStats(collectionName){ let resp={ns:"ram."+collectionName,size:0,count:0,avgObjSize:0,storageSize:0,totalIndexSize:0,totalSize:0};
			if(!this.collections[collectionName]){ resp.ns=null; return resp; }
	    for(let id in this.collections[collectionName].data){ resp.count++;
					resp.size += _CalcSizeOfDucument(this.collections[collectionName].data[id]); }
			resp.totalSize = resp.storageSize = resp.size; resp.avgObjSize=Math.floor(resp.size/resp.count);
			if(isNaN(resp.avgObjSize)){ resp.avgObjSize=0; } return resp; },
	_CalcStats(){ this._stats.collections=this._stats.dataSize=0; let docscount=0; let calcresp={};
	    for(let name in this.collections){ calcresp=this._CalcCollectionStats(name); this._stats.collections++;
					this._stats.dataSize += calcresp.size; docscount+=calcresp.count; }
			this._stats.totalSize = this._stats.storageSize = this._stats.dataSize;
			this._stats.avgObjSize=Math.floor(this._stats.dataSize/docscount);
			if(isNaN(this._stats.avgObjSize)){ this._stats.avgObjSize=0; } return this._stats; },
	_stats:{ collections: 0, avgObjSize: 0, dataSize: 0, storageSize: 0, indexes: 0, indexSize: 0, totalSize: 0 },
	users:{
		async list(dbname, options={}){ return []; },
	},
};

function mongo_match(document, filter){
	for (let key in filter){
		if (key.startsWith('$')){
			switch (key) {
				case '$and':
					for (let subQuery of filter[key]) {
						if (!mongo_match(document, subQuery)) {
							return false;
						}
					} break;
				case '$or': let orMatch = false;
					for (let subQuery of filter[key]) {
						if (mongo_match(document, subQuery)){
							orMatch = true; break;
						}
					} return orMatch; break;
				default: return false;
			}
		}
		else if (typeof filter[key] === 'object' && !Array.isArray(filter[key])){ return mongo_matchField(_getNestedValue(document, key), filter[key], key); }
		else if (document[key] !== filter[key]){ return false; }
	} return true; }

function mongo_matchField(value, conditions){
	for (let operator in conditions){
		switch (operator){
			case "$eq":  if (value !== conditions[operator]) return false; break;
			case "$gt":  if (value <= conditions[operator]||isNaN(Number(value))) return false; break;
			case "$gte": if (value < conditions[operator]||isNaN(Number(value))) return false; break;
			case "$lt":  if (value >= conditions[operator]||isNaN(Number(value))) return false; break;
			case "$lte": if (value > conditions[operator]||isNaN(Number(value))) return false; break;
			case "$ne":  if (value === conditions[operator]) return false; break;
			case '$regex': if(!(new RegExp(conditions[operator])).test(value)){ return false; } break;
			case '$in': if(!(new Set(conditions[operator])).has(value)){ return false; } break;
			case "$nin": if((new Set(conditions[operator])).has(value)){ return false; } break;
		    case "$exists":
		  	    if (conditions[operator] && value === undefined) return false;
			    if (!conditions[operator] && value !== undefined) return false; break;
		    case "$type": if(typeof(value) !== conditions[operator]){ return false; } break;
		    case "$all":  for (let item of conditions[operator]){ if (!value.includes(item)) return false; } break;
		    case "$elemMatch": if(!Array.isArray(value)) continue; let matchFound = false;
			    for (let item of value){
				    if (typeof item === "object"){ if (mongo_match(item, conditions[operator])){ matchFound = true; break; } }
					else{ if(item === conditions[operator]){ matchFound = true; break; } }
			    } if (!matchFound) return false; break;
		    case "$size": if (value.length !== conditions[operator]) return false; break;
			default: return value===conditions[operator]; break;
		}
	} return true;
}

function mongo_projectFields(document, fields){ document = JSON.parse(JSON.stringify(document)); let projected = {};

    let inclusionFields = Object.keys(fields).filter(key => fields[key] === 1);
    let exclusionFields = Object.keys(fields).filter(key => fields[key] === 0);

    if (inclusionFields.length > 0 && exclusionFields.length > 0) {
        // MongoDB позволяет исключать только поле _id, когда другие поля включены
        if (!(exclusionFields.length === 1 && exclusionFields[0] === '_id')) {
            throw new Error('Cannot mix include and exclude fields, except to exclude _id.');
        }
    }

    if (inclusionFields.length > 0){
        for (let key of inclusionFields){ let keys = key.split('.'); let currentValue = document;
            for (let part of keys) {
                if (currentValue[part] === undefined) {
                    currentValue = undefined;
                    break;
                }
                currentValue = currentValue[part];
            }
            if (currentValue !== undefined) {
                let target = projected;
                for (let i = 0; i < keys.length - 1; i++) {
                    if (!target[keys[i]]){ target[keys[i]] = {}; }
                    target = target[keys[i]];
                }
                target[keys[keys.length - 1]] = currentValue;
            }
        }
        // Если _id не указано, добавим его по умолчанию
        if (!("_id" in fields)){ projected['_id'] = document['_id']; }
    }else{
        projected = {...document};
        for (let key of exclusionFields) {
            const keys = key.split('.');
            let target = projected;
            for (let i = 0; i < keys.length - 1; i++) {
                if (target[keys[i]] === undefined){ break; }
                target = target[keys[i]];
            }
            delete target[keys[keys.length - 1]];
        }
    }
    return projected;
}

function mongo_applyUpdate(document, update){ ismodified=false;
    for (let operator in update){
        switch (operator){
            case '$set':
                for (let key in update.$set){
                    _setNestedValue(document, key, update.$set[key]);
                } ismodified=true; break;
            case '$inc':
                for (let key in update.$inc){
                    let currentVal = _getNestedValue(document, key);
                    if (typeof currentVal === 'number'){
                        _setNestedValue(document, key, currentVal + update.$inc[key]);
                    }
                } ismodified=true; break;
        }
    } return ismodified;
}

function _getNestedValue(obj, path){ if(typeof(path)==='string'){ if (!path.includes('.')){ return obj[path]; } path = path.split('.'); }
	for(let key of path){ if(typeof(obj)!=='object'){ return obj; } obj = obj[key]; } return obj; }

function _setNestedValue(obj, path, value){ if(typeof(path)==='string'){ if (!path.includes('.')){ return obj[path]; } path = path.split('.'); }
    for (let i = 0; i < path.length - 1; i++){
        let key = path[i]; if (obj[key] === undefined){ obj[key] = {}; } obj = obj[key];
    } obj[path[path.length - 1]] = value; }

function _CalcSizeOfDucument(doc){ return Buffer.from(JSON.stringify(doc), 'utf8').length; }

function quickSortv2_1(items, sortField, sortOrder){
    const stack = []; let left = 0, right = items.length - 1;

    const qs_swap = (items, leftIndex, rightIndex) => {
        const temp = items[leftIndex];
        items[leftIndex] = items[rightIndex];
        items[rightIndex] = temp;
    };
    stack.push(left, right);

    while (stack.length){ right = stack.pop(); left = stack.pop();
        const pivotIndex = Math.floor((left + right) / 2);
        const pivot = _getNestedValue(items[pivotIndex], sortField);
        let i = left, j = right;

        while (i <= j) {
            if (sortOrder >= 0){
                while (_getNestedValue(items[i], sortField) < pivot) i++;
                while (_getNestedValue(items[j], sortField) > pivot) j--;
            } else {  // sortOrder is -1
                while (_getNestedValue(items[i], sortField) > pivot) i++;
                while (_getNestedValue(items[j], sortField) < pivot) j--;
            }
            if (i <= j){ qs_swap(items, i, j); i++; j--; }
        }
        if (left < j) { stack.push(left, j); }
        if (i < right){ stack.push(i, right); }
    } return items;
}
