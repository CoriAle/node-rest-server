//Objeto global que es actualizado dependiendo env

//===================================
//Puerto
//===================================
process.env.PORT = process.env.PORT  || 3000

//===================================
//Entorno
//===================================
process.env.NODE_ENV = process.env.NODE_ENV  || 'dev';

//===================================
//Entorno
//===================================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
	urlDB = 'mongodb://localhost:27017/cafe'
}
else{
	urlDB = process.env.MONGO_URI;
}

//===================================
//VEncimiento token
//===================================
//60 seg
//60 mins
//24hrs
//30días

process.env.CADUCIDAD_TOKEN = 60*60*24*30;
//===================================
//SEED de autenticacion
//===================================
process.env.SEED = process.env.SEED  || 'este-es-el-seed-desarrollo';

process.env.URLDB  = urlDB;
