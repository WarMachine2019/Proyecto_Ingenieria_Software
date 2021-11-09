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

module.exports = router;