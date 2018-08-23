var activeCollections = {};
var collectionManager = {};

collectionManager.addCollection = function(collection, collectionName){
	activeCollections[collectionName] = collection;
}

collectionManager.getCollection = function(collectionName){
	return activeCollections[collectionName];
}

collectionManager.getActiveCollections = function(){
	return activeCollections;
};

collectionManager.removeCollection = function(collectionName){	
	delete activeCollections[collectionName];
	return activeCollections;
}

module.exports = collectionManager;