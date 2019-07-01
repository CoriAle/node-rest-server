//==================
//Veriricar toke
//==================
//next continua la exec del programa
//Next hace que se ejecute el callback del método

const jwt = require('jsonwebtoken');

let verificaToken =  (req, res, next)=>{
	//leer prop de los headers
	let token = req.get('token');
	/*res.json({
		token: token
	})*/
	//decoded payload
	jwt.verify(token, process.env.SEED, (err, decoded)=>{
		if(err){
			return res.status(401).json({
				ok: false,
				err:{
					message: 'Token no válido'
				}
			})
		}

		//cualquier petición accede l usuario
		req.usuario = decoded.usuario;
		next();
		
	});

}

//==================
//Veriricar ADMIN_ROLE
//==================

let verificaAdmin_Role = (req, res, next)=>{
	let usuario  = req.usuario;
	if(usuario.role === "ADMIN_ROLE"){
		next();

	}
	else{
		return res.status(401).json({
				ok: false,
				err:{
					message: 'El usuario no es administrador'
				}
			})
	}
}
module.exports = {
	verificaToken,
	verificaAdmin_Role
}