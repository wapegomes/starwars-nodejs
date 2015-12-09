/**
 * Created by felipe.arimateia on 12/9/2015.
 */

var gcm = require('node-gcm');
var utils = require('../utils/utils');
var db = utils.connection();
var devices = db.get("devices");


function send(type, content) {

    devices.find({}, function(err, result) {

        if(err) {
            return err;
        }

        var regIds = [];

        result.forEach(function(device) {
            regIds.push(device.token);
        });

        sendPush(type, content, regIds);
    });
}

function sendPush(type, content, regIds) {

    var message = new gcm.Message();
    message.addData('type', type);
    message.addData('content', content)

    var sender = new gcm.Sender('AIzaSyBnXAbB6F2EzDY8_4bbzq2nuybOy7typsc');

    sender.send(message, regIds, function (err, result) {
        if(err) console.error(err);
        else    console.log(result);
    });
}

module.exports= {
    sendMessage:send
}