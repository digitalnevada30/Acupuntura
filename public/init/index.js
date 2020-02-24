window.onload=function(){
	let btn_eva=document.getElementById('btn_eva');
	let btn_edu=document.getElementById('btn_edu');
	let connImage = document.getElementById('connImage');

	checkConnection(navigator.onLine);
	comparaFecha();


	function checkConnection(status){
		var actualTime = Date.now()
		console.log(actualTime);
		if(status){
			connImage.setAttribute('src', '../images/conn.png?' + actualTime);
		}else{
			connImage.setAttribute('src', '../images/no-conn.png?' + actualTime);
		}
	};

	async function comparaFecha(){
		let datosFS = '';
		let datosJS = '';
		//check for config.json file
		datosJS = await compruebaArchivoConfig();

		//if we dont have internet
		if(!navigator.onLine){
			if(datosJS['error']){
				//in this case we need to end the application because we dont have neither json nor db
				alert("1 We don't have any Information");
			}else{
				//we need to base our data on recent files and do nothing
				alert('2 Working with current files');
			}
		}else{
			datosFS = await comparaFechaFS();
			if(datosJS['error']){
				//Download information from FS
				alert('3 Download from FS due to json error');
			}else{
				//we have both, we need to compare update field
				console.log(datosJS['fecha'] + ' vs ' + datosFS['fecha']);
				if(datosJS['fecha'] >= datosFS['fecha']){
					//do nothing because data in JSON are updated
					alert('4 JSON is updated');
				}else{
					//Download information from FS
					alert('5 Download from FS');
					await descargaContenidoFS();					
				}
			}

		}
	};

	function compruebaArchivoConfig(){
		return new Promise(resolve => {
			var data = {
				name : 'config.json'
			};
			axios.get('/testRead', {
				params: data
			})
			.then(function(res){
				resolve(res.data);
			})
			.catch(function(error){
				resolve({error : 'Got an Error'});
			})
		});
	};

	function comparaFechaFS(){
		return new Promise(resolve => {
			axios.get('/readConfig')
			.then(function(res){
				resolve(res.data);
			})
			.catch(function(error){
				resolve({error : 'Got an Error'});
			})
			});
	};

	function descargaContenidoFS(){
		return new Promise(resolve => {
			axios.post('/downloadFS')
			.then(function(res){
				resolve();
			})
			.catch(function(error){
				resolve();
			})
		});
	};

	window.addEventListener('online', e => {
		checkConnection(true);
	});

	window.addEventListener('offline', e => {
		checkConnection(false);
	});

	btn_eva.addEventListener("click", e=>{
		location.replace("http://127.0.0.1:3000/Evaluativo");
	});

	btn_edu.addEventListener("click", e=>{
		location.replace("http://127.0.0.1:3000/Educativo");
	});
}