var db = require('../DAL.js');
var collectionName = "test";
var _ = require('lodash');

module.exports = function (router) {
	"use strict";

	router.all('*', function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Auth, Content-Type, Accept");
		next();
	});

	router.options('*', function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
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
		get(req.params, collectionName, res);
	});

	function get(query, collectionName, res) {
		if (query && collectionName) {
			db.find(collectionName, query).done(function (response) {
				console.log("Single get");
				res.status(200).send(response);
			});
		} else if (collectionName) {
			console.log("Many get");
			db.findAll(collectionName).done(function (response) {
				res.status(200).send(response);
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
			db.insert(collectionName, req.body).done(function (response) {
				res.status(201).send(response);
			});
		} else {
			res.status(400).send();
		}
	});

	router.put('/*', function (req, res) {
		edit(req, res);
	});

	router.patch('/*', function (req, res) {
		edit(req, res);
	})

	function edit(req, res) {
		var collectionName = req.params[0];
		if (Object.keys(req.body).length !== 0 && req.body.constructor === Object && collectionName) {
			db.update(collectionName, req.body).done(function (response) {
				console.log("Success result", response);
				res.status(200).send(response);
			});
		} else {
			res.status(400).send();
		}
	}

	router.delete('/*', function (req, res) {
		var collectionName = req.params[0];
		var id = req.query._id;
		if (id && collectionName) {
			db.remove(collectionName, id).done(function (response) {
				res.status(200).send(response);
			});
		} else {
			res.status(400).send();
		}
	});

	return router;
};
