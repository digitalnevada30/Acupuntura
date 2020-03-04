window.onload = async function(){
	let divQuestion = document.getElementById('question');
	//let divanswer = document.getElementById('answer');
	let btnReturn = document.getElementById('btnReturn');
	let titulo = document.getElementById('titulo');

	let fuego = document.getElementById('fuego');
	let madera = document.getElementById('madera');
	let tierra = document.getElementById('tierra');
	let agua = document.getElementById('agua');
	let metal = document.getElementById('metal');

	//read elementos.json
	let canal = window.location.search.substr(1).split('=')[1];
	let canalInfo = await obtenerTipo(canal);
	titulo.innerHTML = canalInfo['titulo'];
	let tipo = canalInfo['tipo'];
	let puntoElementos = await obtenerElementos(canalInfo['archivo']);

	let elementos = {};
	if(tipo === 'o'){
		console.log('Tipo organo');
		elementos = {
			fuego : ['Fuego', 'Manto', 'Yi'],
			tierra: ['Tierra', 'Arroyo', 'Xi'],
			metal: ['Metal', 'Río'],
			agua: ['Agua', 'Mar'],
			madera: ['Madera', 'Pozo']
		};
	}else{
		console.log('Tipo viscera');
		elementos = {
			fuego : ['Fuego', 'Río'],
			tierra: ['Tierra', 'Mar'],
			metal: ['Metal', 'Pozo'],
			agua: ['Agua', 'Manantial'],
			madera: ['Madera', 'Arroyo']
		};
	}
	//add elementos from point
	elementos['fuego'].push(puntoElementos['fuego']);
	elementos['tierra'].push(puntoElementos['tierra']);
	elementos['metal'].push(puntoElementos['metal']);
	elementos['agua'].push(puntoElementos['agua']);
	elementos['madera'].push(puntoElementos['madera']);
	//let elementos = { "fuego" : [], "madera": [] }
	let respuestas = [];

	//in this for we add divs to dropping elements
	for(let el in elementos){
		for(let i=0 ; i < elementos[el].length ; i++){
			var tmpNode = document.createElement('DIV');

			tmpNode.setAttribute("id", el + i);
			tmpNode.setAttribute("class", "divQuestion");
			tmpNode.setAttribute("ondrop", "drop(event)");
			tmpNode.setAttribute("ondragover", "allowDrop(event)");
			document.getElementById(el).appendChild(tmpNode);
			respuestas.push(elementos[el][i]);
		}
	}

	//add the answer divs
	shuffle(respuestas);

	for(let i=0 ; i < respuestas.length ; i++){
		//<div id="divAnswer" draggable="true" ondragstart="drag(event)" onmouseup="clickFun(event)">Answer 1</div>
		let tmpNode = document.createElement('DIV');

		tmpNode.setAttribute("id", respuestas[i]);
		tmpNode.setAttribute("draggable", "true");
		tmpNode.setAttribute("ondragstart", "drag(event)");
		tmpNode.setAttribute("onmouseup", "clickFun(event)");
		tmpNode.setAttribute("class", "respuesta");

		tmpNode.innerHTML = respuestas[i];

		document.getElementById('answer').appendChild(tmpNode);

	}



	btnReturn.addEventListener('click', e => {
		location.replace('http://127.0.0.1:3000/Puntos/canal.html');
	});

	btnEval.addEventListener('click', e => {
		var divanswer = document.getElementById('answer');
		//console.log(divanswer.childNodes);
		console.log(elementos);
		if(divanswer.childNodes.length !== 0){
			alert('Favor de completar el ejercicio');
		}else{
			let respCorrectas = 0;
			for(let el in elementos){
				//check each circle
				//console.log(document.getElementById(el).childNodes);
				console.log('canal: ' + el);
				for(let i=0 ; i < document.getElementById(el).childNodes.length ; i++){
					//resp: document.getElementById(el + i).childNodes[0].innerHTML
					let nombre = document.getElementById(el + i).childNodes[0].innerHTML;
					if(checkAnswer(elementos[el], nombre)){
						console.log('Correcta: ' + el + ' - ' + nombre);
						respCorrectas++;
					}
				}
				
			}
			let calificacion = respCorrectas*10.0/respuestas.length;
			alert('Marcador: ' + respCorrectas + '/' + respuestas.length + '\n' + 'calificación: ' + calificacion.toFixed(1));
			location.replace('http://127.0.0.1:3000/Puntos?name=' + canal);
		}
	});

	function checkAnswer(arreglo, nombre){
		for(let i=0 ; i < arreglo.length ; i++){
			if(arreglo[i] == nombre){
				return true;
			}
		}
		return false;
	}

	function obtenerTipo(canal){
		return new Promise(resolve => {
			let data = {name : "config.json"};
			axios.get('/testRead', {
				params:data
			})
			.then(function (res){
				resolve(res.data['canales'][canal]) ;
			})
			.catch(function (error){
				//console.log(error);
				resolve({error:"Got an error"});
			})
		});
	}

	function obtenerElementos(archivo){
		return new Promise(resolve => {
			let data = {name : archivo};
			axios.get('/testRead', {
				params : data
			})
			.then(function (res){
				resolve(res.data['elementos']);
			})
			.catch({error:"Got an error"});
		});
	}

	function shuffle(array) {
	  array.sort(() => Math.random() - 0.5);
	}
}