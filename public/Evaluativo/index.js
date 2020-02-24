window.onload=function(){
	let btnMain=document.getElementById('btnMain')

	btnMain.addEventListener("click", e=>{
		location.replace("http://127.0.0.1:3000/init")
	})
}