/**
 * Created by felipe.arimateia on 12/1/2015.
 */

var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var db = utils.connection();
var locations = db.get("locations");


router.get('/', function(req, res, next){

    locations.find({},function(err, result){

        if(err) {
            return  res.sendStatus(500);
        }

        return res.send(result);
    });
});

router.post('/', function(req, res, next) {

    var location = req.body;

    if(!location.title || !location.description || !location.latitude || !film.longitude) {
        return res.status(400).send({message:"Json invalido."});
    }

    locations.insert(location, function(err, doc) {

        if (err) {
            return res.status(500).send(err);
        }
        return res.send(doc);
    });

});

router.get('/:locationId', function(req, res, next) {

    var locationId = req.params.locationId;

    locations.findById(locationId, function(err, doc){

        if (err) {
            return res.status(500).send(err);
        }

        return res.send(doc);

    });
});

module.exports = router;