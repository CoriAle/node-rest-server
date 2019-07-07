const express = require('express');
const fs = require('fs');
const path = require('path')

const { verificaTokenImg } = require('../middlewares/autenticacion');


let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res)=>{
	let tipo = req.params.tipo;
	let img = req.params.img;
	let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
	//VEr si existe
	if(fs.existsSync(pathImagen)){
		res.sendFile(pathImagen)
	}
	else{
		let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
		//no-image.jpg
		//Setea el contentTYpe del haedar
		res.sendFile(noImagePath);
		
	}
});
module.exports = app;