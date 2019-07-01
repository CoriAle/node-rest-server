const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

const app = express();

//ruta, middleware, callback
app.get('/usuario', verificaToken, (req, res)=> {
  //res.json('get Usuario')
  /*return res.json({
    usuario: req.usuario,
    nombre: req.usuario.nombre,
    email: req.usuario.email,
  })*/
  let desde = req.query.desde || 0;//Parámetros opcionales
  let limite = req.query.limite || 5;//Parámetros opcionales
  desde = Number(desde);
  limite = Number(limite);
  //Condicion, nombre campos a retornar
  Usuario.find({estado: true}, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios)=>{
      if(err){
        return res.status(400).json({
          ok: false,
          err,
        })
      }
      //condicion y callback
      Usuario.count({estado: true}, (err, conteo)=>{
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo
        })

      });
    });
})

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res)=> {
    let body = req.body;
  //nueva instancia esquma
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync( body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB)=>{
    if(err){
      return res.status(400).json({
        ok: false,
        err,
      })
    }
    //usuarioDB.password = null;
    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });/*
  if(body.nombre=== undefined){
  	res.status(400).json({
  		ok: false,
  		mensaje: "El nombre es necesario",
  	});
  }else{
	  res.json({
	  	persona: body,

	  })
  	
  }*/
})
//Envíar parámetros
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res)=> {
	let id = req.params.id; //Obtener el id

  //Añadir solo propiedades válidas
  let body = _.pick(req.body, [
      "nombre",
      "email",
      "img",
      "role",
      "estado",
    ]);
  //New para que devuelva el usurio actualizado
  //runValidators para que corra validaciones de schema
  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true} ,(err, usuarioDB)=>{
    if(err){
      return res.status(400).json({
        ok: false,
        err,
      })
    }

    res.json({
    	ok: true,
      usuario: usuarioDB
    });
    
  });

})
/*
app.delete('/usuario/:id', function (req, res) {
  let id = req.params.id;
  Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
    if(err){
      return res.status(400).json({
        ok: false,
        err,
      })
    }
    if(!usuarioBorrado){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado"
        },
      });
    }



    res.json({
      ok: true,
      usuario: usuarioBorrado
    })
  });


})*/
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res)=> {
  let id = req.params.id;
  let cambiaEstado = { estado: false };
  Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado)=>{
    if(err){
      return res.status(400).json({
        ok: false,
        err,
      })
    }
    if(!usuarioBorrado){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado"
        },
      });
    }



    res.json({
      ok: true,
      usuario: usuarioBorrado
    })
  });


})



module.exports = app;