window.onload=function(){
	let btnModelo = document.getElementById('btnModelo');
	let btnJuego = document.getElementById('btnJuego');
	let btnRegresar = document.getElementById('btnRegresar');


	btnModelo.addEventListener('click', e => {
		location.replace('http://127.0.0.1:3000/Modelo/canal.html')
	})

	btnJuego.addEventListener('click', e => {
		location.replace('http://127.0.0.1:3000/Puntos/canal.html')
	})

	btnRegresar.addEventListener("click", e=>{
		location.replace("http://127.0.0.1:3000/init")
	})
}