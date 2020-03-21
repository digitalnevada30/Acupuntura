window.onload = function(){
  const Modelo = {
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
    regresar: function(){
      location.replace('http://127.0.0.1:3000/Puntos/canal.html');
    }
  };

  const PuntosJuego = Vue.component('PuntosJuego',{
    data: function(){
      return {
        canal: '',
        informacionCanal: {},
        tipo: '',
        puntoElementos: {},
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
        console.log(document.getElementById(id).parentElement.id);

      	if(event.button === 2 && document.getElementById(id).parentElement.id.search('answer') === -1){
      		//remove element from question and add it to stack
      		document.getElementById('answer').appendChild(document.getElementById(id));
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
        }
      },
      allowDrop: function(ev){
        ev.preventDefault();
      },
      colocarRespuestas: function(elemento){
        if(this.elementos[elemento] === undefined) return;

        let nombres = this.elementos[elemento].slice();


        for(let i=0; i < nombres.length; i++){
          var tmpNode = document.createElement('DIV');
    			tmpNode.setAttribute("id", elemento + i);
    			tmpNode.setAttribute("class", "divQuestion");
    			//tmpNode.setAttribute("ondrop", "drop(event)");
    			//tmpNode.setAttribute("ondragover", "allowDrop(event)");
    			document.getElementById(elemento).appendChild(tmpNode);
        }
      },
      regresar: function(){
        Modelo.regresar();
      },
      evaluar: function(){
        var divanswer = document.getElementById('answer');
        if(divanswer.childNodes.length !== 0){
    			swal('Error', 'Favor de completar el ejercicio', 'error');
    		}else{
    			let respCorrectas = 0;
    			for(let el in this.elementos){
    				//check each circle
    				//console.log(document.getElementById(el).childNodes);
    				console.log('canal: ' + el);
    				for(let i=0 ; i < document.getElementById(el).childNodes.length ; i++){
    					//resp: document.getElementById(el + i).childNodes[0].innerHTML
    					let nombre = document.getElementById(el + i).childNodes[0].innerHTML;
    					if(this.checkAnswer(this.elementos[el], nombre)){
    						console.log('Correcta: ' + el + ' - ' + nombre);
    						respCorrectas++;
    					}
    				}

    			}
    			let calificacion = respCorrectas*10.0/this.respuestas.length;
          if(calificacion > 8.0){
            swal('¡Felicidades!', 'Marcador: ' + respCorrectas + '/' + this.respuestas.length + '\n' + 'calificación: ' + calificacion.toFixed(1), 'success')
              .then((value) => {
                location.replace('http://127.0.0.1:3000/Puntos?name=' + this.canal);
              });
          }else if(calificacion >= 6.0 && calificacion <= 8.0){
            swal('Practiquemos un poco más', 'Marcador: ' + respCorrectas + '/' + this.respuestas.length + '\n' + 'calificación: ' + calificacion.toFixed(1), 'info')
            .then((value) => {
              location.replace('http://127.0.0.1:3000/Puntos?name=' + this.canal);
            });
          }else{
            swal('Podemos hacerlo mejor', 'Marcador: ' + respCorrectas + '/' + this.respuestas.length + '\n' + 'calificación: ' + calificacion.toFixed(1), 'error')
            .then((value) => {
              location.replace('http://127.0.0.1:3000/Puntos?name=' + this.canal);
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
    	}
    },
    mounted: async function(){
      let respuestas = [];
      this.canal = window.location.search.substr(1).split('=')[1];
      this.informacionCanal = await Modelo.obtenerInfoCanal(this.canal);

      this.tipo = this.informacionCanal['tipo'];
      this.puntoElementos = await Modelo.obtenerElementos(this.informacionCanal['archivo']);

      if(this.tipo === 'o'){
        this.elementos = {
    			fuego : ['Fuego', 'Manto', 'Yi'],
    			tierra: ['Tierra', 'Arroyo', 'Xi'],
    			metal: ['Metal', 'Río'],
    			agua: ['Agua', 'Mar'],
    			madera: ['Madera', 'Pozo']
    		};
        respuestas = [
          'Fuego', 'Manto', 'Yi',
          'Tierra', 'Arroyo', 'Xi',
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
    	this.elementos['fuego'].push(this.puntoElementos['fuego']);
    	this.elementos['tierra'].push(this.puntoElementos['tierra']);
    	this.elementos['metal'].push(this.puntoElementos['metal']);
    	this.elementos['agua'].push(this.puntoElementos['agua']);
    	this.elementos['madera'].push(this.puntoElementos['madera']);

      respuestas.push(this.puntoElementos['fuego']);
    	respuestas.push(this.puntoElementos['tierra']);
    	respuestas.push(this.puntoElementos['metal']);
    	respuestas.push(this.puntoElementos['agua']);
    	respuestas.push(this.puntoElementos['madera']);

      //console.log(this.elementos);

      this.shuffle(respuestas);

      this.respuestas = respuestas.slice();
      console.log(this.elementos);
    },
    template: `
      <div class="row justify-content-center">
        <div class="col-md-8" id="question">
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
            <div class="col-md-4">
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


        <div class="col-md-4">
          <div class="row">
            <div class="col-md-12">
              <h3 id="titulo" class="text-center">{{informacionCanal['titulo']}}</h3>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12" id="answer" style="margin-bottom: 20px;">
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
