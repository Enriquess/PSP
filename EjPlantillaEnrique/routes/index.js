var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.usuario == null){
    res.render('index', { title: 'Express',usu:"Iniciar sesion"});
  }else
  res.render('index', { title: 'Express',usu:req.session.usuario});
  
});

module.exports = router;
