//Invocamos a la conexion de la DB
const conexion = require('../database/db');

<<<<<<< HEAD
var identidad=1;

function internalVariable(select){
    identidad=select;
}



=======
>>>>>>> cc5d51c01a5464d3f8eef25db2922021878f8a36

//GUARDAR un Evento
exports.save = (req, res)=>{
    const user = req.body.user;
    const rol = req.body.rol;
<<<<<<< HEAD
    console.log("se creo evento");
    /*conexion.query('INSERT INTO eventos SET ?',{fecha_inicio:fecha_inicio, fecha_final:fecha_final, nombre:nombre, institucion:institucion, descripcion:descripcion}, (error, results)=>{
=======
    conexion.query('INSERT INTO eventos SET ?',{fecha_inicio:fecha_inicio, fecha_final:fecha_final, nombre:nombre, institucion:institucion, descripcion:descripcion}, (error, results)=>{
>>>>>>> cc5d51c01a5464d3f8eef25db2922021878f8a36
        if(error){
            console.log(error);
        }else{
            //console.log(results);   
            res.redirect('principal');         
<<<<<<< HEAD
        }*
});*/
};



=======
        }
});
};
>>>>>>> cc5d51c01a5464d3f8eef25db2922021878f8a36
//ACTUALIZAR un evento
exports.update = (req, res)=>{
    const id = req.body.id;
    const fecha_inicio = req.body.fecha_inicio;
    const fecha_final = req.body.fecha_final;
    const nombre = req.body.nombre;
    const institucion = req.body.institucion
<<<<<<< HEAD
    conexion.query('UPDATE eventos SET ? WHERE id = ?',[{fecha_inicio:fecha_inicio, fecha_final:fecha_final, nombre:nombre, institucion:institucion, descripcion:descripcion}, identidad], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect('principal');   
            console.log(identidad);      
        }
});
};


exports.update2 = (req, res)=>{
    
    const correoModificado = req.body.correoModificado;
    const nombreModificado = req.body.nombreModificado;
    const apellidoModificado = req.body.apellidoModificado;
    const institucionModificado = req.body.institucionModificado
    conexion.query('UPDATE users SET ? WHERE id = ?',[{correo: correoModificado
        , nombre:nombreModificado, apellido:apellidoModificado, institucion:institucionModificado}, identidad], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect('principal');     
            console.log(identidad);    
        }
});
};


=======
    conexion.query('UPDATE eventos SET ? WHERE id = ?',[{fecha_inicio:fecha_inicio, fecha_final:fecha_final, nombre:nombre, institucion:institucion, descripcion:descripcion}, id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect('principal');         
        }
});
};
>>>>>>> cc5d51c01a5464d3f8eef25db2922021878f8a36
