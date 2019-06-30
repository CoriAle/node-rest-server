
const mongoose = require('mongoose');
const uniqueValidator =  require('mongoose-unique-validator');


let rolesValidos = {
	values: ['ADMIN_ROLE', 'USER_ROLE'],
	message: "{VALUE} no es un rol válidos"
};
//Esquma de la bd
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es necesario'],

	},
	email: {
		type: String,
		required: [true, "El Correo es necesario"],
		unique: true
	},
	password: {
		type: String,
		required: [true, "La contraseña es necesario"]
	},
	img: {
		type: String,
	},
	role: {
		type: String,
		required: [true, "Rol es obligatorio"],
		default: 'USER_ROLE',
		enum: rolesValidos
	},
	estado: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	}
});

usuarioSchema.methods.toJSON = function(){
	let user = this; //valor de la clase
	let userObject = user.toObject();

	delete userObject.password;

	return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único'})

//Nombre de la tabla
module.exports = mongoose.model('Usuario', usuarioSchema)

