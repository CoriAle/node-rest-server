const express = require('express');
const {verificaToken }	 = require('../middlewares/autenticacion')

const app = express();
let Producto = require('../models/producto');

//listar todos con us y categoria y paginado
app.get('/producto', verificaToken, (req, res)=>{
	
	let desde = req.query.desde || 0;
	desde = Number(desde);
	Producto.find({disponible: true})
	.skip(desde)
	.limit(5)
	.populate('usuario', 'nombre email')
	.populate('categoria', 'descripcion')
	.exec((err, productos)=>{
				if(err){
					return res.status(500).json({
						ok: false,
						err
					})
				}

			res.json({
				ok: true,
				productos
			});
	})

});
//por id
app.get('/producto/:id', verificaToken, (req, res)=>{
	//Grabar usuario y categoria
	let id = req.params.id;
	Producto.findById(id)
	.populate('usuario', 'nombre email')
	.populate('categoria', 'nombre')
	.exec( (err, productoDB)=>{
				if(err){
					return res.status(500).json({
						ok: false,
						err
					})
				}

				if(!productoDB){
					return res.status(400).json({
						ok: false,
						err:{
							message: 'ID NO EXISTE'
						}
					})
				}


				res.json({
					ok: true,
					producto: productoDB
				})


	});
});


/*******/
//Bunscar productos
/*******/
app.get('/producto/buscar/:termino', verificaToken, (req, res)=>{
	let termino = req.params.termino;
	let regex = new  RegExp(termino, 'i');

	Producto.find({nombre: regex})
		.populate('categoria', 'nombre')
		.exec((err, productos)=>{
					if(err){
						return res.status(500).json({
							ok: false,
							err
						})
					}

					res.json({
						ok: true,
						productos
					})
		});
});

//nuevo producto
app.post('/producto', verificaToken, (req, res)=>{
	let body = req.body;

	let producto = new Producto({
		usuario: req.usuario._id,
		nombre:body.nombre,
		precioUni:body.precioUni,
		descripcion:body.descripcion,
		disponible:body.disponible,
		categoria:body.categoria,
	})

	producto.save((err, productoDB)=>{
		if(err){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		res.status(201).json({
			ok: true,
			producto: productoDB
		})
	})
});

//actualizar
app.put('/producto/:id', verificaToken, (req, res)=>{
	let id = req.params.id;
	let body = req.body;

	Producto.findById(id, (err, productoDB)=>{
		if(err){
			return res.status(500).json({
				ok: false,
				err
			})
		}
		if(!productoDB){
			return res.status(400).json({
				ok: false,
				err:{
					message: "No existe"
				}
			})
		}

		productoDB.nombre = body.nombre;
		productoDB.categoria = body.categoria
		productoDB.precioUni = body.precioUni
		productoDB.categoria = body.categoria
		productoDB.disponible = body.disponible
		productoDB.descripscion = body.descripcion

		productoDB.save((err, productoGuardado)=>{
			if(err){
				return res.status(500).json({
					ok: false,
					err
				})
			}

			res.json({
				ok: true,
				producto: productoGuardado
			})
		})
	})
});
//delete
app.delete('/producto/:id', verificaToken, (req, res)=>{
	let id = req.params.id;

	Producto.findById(id, (err, productoDB)=>{
				if(err){
					return res.status(500).json({
						ok: false,
						err
					})
				}

			if(err){
				return res.status(400).json({
					ok: false,
					err: {
						message: 'Id no existe'
					}
				})
			}

			productoDB.disponible = false;

			productoDB.save((err, productoBorrado)=>{
						if(err){
							return res.status(500).json({
								ok: false,
								err
							})
						}

						res.json({
							ok: true,
							producto: productoBorrado,
							mensaje: 'Producto borrado'
						});
			});
	});
});

module.exports = app;