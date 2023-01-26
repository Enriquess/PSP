var express = require('express');
var router = express.Router();
const perm = require('../permissions')

router.get('/', (req, res, next) =>{
  //quitar 
    if (req.session.permission === perm.ADMIN)
    res.render("panel",{admin_panel:"inline",usu:req.session.usuario})
    else
    res.render("panel",{admin_panel:"none",usu:req.session.usuario})
    
});
module.exports = router;
