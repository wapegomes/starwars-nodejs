var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var db = utils.connection();
var users = db.get('users');
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "m'RN}GSFS%Hg7S2o1D;6Y|1@:DnPwRkrN^m{Nc1l]9yFeQ4<}3tU[st21M(AU";

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var gm = require('gm');
var path = require('path');

router.post('/login', function (req, res, next) {

  var user = req.body;
  var password = utils.sha1(user.password);

  users.findOne({email:user.email, password:password},function(err, user){

    if (err || !user) {
      return res.sendStatus(401);
    }

    var expires = moment().add(7, 'days').valueOf();

    var token = jwt.encode({
      iss:user._id,
      exp:expires
    }, secret, 'HS512');

    user.token = token;
    user.exp = expires;
    delete user.password;

    return res.send(user);

  });
});

router.post('/signup', function(req, res, next){

  var user = req.body;

  if(!user.name || !user.email || !user.password) {
    return res.sendStatus(400);
  }

  users.findOne({email:user.email}, function(err, doc) {

    if(doc) {
      return res.status(409).send({message:"Usuario ja cadastrado"});
    }

    var password = utils.sha1(user.password);
    user.password = password;

    users.insert(user, function(err, user){

      if(err) {
        return res.sendStatus(500);
      }

      delete user.senha;

      return res.send(user);

    });

  });
});

router.post('/uploadPhoto/:user', multipartMiddleware, function(req, res) {

  var userId = req.params.user;

  if (!userId) {
    console.log(userId);
    return res.status(400).send({message:"User ID invalido"});
  }

  var uploadFile = null;

  for(var i in req.files) {
    if (req.files.hasOwnProperty(i)){
      uploadFile = req.files[i];
    }
  }

  var fileName = userId + "_" + Date.now() +".jpg";
  var pahtImage = path.resolve(__dirname + "/../public/images/" + fileName);

  gm(uploadFile.path).write(pahtImage, function(err) {

    if(err) {
      console.log(err);
      return res.status(500).send(err);
    }

    save(userId, fileName, res);

  });
});

function save(userId, fileName, res) {

  users.findById(userId, function(err, result){

    if(err) {
      return res.status(500).send(err);
    }

    result.image = fileName;

    users.findAndModify({_id:result._id},{$set: result},{upsert:true}, function(err, doc){

      if(!err) {
        return res.send(doc);
      }

      return res.status(500).send(err);

    });

  });
};

router.get('/:idUser/deviceToken/:token', function(req, res, next){

  var idUser = req.params.idUser;
  var deviceToken = req.params.token;

  console.log("user_id" + idUser);

  if(!idUser || deviceToken == undefined || !deviceToken) {
    return res.status(400).send({message:"User ID invalido"});
  }

  users.findById(idUser, function(err, result){

    if(err) {
      return res.status(500).send(err);
    }

    result.deviceToken = deviceToken;

    users.findAndModify({_id:result._id},{$set: result},{upsert:true}, function(err, doc){

      if(!err) {
        return res.send(doc);
      }

      return res.status(500).send(err);

    });

  });

});

module.exports = router;
