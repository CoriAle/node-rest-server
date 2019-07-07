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

process.env.CADUCIDAD_TOKEN = '48h';
//===================================
//SEED de autenticacion
//===================================
process.env.SEED = process.env.SEED  || 'este-es-el-seed-desarrollo';

process.env.URLDB  = urlDB;

//===================================
//google cliente id
//===================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '662329285461-53komivfq83vcooihsepq77lii7alajp.apps.googleusercontent.com';