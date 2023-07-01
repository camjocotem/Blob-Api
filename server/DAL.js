var dbUrl = require('./db.js').url;
var { ObjectId, MongoClient } = require('mongodb');
var DAL = {};
const client = new MongoClient(dbUrl);

/**
 * @returns {Promise<import('mongodb').Db>} 
 */
async function getDb() {
	try{
		await client.connect();
		const db = client.db();
		return db;
	}
	catch(err){
		console.log(err);
	}
}

// Continue working with the database
// Perform database operations here

DAL.insert = async function insert(collectionName, object) {
	if (!collectionName) {
		throw new Error("A collection name is required.")
	}
	if (!object) {
		throw new Error("An object to insert is required.")
	}
	let isArray = Array.isArray(object);
	if(!isArray){
		delete object._id;
	}
	let db = await getDb();

	var collection = db.collection(collectionName);

	if(!isArray){
		return await collection.insertOne(object);
	}
	
	return await collection.insertMany(object);
}

DAL.update = async function update(collectionName, object, id=object._id) {
	if (!collectionName) {
		throw new Error("A collection name is required.")
	}
	if (!object) {
		throw new Error("An object to update is required.")
	}
	let db = await getDb();

	var collection = db.collection(collectionName);
	if(id){
		object._id = new ObjectId(id);
	}
	else if(object._id){
		object._id = new ObjectId(object._id);
	}
	else{
		throw new Error("An id is required");
	}

	return collection.updateOne({
		_id: object._id
	}, {
		$set:object
	}, {
		upsert: true
	});
}

DAL.remove = async function remove(collectionName, id) {
	if (!collectionName) {
		throw new Error("A collection name is required.")
	}
	if (!id) {
		throw new Error("An id is required");
	}
	let db = await getDb();

	var collection = db.collection(collectionName);
	return await collection.findOneAndDelete({
		_id: new ObjectId(id)
	});
}

DAL.find = async function find(collectionName, query, isSingle=false) {
	if (!collectionName) {
		throw new Error("A collection name is required.")
	}

	if (query._id) {
		query._id = new ObjectId(query._id);
	}
	let db = await getDb();

	var collection = db.collection(collectionName);
	if(isSingle){
		return await collection.findOne(query);
	}
	return await collection.find(query).toArray();
}

DAL.findAll = async function findMany(collectionName) {
	if (!collectionName) {
		throw new Error("A collection name is required.")
	}
	let db = await getDb();

	var collection = db.collection(collectionName);
	return await collection.find({}).toArray();
}

DAL.findMany = async function findMany(collectionName, ids) {
	if (!collectionName) {
		throw new Error("A collection name is required.")
	}
	if (!ids) {
		throw new Error("An id is required");
	}

	ids = ids.map((n) => {
		return n = new ObjectId(n);
	});
	let db = await getDb();

	var collection = db.collection(collectionName);
	return await collection.find({
		_id: {
			$in: ids
		}
	}).toArray();
}

module.exports = DAL;
