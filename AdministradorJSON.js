const fs = require('fs');
const path = require('path');

exports.writeData = function(data){
	return new Promise(resolve => {
		var nombre = data['name'];
		console.log(data['data']);
		var datos = JSON.stringify(data['data']);
		console.log('datos en administrador:');
		//console.log(nombre);
		//console.log(datos);
		fs.writeFile(__dirname + path.sep + "Informacion"+ path.sep + nombre, datos, 'utf8', function(err){
			if(err){
				console.log('An error occurred while writing JS');
				resolve({error:"Got an error"});
			}else{
				console.log('File written');
				resolve({OK: "File written sucessfully"});
			}
		});
	});

}

exports.writePoint = function(data){
	return new Promise(resolve => {
		/*
		archivo: archivo,
		nombrePunto: nombrePunto,
		info: info
		*/
		var nombre = data['archivo'];
		var id = data['nombrePunto'];
		var datos = data['info'];
		fs.readFile(__dirname + path.sep + 'Informacion' + path.sep + nombre, function(err, data2){
			if(err){
				console.log('An error occurred while writing JSON 31');
				console.log(err);
				resolve({error:"Got an error"});
			}else{
				var info = JSON.parse(data2);
				//modify the correct point
				info['puntos'][id] = datos;
				//write again
				info = JSON.stringify(info);
				fs.writeFile(__dirname + path.sep + 'Informacion'+ path.sep + nombre, info, 'utf8', function(err){
					if(err){
						console.log('An error occurred while writing JS');
						resolve({error:"Got an error"});
					}else{
						console.log('File written');
						resolve({OK: "File written sucessfully"});
					}
				});
			}
		});
		//resolve({OK: "File written sucessfully"});
	});
}

exports.updateDate = function(data){
	return new Promise(resolve => {
		var fecha = data['fecha'];
		fs.readFile(__dirname + path.sep + 'Informacion'+ path.sep +'config.json', function(err, data2){
			if(err){
				console.log('An error occurred while writing JSON 31');
				console.log(err);
				resolve({error:"Got an error"});
			}else{
				var info = JSON.parse(data2);
				console.log('fecha antes:' + info);
				info['fecha'] = fecha;
				console.log('fecha despues: ' + info);
				info = JSON.stringify(info);
				fs.writeFile(__dirname + path.sep + 'Informacion'+ path.sep +'config.json', info, 'utf8', function(err){
					if(err){
						console.log('An error occurred while writing JS');
						resolve({error:"Got an error"});
					}else{
						console.log('File written');
						resolve({OK: "File written sucessfully"});
					}
				});
			}
		});
	});
}

exports.readData = function(params){
	return new Promise(resolve => {
		fs.readFile(__dirname + path.sep + 'Informacion'+ path.sep + params['name'], function(err, data){
			if(err){
				console.log('An error occurred while writing JS');
				resolve({error:err});
			}else{
				var datos = JSON.parse(data);
				resolve(datos);
			}
		});
	});
}
