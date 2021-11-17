const express = require('express');
const router = express.Router();

const conexion = require('./database/db');

router.get('principal', (req, res)=>{     
    conexion.query('SELECT * FROM eventos',(error, results)=>{
        if(error){
            throw error;
        } else {                       
            res.render('principal', {results:results});            
        }   
    })
})

router.get('/create', (req,res)=>{
    res.render('create');
})


const crud = require('./controllers/crud');

router.post('/save', crud.save);

<<<<<<< HEAD



=======
>>>>>>> cc5d51c01a5464d3f8eef25db2922021878f8a36
module.exports = router;