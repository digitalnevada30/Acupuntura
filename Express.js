const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fire = require('./Firestore.js');
const admJSON = require('./AdministradorJSON');
const server = require('./server');
const internetAvailable = require('internet-available');

exports.Express = function(){
	this.expressApp = express();
	this.expressApp.use(express.static(path.join(__dirname, 'public')));
	this.expressApp.use(bodyParser.json()); //support json encoded bodies
	this.expressApp.use(bodyParser.urlencoded({extended: true})); //support encoded bodies

	this.app = null;

	this.init = function(){
		/*this.expressApp.use(express.static(path.join(__dirname, 'public')));
		this.expressApp.use(bodyParser.json()); //support json encoded bodies
		this.expressApp.use(bodyParser.urlencoded({extended: true})); //support encoded bodies*/

		this.expressApp.listen(3000, function(){
		  console.log('Example app listening on port 3000');
		});
	}

	/*
		Funciones de enrutamiento de la aplicacion
		cada peticion GET o POST se busca en estas funciones,
		en caso de no encontrarlo, lo busca por carpeta como recurso
		estatico
	*/
	this.expressApp.get('/getStatusConnection', function(req,res){
		console.log('Get method: check internet availability');
		internetAvailable({
			timeout: 2000,
			retries: 2
		}).then(function(){
			res.status(200).send(true);
    }).catch(function(){
      res.status(200).send(false);
    });
	});

	this.expressApp.get('/finishApp', function(req,res){
	  requestApp().quit();
	});

	this.expressApp.get('/checkForDownload',function(req, res){
	  console.log('Get method: return checkDownload variable');
	  var resp = getCheckDownload();
	  setCheckDownload(false);
	  res.status(200).send(resp);
	});

	/*- - - - - GET JSON - - - - -*/
	this.expressApp.get('/testRead', async function(req, res){
	  console.log('Get method: Read JSON file');
	  console.log(req.query);
	  var resp = await admJSON.readData(req.query);
	  //console.log(resp);
	  res.status(200).send(resp);
	});

	/*- - - - - GET FIRE - - - - -*/
	this.expressApp.get('/getCanal', async function(req, res){
	  console.log('Get method: read document information from firestore');
	  console.log(req.query);
	  var resp = await fire.readReg(req.query);
	  //console.log(resp);
	  res.status(200).send(resp);
	});

	this.expressApp.get('/readConfig', async function(req, res){
	  console.log('Get method: read config file');
	  var resp = await fire.readConfig();
	  //console.log(resp);
	  res.status(200).send(resp);
	});


	/*- - - - - POST JSON - - - - -*/
	this.expressApp.post('/updateFiles', async function(req,res){
			console.log('Subiendo contenido a la nube');
			var resp = await admJSON.readData({name : 'config.json'});
			console.log('actualizando Canales');
			if(!resp['error']){
				//subimos la informacion de los canales
				for(let prop in resp['canales']){
					console.log(prop);
					//leemos la informacion de cada archivo de los canales
					var tmp = await admJSON.readData({name : resp['canales'][prop]['archivo']});
					if(!tmp['error']){
						//upload files
						await fire.uploadFile(prop, tmp);
						//actualizamos la fecha
						await fire.updateDate(resp['fecha']);
					}else{
						res.status(200).send({error:'No logramos subir los documentos'});
					}
				}
			}else{
				res.status(200).send({error:'No logramos subir los documentos'});
			}

			console.log('actualizando Glosario');
			if(!resp['error']){
				var tmp = await admJSON.readData({name : resp['glosario']});
				if(!tmp['error']){
					await fire.uploadFile('glosario', tmp);
				}else{
					res.status(200).send({error:'No logramos subir los documentos'});
				}
			}else{
				res.status(200).send({error:'No logramos subir los documentos'});
			}
			console.log('Actualizacion realizada exitosamente');
			res.status(200).send({OK:'Archivos actualizados exitosamente'});
	});
	this.expressApp.post('/testWrite', async function(req, res){
	  console.log('Post method: upload JSON file');
		console.log(req);
	  console.log(req.body.params);
	  var resp = await admJSON.writeData(req.body.params);
	  //console.log(resp);
	  res.status(200).send(resp);
	});

	this.expressApp.post('/updatePoint',async function(req, res){
	  console.log('Post method: upload JSON point');
	  console.log(req.body.params);
	  var resp = await admJSON.writePoint(req.body.params);
	  //console.log(resp);
	  res.status(200).send(resp);
	});

	this.expressApp.post('/updateDate', async function(req, res){
	  console.log('Post method: upload JSON date');
	  console.log(req.body.params);
	  var resp = await admJSON.updateDate(req.body.params);
	  //Update = true;
	  setUpdate(true);
	  console.log('update var has been changed');
	  res.status(200).send(resp);
	});

	this.expressApp.post('/updateDateGlosario', async function(req, res){
	  console.log('Post method: upload JSON date');
	  console.log(req.body.params);
	  var resp = await admJSON.updateDate(req.body.params);
	  //UpdateGlossary = true;
	  setUpdateGlossary(true);
	  console.log('updateGlossary var has been changed');
	  res.status(200).send(resp);
	});


	/*- - - - - POST FIRE - - - - -*/
	this.expressApp.post('/canales', async function(req, res,next){
	  console.log('Post method: upload channel information to firestore');
	  console.log(req.body.params);
	  var resp = await fire.addReg(req.body.params);
	  //console.log(resp);
	  res.status(200).send(resp);
	});

	this.expressApp.post('/downloadFS', async function(req, res){
	  console.log('Post method: download Content');
	  //download config
	  var resp = await fire.readConfig();
	  //write the config file
	  var datos = {
	    name : 'config.json',
	    data : {
	      canales: resp['canales'],
	      glosario: resp['glosario'],
	      fecha : resp['fecha']
	    }
	  };
	  var ans = await admJSON.writeData(datos);
	  if(ans['error']){
	    console.log('Ha ocurrido un error en 115@server.js');
	  }else{
	    console.log('Archivo config.json escrito exitosamente');
	    //escribimos los canales
	    for(let elemento in resp['canales']){
	      console.log(elemento);
	      //download each file
	      var contenido = await fire.readFile({name : elemento});
	      datos = {
	        name : resp['canales'][elemento]['archivo'],
	        data : contenido
	      };
	      ans = await admJSON.writeData(datos);
	      //write each file
	    }
	    //escribimos el glosario
	    var contenido = await fire.readFile({name : 'glosario'});
	    datos = {
	      name : resp['glosario'],
	      data : contenido
	    };
	    ans = await admJSON.writeData(datos);
	  }
	  res.status(200).send(ans);
	});
}

/*
	Funciones necesarias para las variables compartidas entre
	el archivo server.js y Express.js que son variables de control
	para saber en que momento se debe descargar/cargar lo archivos

*/
function requestApp(){
	return server.enviaApp();
}

function setUpdate(val){
	server.setUpdate(val);
}

function setUpdateGlossary(val){
	server.setUpdateGlossary(val);
}

function getCheckDownload(){
	return server.getCheckDownload();
}

function setCheckDownload(val){
	server.setCheckDownload(val);
}
