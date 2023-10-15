## dbmgr2 v0.0.2 Documentation

## Список методов

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
- `engine` *{String}* Название используемого движка база данных На данный момент поддерживаются только `ram` и `mongodb`.
- `connection` *{Object}* Данные для подключения к удаленному хранилищу (если указанный движок использует такое хранилище)
	- `uri` *{String}* Подключение через uri к базе данных `mongodb`. Если указан этот параметр, остальные параметры игнорируются.
	- `host` *{String}* Адрес или IP хоста.
	- `port` *{Number}* Номер порта.
	- `dbname` *{String}* Имя базы данных.
	- `login` *{String}* Логин для авторизации.
	- `pass` *{String}* Пароль для для авторизации.
	- `tls` *{Boolean}* Использовать подключение через TLS. По умолчанию: true
	- `tlsAllowInvalidCertificates` *{Boolean}* Принимать самоподписанные сертификаты. По умолчанию: true

Этот конструктор возвращается в качестве метода при импорте библиотеки, этот метод возвращает основной объект `dbmgr`. Этот объект может иметь дополнительные методы для более удобной работы с данными.
**Возвращает**: `{dbmgr<Object>}`: экземпляр объекта `dbmgr`

### dbmgr.get(collectionName, id)
- `collectionName` {String} Название коллекции.
- `id` {String|Number} Идентификатор документа в коллекции.

Достает документ из коллекции по идентификатору.
**Возвращает**: `Promise {Document<Object>|null}`

### dbmgr.set(collectionName, id)
- `collectionName` {String} Название коллекции.
- `id` {String|Number} Идентификатор документа в коллекции.

Заменяет документ в коллекции. Если не находит документ с указанным `id`, вставляет новый документ.
**Возвращает**: `Promise {Object}`

### dbmgr.setCollectionOpts()
- `collectionName` {String} Название коллекции.
- `options` *{Object}* Опции, которые требуется установить.
	- `autoincrement` *{Boolean}* Определяет, использовать ли автоинкремент при вставке документов. 
	По умолчанию, в движке `ram` установлен на: true, в остальных: false;

Устанавливает опции для определенной коллекццтт возвращается в качестве метода при импорте библиотеки, этот метод возвращает основной объект `dbmgr`. Этот объект может иметь дополнительные методы для более удобной работы с данными.
**Возвращает**: `{dbmgr<Object>}`: экземпляр объекта `dbmgr`

### dbmgr.import()
- `dbmgr` {dbmgr<*Object*>} Экземпляр обьекта `dbmgr`, из которого требуется выполнить импорт.

Выполняет импорт коллекций с документами из указанного экземпляра `dbmgr` в текущий экземпляр.
**Возвращает**: `Promise {Object}`

> NOTE: Текущая реализация этой функции подразумевает, что потребуется объем памяти, равный импортируемым данным.

## Обертка спецификации MongoDB API 
Эти методы представляют собой частичную имитацию [спецификации](https://mongodb.github.io/node-mongodb-native/6.1/classes/Db.html) MongoDB API, позволяя использовать один и тот же синтаксис при переключении между различными базами данных.

### dbmgr.collection(collectionName)
- `collectionName` {String} Название коллекции.

Вызывает констуктор [Constructor: Collection](#constructor-collection)
### dbmgr.getCollection()
Алиас для метода [dbmgr.collection()](#dbmgrcollectioncollectionname)
### Constructor: Collection
Этот конструктор возвращает экземпляр объекта коллекции, который содержит ссылки на методы `dbmgr` для работы с конкретной коллекцией. Является подобием для `db.collection()` из [спецификации](https://mongodb.github.io/node-mongodb-native/6.1/classes/Collection.html) MongoDB API.
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
Устанавливает соединение с базой данных. После установки соединения можно выполнять другие операции с базой данных.
**Возвращает**: `Promise {Boolean}`
### dbmgr.disconnect()
Закрывает соединение с базой данных.
**Возвращает**: `Promise {Boolean}`
### dbmgr.listDatabases()
Возвращает список баз данных.
**Возвращает**:`Promise {Array<String>}`
### dbmgr.listCollections()
Возвращает список всех коллекций в текущей базе данных.
**Возвращает**:`Promise {Array<String>}`
### dbmgr.createCollection()
- `collectionName` {String} Имя коллекции.
- `options` *{Object}* Дополнительные параметры коллекции.

Создает новую коллекцию с указанным именем. Если коллекция уже существует, метод возвращает false. В противном случае создает коллекцию и возвращает true.
**Возвращает**: `Promise {Boolean}`
### dbmgr.dropCollection()
- `collectionName` {String} Название коллекции.

Удаляет коллекцию с указанным именем. Если коллекция существует, она удаляется, и метод возвращает true. В противном случае возвращает false.
**Возвращает**: `Promise {Boolean}`
### dbmgr.find()
- `collectionName` *{String}* Имя коллекции.
- `filter` *{Object}* Критерии фильтрации документов.
- `options` *{Object}* [Опции](https://mongodb.github.io/node-mongodb-native/6.1/interfaces/FindOptions.html) поиска.

Ищет документы в коллекции на основе указанного фильтра и опций. Возвращает массив найденных документов.
**Возвращает**:`Promise {Array<Document>}`
### dbmgr.findOne()
- `collectionName` *{String}* Имя коллекции.
- `filter` *{Object}* Критерии фильтрации документов.
- `options` *{Object}* [Опции](https://mongodb.github.io/node-mongodb-native/6.1/interfaces/FindOptions.html) поиска.

Ищет документ в коллекции на основе указанного фильтра и опций. Возвращает первый найденный документ или null, если совпадений не найдено.
**Возвращает**: `Promise {Document<Object>|null}`
### dbmgr.updateOne()
- `collectionName` *{String}* Имя коллекции.
- `filter` *{Object}* Критерии для фильтрации документов.
- `update` *{Object}* Операции обновления к отфильтрованным документам.

Обновляет первый найденный документ в коллекции на основе указанного фильтра и инструкций по обновлению. Возвращает количество обновленных документов.
**Возвращает**: `Promise {Object}`
### dbmgr.updateMany()
- `collectionName` *{String}* Имя коллекции.
- `filter` *{Object}* Критерии для фильтрации документов.
- `update` *{Object}* Операции обновления к отфильтрованным документам.

Обновляет документы в коллекции на основе указанного фильтра и инструкций по обновлению. Возвращает количество обновленных документов.
**Возвращает**: `Promise {Object}`
### dbmgr.update()
Алиас для [dbmgr.updateOne()](#dbmgrupdateone)
### dbmgr.replaceOne()
- `collectionName` *{String}* Имя коллекции.
- `filter` *{Object}* Критерии для фильтрации документов.
- `replacement` *{Object}* Документ для замены.
- `options` *{Object}* Дополнительные опции.

Заменяет первый найденный документ в коллекции.
**Возвращает**: `Promise {Object}`
### dbmgr.replace()
Алиас для [dbmgr.replaceOne()](#dbmgrreplaceone)
### dbmgr.insertOne()
- `collectionName` *{String}* Имя коллекции.
- `document` *{Object}* Документ для вставки.

Вставляет новый документ в коллекцию.
**Возвращает**: `Promise {Object}`
### dbmgr.insertMany()
- `collectionName` *{String}* Имя коллекции.
- `documents` {Array<*Object*>} Документ для вставки.

Вставляет несколько документов в коллекцию.
**Возвращает**: `Promise {Object}`
### insert()
Алиас для [dbmgr.insertOne()](#dbmgrinsertone)
### dbmgr.deleteOne()
- `collectionName` *{String}* Имя коллекции.
- `filter` *{Object}* Критерии для фильтрации документов.

Удаляет первый найденный документ из коллекции на основе указанного фильтра. Возвращает количество удаленных документов.
**Возвращает**: `Promise {Object}`
### dbmgr.deleteMany()
- `collectionName` *{String}* Имя коллекции.
- `filter` *{Object}* Критерии для фильтрации документов.

Удаляет документы из коллекции на основе указанного фильтра. Возвращает количество удаленных документов.
**Возвращает**: `Promise {Object}`

### dbmgr.elemsCount()
- `collectionName` *{String}* Имя коллекции.
- `filter` *{Object}* Критерии для фильтрации документов.

Подсчитывает документы в коллекции на основе указанного фильтра.
**Возвращает**: `Promise {Number}`
### dbmgr.countDocuments()
Алиас для [dbmgr.elemsCount()](#dbmgrupdate)
### dbmgr.count()
Алиас для [dbmgr.elemsCount()](#dbmgrupdate)
### dbmgr.stats()
- `collectionName` *{String}* Имя коллекции.

Возвращает статистику для указанной коллекции. Если `collectionName` не указан, вернет статистику для всей базы.
**Возвращает**: `Promise {Object}`