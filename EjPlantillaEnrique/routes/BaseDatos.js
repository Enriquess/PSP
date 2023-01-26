const sqlite3 = require('sqlite3');
const hash = require('pbkdf2-password')()
const perm = require("../permissions")

function DBFactory(cual){
    let db;
    if (cual === "sqlite"){
        db = new sqlite3.Database('./baseDatos.db', sqlite3.OPEN_READWRITE |
        sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.log("Error: " + err);
            process.exit(1);
        }
        });

        db.crearBase = ()=>{
            let pass_hash = "";
            let pass_salt = "";

            hash({password : "admin"},(err,pass,salt,hash)=>{
                if (err) throw err;
                pass_hash = hash;
                pass_salt = salt;
            })
            
            db.exec(
                `
                create table if not exists usuarios (
                    usuario text primary key,
                    password text,
                    salt text,
                    perm integer
                    ); 
                `
                ,(err) => {
                    if (err) {
                        console.log("Error: " + err);
                        process.exit(1);
                    }else
                    {
                        db.all("insert or replace into usuarios (usuario,password,salt,perm) values (?,?,?,?)","admin",pass_hash,pass_salt,perm.ADMIN,
                        (err) => {
                            if (err) {
                                console.log("Error: " + err);
                                process.exit(1);
                            }
                        });
                    }
                });
        }

        db.cambiarContra = (contra,usu,fun)=>{
            let pass_hash = "";
            let pass_salt = "";
            hash({password:contra},(err,pass,salt,hash)=>{
                if (err) throw err;
                pass_hash = hash;
                pass_salt = salt;
                db.all("update usuarios set password = ?, salt = ? where usuario = ?",pass_hash,pass_salt,usu,
                    (err,rows)=>{
                        if(err) {
                            console.log("Error: " + err);
                            process.exit(1);
                            }
                        fun()
                            
                    });
            })
        }

        db.loginUsuario = (usu,contra,fun)=>{
            db.all("select * from usuarios where usuario = ?", usu, (err, rows) => {
                if (err) {
                    console.log("Error: " + err);
                    process.exit(1);
                }
                const row = rows[0];
                if (rows.length > 0){
                    hash({password:contra,salt:row.salt},(err,pass,salt,hash)=>{
                        if (err) throw err;
                        if (row.password == hash)
                            fun(true,row.perm)
                        else
                            fun(false)
                    })
                }else
                    fun(false)
            });
        }

        db.modificarUsuario = (usuario,contra,fun)=>{
            let pass_hash = "";
            let pass_salt = "";
            
            hash({password : contra},(err,pass,salt,hash)=>{
                if (err) throw err;
                console.log('hola');
                pass_hash = hash;
                pass_salt = salt;
            

                db.all("update usuarios set password = ?,salt = ? where usuario = ?",pass_hash,pass_salt,usuario,(err)=>{
                    if (err){
                        console.log("Error: " + err);
                        process.exit(1);
                    }
                })
            })
        }

        db.borrarUsuario = (usuario,fun)=>{
            db.all("delete from usuarios where usuario = ?",usuario,
            (err)=>{
                if (err) {
                    if (err) throw err;
                    fun(true)
                }
                fun(false)
            })
        }

        db.insertarUsuario = (usuario,contra,permisos,fun)=>{
            let pass_hash = "";
            let pass_salt = "";
            
            hash({password : contra},(err,pass,salt,hash)=>{
                if (err) throw err;
                pass_hash = hash;
                pass_salt = salt;
            
                db.all("insert or replace into usuarios (usuario,password,salt,perm) values (?,?,?,?)",usuario,pass_hash,pass_salt,permisos,(err)=>{
                    if (err){
                        console.log("Error: " + err);
                        process.exit(1);
                    }
                    fun()
                })
            })
        }

        db.mostrarUsuarios = (fun)=>{
            db.all("select usuario from usuarios",(err,rows)=>{
                if (err){
                    console.log('Error: ' + err);
                    process.exit(19);
                }
                fun(rows);
            })
        }
    }
    else if (cual === "mysql"){
        db = null
    }
    else if(cual === "mariadb"){
        db = null
    }
    return db;
}

exports.DBFactory = DBFactory;