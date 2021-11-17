//Invocamos a la conexion de la DB
const conexion = require('../database/db');

var identidad=1;

function internalVariable(select){
    identidad=select;
}




//GUARDAR un Evento
exports.save = (req, res)=>{
    const user = req.body.user;
    const rol = req.body.rol;
    console.log("se creo evento");
    /*conexion.query('INSERT INTO eventos SET ?',{fecha_inicio:fecha_inicio, fecha_final:fecha_final, nombre:nombre, institucion:institucion, descripcion:descripcion}, (error, results)=>{
        if(error){
            console.log(error);
        }else{
            //console.log(results);   
            res.redirect('principal');         
        }*
});*/
};



//ACTUALIZAR un evento
exports.update = (req, res)=>{
    const id = req.body.id;
    const fecha_inicio = req.body.fecha_inicio;
    const fecha_final = req.body.fecha_final;
    const nombre = req.body.nombre;
    const institucion = req.body.institucion
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


