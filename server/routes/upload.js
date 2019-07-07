const express = require('express');
const fileUpload = require('express-fileupload')
let app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

//Transforma todo  lo que viene a un req.files
app.use( fileUpload({ useTempFiles: true }) );


app.put('/upload/:tipo/:id', function(req, res){
	
	let tipo = req.params.tipo;
	let id = req.params.id;



	if(!req.files){
		return res.status(400)
					.json({
						ok: false,
						err:{
							message: "No se ha seleccionado ningún archivo"
						}
					})
	}

	//val tipo
	let tiposValidos = ['productos', 'usuarios'];
	if(tiposValidos.lastIndexOf(tipo)<0){
		return res.status(400).json({
				ok: false,
				err:{
					
					message: 'Los tipos válidos son  ' + tiposValidos.join(' ')
				}
			})
	}



	//Archivo es el nombre del input
	let archivo = req.files.archivo;
	//extensiones permitidas

	let extensionesValidad = ['png', 'jpg', 'gif', 'jpeg'];

	let nombreCortado = archivo.name.split('.');

	let extension = nombreCortado[nombreCortado.length -1]
	console.log(extension);

	if(extensionesValidad.indexOf(extension)<0)
	{
		return res.status(400).json({
			ok: false,
			err:{
				exte: extension,
				message: 'Las extensiones permitidas son  ' + extensionesValidad.join(' ')
			}
		})
	}
	//cambiar nombre archivo
	//nombreHola-123.jpg
	let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

	archivo.mv(`../uploads/${tipo}/${ nombreArchivo }`, (err)=>{
				if(err){
					return res.status(500).json({
						ok: false,
						err
					})
				}

				//Aquí ya se cargó la imagen
				switch (tipo) {
					case 'usuarios':
						// statements_1
						imagenUsuario(id, res, nombreArchivo);
						break;
					case 'productos':
						// statements_1
						imagenProducto(id, res, nombreArchivo);
						break;
					default:
						// statements_def
						break;
				}


				
	});
});


function imagenUsuario(id, res, nombreArchivo){
	Usuario.findById(id,(err, usuarioDB)=>{
	
		if(err){
			borraArchivo(nombreArchivo, 'usuarios');

			return res.status(500).json({
				ok: false,
				err
			})
		}

		if(!usuarioDB){
			borraArchivo(nombreArchivo, 'usuarios');

			return res.status(400).json({
				ok: false,
				err: {
					message: "Usuario no existe"
				}
			})
		}

		borraArchivo(usuarioDB.img, 'usuarios');
		
		usuarioDB.img = nombreArchivo;
		usuarioDB.save((err, usuarioGuardado)=>{
			if(err){
				return res.status(500).json({
					ok: false,
					err
				})
			}
			res.json({
						ok: true,
						usuario: usuarioGuardado,
						img: nombreArchivo
					})
			})

	});
}
function imagenProducto(id, res, nombreArchivo){

	Producto.findById(id, (err, productoDB)=>{
				if(err){
					borraArchivo(nombreArchivo, 'productos');
					return res.status(500).json({
						ok: false,
						err
					})
				}

				if(!productoDB){
					borraArchivo(nombreArchivo, 'productos');
					return res.status(400).json({
						ok: false,
						err: {
							message: "No existe un producto con ese id"
						}
					})
				}

				//Borrar foto anterior
				borraArchivo(productoDB.img, 'productos');

				productoDB.img = nombreArchivo;

				productoDB.save((err, productoGuardado)=>{
					res.json({
						ok: true,
						producto: productoGuardado,
						img: nombreArchivo
					})
				});
	});

}

function borraArchivo(nombreImagen, tipo){
	let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
		//VEr si existe
		if(fs.existsSync(pathImagen)){
			fs.unlinkSync(pathImagen);
		}
}

module.exports = app;