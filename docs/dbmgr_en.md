## dbmgr2 v0.0.2 Documentation

## List of Methods

- [Constructor: dbmgr_create(engine?, connection?)](#constructor-dbmgr_createengine-connection)
	- [dbmgr.get(collectionName, id)](#dbmgrgetcollectionname-id)
	- [dbmgr.set(collectionName, id)](#dbmgrsetcollectionname-id)
	- [dbmgr.setCollectionOpts()](#dbmgrsetcollectionopts)
	- [dbmgr.import()](#dbmgrimport)
- [MongoDB API specification wrapper](#mongodb-api-specification-wrapper)
	- [dbmgr.collection(collectionName)](#dbmgrcollectioncollectionname)
	- [dbmgr.getCollection()](#dbmgrgetcollection)
	- [Constructor: Collection](#constructor-collection)
		- [collection.get()](#collectionget)
		- [collection.set()](#collectionfind)
		- [collection.find()](#collectionfind)
		- [collection.findOne()](#collectionfindone)
		- [collection.updateOne()](#collectionupdateone)
		- [collection.updateMany()](#collectionupdatemany)
		- [collection.update()](#collectionupdate)
		- [collection.replaceOne()](#collectionreplaceone)
		- [collection.replace()](#collectionreplace)
		- [collection.insertOne()](#collectioninsertone)
		- [collection.insertMany()](#collectioninsertmany)
		- [collection.insert()](#collectioninsert)
		- [collection.deleteOne()](#collectiondeleteone)
		- [collection.deleteMany()](#collectiondeletemany)
		- [collection.delete()](#collectiondelete)
		- [collection.countDocuments()](#collectioncountdocuments)
		- [collection.count()](#collectioncount)
		- [collection.stats()](#collectionstats)
	- [dbmgr.connect()](#dbmgrconnect)
	- [dbmgr.disconnect()](#dbmgrconnect)
	- [dbmgr.createCollection(collectionName)](#dbmgrcreatecollectioncollectionname)
	- [dbmgr.dropCollection(collectionName)](#dbmgrdropcollectioncollectionname)
	- [dbmgr.listDatabases()](#dbmgrlistdatabases)
	- [dbmgr.listCollections()](#dbmgrlistcollections)
	- [dbmgr.createCollection()](#dbmgrcreatecollection)
	- [dbmgr.dropCollection()](#dbmgrdropcollection)
	- [dbmgr.find()](#dbmgrfind)
	- [dbmgr.findOne()](#dbmgrfindone)
	- [dbmgr.updateOne()](#dbmgrupdateone)
	- [dbmgr.updateMany()](#dbmgrupdatemany)
	- [dbmgr.update()](#dbmgrupdate)
	- [dbmgr.replace()](#dbmgrreplace)
	- [dbmgr.replaceOne()](#dbmgrreplaceone)
	- [dbmgr.insertOne()](#dbmgrinsertone)
	- [dbmgr.insertMany()](#dbmgrinsertmany)
	- [dbmgr.insert()](#dbmgrinsert)
	- [dbmgr.deleteOne()](#dbmgrdeleteone)
	- [dbmgr.deleteMany()](#dbmgrdeletemany)
	- [dbmgr.elemsCount()](#dbmgrupdate)
	- [dbmgr.countDocuments()](#dbmgrcountdocuments)
	- [dbmgr.count()](#dbmgrcount)
	- [dbmgr.stats()](#dbmgrstats)

## Constructor: dbmgr_create(engine?, connection?)
- `engine` *{String}* Name of the used database engine. Currently, only `ram` and `mongodb` are supported.
- `connection` *{Object}* Connection data for a remote repository (if the specified engine uses such a repository).
	- `uri` *{String}* Connection via uri to the `mongodb` database. If this parameter is specified, other parameters are ignored.
	- `host` *{String}* Address or IP of the host.
	- `port` *{Number}* Port number.
	- `dbname` *{String}* Database name.
	- `login` *{String}* Login for authentication.
	- `pass` *{String}* Password for authentication.
	- `tls` *{Boolean}* Use a connection via TLS. Default: true.
	- `tlsAllowInvalidCertificates` *{Boolean}* Accept self-signed certificates. Default: true.

This constructor is returned as a method when importing the library, this method returns the main `dbmgr` object. This object may have additional methods for more convenient data handling.
**Returns**: `{dbmgr<Object>}`: an instance of the `dbmgr` object

### dbmgr.get(collectionName, id)
- `collectionName` {String} Name of the collection.
- `id` {String|Number} Identifier of the document in the collection.

Fetches a document from the collection by its identifier.
**Returns**: `Promise {Document<Object>|null}`

### dbmgr.set(collectionName, id)
- `collectionName` {String} Name of the collection.
- `id` {String|Number} Identifier of the document in the collection.

Replaces a document in the collection. If it does not find a document with the specified `id`, it inserts a new document.
**Returns**: `Promise {Object}`

### dbmgr.setCollectionOpts()
- `collectionName` {String} Collection name.
- `options` *{Object}* Options to set.
	- `autoincrement` *{Boolean}* Determines whether to use auto-increment when inserting documents. 
	By default, in the `ram` engine it's set to: true; in others: false.

Sets options for a specific collection. This method is returned when importing the library and returns the main `dbmgr` object. This object might have additional methods for more convenient data handling.
**Returns**: `{dbmgr<Object>}`: an instance of the `dbmgr` object.

### dbmgr.import()
- `dbmgr` {dbmgr<*Object*>} Instance of the `dbmgr` object from which the import is to be performed.

Performs an import of collections with documents from the specified `dbmgr` instance into the current instance.
**Returns**: `Promise {Object}`

> NOTE: The current implementation of this function assumes that memory equal to the imported data will be required.

## MongoDB API specification wrapper
These methods are a partial imitation of the [specification](https://mongodb.github.io/node-mongodb-native/6.1/classes/Db.html) of the MongoDB API, allowing the use of the same syntax when switching between different databases.

### dbmgr.collection(collectionName)
- `collectionName` {String} Name of the collection.

Calls the constructor [Constructor: Collection](#constructor-collection)
### dbmgr.getCollection()
Alias for the method [dbmgr.collection()](#dbmgrcollectioncollectionname)
### Constructor: Collection
This constructor returns an instance of the collection object, which contains links to `dbmgr` methods for working with a specific collection. It is an imitation of `db.collection()` from the [specification](https://mongodb.github.io/node-mongodb-native/6.1/classes/Collection.html) of the MongoDB API.
##### collection.get()
##### collection.set()
##### collection.find()
##### collection.findOne()
##### collection.updateOne()
##### collection.updateMany()
##### collection.update()
##### collection.replaceOne()
##### collection.replace()
##### collection.insertOne()
##### collection.insertMany()
##### collection.insert()
##### collection.deleteOne()
##### collection.deleteMany()
##### collection.delete()
##### collection.countDocuments()
##### collection.count()
##### collection.stats()

### dbmgr.connect()
Establishes a connection to the database. After the connection is established, other operations with the database can be performed.
**Returns**: `Promise {Boolean}`

### dbmgr.disconnect()
Closes the connection to the database.
**Returns**: `Promise {Boolean}`

### dbmgr.listDatabases()
Returns a list of databases.
**Returns**: `Promise {Array<String>}`

### dbmgr.listCollections()
Returns a list of all collections in the current database.
**Returns**: `Promise {Array<String>}`

### dbmgr.createCollection()
- `collectionName` {String} Collection name.
- `options` *{Object}* Additional collection parameters.

Creates a new collection with the specified name. If the collection already exists, the method returns false. Otherwise, it creates a collection and returns true.
**Returns**: `Promise {Boolean}`

### dbmgr.dropCollection()
- `collectionName` {String} Collection name.

Deletes the collection with the specified name. If the collection exists, it is deleted, and the method returns true. Otherwise, it returns false.
**Returns**: `Promise {Boolean}`

### dbmgr.find()
- `collectionName` *{String}* Collection name.
- `filter` *{Object}* Document filtering criteria.
- `options` *{Object}* [Search options](https://mongodb.github.io/node-mongodb-native/6.1/interfaces/FindOptions.html).

Searches for documents in the collection based on the specified filter and options. Returns an array of found documents.
**Returns**: `Promise {Array<Document>}`

### dbmgr.findOne()
- `collectionName` *{String}* Collection name.
- `filter` *{Object}* Document filtering criteria.
- `options` *{Object}* [Search options](https://mongodb.github.io/node-mongodb-native/6.1/interfaces/FindOptions.html).

Searches for a document in the collection based on the specified filter and options. Returns the first found document or null if no matches are found.
**Returns**: `Promise {Document<Object>|null}`

### dbmgr.updateOne()
- `collectionName` *{String}* Collection name.
- `filter` *{Object}* Criteria for filtering documents.
- `update` *{Object}* Update operations for the filtered documents.

Updates the first found document in the collection based on the specified filter and update instructions. Returns the number of updated documents.
**Returns**: `Promise {Object}`

### dbmgr.updateMany()
- `collectionName` *{String}* Collection name.
- `filter` *{Object}* Criteria for filtering documents.
- `update` *{Object}* Update operations for the filtered documents.

Updates documents in the collection based on the specified filter and update instructions. Returns the number of updated documents.
**Returns**: `Promise {Object}`

### dbmgr.update()
Alias for [dbmgr.updateOne()](#dbmgrupdateone)

### dbmgr.replaceOne()
- `collectionName` *{String}* Collection name.
- `filter` *{Object}* Criteria for filtering documents.
- `replacement` *{Object}* Document for replacement.
- `options` *{Object}* Additional options.

Replaces the first found document in the collection.
**Returns**: `Promise {Object}`

### dbmgr.replace()
Alias for [dbmgr.replaceOne()](#dbmgrreplaceone)

### dbmgr.insertOne()
- `collectionName` *{String}* Collection name.
- `document` *{Object}* Document for insertion.

Inserts a new document into the collection.
**Returns**: `Promise {Object}`

### dbmgr.insertMany()
- `collectionName` *{String}* Collection name.
- `documents` {Array<*Object*>} Documents for insertion.

Inserts multiple documents into the collection.
**Returns**: `Promise {Object}`

### insert()
Alias for [dbmgr.insertOne()](#dbmgrinsertone)

### dbmgr.deleteOne()
- `collectionName` *{String}* Collection name.
- `filter` *{Object}* Criteria for filtering documents.

Deletes the first found document from the collection based on the specified filter. Returns the number of deleted documents.
**Returns**: `Promise {Object}`

### dbmgr.deleteMany()
- `collectionName` *{String}* Collection name.
- `filter` *{Object}* Criteria for filtering documents.

Deletes documents from the collection based on the specified filter. Returns the number of deleted documents.
**Returns**: `Promise {Object}`

### dbmgr.elemsCount()
- `collectionName` *{String}* Collection name.
- `filter` *{Object}* Criteria for filtering documents.

Counts documents in the collection based on the specified filter.
**Returns**: `Promise {Number}`

### dbmgr.countDocuments()
Alias for [dbmgr.elemsCount()](#dbmgrupdate)

### dbmgr.count()
Alias for [dbmgr.elemsCount()](#dbmgrupdate)

### dbmgr.stats()
- `collectionName` *{String}* Collection name.

Returns statistics for the specified collection. If `collectionName` is not specified, it returns statistics for the entire database.
**Returns**: `Promise {Object}`