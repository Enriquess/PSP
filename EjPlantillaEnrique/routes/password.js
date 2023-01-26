var express = require('express');
const DBFactory = require("./BaseDatos").DBFactory
const db = DBFactory("sqlite")
var router = express.Router();


router.post('/',(req,res)=>{
    let pass1 = req.body['password1'];
    let pass2 = req.body['password2'];
    //pasar a la base de datos y cambiar la encriptacion
    if (pass1 === pass2){
        db.cambiarContra(pass1,req.session.usuario,()=>{
            res.redirect("/panel")
        })
    }
    else
    {
        res.redirect("/panel");
    }
})

module.exports = router;