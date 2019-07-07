const express = require('express');


let { verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');


let app = express();

let Categoria = require('../models/categoria');

app.get('/categoria', verificaToken, (req, res)=> {
//mostrar todas las cateoriías
	Categoria.find({})
		//Criterio
		.sort('descripcion')
		//nombre coleccion, campos a mostrar
		.populate('usuario', 'nombre email ')
		.exec((err, categorias)=>{
		if(err){
	        return res.status(500).json({
	          ok: false,
	          err,
	        })
    	}

    	res.json({
    	    		ok: true,
    	    		categorias
    	    	})
	});
});

app.get('/categoria/:id', verificaToken, (req, res)=>{
//mostrar una 
	let id = req.params.id
	Categoria.findById(id, (err, categoriaDB)=>{
		if(err){
	        return res.status(500).json({
	          ok: false,
	          err,
	        })
    	}

    	if(!categoriaDB){
    		return res.status(400).json({
	          ok: false,
	          err:{
	          	message: "El id no es correcto"
	          },
	        });
    	}

    	res.json({
    		ok: true,
    		categorias: categoriaDB
    	})
	})

});
app.post('/categoria', verificaToken, (req, res)=>{
//crear una nueva
	let body = req.body;

	let categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id
	});

	categoria.save((err, categoriaDB)=>{
		if(err){
	        return res.status(500).json({
	          ok: false,
	          err,
	        })
    	}
    	if(!categoriaDB){
    		return res.status(400).json({
	          ok: false,
	          err,
	        });
    	}
    	res.json({
    		ok: true,
    		categoria: categoriaDB
    	});
	})

	
});

app.put('/categoria/:id', verificaToken, (req, res)=>{
//crear una nueva
	let id = req.params.id;
console.log(id)
	let body = req.body;
	let descCategoria = {
		descripcion : body.descripcion
	}
	Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB)=>{
		if(err){
	        return res.status(500).json({
	          ok: false,
	          err,
	        })
    	}

    	if(!categoriaDB){
    		return res.status(400).json({
	          ok: false,
	          err,
	        });
    	}
    	res.json({
    		ok: true,
    		categoria: categoriaDB
    	});

	});
	
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role ],(req, res)=>{
//crear una nueva
//Categoria.findByIdAndRemove();
	let id = req.params.id;

	Categoria.findByIdAndRemove(id, (err, categoriaDB)=>{
		if(err){
	        return res.status(500).json({
	          ok: false,
	          err,
	        })
    	}

    	if(!categoriaDB){
    		return res.status(400).json({
	          ok: false,
	          err:{
	          	message: "El id no existe"
	          },
	        });
    	}

    	res.json({
    		ok: true,
    		message: "Categoria borrada"
    	})
	})
	
});

module.exports = app;