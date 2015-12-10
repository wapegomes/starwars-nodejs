/**
 * Created by felipe.arimateia on 12/9/2015.
 */
var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var db = utils.connection();
var devices = db.get("devices");

router.get('/save/:token', function(req, res, next){

    var deviceToken = req.params.token;

    if(deviceToken == undefined || !deviceToken) {
        return res.status(400).send({message:"Token invalido"});
    }

    devices.findAndModify({token:deviceToken},{$set: {token:deviceToken}},{upsert:true},function(err, doc){

        if(!err) {
            return res.send(doc);
        }

        console.error(err);
        return res.status(500).send(err);

    });
});

module.exports = router;