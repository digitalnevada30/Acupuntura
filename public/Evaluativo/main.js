window.onload = function(){
  const Modelo = {
    abrirModelo: function(){
      location.replace('http://127.0.0.1:3000/Modelo/canal.html');
    },
    abrirPuntos: function(){
      location.replace('http://127.0.0.1:3000/Puntos/canal.html');
    },
    regresar: function(){
      location.replace("http://127.0.0.1:3000/init");
    }
  };

  const evaluativoApp = Vue.component('evaluativoApp', {
    methods: {
      abrirModelo: function(){
        Modelo.abrirModelo();
      },
      abrirPuntos: function(){
        Modelo.abrirPuntos();
      },
      regresar: function(){
        Modelo.regresar();
      }
    },
    template:`
      <div class="container">
        <div class="row justify-content-center" style="margin-bottom:90px;">
          <div class="col-md-10">
            <h2>Seleccionar el módulo evaluativo</h2>
          </div>
        </div>

        <div class="row justify-content-around">
          <div class="col-md-4"> <!--Primer boton-->
              <div class="row p-1">
                <button type="button" class="btnMain btn btn-success" id="btnModelo" v-on:click="abrirModelo">Cuerpo humano</button>
              </div>
            </div> <!--fin primer boton-->
            <div class="col-md-4">
              <div class="row p-1">
                <button type="button" class="btn btn-success btnMain" id="btnJuego" style="margin-bottom:30px;" v-on:click="abrirPuntos">Juego de puntos</button>
              </div>
              <div class="row">
                <a id="btnRegresar" class=" btn btn-play" style="margin-left:170px;" v-on:click="regresar">
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
