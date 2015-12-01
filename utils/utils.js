/**
 * Created by felipearimateia on 12/02/15.
 */

var crypto = require('crypto');
var monk = require('monk');


function sha1(str) {
    var hash;
    hash = crypto.createHash('sha1');
    hash.update(str);
    return hash.digest('hex');
};

function responseSuccess(result, res) {
    res.status(200).send(result);
};

function responseError(code, error, res) {
    console.log(error);
    res.status(code).send(error);
};

module.exports= {
    connection: function(){
        return monk("localhost/starwarsapp",{auto_reconnect:true});
    },
    sha1 : sha1,
    responseSuccess: responseSuccess,
    responseError: responseError
}
