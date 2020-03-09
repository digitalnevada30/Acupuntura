window.onload=function(){
	let btnMain=document.getElementById('btnMain')
	let btnGlosario = document.getElementById('btnGlosario');
	let btnOrHigado=document.getElementById('btnOrHigado')
	let btnOrCorazon=document.getElementById('btnOrCorazon')
	let btnOrPericardio=document.getElementById('btnOrPericardio')
	let btnOrBazo=document.getElementById('btnOrBazo')
	let btnOrPulmon=document.getElementById('btnOrPulmon')
	let btnOrRinon=document.getElementById('btnOrRinon')

	let btnViVesicula=document.getElementById('btnViVesicula')
	let btnViInDelgado=document.getElementById('btnViInDelgado')
	let btnViSanJ=document.getElementById('btnViSanJ')
	let btnViEstomago= document.getElementById('btnViEstomago')
	let btnViInGrueso=document.getElementById('btnViInGrueso')
	let btnViVejiga=document.getElementById('btnViVejiga')

	btnGlosario.addEventListener('click', e => {
		location.replace('http://127.0.0.1:3000/Glosario')
	});
	btnMain.addEventListener("click", e=>{
		location.replace("http://127.0.0.1:3000/init")
	})

	btnOrHigado.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=higado")
	})
	btnOrCorazon.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=corazon")
	})
	btnOrPericardio.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=pericardio")
	})
	btnOrBazo.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=bazo")
	})
	btnOrPulmon.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=pulmon")
	})
	btnOrRinon.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=rinon")
	})


	btnViVesicula.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=vesicula")
	})
	btnViInDelgado.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=delgado")
	})
	btnViSanJ.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=sanj")
	})
	btnViEstomago.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=estomago")
	})
	btnViInGrueso.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=grueso")
	})
	btnViVejiga.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Canales?name=vejiga")
	})
}