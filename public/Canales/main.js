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
        let informacion = [];
        if(this.puntoSeleccionado === '' || this.puntoSeleccionado === '-'){
          return contenido;
        }else{
          //convertir la informacion del punto en un arreglo
          informacion.push({nombre:this.informacionPuntos[this.puntoSeleccionado]['nombre']});
          informacion.push({localizacion:this.informacionPuntos[this.puntoSeleccionado]['localizacion']});
          informacion.push({funcion:this.informacionPuntos[this.puntoSeleccionado]['funcion']});
          informacion.push({indicaciones:this.informacionPuntos[this.puntoSeleccionado]['indicaciones']});
          informacion.push({observaciones:this.informacionPuntos[this.puntoSeleccionado]['observaciones']});
          informacion.push({importancia:this.informacionPuntos[this.puntoSeleccionado]['importancia']});

          for(let i in informacion){
            let elem = Object.keys(informacion[i])[0];
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
                  <p>`+ informacion[i][elem] +`</p>
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
            <div style="width:100%; height:600px; background:blue;">
              <!--<img src="../images/Modelos/bazo.jpeg" width="100%">-->
            </div>
          </div>
          <div class="col-md-7">
            <div class="row">
              <div class="col-md-9 barratitulo"  style="margin-bottom: 30px;">
                <h2 class="text-light" id="titulo">{{titulo}}</h2>
              </div>
              <div class="col-md-3 text-center">
                <a id="edit" class="btn btn-info btn-lg" v-on:click="editar">
                  <img src="../images/documento.png" width="50" height="50">
                </a>
                <h5>Editar</h5>
              </div>
            </div>
            <div class="row">
              <select class="select" id="selPuntos" v-model="puntoSeleccionado">
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
