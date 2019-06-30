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
	urlDB = 'mongodb+srv://admin:8N7V5YzU9wfToehH@cluster0-jj6ts.mongodb.net/cafe';
}


process.env.URLDB  = urlDB;
