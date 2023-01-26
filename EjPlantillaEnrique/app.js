var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var md5 = require('md5');
const hash = require('pbkdf2-password')()

// Se cargan las rutas

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/inicioSesion');
var panelRouter = require('./routes/panel');
var adminRouter = require('./routes/admin');
var crearRouter = require('./routes/instalador');
var cerrarRouter = require('./routes/cerrar');
var passwordRouter = require('./routes/password');
var adminRouter = require('./routes/admin');
var altaRouter = require('./routes/alta')
var borrarRouter = require('./routes/borrar')
var modificarRouter = require('./routes/modificar')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: "Contraseña", 
        cookie: { maxAge: 10*60*1000 }, 
        saveUninitialized: false,
        resave: false
    })
)

// Listado de permisos
const perm = require("./permissions")

// Listado de las páginas que se pueden ver sin autentificación
const public_pages = {
    "/":[perm.NONE],
    "/inicioSesion":[perm.NONE],
    "/instalador":[perm.NONE]
};

// Listado de páginas que requieren algún tipo de autorización especial
const private_pages = {
    "/panel":[perm.USER, perm.ADMIN],
    "/cerrar":[perm.USER, perm.ADMIN],
    "/admin":[perm.ADMIN],
    "/password":[perm.USER, perm.ADMIN],
    "/borrar":[perm.ADMIN],
    "/modificar":[perm.ADMIN],
    "/alta":[perm.ADMIN]
};

// Control de sesión iniciada
app.use((req, res, next) => {
    // Se verifica que la pagiona inicial este dentro de las paginas posibles
    console.log('antes del if de los permisos');
    
    console.log(private_pages[req.url]);
    console.log('pagina publica' + public_pages[req.url]);
    console.log("url pagina: " +req.url);
    console.log("permisos: "+req.session.permission);
    
    
    if (req.session.usuario){
        if((req.url in private_pages &&
          private_pages[req.url].includes(req.session.permission)) || req.url in public_pages) {
            next()
        }else
        next(createError(404));
    }
    else {
        // Si el usuario no ha iniciado sesión, se verifica que la página es pública
        if(req.url in public_pages)
            next()
        else if(req.url in private_pages)
            res.redirect('/inicioSesion')
        else
            next(createError(404)) // Not found
    }
})
// || 

// Se asignan las rutas a sus funciones middleware

app.use('/', indexRouter);
app.use('/instalador', crearRouter);
app.use('/inicioSesion', loginRouter);
app.use('/admin',adminRouter);
app.use('/panel', panelRouter);
app.use('/cerrar', cerrarRouter);
app.use('/password',passwordRouter);
app.use('/alta',altaRouter);
app.use('/modificar', modificarRouter);
app.use('/borrar',borrarRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080)

module.exports = app;
