require('./config/config');
const express = require('express');
const app = express();
// Using Node.js `require()`
const mongoose = require('mongoose');

const path = require('path')

const bodyParser = require('body-parser');
 
// parse application/x-www-form-urlencoded
//Ap use es un middleware y toda petición pasa por ellos
//bodyparser sirve para parsear objetos de las peticones
app.use(bodyParser.urlencoded({ extended: false }))
 
//Configuración global de rutas
app.use( require('./routes/index'));

//hbilitar la carpeta public
//path para añadir la url correcta
app.use( express.static( path.resolve(__dirname , '../public')));


mongoose.connect(process.env.URLDB, 
	{useNewUrlParser: true, useCreateIndex: true}
	,(err, res)=>{
	if(err) throw err;
	
	console.log("Base de datos ONLINE");
});
 
app.listen(process.env.PORT, ()=>{
	console.log('Escuchando puerto 3000')
})


