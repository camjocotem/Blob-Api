var db = require('../DAL.js');
var _ = require('lodash'),
	express = require('express'),
	router = express.Router();

	router.all('*', function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Auth, Content-Type, Accept");
		next();
	});

	router.options('*', function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Auth, Content-Type, Accept");
		next();
	});

	router.get('/alive', function (req, res) {
		res.send("OK");
	});

	router.get('/*', function (req, res, next) {
		var collectionName = req.params[0];
		if (req._parsedUrl.pathname.slice(1).indexOf('/') !== -1) {
			return next();
		}
		get(req.query, collectionName, res);
	});

	router.get('/*/:_id', function (req, res) {
		var collectionName = req.params["0"];
		delete req.params["0"]
		get(req.params, collectionName, res, true);
	});

	/**
 * @param {import("qs").ParsedQs | { _id: string; }} query
 * @param {any} collectionName
 * @param {import("express-serve-static-core").Response<any, Record<string, any>, number>} res
 */
	function get(query, collectionName, res, single=false) {
		if (Object.entries(query).length > 0 && collectionName) {
			db.find(collectionName, query,single).then(function (response) {
				res.status(200).send(response);
			});
		} else if (collectionName) {
			db.findAll(collectionName).then(function (response) {
				if(response && response.length === 0){
					res.status(204).send(response);
				}
				else{
					res.status(200).send(response);
				}
			});
		} else {
			res.status(400).send();
		}
	}

	router.post('/*', function (req, res) {
		var collectionName = req.params[0];
		if (
			((_.isArray(req.body) && req.body.length > 0) ||
			 (Object.keys(req.body).length !== 0 && req.body.constructor === Object))
			&& collectionName) {
			db.insert(collectionName, req.body).then(function (response) {
				res.status(201).send(response);
			});
		} else {
			res.status(400).send();
		}
	});

	router.put('/*', function (req, res, next) {
		if (req._parsedUrl.pathname.slice(1).indexOf('/') !== -1) {
			return next();
		}
		edit(req, res);
	});

	router.put('/*/:_id', function (req, res) {
		edit(req, res);
	})

	router.patch('/*', function (req, res, next) {
		if (req._parsedUrl.pathname.slice(1).indexOf('/') !== -1) {
			return next();
		}
		edit(req, res);
	});

	router.patch('/*', function (req, res) {
		edit(req, res);
	})

	function edit(req, res) {
		try {
			var collectionName = req.params[0];
			if (Object.keys(req.body).length !== 0 && req.body.constructor === Object && collectionName) {
				db.update(collectionName, req.body, req.params._id).then(function (response) {
					res.status(200).send(response);
				});
			} else {
				res.status(400).send("Logic error");
			}
		}
		catch (err) {
			res.status(400).send(err);
		}
	}

	router.delete('/*', function (req, res, next) {
		var collectionName = req.params[0];
		if (req._parsedUrl.pathname.slice(1).indexOf('/') !== -1) {
			return next();
		}
		del(req.query._id, collectionName, res);
	});

	router.delete('/*/:id', function (req, res) {
		var collectionName = req.params["0"];
		delete req.params["0"]
		del(req.params.id, collectionName, res);
	});

	// @ts-ignore
	function del(id,collectionName, res) {
		if (id && collectionName) {
			db.remove(collectionName, id).then(function (response) {
				res.status(200).send(response);
			});
		} else {
			res.status(400).send();
		}
	}

module.exports = router;