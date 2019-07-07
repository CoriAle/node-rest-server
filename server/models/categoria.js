
const mongoose = require('mongoose');
const uniqueValidator =  require('mongoose-unique-validator');

//Esquma de la bd
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
	descripcion: {
		type: String,
		unique: true,
		required: [true, 'La descripción es necesario'],

	},
	usuario: {
        type: Schema.Types.ObjectId, //Referencia a otra tabla
        ref: 'Usuario'
    },
});


categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único'})

//Nombre de la tabla
module.exports = mongoose.model('Categoria', categoriaSchema)

