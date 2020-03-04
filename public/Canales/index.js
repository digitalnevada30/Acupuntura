window.onload = async function(){
	let btnReturn=document.getElementById('btnReturn');
	let selPuntos = document.getElementById('selPuntos');
	let titulo = document.getElementById('titulo');
	let encabezado = document.getElementById('encabezado');
	let informacion = document.getElementById('informacion');
	let editar = document.getElementById('edit');
	let btnplay=document.getElementById('btnplay');
	let audio=document.getElementById('audio');

	let canal = window.location.search.substr(1).split('=')[1];
	let datos = {};
	let puntos = {};
	//obtenemos los datos 
	datos = await obtenerInformacionCanales();
	datos = datos['canales'][canal];
	
	if(datos['error']){
		alert('Ha ocurrido un error');
		location.replace("http://127.0.0.1:3000/Educativo");
	}
	//cambiamos titulo
	titulo.innerHTML = datos['titulo'];
	encabezado.innerHTML = canal;

	//obtener la informacion de los json
	puntos = await obtenerInformacionPuntos(datos['archivo']);
	//colocar elementos de select
	for(let elem in puntos['puntos']){
		var tmp = '<option value="'+ elem +'">'+ elem +'</option>';
		selPuntos.innerHTML += tmp;
	}
	
	

	btnReturn.addEventListener("click", e=>{
		location.replace("http://127.0.0.1:3000/Educativo");
	});

	selPuntos.addEventListener("change", e => {
		colocarInformacion(selPuntos.value);
		audio.setAttribute('src','../Audios/' + selPuntos.value + '.mp3');
	});

	editar.addEventListener("click", e => {
		if(selPuntos.value == '-'){
			alert('Selecciona un punto');
		}else{
			location.replace("http://127.0.0.1:3000/Editar?name=" + selPuntos.value + "-" + canal);
		}
	});

	btnplay.addEventListener("click",e=>{
		if(selPuntos.value == '-'){
			console.log("no hay punto");
		}else{
			audio.play();
		}
	});



	function obtenerInformacionCanales(){
		return new Promise(resolve => {
			let data = {name : "config.json"};
			axios.get('/testRead', {
				params:data
			})
			.then(function (res){
				resolve(res.data) ;
			})
			.catch(function (error){
				//console.log(error);
				resolve({error:"Got an error"});
			})
		});
	}

	function obtenerInformacionPuntos(nombre){
		return new Promise(resolve => {
			let data = {name : nombre};
			axios.get('/testRead', {
				params:data
			})
			.then(function(res){
				resolve(res.data);
			})
			.catch(function(error){
				resolve({error : 'Got an error'});
			})
		});
	}

	function colocarInformacion(nombrePunto){
		informacion.innerHTML = '';
		for(let elem in puntos['puntos'][nombrePunto]){
			let temp='';
			switch (elem){
				case 'nombre':
					temp='Nombre';
					break;
				case 'localizacion':
					temp ='Localización';
					break;
				case 'funcion':
					temp='Función';
					break;
				case 'indicaciones':
					temp='Indicaciones';
					break;
				case 'observaciones':
					temp ='Observaciones';
					break;
				case 'importancia':
					temp='Nivel de importancia';
					break;
				default:
					break;
			}
			let tmp = `
				<div class="row">
					<div class="col-md-12">
						<h3>`+ temp +`</h3>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<p>`+ puntos['puntos'][nombrePunto][elem] +`</p>
					</div>
				</div>
			`;
			console.log(tmp);
			informacion.innerHTML+=tmp;
		}
	}
}