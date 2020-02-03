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

exports.readData = function(params){
	return new Promise(resolve => {
		fs.readFile('./Informacion/' + params['name'] + '.json', function(err, data){
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
