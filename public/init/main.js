window.onload = function(){

	/* - - - - - MODELO - - - - - */
	const Modelo = {
		subirInformacion: function(){
			return new Promise(resolve => {
				axios.post('/updateFiles')
					.then(function(res){
						resolve(res.data);
					})
					.catch(function(error){
						resolve({error:'No logramos subir la informacion'});
					})
			});
		},
		obtenerInformacionConexion: function(){
			return new Promise(resolve => {
				axios.get('/getStatusConnection')
					.then(function(res){
						console.log('que llego:');
						console.log(res.data);
						resolve(res.data);
					})
					.catch(function(error){
						resolve(false);
					})
			});
		},
		//utilizada para solicitar cambiar la pagina mostrada
		cambiarPagina: function(tipo){
			if(tipo == 'eva'){
				location.replace("http://127.0.0.1:3000/Evaluativo");
			}else{
				location.replace("http://127.0.0.1:3000/Educativo");
			}
		},
		//obtiene la variable checkDownload del servidor para evitar descargar contenido multiples veces
		getCheckDownload: function(){
			return new Promise(resolve => {
				axios.get('/checkForDownload')
					.then(res => {
						resolve(res.data);
					})
					.catch(error => {
						resolve(-1);
					})
			});
		},
		//obtiene la informacion del archivo config.json
		compruebaArchivoConfig: function(){
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
		},
		//Funcion que solicita el archivo config.json desde la nube
		obtenerConfigFS: function(){
			return new Promise(resolve => {
				axios.get('/readConfig')
				.then(function(res){
					resolve(res.data);
				})
				.catch(function(error){
					resolve({error : 'Got an Error'});
				})
			});
		},
		//funcion que descarga todo el contenido de la nube
		descargaContenidoFS: function(){
			return new Promise(resolve => {
				axios.post('/downloadFS')
				.then(function(res){
					resolve();
				})
				.catch(function(error){
					resolve();
				})
			});
		},
		//finaliza la aplicacion
		terminaAplicacion: function(){
			axios.get('/finishApp')
		}
	};

	/* - - - - - VISTA Y CONTROLADOR - - - - - */
	const initApp = Vue.component('initApp', {
		data : function(){
			return{
				titulo : 'Acupuntura',
				urlIconoWifi : '../images/conn.png',
				conexion: false
			}
		},
		methods : {
			//funcion que solicita un cambio de pagina
			cargarModulo: function(evento, tipo){
				Modelo.cambiarPagina(tipo);
			},
			//funcion que realiza la evaluacion de descargar en la nube o continuer con archivos locales
			comparaFecha: async function(){
				let datosFS = '';
				let datosJS = '';
				let checkDownload = await Modelo.getCheckDownload();
				//establecemos la variable que nos indica la salida a internet
				this.conexion = await Modelo.obtenerInformacionConexion();
				console.log('CheckDownload: ');
				if(checkDownload === -1){
					console.log('error al obtener la variable');
					return;
				}else{
					console.log(checkDownload);
					if(!checkDownload){
						console.log('download have already done');
						return;
					}

					//Obtenemos el archivo config.json
					datosJS = await Modelo.compruebaArchivoConfig();

					/*
						Revisamos si no tenemos internet
						para basar los resultados en los archivos locales
					*/
					console.log('internet:');
					console.log(this.conexion);
					if(!this.conexion){

						//revisamos si tenemos error en los archivos JSON
						if(datosJS['error']){
							swal('Error', 'No tenemos informacion local ni conexión a internet', 'error');
							Modelo.terminaAplicacion();
						}else{
							swal('Aviso', 'No hay internet, pero tenemos los archivos locales', 'info');
						}

					}else{
						/*en este caso se tiene internet y se procede a revisar
							si tenemos o no conexion a internet*/
						//intentamos descargar la informacion de la nube
						datosFS = await Modelo.obtenerConfigFS();
						//revisamos si hay un error en los archivos locales
						if(datosJS['error']){
							//descargamos el contenido de FS
							await Modelo.descargaContenidoFS();
							swal('Aviso', 'Se ha descargado el contenido desde la nube', 'success');
						}else{
							console.log(datosJS['fecha'] + ' vs ' + datosFS['fecha']);
							let meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
							if(datosJS['fecha'] == datosFS['fecha']){
								let d = new Date(datosJS['fecha']);
								swal('Aviso',`Los Archivos locales están actualizados \nCon fecha: ${d.getDate()}/${meses[d.getMonth()]}/${d.getFullYear()}`, 'success');
							}else if(datosJS['fecha'] > datosFS['fecha']){
								swal('Aviso', 'Se han detectado actualizaciones mientras no estabas conectado, actualizaremos la informacón en la nube', 'info');
								await Modelo.subirInformacion();
							}else{
								await Modelo.descargaContenidoFS();
								let d = new Date(datosFS['fecha']);
								swal('Aviso',`Se han descargado los documentos desde la nube \nCon fecha: ${d.getDate()}/${meses[d.getMonth()]}/${d.getFullYear()}`, 'success');
							}
						}
					}
				}
			}
		},

		template : `
			<div class="container">
		      <div class="row justify-content-center" style="margin-bottom: 90px;">
		        <div class="col-md-12">
		          <h1>{{titulo}}</h1>
		        </div>
		      </div>
		      <div class="row justify-content-around">
		          <div class="col-md-4">
		            <div class="row p-1">
		              <button type="button" class="btnMain btn btn-success" v-on:click="cargarModulo($event, 'edu')">Módulo Educativo</button>
		            </div>
		          </div>
		          <div class="col-md-4">
		            <div class="row p-1">
		              <button type="button" class="btn btn-success btnMain" v-on:click="cargarModulo($event,'eva')">Módulo Evaluativo</button>
		            </div>
		          </div>
		      </div>
		    </div>
		`,
		//una vez creados los componentes solicitamos la evaluacion de las descargas
		created: function(){
			this.comparaFecha();
		}
	});

	const app = new Vue({
	  el: '#app',
	  components : {
	  	'init-app' : initApp
	  }
	});
}
