// Se cierra la sesión del usuario
const DBFactory = require("./BaseDatos").DBFactory
const db = DBFactory("sqlite")
var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    let usuario = req.body['nombre3']

    //pasar a la base de datos y cambiar la encriptacion
    db.borrarUsuario(usuario,()=>{
        res.redirect("/panel")
    })
        
});

module.exports = router;
