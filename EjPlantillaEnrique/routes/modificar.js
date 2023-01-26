// Se cierra la sesión del usuario
const DBFactory = require("./BaseDatos").DBFactory
const db = DBFactory("sqlite")
var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    let usuario = req.body['nombre2']
    let contr = req.body['password2']
    //pasar a la base de datos y cambiar la encriptacion
    if (usuario != "admin"){
        db.modificarUsuario(usuario,contr)
    }
    res.redirect("/panel")
});

module.exports = router;
