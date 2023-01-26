// Se cierra la sesión del usuario

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.usuario) {
        res.render("cerrar", {sesion_usuario:req.session.usuario,usu:req.session.usuario} )
        req.session.destroy()
    }
});

module.exports = router;
