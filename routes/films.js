/**
 * Created by felipe.arimateia on 12/1/2015.
 */

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var db = utils.connection();
var films = db.get("films");


router.get('/', function(req, res, next){

    films.find({},function(err, result){

        if(err) {
            return  res.sendStatus(500);
        }

        return res.send(result);
    });
});

router.post('/', function(req, res, next) {

    var film = req.body;

    if(!film.name || !film.description || !film.link || !film.image || !film.year) {
        return res.status(400).send({message:"Json invalido."});
    }

    films.insert(film, function(err, doc) {

        if (err) {
            return res.status(500).send(err);
        }
        return res.send(doc);
    });

});

router.get('/:filmId', function(req, res, next) {

    var filmId = req.params.filmId;

    films.findById(filmId, function(err, doc){

        if (err) {
            return res.status(500).send(err);
        }

        return res.send(doc);

    });
});

module.exports = router;