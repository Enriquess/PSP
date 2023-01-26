var express = require('express');
const DBFactory = require("./BaseDatos").DBFactory
const db = DBFactory("sqlite")
var router = express.Router();

router.get('/', function(req, res, next) {
    db.crearBase();
    res.redirect('/');
});
module.exports = router;