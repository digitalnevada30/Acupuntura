window.onload = function(){
  const Modelo = {
    abrirModelo: function(grupo){
      location.replace('http://127.0.0.1:3000/Modelo/canal.html?group=' + grupo);
    },
    abrirPuntos: function(grupo){
      location.replace('http://127.0.0.1:3000/Puntos/canal.html?group=' + grupo);
    },
    regresar: function(){
      location.replace("http://127.0.0.1:3000/init");
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
    }
  };

  const evaluativoApp = Vue.component('evaluativoApp', {
    data:function(){
      return {
        grupos: [],
        grupo: ''
      };
    },
    methods: {
      obtenerGrupos: async function(){
        this.grupos = await Modelo.obtenerGrupos();
        console.log('grupos:');
        console.log(this.grupos);
      },
      abrirModelo: function(){
        if(this.grupo === ''){
          swal('Error', 'Selecciona un grupo', 'error');
        }else{
          //Modelo.abrirPuntos(this.grupo);
          Modelo.abrirModelo(this.grupo);
        }
      },
      abrirPuntos: function(){
        if(this.grupo === ''){
          swal('Error', 'Selecciona un grupo', 'error');
        }else{
          Modelo.abrirPuntos(this.grupo);
        }
      },
      regresar: function(){
        Modelo.regresar();
      }
    },
    created: function(){
      this.obtenerGrupos();
      console.log(this.grupos);
    },
    template:`
      <div class="container">
        <div class="row justify-content-center" style="margin-bottom:70px;">
          <div class="col-md-10">
            <h2>Seleccionar modo a evaluar</h2>
          </div>
        </div>

        <div class="row justify-content-center" style="margin-bottom:60px;">
          <div class="col-md-3">
            <h5>Seleccionar Grupo:</h5>
          </div>
          <div class="col-md-4">
            <select class="custom-select" v-model="grupo">
              <option value="" selected>Elegir...</option>
              <option v-for="(elemento,indice) in grupos" :value="indice">{{elemento['nombre']}}</option>
            </select>
          </div>
        </div>

        <div class="row justify-content-around">
          <div class="col-md-4">
              <div class="row p-1">
                <button type="button" class="btnJ btn" id="btnModelo" v-on:click="abrirModelo">Cuerpo humano</button>
              </div>
            </div>
            <div class="col-md-4">
              <div class="row p-1">
                <button type="button" class="btn btnJ" id="btnJuego"  v-on:click="abrirPuntos">Juego de puntos</button>
              </div>
              <div class="row">
                <a id="btnRegresar" class=" btn btn-play" v-on:click="regresar">
                  <img src="../images/regre.png" width="55" height="55">
                </a>
              </div>
            </div>
        </div>
      </div>
    `
  });

  const app = new Vue({
    el: '#app',
    components: {
      'evaluativo-app': evaluativoApp
    }
  });
}
