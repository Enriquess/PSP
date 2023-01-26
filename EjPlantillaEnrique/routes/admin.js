// Se cierra la sesión del usuario
var express = require('express');
var router = express.Router();
const DBFactory = require("./BaseDatos").DBFactory
const db = DBFactory("sqlite")

router.get("/",(req,res)=>{
        res.render("admin",{usu:req.session.usuario})
})

router.post('/', function (req, res, next) {
        
        if (req.session.usuario = "admin")
                db.mostrarUsuarios((rows)=>{
                        res.render('admin',{usu:req.session.usuario,filas:rows})
        })       
        else 
                res.redirect("/panel"); 
        
});

module.exports = router;
