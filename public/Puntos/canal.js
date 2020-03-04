window.onload=function(){
	let btnMain=document.getElementById('btnMain')
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

	btnMain.addEventListener("click", e=>{
		location.replace("http://127.0.0.1:3000/Evaluativo")
	})

	btnOrHigado.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=higado")
	})
	btnOrCorazon.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=corazon")
	})
	btnOrPericardio.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=pericardio")
	})
	btnOrBazo.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=bazo")
	})
	btnOrPulmon.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=pulmon")
	})
	btnOrRinon.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=rinon")
	})


	btnViVesicula.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=vesicula")
	})
	btnViInDelgado.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=delgado")
	})
	btnViSanJ.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=sanj")
	})
	btnViEstomago.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=estomago")
	})
	btnViInGrueso.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=grueso")
	})
	btnViVejiga.addEventListener("click",e=>{
		location.replace("http://127.0.0.1:3000/Puntos?name=vejiga")
	})
}