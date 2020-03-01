function allowDrop(ev) {
	  ev.preventDefault();
	}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var idRespuesta = ev.dataTransfer.getData("text");
  var idPregunta = event.target.id
  console.log('Drop ' + idRespuesta + ' on ' + idPregunta);
  //console.log(document.getElementById(idPregunta).childNodes.length);
  if(document.getElementById(idPregunta).childNodes.length < 1){
  	ev.target.appendChild(document.getElementById(idRespuesta));
  }
}

function clickFun(ev){
	var id = ev.target.id;
	console.log(document.getElementById(id).parentElement.id);

	if(ev.button === 2 && document.getElementById(id).parentElement.id.search('answer') === -1){
		//remove element from question and add it to stack
		document.getElementById('answer').appendChild(document.getElementById(id));
	}
}