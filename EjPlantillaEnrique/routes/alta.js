// Se cierra la sesión del usuario
var express = require('express');
var router = express.Router();
const DBFactory = require("./BaseDatos").DBFactory
const db = DBFactory("sqlite")

router.post('/', function (req, res, next) {
    let usuario = req.body['nombre']
    let contr = req.body['password']
    let permiso = req.body['permiso']

    db.insertarUsuario(usuario,contr,permiso,()=>{
        res.redirect("/panel")
    })
        
});

module.exports = router;
