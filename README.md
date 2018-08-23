Blob-API
===================


This NodeJS CRUD API serves as a way to dynamically manage content in a MongoDB database.

----------

POST
-------------
localhost:3003/api/{Collection Name Here}

#### Adding a single item:
POST Url - http://localhost:3003/api/Food

JSON Body -
```
{
  "Name": "Chocolate Fondant",
  "Type": "Dessert"
}
```

#### Response (201):
```
{ 
  "_id" :  (New Id Here)
  “Name”: “Chocolate Fondant”, 
  “Type”: “Dessert” 
}
```

#### Adding multiple items:
POST Url - http://localhost:3003/api/Food

JSON Body -
```
[{
  "Name": "Chocolate Fondant",
  "Type": "Dessert"
},
{
  "Name": "Fajitas",
  "Type": "Savory"
}]
```

----------
Get
-------------

localhost:3003/api/{Collection Name Here}?propertyhere=value

OR

localhost:3003/api/{Collection Name Here}/id-here

#### Get all items
GET Url - http://localhost:3003/api/Food 
#### Response (200)
```
[{
  "Name": "Chocolate Fondant",
  "Type": "Dessert"
},
{
  "Name": "Fajitas",
  "Type": "Savory"
}]
```

#### Get a single item
GET Url - http://localhost:3003/api/Food?_id=id-here

OR

GET Url - http://localhost:3003/api/Food/id-here

#### Response(200)
```
{
  "_id": "id-here"
  "Name": "Chocolate Fondant",
  "Type": "Dessert"
}
```
----------
Put/Patch
-------------
localhost:3003/api/{Collection Name Here}

#### Updating single item:
POST Url - http://localhost:3003/api/Food

JSON Body -
```
{
  "_id": id-here
  "Name": "Chocolate Fondant",
  "Type": "Chocolate Dessert"
}
```

#### Response (200):
```
{
  "ok": 1,
  "nModified": 1,
  "n": 1
}
```

----------
Delete
-------------
localhost:3003/api/{Collection Name Here}?_id=id-here

#### Deleting a single item:
DELETE Url - http://localhost:3003/api/Food?_id=id-here
#### Response (200):
```
{
  "ok": 1,
  "n": 1
}
```

----------

## Building & Running Blob-API
1. To run Blob-API, you'll need the following things installed:
   - [NodeJS](https://nodejs.org/en/)
   - [MongoDB](https://www.mongodb.com/download-center?jmp=nav)
2. Get lib dependencies - In the /Server directory, via command line run: `npm install`.
3. Run Blob-API - In the /Server directory, via command line run `node index.js`

