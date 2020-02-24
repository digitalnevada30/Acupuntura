const fs = require('fs');

exports.writeData = function(data){
	return new Promise(resolve => {
		var nombre = data['name'];
		var datos = {
			age: data['age'],
			number: data['number']
		};
		datos = JSON.stringify(datos);
		fs.writeFile("./Informacion/" + nombre + ".json", datos, 'utf8', function(err){
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
		var nombre = data['nombre'];
		var id = data['id'];
		var datos = data[id];
		fs.readFile('./Informacion/' + nombre, function(err, data2){
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
				fs.writeFile('./Informacion/' + nombre, info, 'utf8', function(err){
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
		fs.readFile('./Informacion/config.json', function(err, data2){
			if(err){
				console.log('An error occurred while writing JSON 31');
				console.log(err);
				resolve({error:"Got an error"});
			}else{
				var info = JSON.parse(data2);
				info['fecha'] = fecha;
				console.log(info);
				info = JSON.stringify(info);
				fs.writeFile('./Informacion/config.json', info, 'utf8', function(err){
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
		fs.readFile('./Informacion/' + params['name'], function(err, data){
			if(err){
				console.log('An error occurred while writing JS');
				resolve({error:"Got an error"});
			}else{
				var datos = JSON.parse(data);
				datos['OK'] = 'File read sucessfully';
				resolve(datos);
			}
		});
	});
}
