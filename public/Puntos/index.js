window.onload = async function(){
	let divQuestion = document.getElementById('question');
	//let divanswer = document.getElementById('answer');
	let btnReturn = document.getElementById('btnReturn');

	let fuego = document.getElementById('fuego');
	let madera = document.getElementById('madera');
	let tierra = document.getElementById('tierra');
	let agua = document.getElementById('agua');
	let metal = document.getElementById('metal');

	//read elementos.json
	let elementos = await obtenerElementos();
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
		location.replace('http://127.0.0.1:3000/Evaluativo');
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
			location.replace('http://127.0.0.1:3000/Puntos');
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

	function obtenerElementos(){
		return new Promise(resolve => {
			let data = {name : "elementos.json"};
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
	};

	function shuffle(array) {
	  array.sort(() => Math.random() - 0.5);
	}
}