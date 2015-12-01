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

    if(!game.nome || !game.descricao || !game.plataformas) {
        return res.status(400).send({message:"Json invalido."});
    }

    games.insert(game, function(err, doc) {

        if (err) {
            return res.status(500).send(err);
        }

        sendPush(doc);

        return res.send(doc);
    });

});

module.exports = router;