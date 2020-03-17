window.onload = function(){
  const Modelo = {
    obtenerInformacionCanal: function(nombreCanal){
      return new Promise(resolve => {
        let data = {name : 'config.json'};
        axios.get('/testRead', {
          params: data
        })
          .then(function(res){
            resolve(res.data['canales'][nombreCanal]);
          })
          .catch(function(error){
            resolve({error: 'Hemos tenido un error al leer la configuracion'});
          })
      });
    },
    obtenerPuntos: function(nombreArchivo){
      return new Promise(resolve => {
        let data = {name: nombreArchivo};
        axios.get('/testRead',{
          params: data
        })
          .then(function(res){
            resolve(res.data['puntos']);
          })
          .catch(function(error){
            resolve({error: 'Obtuvimos un error al recibir los datos del punto'});
          })
      });
    },
    editar: function(punto, canal){
      location.replace('http://127.0.0.1:3000/Canales/editar.html?name=' + punto + '-' + canal);
    },
    regresar: function(){
      location.replace('http://127.0.0.1:3000/Educativo');
    }
  };

  const canalesApp = Vue.component('canalesApp', {
    data: function(){
      return {
        titulo: 'Título',
        canal: '',
        informacionCanal: {},
        informacionPuntos: {},
        puntos: [],
        puntoSeleccionado: '-',
        audio: null
      }
    },
    methods:{
      reproducir: function(){
        if(this.puntoSeleccionado !== '-'){
          this.audio.play();
        }
      },
      editar: function(){
        if(this.puntoSeleccionado === '-'){
          swal('Error', 'No se ha seleccionado ningún elemento', 'error');
        }else{
          Modelo.editar(this.puntoSeleccionado, this.canal);
        }
      },
      regresar: function(){
        Modelo.regresar();
      }
    },
    computed:{
      setInformacion: function(){
        let contenido = ''
        if(this.puntoSeleccionado === ''){
          return contenido;
        }else{
          for(let elem in this.informacionPuntos[this.puntoSeleccionado]){
            let temp='';
      			switch (elem){
      				case 'nombre':
      					temp='Nombre';
      					break;
      				case 'localizacion':
      					temp ='Localización';
      					break;
      				case 'funcion':
      					temp='Función';
      					break;
      				case 'indicaciones':
      					temp='Indicaciones';
      					break;
      				case 'observaciones':
      					temp ='Observaciones';
      					break;
      				case 'importancia':
      					temp='Nivel de importancia';
      					break;
      			}
            contenido += `
              <div class="row">
                <div class="col-md-12">
                  <h3>`+ temp +`</h3>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <p>`+ this.informacionPuntos[this.puntoSeleccionado][elem] +`</p>
                </div>
              </div>
            `;
          }
        }
        return contenido;
      },
      setAudio: function(){
        let rutaAudio = '';
        if(this.puntoSeleccionado === '-'){
          return rutaAudio;
        }else{
          rutaAudio = '../Audios/' + this.puntoSeleccionado + '.mp3';
          return rutaAudio;
        }
      }
    },
    created: async function(){
      //obtenemos el canal seleccionado
      this.canal = window.location.search.substr(1).split('=')[1];
      //obtenemos la informacion del canal
      this.informacionCanal = await Modelo.obtenerInformacionCanal(this.canal);
      //obtenemos la informacion de los puntos
      this.informacionPuntos = await Modelo.obtenerPuntos(this.informacionCanal['archivo']);
      //titulo
      this.titulo = this.informacionCanal['titulo']
      //establecemos los puntos
      this.puntos.push({nombre:'Seleccione un elemento', valor:'-'});
      this.puntoSeleccionado = '-';
      for(let elemento in this.informacionPuntos){
        this.puntos.push({nombre:elemento, valor:elemento});
      }
    },
    mounted: function(){
      this.audio = document.getElementById('audio');
    },
    template: `
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5">
            <p>Espacio para colocar el modelo</p>
          </div>
          <div class="col-md-7">
            <div class="row">
              <div class="col-md-9 bg-dark"  style="margin-bottom: 30px;">
                <h2 class="text-light" id="titulo">{{titulo}}</h2>
              </div>
              <div class="col-md-3">
                <a id="edit" class="btn btn-info btn-lg" v-on:click="editar">
                  <img src="../images/documento.png" width="50" height="50">
                </a>
              </div>
            </div>
            <div class="row">
              <select id="selPuntos" v-model="puntoSeleccionado">
                <option v-for="elemento in puntos" v-bind:value="elemento.valor">{{elemento.nombre}}</option>
              </select>
                <a id="btnplay" class="btn btn-play" v-on:click="reproducir">
                  <img src="../images/altavoz.png" width="35" height="35">
                </a>
                <audio id="audio" v-bind:src="setAudio"></audio>
            </div>
            <div class="row">
              <div id="informacion" class="col-md-12" style="margin-bottom: 30px;">
                <div class="canal-scroll-puntos" v-html="setInformacion">
                </div>
              </div>
            </div>
            <div class="row justify-content-end">
              <div class="col-md-2">
                <a id="btnReturn" class=" btn btn-play" v-on:click="regresar">
                    <img src="../images/regre.png" width="55" height="55">
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    `
  });

  const app = new Vue({
    el: '#app',
    components:{
      'canales-app': canalesApp
    }
  });
}
