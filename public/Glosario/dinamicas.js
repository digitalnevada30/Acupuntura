let infoGlosario = '';
let conceptoActual = '';

function clickElement(event){
	var nombre = event.target.id;
	conceptoActual = nombre;
	document.getElementById('txt-titulo-concepto').innerHTML = nombre;
	let tmp = '<p>' + infoGlosario[nombre] + '</p>';
	let txtInfo = document.getElementById('txt-info');
	txtInfo.innerHTML = tmp;
}