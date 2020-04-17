window.onload = function(){
  const Modelo = {
    obtenerCanales: function(){
      return new Promise(resolve => {
        let data = {
          name : 'config.json'
        };
        axios.get('/testRead',{
          params: data
        })
          .then(function(res){
            resolve(res.data['canales']);
          })
          .catch(function(error){
            console.log(error);
            resolve({error: 'error al obtener los datos'})
          })
      });
    },
    abrirCanal: function(id){
      location.replace("http://127.0.0.1:3000/Canales?name=" + id);
    },
    abrirGlosario: function(){
      location.replace('http://127.0.0.1:3000/Glosario');
    },
    regresar: function(){
      location.replace("http://127.0.0.1:3000/init")
    }
  };

  const eduApp = Vue.component('eduApp', {
    data: function(){
      return{
        datos: {},
        botones: [],
        glosario: '',
        titulo: 'Seleccione el Canal a Estudiar',
        tituloGlosario: 'Glosario'
      }
    },
    methods:{
      obtenerCanales: async function(){
        this.datos = await Modelo.obtenerCanales();
        if(this.datos['error']){
          swal('Error', this.datos['error'], 'error').then((value)=>{
            Modelo.regresar();
          })
        }
        this.ordenarCanales();
      },
      ordenarCanales: function(){
        let arrLLaves = [];
        for(let elemento in this.datos){
          arrLLaves.push(elemento);
          //arrLLaves.push(this.datos[elemento]);
        }
        arrLLaves.sort();
        this.botones = [];
        for(let i=0 ; i < arrLLaves.length ; i++){
          console.log(arrLLaves[i]);
          let tmp = {id: arrLLaves[i], valor: this.datos[arrLLaves[i]]['nombre']}
          this.botones.push(tmp);
        }
        console.log(this.botones);
      },
      abrirCanal: function(evento, id){
        Modelo.abrirCanal(id);
      },
      abrirGlosario: function(evento){
        Modelo.abrirGlosario();
      },
      regresar: function(){
        Modelo.regresar();
      }
    },
    template: `
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-12">
            <h2>{{titulo}}</h2>
          </div>
        </div>
        <div class="row justify-content-center" >
          <div class="col-md-6">
            <div class="d-flex flex-row flex-wrap justify-content-around  p-2 educativo-canal">
              <div class="pb-2 pt-2" v-for="(v, k) in botones">
                <button type="button" class="btnCanal btn" v-on:click="abrirCanal($event, v.id)">{{v.valor}}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-between">
          <div class="col-md-2 text-center">
            <a id="btnGlosario" class=" btn btn-play" v-on:click="abrirGlosario($event)">
              <img src="../images/glosario.png" width="55" height="55">
            </a>
            <h5>{{tituloGlosario}}</h5>
          </div>
          <div class="col-md-2">
            <a id="btnMain" class=" btn btn-play" v-on:click="regresar($event)">
              <img src="../images/regre.png" width="55" height="55">
            </a>
          </div>
        </div>
      </div>
    `,
    created:function(){
      this.obtenerCanales();
    }
  });

  const App = new Vue({
    el: '#app-edu',
    components: {
      'educativo-app': eduApp
    }
  });
}
