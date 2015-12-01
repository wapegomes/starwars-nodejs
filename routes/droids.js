/**
 * Created by felipe.arimateia on 12/1/2015.
 */

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var db = utils.connection();
var droids = db.get("droids");

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var gm = require('gm');
var path = require('path');

router.get('/', function(req, res, next){

    droids.find({},function(err, result){

        if(err) {
            return  res.sendStatus(500);
        }

        return res.send(result);
    });
});

router.post('/', function(req, res, next) {

    var droid = req.body;

    if(!droid.name || !droid.description || !droid.link || !droid.image) {
        return res.status(400).send({message:"Json invalido."});
    }

    droids.insert(droid, function(err, doc) {

        if (err) {
            return res.status(500).send(err);
        }
        return res.send(doc);
    });

});

router.get('/:droidId', function(req, res, next) {

    var droidId = req.params.droidId;

    droids.findById(droidId, function(err, doc){

        if (err) {
            return res.status(500).send(err);
        }

        return res.send(doc);

    });
});

module.exports = router;