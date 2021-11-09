//1- Invocamos a express
const express = require('express');
const app = express();
const router = express.Router();

//2- seteamos urlencoded para capturar Los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//


//3- Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});


//4- el directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - Establecemos el motor de plantillas ejs
app.set('view engine', 'ejs');


//6- Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//7- Var. de session
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

//8- Invocamos al módulo de conexion de la BD
const connection = require('./database/db');

//9- Estableciendo las rutas
app.get('/', (req, res)=>{
    res.render('index');
})

app.get('/login', (req, res)=>{
    res.render('login');
})
app.get('/register', (req, res)=>{
    res.render('register');
})


//10- Registro de usuarios
app.post('/register', async (req, res) =>{
    const correo = req.body.correo;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const institucion = req.body.institucion;
    const contrasenia = req.body.contrasenia;
    let passwordHaash = await bcryptjs.hash(contrasenia, 8);
    connection.query('INSERT INTO users SET ?', {correo:correo, nombre:nombre,apellido:apellido, institucion:institucion, contrasenia:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register',{
                alert:true,
                alertTitle:"Registro",
                alertMessage:"Registro Completado",
                alertIcon:"success",
                showConfirmButton:false,
                timer:1500,
                ruta:''
            })
        }
    })
})


//11- Autenticación
app.post('/auth', async(req, res)=>{
    const correo = req.body.correo;
    const contrasenia = req.body.contrasenia;
    let passwordHaash = await bcryptjs.hash(contrasenia, 8)
    if(correo && contrasenia){
        connection.query('SELECT * FROM users WHERE correo = ?', [correo], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(contrasenia, results[0].contrasenia))){
                res.render('login',{
                    alert:true,
                    alertTitle:"Error",
                    alertMessage:"Correo y Contraseña Incorrectas",
                    alertIcon: "error",
                    showConfirmButton:true,
                    timer:1500,
                    ruta:'login'
                });
            }else{
                req.session.loggedin = true;
                req.session.nombre = results[0].nombre;
                res.render('login', {
                    alert:true,
                    alertTitle:"Conexión exitosa",
                    alertMessage:"¡LOGIN CORRECTO!",
                    alertIcon:"success",
                    showConfirmButton:false,
                    timer:1500,
                    ruta:'principal'
                });
            }

        })
    }else{
        res.render('login', {
            alert:true,
            alertTitle:"!Por favor ingrese un correo y una contraseña!",
            alertMessage:"¡LOGIN CORRECTO!",
            alertIcon:"warning",
            showConfirmButton:true,
            timer:2500,
            ruta:'login'
        });
    }
})

//12- Autenticar paginas
app.get('/principal',(req, res)=> {
    if(req.session.loggedin){
        res.render('main',{
            login:true,
            nombre: req.session.nombre
        });
    }else{
        res.render('main',{
            login:false,
            nombre:'Debe iniciar sesión',
        })
    }
})

//13- Funcion para limpiar la cache luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});



//14- Cerrar Sesión
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});


app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000')
})

module.exports = router