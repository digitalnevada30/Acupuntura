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
    obtenerGrupos: function(){
      return new Promise(resolve => {
        let data = {
          name: 'config.json'
        };

        axios.get('/testRead', {
          params: data
        }).then(function(res){
          console.log(res.data['grupos']);
          resolve(res.data['grupos']);
        }).catch(function(error){
          resolve({error:'Error al obtener Grupos'});
        })
      });
    },
    regresar: function(grupo){
      location.replace('http://127.0.0.1:3000/Modelo/canal.html?grupo=' + grupo);
    },
    obtenerReportes: function(){
      return new Promise(resolve => {
        let data = {
          name: 'reportes.json'
        };

        axios.get('/testRead', {
          params: data
        }).then(function(res){
          resolve(res.data);
        }).catch(function(error){
          resolve({error:'Error al obtener Grupos'});
        })
      });
    },
    guardarReportes: function(nombreArchivo, informacion){
      return new Promise(resolve => {
        let datos = {
          name: nombreArchivo,
          data: informacion
        };
        axios.post('/testWrite',{
          params: datos
        }).then(res => {resolve()})
        .catch(error => {
          swal('Error', 'No hemos podido guardar los archivos locales', 'error');
          resolve();
        })
      });
    }
  };

  const ModeloJuego = Vue.component('ModeloJuego', {
    data: function(){
      return {
        canal: '',
        grupo: '',
        eval: true,
        grupos: [],
        puntos: [],
        informacionCanal: {},
        informacionPuntos: {},
        ordenPuntos: [],
        presionado: false,
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollVert: 0,
        divModelo: null,
        imagen: null
      }
    },
    methods: {
      shuffle: function(arreglo){
        arreglo.sort(() => Math.random() - 0.5);
        return;
      },
      obtenerGrupos: async function(){
        this.grupos = await Modelo.obtenerGrupos();
        console.log('grupos:');
        console.log(this.grupos);
      },
      presionarImagen: function(e){
        this.presionado = true;
        this.startX = e.pageX - this.divModelo.offsetLeft;
        this.startY = e.pageY - this.divModelo.offsetTop;
        this.scrollLeft = this.divModelo.scrollLeft;
        this.scrollVert = this.divModelo.scrollTop;
      },
      soltarImagen: function(e){
        this.presionado = false;
      },
      moverImagen: function(e){
        e.preventDefault;
        if(!this.presionado) return;

        const x = e.pageX - this.divModelo.offsetLeft;
        const y = e.pageY - this.divModelo.offsetTop;

        const walk = (x - this.startX) * 1.5; //velocidad de desplazamiento
        const walkY = (y - this.startY) * 1.5;

        this.divModelo.scrollLeft = this.scrollLeft - walk;
        this.divModelo.scrollTop = this.scrollVert - walkY;
      },
      zoomAdd: function(){
        this.imagen. width += 50;
        this.imagen. height += 50;
      },
      zoomRem: function(){
        if((this.imagen.width-50) < this.divModelo.clientWidth) return;
        this.imagen. width -= 50;
        this.imagen. height -= 50;
      },
      zoomRes: function(){
        if(this.imagen.naturalWidth < this.divModelo.clientWidth){
          let desplazamiento = this.divModelo.clientWidth - this.imagen.naturalWidth;
          this.imagen.width = this.imagen.naturalWidth + desplazamiento;
          this.imagen.height = this.imagen.naturalHeight + desplazamiento;
          return;
        }
        this.imagen.width = this.imagen.naturalWidth;
        this.imagen.height = this.imagen.naturalHeight;
      },
      regresar: function(){
        Modelo.regresar(this.grupo);
      },
      evaluar: async function(){
        if(!this.eval)return;
        let correctas = 0;
        let formatoRespuestas = {
          fecha: Date.now(),
          canal: this.canal,
          sumaCorrectas: 0,
          total: this.ordenPuntos.length,
        };
        let reportes = await Modelo.obtenerReportes();
        let grupoTmp = this.grupos[this.grupo]['nombre'];
        if(reportes[grupoTmp] === undefined){
          console.log('SIN ELEMENTO');
          reportes[grupoTmp] = {
            tipo1: [],
            tipo2: []
          };
          console.log(reportes);
        }
        //recorremos las respuestas
        for(let i=0 ; i < this.ordenPuntos.length ; i++){
          if(this.ordenPuntos[i]['respuesta'] == ''){
            swal('Error', 'Favor de concluir el ejercicio', 'error');
            return;
          }else{
            this.ordenPuntos[i]['respuesta'] = parseInt(this.ordenPuntos[i]['respuesta']);
            console.log(this.ordenPuntos[i]['posicion'] + ' == ' + this.ordenPuntos[i]['respuesta']);

            if(this.ordenPuntos[i]['posicion'] === this.ordenPuntos[i]['respuesta']){
              $('#'+this.ordenPuntos[i]['nombre'].split(' ')[0]).removeClass('input-modelo-error');
              $('#'+this.ordenPuntos[i]['nombre'].split(' ')[0]).addClass('input-modelo-correcto');
              formatoRespuestas['sumaCorrectas'] += 1;
            }else{
              $('#'+this.ordenPuntos[i]['nombre'].split(' ')[0]).removeClass('input-modelo-correcto');
              $('#'+this.ordenPuntos[i]['nombre'].split(' ')[0]).addClass('input-modelo-error');
            }
          }
        }
        //guardamos el reporte
        reportes[grupoTmp]['tipo2'].push(formatoRespuestas);
        await Modelo.guardarReportes('reportes.json', reportes);
        //evaluar
        let calificacion = formatoRespuestas['sumaCorrectas']*10.0/formatoRespuestas['total'];
        if(calificacion > 8.0){
          swal('¡Felicidades!', 'Marcador: ' + formatoRespuestas['sumaCorrectas'] + '/' + formatoRespuestas['total'] + '\n' + 'calificación: ' + calificacion.toFixed(1), 'success');
        }else if(calificacion >= 6.0 && calificacion <= 8.0){
          swal('Practiquemos un poco más', 'Marcador: ' + formatoRespuestas['sumaCorrectas'] + '/' + formatoRespuestas['total'] + '\n' + 'calificación: ' + calificacion.toFixed(1), 'info');
        }else{
          swal('Podemos hacerlo mejor', 'Marcador: ' + formatoRespuestas['sumaCorrectas'] + '/' + formatoRespuestas['total'] + '\n' + 'calificación: ' + calificacion.toFixed(1), 'error');
        }
        //deshabilitar boton
        this.eval=false;
        $('#imagen-evaluar').css('opacity', 0.5);
      }
    },
    computed:{
      setImagen: function(){
        return '../images/Modelos/' + this.canal + '.jpeg';
      }
    },
    created: async function(){
      //obtenemos el canal seleccionado
      this.canal = window.location.search.substr(1).split('&')[0].split('=')[1];
      this.grupo = window.location.search.substr(1).split('&')[1].split('=')[1];
      this.obtenerGrupos();
      //obtenemos la informacion del canal
      this.informacionCanal = await Modelo.obtenerInformacionCanal(this.canal);
      if(this.informacionCanal['error']){
        swal('Error', this.informacionCanal['error'], 'error').then((value)=>{
          Modelo.regresar(this.grupo);
        })
      }
      //obtenemos la informacion de los puntos
      this.informacionPuntos = await Modelo.obtenerPuntos(this.informacionCanal['archivo']);
      //realizamos el arreglo para colocar las preguntas
      let miArreglo = [];
      for(let el in this.informacionPuntos){
        let tmp = {
          nombre: el,
          posicion: this.informacionPuntos[el]['posicion'],
          respuesta: ''
        };
        this.ordenPuntos.push(tmp);
      }
      this.shuffle(this.ordenPuntos);
    },
    mounted: function(){
      //guardamos el div del modelo
      this.divModelo = document.getElementById('modelo');
      this.imagen = document.getElementById('imagen');
    },
    template: `
      <div class="row justify-content-center mt-2 ml-2">
        <div class="col-md-6">

          <div class="row">
            <div class="col-md-12">
              <div id="modelo" style="width:100%; height:530px; background:blue; position: relative; white-space: nowrap; transition: all 0.2s; transform: scale(0.98); will-change: transform; user-select: none;cursor: pointer; overflow-y: scroll; overflow-x: scroll;" v-on:mousedown="presionarImagen($event)" v-on:mouseup="soltarImagen($event)" v-on:mousemove="moverImagen($event)">
                <img id="imagen" v-bind:src="setImagen" width="100%" draggable="false">
              </div>
            </div>
          </div>

          <div class="row justify-content-between">
            <div class="col-md-3">
              <a class="btn btn-dark btn-md" v-on:click="zoomAdd">
                <img src="../images/add.png" width="30" height="30">
              </a>
            </div>
            <div class="col-md-3">
              <a class="btn btn-dark btn-md" v-on:click="zoomRem">
                <img src="../images/delete.png" width="30" height="30">
              </a>
            </div>
            <div class="col-md-3">
              <a class="btn btn-info btn-md" v-on:click="zoomRes">
                <img src="../images/frame.png" width="30" height="30">
              </a>
            </div>
          </div>

        </div>

        <!-- Inicia seccion de preguntas -->
        <div class="col-md-6">
          <div class="row justify-content-center">
            <div class="col-md-7">
              <h5>{{informacionCanal['titulo']}}</h5>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-10">
              <div class="canal-scroll-modelo">
                <div :id="punto['nombre'].split(' ')[0]" v-for="punto in ordenPuntos" class="elemento-modelo-pregunta">

                    <div>
                      {{punto['nombre']}}
                    </div>
                    <div>
                      <input type="number" v-model="punto['respuesta']" class="input-modelo">
                    </div>

                </div>
              </div>
            </div>
          </div>

          <div class="row justify-content-around">
            <div class="col-md-3">
              <a id="btnReturn" class=" btn btn-play" v-on:click="regresar">
                  <img src="../images/regre.png" width="55" height="55">
              </a>
            </div>

            <div class="col-md-3">
              <a id="btnEval" class="btn btn-play" v-on:click="evaluar">
                  <img id="imagen-evaluar" src="../images/evaluar.png" width="55" height="55">
              </a>
            </div>
          </div>


        </div>
      </div>
    `
  });

  const App = new Vue({
    el: '#app',
    components:{
      'modelo-juego': ModeloJuego
    }
  });
}
