window.onload = function(){
  const Modelo = {
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
    obtenerInfoCanal: function(canal){
      return new Promise(resolve => {
        let data = {name : "config.json"};
  			axios.get('/testRead', {
  				params:data
  			})
  			.then(function (res){
  				resolve(res.data['canales'][canal]) ;
  			})
  			.catch(function (error){
  				resolve({error:"Got an error"});
  			})
      });
    },
    obtenerElementos: function(archivo){
      return new Promise(resolve => {
  			let data = {name : archivo};
  			axios.get('/testRead', {
  				params : data
  			})
  			.then(function (res){
  				resolve(res.data['elementos']);
  			})
  			.catch({error:"Got an error"});
  		});
    },
    obtenerAfuera: function(archivo){
      return new Promise(resolve => {
  			let data = {name : archivo};
  			axios.get('/testRead', {
  				params : data
  			})
  			.then(function (res){
  				resolve(res.data['afuera']);
  			})
  			.catch({error:"Got an error"});
  		});
    },
    regresar: function(grupo){
      location.replace('http://127.0.0.1:3000/Puntos/canal.html?grupo=' + grupo);
    }
  };

  const PuntosJuego = Vue.component('PuntosJuego',{
    data: function(){
      return {
        canal: '',
        grupo: '',
        grupos: [],
        informacionCanal: {},
        tipo: '',
        puntoElementos: {},
        puntoAfuera: {},
        elementos: {},
        respuestas: []
      };
    },
    methods:{
      shuffle: function(arreglo){
        arreglo.sort(() => Math.random() - 0.5);
        return;
      },
      drag: function(event){
        event.dataTransfer.setData("text", event.target.id);
      },
      funcionClick: function(event){
        var id = event.target.id;
        var idParent = document.getElementById(id).parentElement.id;

      	if(event.button === 2 && document.getElementById(id).parentElement.id.search('answer') === -1){
      		//remove element from question and add it to stack
          if(document.getElementById(id).parentElement.id.search('afuera') !== -1){
            //console.log(document.getElementById(id).parentElement.id.split('afuera')[1]);
            console.log('id: ' + id);
            console.log('idP: ' + idParent);
            document.getElementById('answer').appendChild(document.getElementById(id));
            let objeto = document.getElementById(idParent);
            let texto = idParent.split('afuera')[1];
            objeto.innerHTML = texto;
          }else{
            document.getElementById('answer').appendChild(document.getElementById(id));
          }
      	}
      },
      drop: function(ev){
        ev.preventDefault();
        var idRespuesta = ev.dataTransfer.getData("text");
        var idPregunta = event.target.id;
        console.log('Drop ' + idRespuesta + ' on ' + idPregunta);
        //console.log(document.getElementById(idPregunta).childNodes.length);
        if(document.getElementById(idPregunta).childNodes.length < 1){
        	ev.target.appendChild(document.getElementById(idRespuesta));
        }else if(idPregunta.search('afuera') !== -1){
          console.log('Entra!');
          ev.target.removeChild(ev.target.firstChild);
          ev.target.appendChild(document.getElementById(idRespuesta));
        }
      },
      allowDrop: function(ev){
        ev.preventDefault();
      },
      regresar: function(){
        Modelo.regresar(this.grupo);
      },
      evaluar: async function(){
        var divanswer = document.getElementById('answer');
        if(divanswer.childNodes.length !== 0){
    			swal('Error', 'Favor de completar el ejercicio', 'error');
    		}else{
          /*let formatoRespuestas = {
            fecha: Date.now(),
            canal: this.canal,
            fuego: 0,
            tierra: 0,
            metal: 0,
            agua: 0,
            madera: 0,
            afuera: 0,
            sumaCorrectas: 0,
            total: 0,
          };*/
          //PART ADDED
          let formatoRespuestas = {
            fecha: Date.now(),
            canal: this.canal,
            fuego: [0,0],
            tierra: [0,0],
            metal: [0,0],
            agua: [0,0],
            madera: [0,0],
            afuera: [0,0],
            sumaCorrectas: 0,
            total: 0,
          };
          //PART ADDED
          formatoRespuestas['afuera'][1] = Object.keys(this.puntoAfuera).length;
          formatoRespuestas['total'] = Object.keys(this.puntoAfuera).length;
          console.log('----- Evaluando ------');
          console.log(formatoRespuestas);
          console.log('----------------------');
    			let respCorrectas = 0;

          //checamos los circulos
    			for(let el in this.elementos){
    				console.log('canal: ' + el);
            console.log('tamEL: ' + document.getElementById(el).childNodes.length);
            //PART ADDED
            formatoRespuestas[el][1] = document.getElementById(el).childNodes.length;
            formatoRespuestas['total'] += document.getElementById(el).childNodes.length;
    				for(let i=0 ; i < document.getElementById(el).childNodes.length ; i++){
    					//resp: document.getElementById(el + i).childNodes[0].innerHTML
    					let nombre = document.getElementById(el + i).childNodes[0].innerHTML;
    					if(this.checkAnswer(this.elementos[el], nombre)){
                //agregar sumaCorrectas
                formatoRespuestas['sumaCorrectas'] += 1;
                //agregar elemento
                //PART ADDED
                formatoRespuestas[el][0] += 1;
    						console.log('Correcta: ' + el + ' - ' + nombre);
    						respCorrectas++;
    					}
    				}

    			}
          //checamos respuestas del vacio
          for(let elem in this.puntoAfuera){
            let id = 'afuera' + elem;
            let nombre = document.getElementById(id).childNodes[0].innerHTML;
            if(nombre == this.puntoAfuera[elem]){
              formatoRespuestas['sumaCorrectas'] += 1;
              formatoRespuestas['afuera'][0] += 1;
              respCorrectas++;
            }
          }
          console.log(formatoRespuestas);
          //guardamos los resultados
          //obtenemos el grupo
          let reportes = await Modelo.obtenerReportes();
          let grupoTmp = this.grupos[this.grupo]['nombre'];
          console.log(grupoTmp);
          if(reportes[grupoTmp] === undefined){
            console.log('SIN ELEMENTO');
            reportes[grupoTmp] = {
              tipo1: [],
              tipo2: []
            };
            console.log(reportes);
          }

          reportes[grupoTmp]['tipo1'].push(formatoRespuestas);

          //guardamos os reportes
          await Modelo.guardarReportes('reportes.json', reportes);


    			let calificacion = respCorrectas*10.0/this.respuestas.length;
          if(calificacion > 8.0){
            swal('¡Felicidades!', 'Marcador: ' + respCorrectas + '/' + this.respuestas.length + '\n' + 'calificación: ' + calificacion.toFixed(1), 'success')
              .then((value) => {
                location.replace('http://127.0.0.1:3000/Puntos?name=' + this.canal + '&grupo=' + this.grupo);
              });
          }else if(calificacion >= 6.0 && calificacion <= 8.0){
            swal('Practiquemos un poco más', 'Marcador: ' + respCorrectas + '/' + this.respuestas.length + '\n' + 'calificación: ' + calificacion.toFixed(1), 'info')
            .then((value) => {
              location.replace('http://127.0.0.1:3000/Puntos?name=' + this.canal + '&grupo=' + this.grupo);
            });
          }else{
            swal('Podemos hacerlo mejor', 'Marcador: ' + respCorrectas + '/' + this.respuestas.length + '\n' + 'calificación: ' + calificacion.toFixed(1), 'error')
            .then((value) => {
              location.replace('http://127.0.0.1:3000/Puntos?name=' + this.canal + '&grupo=' + this.grupo);
            });
          }
    		}

      },
      checkAnswer: function(arreglo, nombre){
    		for(let i=0 ; i < arreglo.length ; i++){
    			if(arreglo[i] == nombre){
    				return true;
    			}
    		}
    		return false;
    	},
      obtenerGrupos: async function(){
        this.grupos = await Modelo.obtenerGrupos();
        if(this.grupos['error']){
          swal('Error', this.grupos['error'], 'error').then((value)=>{
            Modelo.regresar(this.grupo);
          })
        }
        console.log('grupos:');
        console.log(this.grupos);
      }
    },
    created: async function(){
      let respuestas = [];
      this.canal = window.location.search.substr(1).split('&')[0].split('=')[1];
      this.grupo = window.location.search.substr(1).split('&')[1].split('=')[1];
      this.obtenerGrupos();
      this.informacionCanal = await Modelo.obtenerInfoCanal(this.canal);

      this.tipo = this.informacionCanal['tipo'];
      this.puntoElementos = await Modelo.obtenerElementos(this.informacionCanal['archivo']);
      this.puntoAfuera = await Modelo.obtenerAfuera(this.informacionCanal['archivo']);

      //console.log(Object.keys(this.puntoAfuera).length);


      if(this.tipo === 'o'){
        this.elementos = {
    			fuego : ['Fuego', 'Manto'],
    			tierra: ['Tierra', 'Arroyo'],
    			metal: ['Metal', 'Río'],
    			agua: ['Agua', 'Mar'],
    			madera: ['Madera', 'Pozo']
    		};
        respuestas = [
          'Fuego', 'Manto',
          'Tierra', 'Arroyo',
          'Metal', 'Río',
          'Agua', 'Mar',
          'Madera', 'Pozo'
        ];
      }else{
        this.elementos = {
    			fuego : ['Fuego', 'Río'],
    			tierra: ['Tierra', 'Mar'],
    			metal: ['Metal', 'Pozo'],
    			agua: ['Agua', 'Manantial'],
    			madera: ['Madera', 'Arroyo']
    		};
        respuestas = [
          'Fuego', 'Río',
          'Tierra', 'Mar',
          'Metal', 'Pozo',
          'Agua', 'Manantial',
          'Madera', 'Arroyo'
        ];
      }

      //add elementos from point
      console.log(this.puntoElementos);
      for(let elem in this.elementos){
        for(let i=0 ; i < this.puntoElementos[elem].length ; i++){
          this.elementos[elem].push(this.puntoElementos[elem][i]);
          respuestas.push(this.puntoElementos[elem][i]);
        }
      }

      for(let elem in this.puntoAfuera){
        respuestas.push(this.puntoAfuera[elem]);
      }

      this.shuffle(respuestas);

      this.respuestas = respuestas.slice();
      console.log(this.elementos);
    },
    template: `
      <div class="row justify-content-center">
        <div class="col-md-6" id="question">
          <div class="row justify-content-center">
            <div class="col-md-4">
              <div id="fuego" class="elemento">
                <div v-for="(elem, index) in elementos['fuego']" :id="'fuego'+index" class="divQuestion" v-on:drop="drop($event)" v-on:dragover="allowDrop($event)"></div>
              </div>
            </div>
          </div>

          <div class="row justify-content-around">
            <div class="col-md-4">
              <div id="madera" class="elemento">
                <div v-for="(elem, index) in elementos['madera']" :id="'madera'+index" class="divQuestion" v-on:drop="drop($event)" v-on:dragover="allowDrop($event)"></div>
              </div>
            </div>
            <div class="col-md-4">
              <div id="tierra" class="elemento">
                <div v-for="(elem, index) in elementos['tierra']" :id="'tierra'+index" class="divQuestion" v-on:drop="drop($event)" v-on:dragover="allowDrop($event)"></div>
              </div>
            </div>
          </div>

          <div class="row justify-content-around">
            <div class="col-md-1">
              <div id="agua" class="elemento" >
                <div v-for="(elem, index) in elementos['agua']" :id="'agua'+index" class="divQuestion" v-on:drop="drop($event)" v-on:dragover="allowDrop($event)"></div>
              </div>
            </div>
            <div class="col-md-4">
              <div id="metal" class="elemento">
                <div v-for="(elem, index) in elementos['metal']" :id="'metal'+index" class="divQuestion" v-on:drop="drop($event)" v-on:dragover="allowDrop($event)"></div>
              </div>
            </div>
          </div>
        </div>


        <div class="col-md-2" id="question">
          <div id="afuera" class="elementoAfuera">
            <div v-for="(elem, index) in puntoAfuera" :id="'afuera'+index" class="divQuestionAfuera" v-on:drop="drop($event)" v-on:dragover="allowDrop($event)">{{index}}</div>
          </div>
        </div>


        <div class="col-md-4">
          <div class="row">
            <div class="col-md-12">
              <h4 id="titulo" class="text-center">{{informacionCanal['titulo']}}</h4>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-10" id="answer" style="margin-bottom: 20px;">
                <div v-for="res in respuestas" :id="res" draggable="true" v-on:mouseup="funcionClick($event)" v-on:dragstart="drag($event)" class="respuesta">{{res}}</div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-3">
              <a id="btnReturn" class=" btn btn-play" v-on:click="regresar">
                  <img src="../images/regre.png" width="55" height="55">
              </a>
            </div>
            <div class="col-md-3">
              <a id="btnEval" class="btn btn-play" v-on:click="evaluar">
                  <img src="../images/evaluar.png" width="55" height="55">
              </a>
              <h5>  Evaluar</h5>
            </div>
          </div>
        </div>

      </div>
    `
  });

  const App = new Vue({
    el: '#app',
    components:{
      'puntos-juego': PuntosJuego
    }
  });
}
