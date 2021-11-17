//1- Invocamos a express

const express = require('express');
const app = express();
const router = express.Router();
//nuevo//
const mycon = require('express-myconnection')
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use(express.static('upload'));
const fs = require('fs')
const path=require('path')
const multer = require('multer')
app.use(express.static(path.join(__dirname,'upload')));
var crud=require('./controllers/crud')
let alert = require('alert'); 



//5 - Establecemos el motor de plantillas ejs
app.set('view engine', 'ejs');



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
const { ExpressHandlebars } = require('express-handlebars');

//9- Estableciendo las rutas
app.get('/', (req, res)=>{
    res.render('index');
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.use('/',require('./router'));

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

var identidad=0;
let apellido2="";
let institucion2="";
let correo2="";
let nombre="";

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
                nombre = results[0].nombre;
                req.session.id = results[0].id;
                apellido2 = results[0].apellido;
                institucion2 = results[0].institucion;
                correo2 = results[0].correo;

                identidad=results[0].id;
                fs.writeFileSync(path.join(__dirname,'./upload/'+ results[0].id+".jpg"),results[0].foto);
                fs.writeFileSync(path.join(__dirname,'./upload/temporal.jpg'),results[0].foto);
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
            nombre: nombre,
            id: identidad,
            correo:correo2,
            apellido:apellido2,
            institucion:institucion2,
            
        });
        
    }else{
        res.render('main',{
            login:false,
            nombre:'Debe iniciar sesión'
            
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
      const fs = require('fs')

try {
  fs.unlinkSync(path.join(__dirname,'./upload/'+ identidad+".jpg"));
  fs.unlinkSync(path.join(__dirname,'./upload/temporal.jpg'));
  console.log('File removed');
} catch(err) {
  console.error('Something wrong happened removing the file', err)
}
	})
});

/*const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '/upload'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-monkeywit-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('upload');*/


//nuevo

app.post('/prueba3', fileUpload,(req, res) => {

    req.getConnection((err, conn) => {
        if(err) return res.status(500).send('server error')

        const type = req.file.mimetype
        const name = req.file.originalname
        const data = fs.readFileSync(path.join(__dirname, '/images/' + req.file.filename))

        connection.query('UPDATE users set ? where id = ?', [{foto:data},identidad] , (err, rows) => {
            if(err) return res.status(500).send('server error')

            res.send('image saved!')
        })
    })
    
});




app.post('/prueba',(req,res)=>{
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return alert('no subio ninguna imagen');
    }
    
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/upload/temporal.jpg';
  
    console.log(sampleFile);
    // Use mv() to place file on the server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        
            const data = fs.readFileSync(path.join(uploadPath))
            fs.writeFileSync(path.join(__dirname,'./upload/temporal.jpg'),data);
            
        })

        imagenes = fs.readdirSync(path.join(__dirname,"./upload/"));
        req.session.loggedin = true;
       

});


/** prueba origina
 * app.post('/prueba',(req,res)=>{
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/upload/' +identidad+".jpg";
  
    console.log(sampleFile);
    // Use mv() to place file on the server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        
            const data = fs.readFileSync(path.join(uploadPath))
    
            connection.query('UPDATE users set ? where id = ?', [{foto:data},identidad], (err, rows) => {
                if(err) return res.status(500).send('server error')
    
                
            
        })

        connection.query('select * from users where id = ?',[identidad],(err, rows) => {
            if(err) return res.status(500).send('server error')

            console.log(rows[0].id);
            fs.writeFileSync(path.join(__dirname,'./upload/'+ rows[0].id+".jpg"),rows[0].foto);

            const imagenPerfil = path.join(__dirname,'./upload/'+ rows[0].id+".jpg");
            
           
        })

        imagenes = fs.readdirSync(path.join(__dirname,"./upload/"));
        

});

});
 */



/*

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;+ñ
}
*/


//do stuff here to give the blob some data...




let imagenes=[];


app.get('/prueba/get',(req,res)=>{


        connection.query('select * from users where id = ?',[identidad],(err, rows) => {
            if(err) return res.status(500).send('server error')

            console.log(rows[0].id);
            fs.writeFileSync(path.join(__dirname,'./upload/'+ rows[0].id+".jpg"),rows[0].foto);
            req.session.loggedin = true;
        })

        imagenes = fs.readdirSync(path.join(__dirname,"./upload/"));
        
        
    }) ;   

app.post('/update2', (req, res)=>{
    const correoModificado = req.body.correoModificado;
    const nombreModificado = req.body.nombreModificado;
    const apellidoModificado = req.body.apellidoModificado;
    const institucionModificado = req.body.institucionModificado
    connection.query('UPDATE users SET ? WHERE id = ?',[{correo: correoModificado
        , nombre:nombreModificado, apellido:apellidoModificado, institucion:institucionModificado}, identidad], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            console.log('se acualizo la info')
            req.session.loggedin = true;
    }
});
            let uploadPath = __dirname + '/upload/temporal.jpg';
            const data = fs.readFileSync(path.join(uploadPath))

            connection.query('UPDATE users set ? where id = ?', [{foto:data},identidad], (err, rows) => {
                if(err) return res.status(500).send('server error');
                req.session.loggedin = true;
            });
            connection.query('SELECT * FROM users WHERE id = ?', [identidad], async (error, results)=>{
                req.session.loggedin = true;
                nombre= results[0].nombre;
                apellido2 = results[0].apellido;
                institucion2 = results[0].institucion;
                correo2 = results[0].correo;
                identidad=results[0].id;
                fs.writeFileSync(path.join(__dirname,'./upload/'+ results[0].id+".jpg"),results[0].foto);
                console.log(results[0]);
                console.log(req.session.nombre);
                
                res.redirect('/principal'); 
            
        });


        
});



app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000')
})




