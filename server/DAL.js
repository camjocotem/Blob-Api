var dbUrl = require('./db.js').url;
var { ObjectId, MongoClient } = require('mongodb');
var collectionStore = require('./collectionStore.js');
/** @type {import('mongodb').MongoClientOptions} */
const options = { 
	// useNewUrlParser: true, 
	// useUnifiedTopology: true 	
};

var DAL = {};

MongoClient.connect(dbUrl, options)
	.then(client => {
		// Continue working with the database
		const db = client.db();
		// Perform database operations here

		DAL.insert = function insert(collectionName, object) {
			if (!collectionName) {
				throw new Error("A collection name is required.")
			}
			if (!object) {
				throw new Error("An object to insert is required.")
			}
			delete object._id;
			
			var collection = getOrAddCollection(collectionName);
			return collection.insertOne(object);
		}

		DAL.update = function update(collectionName, object) {
			if (!collectionName) {
				throw new Error("A collection name is required.")
			}
			if (!object) {
				throw new Error("An object to update is required.")
			}

			var collection = getOrAddCollection(collectionName);
			object._id = new ObjectId(object._id);
			return collection.updateOne({
				_id: object._id
			}, object, {
				upsert: true
			});
		}

		DAL.remove = function remove(collectionName, id) {
			if (!collectionName) {
				throw new Error("A collection name is required.")
			}
			if (!id) {
				throw new Error("An id is required");
			}

			var collection = getOrAddCollection(collectionName);
			return collection.findOneAndDelete({
				_id: new ObjectId(id)
			});
		}

		DAL.find = function find(collectionName, query) {
			if (!collectionName) {
				throw new Error("A collection name is required.")
			}

			if (query._id) {
				query._id = new ObjectId(query._id);
			}

			var collection = getOrAddCollection(collectionName);
			return collection.find(query);
		}

		DAL.findAll = function findMany(collectionName) {
			if (!collectionName) {
				throw new Error("A collection name is required.")
			}

			var collection = getOrAddCollection(collectionName);
			return collection.find({});
		}

		DAL.findMany = function findMany(collectionName, ids) {
			if (!collectionName) {
				throw new Error("A collection name is required.")
			}
			if (!ids) {
				throw new Error("An id is required");
			}

			ids = ids.map((n) => {
				return n = new ObjectId(n);
			});

			var collection = getOrAddCollection(collectionName);
			return collection.find({
				_id: {
					$in: ids
				}
			});
		}

		function getOrAddCollection(collectionName) {			
			// var collection = collectionStore.getCollection(collectionName);
			// if (!collection) {
			// 	collectionStore.addCollection(collection, collectionName);
			// }
		
			// return collection;
			return db.collection(collectionName)
		}
	})
	.catch(err => {
		// Handle connection error
		console.error('Error connecting to MongoDB:', err);
	});

module.exports = DAL;
