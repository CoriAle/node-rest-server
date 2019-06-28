require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
 
// parse application/x-www-form-urlencoded
//Ap use es un middleware y toda petición pasa por ellos
//bodyparser sirve para parsear objetos de las peticones
app.use(bodyParser.urlencoded({ extended: false }))
 

app.get('/usuario', function (req, res) {
  res.json('get Usuario')
})

app.post('/usuario', function (req, res) {
  let body = req.body;
  if(body.nombre=== undefined){
  	res.status(400).json({
  		ok: false,
  		mensaje: "El nombre es necesario",
  	});
  }else{
	  res.json({
	  	persona: body,

	  })
  	
  }
})
//Envíar parámetros
app.put('/usuario/:id', function (req, res) {
	let id = req.params.id; //Obtener el id
  res.json({
  	id
  });
})
app.delete('/usuario', function (req, res) {
  res.json('delete Usuario')
})
 
app.listen(process.env.PORT, ()=>{
	console.log('Escuchando puerto 3000')
})


//"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="c:\data\db"