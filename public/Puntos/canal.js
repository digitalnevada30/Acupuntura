window.onload = function(){
	const Modelo = {
		obtenerCanales: function(){
			return new Promise(resolve => {
				let data = {name: 'config.json'};
				axios.get('/testRead',{
					params: data
				})
					.then(function(res){
						resolve(res.data['canales']);
					})
					.catch(function(error){
						resolve({error: 'Error al obtener la informacion'});
					})
			});
		},
		abrirCanal: function(nombre, grupo){
			location.replace('http://127.0.0.1:3000/Puntos?name=' + nombre + '&grupo=' + grupo);
		},
		regresar: function(){
			location.replace('http://127.0.0.1:3000/Evaluativo');
		}

	};

	const evaSelCanal = Vue.component('evaSelCanal', {
		data: function(){
			return {
				botones: [],
				nombreArchivo: '',
				grupo: -1,
				datos: {}
			}
		},
		methods:{
			abrirCanal: function(evento, nombre){
				Modelo.abrirCanal(nombre, this.grupo);
			},
			regresar: function(evento){
				Modelo.regresar();
			},
			obtenerCanales: async function(){
				this.datos = await Modelo.obtenerCanales();
				this.ordenarCanales();
			},
			ordenarCanales: function(){
				let arrLLaves = [];
				for(let elemento in this.datos){
					arrLLaves.push(elemento);
				}
				arrLLaves.sort();
				this.botones = [];
				for(let i=0 ; i < arrLLaves.length ; i++){
					this.botones.push(arrLLaves[i]);
				}
			}
		},
		created: function(){
			//window.location.search.substr(1).split('=')[1].split('-')[1];
			this.grupo = window.location.search.substr(1).split('=')[1];
			this.obtenerCanales();
		},
		template: `
			<div class="container">

				<div class="row justify-content-center" style="margin-bottom:90px; ">
	        <div class="col-md-12">
	          <h2>Seleccione el Canal</h2>
	        </div>
	      </div>

				<div class="row justify-content-center" >
					<div class="col-md-6">
						<div class="d-flex flex-row flex-wrap justify-content-around  p-2">
							<div class="pb-2 pt-2" v-for="(v, k) in botones">
								<button type="button" class="btnCanal btn btn-success" v-on:click="abrirCanal($event, v)">{{datos[v]['nombre']}}</button>
							</div>
						</div>
					</div>
				</div>

				<div class="row justify-content-end">
					<div class="col-md-2">
						<a id="btnMain" class=" btn btn-play" v-on:click="regresar">
								<img src="../images/regre.png" width="55" height="55">
						</a>
					</div>
				</div>

			</div>
		`
	});

	const app = new Vue({
		el: '#app',
		components:{
			'eva-sel-canal': evaSelCanal
		}
	});
}
