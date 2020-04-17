window.onload = function(){
  const Modelo = {
    obtenerInformacionCanal: function(canal){
      return new Promise(resolve => {
        let data = {name: 'config.json'};
        axios.get('/testRead', {
          params: data
        })
          .then(function(res){
            resolve(res.data['canales'][canal]);
          })
          .catch(function(error){
            resolve({error: 'Tenemos un error al leer el archivo de configuracion'});
          })
      });
    },
    obtenerInformacionPunto: function(archivo, punto){
      return new Promise(resolve => {
        let data = {name: archivo};
        axios.get('/testRead',{
          params: data
        })
          .then(function(res){
            resolve(res.data['puntos'][punto]);
          })
      });
    },
    regresar: function(canal){
      location.replace('http://127.0.0.1:3000/Canales?name=' + canal);
    },
    actualizaPunto: function(archivo, nombrePunto, info){
      return new Promise(resolve => {
        let data = {
          archivo: archivo,
          nombrePunto: nombrePunto,
          info: info
        };
        axios.post('/updatePoint',{
          params: data
        })
          .then(function(res){
            if(res.data['error']){
              resolve({error: res.data['error']});
            }else{
              resolve({OK: 'fecha actualizada'});
            }
          })
          .catch(function(error){
            resolve({error: error});
          })
      });
    },
    actualizafechaJSON: function(){
      return new Promise(resolve => {
        let myDate = Date.now();
        let data = {fecha : myDate};
        axios.post('/updateDate',{
          params: data
        })
          .then(function(res){
            if(res.data['error']){
              resolve({error: res.data['error']});
            }else{
              resolve({OK: 'fecha actualizada'});
            }
          })
          .catch(function(error){
            resolve({error: error});
          })
      });
    }
  };

  const editarPuntoApp = Vue.component('editarPuntoApp', {
    data: function(){
      return {
        canal: '',
        punto: '',
        datos: {},
        informacionPunto: {},
        localizacion: '',
        funcion: '',
        indicaciones: '',
        observaciones: '',
        importancia: 1
      };
    },
    created: async function(){
      //obtenemos canal
      this.canal = window.location.search.substr(1).split('=')[1].split('-')[1];
      //obtenemos nombre del punto
      this.punto = window.location.search.substr(1).split('=')[1].split('-')[0];
      //obtenemos la informacion del canal
      this.datos = await Modelo.obtenerInformacionCanal(this.canal);
      if(this.datos['error']){
        swal('Error', this.datos['error'], 'error'),then((value) => {
          Modelo.regresar(this.canal);
        })
      }
      //obtenemos la informacion del punto
      this.informacionPunto = await Modelo.obtenerInformacionPunto(this.datos['archivo'], this.punto);
      if(this.informacionPunto['error']){
        swal('Error', this.informacionPunto['error'], 'error').then((value) => {
          Modelo.regresar(this.canal);
        })
      }

      //cambiamos <br> por \n para visualizar los saltos de linea
      this.localizacion  =  this.informacionPunto['localizacion'].replace(/<br>/g, '\n');
      this.funcion       =  this.informacionPunto['funcion'].replace(/<br>/g, '\n');
      this.indicaciones  =  this.informacionPunto['indicaciones'].replace(/<br>/g, '\n');
      this.observaciones =  this.informacionPunto['observaciones'].replace(/<br>/g, '\n');
      this.importancia   =  this.informacionPunto['importancia'];

    },
    methods:{
      guardar: async function(){
        this.informacionPunto['localizacion'] = this.localizacion.replace(/\n/g, '<br>');
        this.informacionPunto['funcion'] = this.funcion.replace(/\n/g, '<br>');
        this.informacionPunto['indicaciones'] = this.indicaciones.replace(/\n/g, '<br>');
        this.informacionPunto['observaciones'] = this.observaciones.replace(/\n/g, '<br>');
        this.informacionPunto['importancia'] = this.importancia;
        let resp = await Modelo.actualizaPunto(this.datos['archivo'], this.punto, this.informacionPunto);
        if(resp['error']){
          swal('Error', resp['error'], 'error');
          Modelo.regresar(this.canal);
        }
        resp = await Modelo.actualizafechaJSON();
        if(resp['error']){
          swal('Error', resp['error'], 'error');
          Modelo.regresar(this.canal);
        }
        swal({
            title: 'Aviso',
            text: 'Atualización realizada con éxito',
            icon: 'success',
            button: 'Continuar'
        })
          .then(value => {
            Modelo.regresar(this.canal);
          })

      },
      regresar: function(){
        Modelo.regresar(this.canal);
      }
    },
    template: `
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h2 id="titulo">{{punto}}</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <h4 class="text-light barratitulo">Localización</h4>
          </div>
          <div class="col-md-8">
            <textarea id="txtLoc" class="editar-textArea" row="10" cols="100" v-model="localizacion"></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <h4 class="text-light barratitulo">Función</h4>
          </div>
          <div class="col-md-8">
            <textarea id="txtFun" class="editar-textArea" row="10" cols="100" v-model="funcion"></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <h4 class="text-light barratitulo">Indicaciones</h4>
          </div>
          <div class="col-md-8">
            <textarea id="txtInd" class="editar-textArea" row="10" cols="100" v-model="indicaciones"></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <h4 class="text-light barratitulo">Observaciones</h4>
          </div>
          <div class="col-md-8">
            <textarea id="txtObs" class="editar-textArea" row="10" cols="100" v-model="observaciones"></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <h4 class="text-light barratitulo">Importancia</h4>
          </div>
          <div class="col-md-8">
            <!--<input type="number" id="txtImp">-->
            <select id="txtImp" style="width:100px; height: 30px;" v-model="importancia">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-2">
            <a class="btn" v-on:click="regresar">
              <img src="../images/regre.png" width="55" height="55">
            </a>
          </div>
          <div class="col-md-2">
            <a class="btn" v-on:click="guardar">
              <img src="../images/save.png" width="55" height="55">
            </a>
          </div>
        </div>
      </div>
    `
  });

  const app = new Vue({
    el: '#app',
    components:{
      'editar-punto-app':editarPuntoApp
    }
  });
}
