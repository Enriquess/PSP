var express = require('express');
var router = express.Router();
const DBFactory = require("./BaseDatos").DBFactory
const db = DBFactory("sqlite")
const perm = require('../permissions')

router.get('/', function (req, res, next) {
    if (req.session.usuario) {
        console.log('Sesión iniciada')
        res.redirect('/panel')
    }
    res.render('inicioSesion', { login_error: "none" });
});

router.post('/', function (req, res, next) {
    const usuario = req.body['usuario']
    const password = req.body['password']
    if (req.session.usuario) {
        res.redirect('/panel')
    }
    //pasar a la base de datos
    db.loginUsuario(usuario,password,(err,permiso)=>{
        if (err){
            req.session.usuario = usuario;
            req.session.permission = permiso;
            res.redirect("/panel")
        }else{
            res.render('inicioSesion', { login_error: "inline",usu:"" });
        }
    })
});

module.exports = router;
