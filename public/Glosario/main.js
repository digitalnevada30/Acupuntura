window.onload = function(){
  const Modelo = {
    obtenerNombreGlosario: function(){
      return new Promise(resolve => {
        let data = {name: 'config.json'}
        axios.get('/testRead',{
          params: data
        })
          .then(function(res){
            resolve(res.data['glosario']);
          })
          .catch(function(error){
            resolve({error: 'Error al leer el archivo de configuracion'});
          })
      });
    },
    obtenerDatosGlosario: function(nombre){
      return new Promise(resolve => {
        let data = {name: nombre};
        axios.get('/testRead', {
          params: data
        })
          .then(function(res){
            resolve(res.data);
          })
          .catch(function(error){
            console.log(error);
            resolve({error: 'Error al obtener archivo ' + nombre});
          })
      });
    },
    guardarInformacion: function(nombreArchivo, informacion){
      return new Promise(resolve => {
        let datos = {
          name: nombreArchivo,
          data: informacion
        };
        console.log(datos);
        axios.post('/testWrite',{
    			params:datos
    		})
    		.then(res => {
          resolve();
    		})
          .catch(error => {
            swal('Error', 'No hemos podido guardar los archivos locales', 'error');
            resolve();
          })
      });
    },
    actualizafechaJSON: function(){
      return new Promise(resolve => {
        let myDate = Date.now();
        let data = {fecha: myDate};
        axios.post('/updatedateGlosario',{
          params : data
        })
          .then(function(res){
            if(res.data['error']){
              resolve(-1);
            }else{
              resolve(myDate);
            }
          })
      });
    },
    regresar: function(){
      location.replace("http://127.0.0.1:3000/Educativo");
    }
  };

  const glosarioApp = Vue.component('glosarioApp', {
    data: function(){
      return {
        nombreGlosario:{},
        datos: {},
        tituloGlosario: 'Glosario',
        tituloElemento: 'Sin Elemento',
        buscador: '',
        elementos: [],

        txtInformacion: '',
        mostrar: true
      }
    },
    methods: {
      obtenerNombreGlosario: async function(){
        this.nombreGlosario = await Modelo.obtenerNombreGlosario();
        if(this.nombreGlosario['error']){
          swal('Error', this.nombreGlosario['error'], 'error').then((value)=>{
            Modelo.regresar();
          })
        }
        this.datos = await Modelo.obtenerDatosGlosario(this.nombreGlosario);
        this.setElementos();
      },
      setElementos: function(){
        this.elementos = [];
        for(let elem in this.datos){
          let tmp = {};
          tmp['id'] = elem;
          tmp['def'] = this.datos[elem];
          this.elementos.push(tmp);
        }
      },
      cargarInformacion: function(id){
        this.tituloElemento = id;
        this.txtInformacion = this.datos[id];
      },
      editar: function(){
        if(this.tituloElemento == 'Sin Elemento'){
          swal('Error', 'No se ha seleccionado un concepto', 'error');
        }else{
          //ocultar contenido
          $('#principal').fadeToggle();
          //limpiamos buscador
          this.buscador = '';
          this.$root.$emit('cambiarVistaF',this.tituloElemento, this.txtInformacion, 'e' );
        }
      },
      nuevo: function(){
        $('#principal').fadeToggle();
        //limpiamos buscador
        this.buscador = '';
        this.$root.$emit('cambiarVistaF','', '', 'n' );
      },
      mostrarFormato: function(){
        //cambiamos background
        $('body').css('background', '#ffffff');
        //mostrar elemento
        $('#principal').fadeToggle();
      },
      obtenerFormatoFecha: function(num){
        let meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        let fecha = new Date(num);
        return(`${fecha.getDate()}/${meses[fecha.getMonth()]}/${fecha.getFullYear()}`);
      },
      limpiarCampos: function(){
        this.tituloElemento = "Sin Elemento";
        this.txtInformacion = '';
      },
      regresar: function(){
        Modelo.regresar();
      }
    },
    created: function(){
      this.obtenerNombreGlosario();
    },
    mounted: function(){
      this.$root.$on('regresarVistaE', () => {
        this.mostrarFormato();
      });

      this.$root.$on('guardarConcepto',async (nombre, definicion, tipo) => {
        //cambiamos los saltos de linea por <br>
        definicion = definicion.replace(/\n/g, '<br>');
        this.mostrarFormato();
        switch(tipo){
          case 'n':
            //guardar el nuevo valor
            this.datos[nombre] = definicion;
            break;
          case 'e':
            //comparamos si no se ha modificado el nombre para actualizar nuestro elemento
            if(this.tituloElemento !== nombre){
              this.datos[nombre] = definicion;
              delete this.datos[this.tituloElemento];
            }else{
              this.datos[nombre] = definicion;
            }

            break;
          default:
            console.log('error');
            break;
        };
        //establecemos los valores
        this.setElementos();
        //limpiamos valores
        this.limpiarCampos();

        await Modelo.guardarInformacion(this.nombreGlosario, this.datos);
        let fecha = await Modelo.actualizafechaJSON();
        console.log(fecha);
        //guardar la informacion en los archivos json
        if(fecha == -1){
          swal('Error', 'No hemos podido actualizar la información', 'error');
        }else{
          swal('Aviso', 'Hemos actualizado los archivos locales\nCon fecha: ' + this.obtenerFormatoFecha(fecha), 'success');
        }
      });

      this.$root.$on('borrarConcepto',async () => {
        this.mostrarFormato();
        //eliminamos del arreglo la variable
        delete this.datos[this.tituloElemento];
        //limpiamos los campos
        this.limpiarCampos();
        //reestablecemos los datos
        this.setElementos();
        //enviamos peticiones asincronas
        await Modelo.guardarInformacion(this.nombreGlosario, this.datos);
        let fecha = await Modelo.actualizafechaJSON();
        console.log(fecha);
        //guardar la informacion en los archivos json
        if(fecha == -1){
          swal('Error', 'No hemos podido actualizar la información', 'error');
        }else{
          swal('Aviso', 'Hemos actualizado los archivos locales\nCon fecha: ' + this.obtenerFormatoFecha(fecha), 'success');
        }
      });
    },
    computed: {
      listaFiltrada: function(){
        return this.elementos.filter(elem => {
          return elem.id.toLowerCase().includes(this.buscador.toLowerCase());
        });
      }
    },
    template: `
      <div class="container" id="principal">
        <div class="row justify-content-center">
          <div class="col-md-7">
            <!-- element segment -->
            <!-- titulo -->
            <div class="row">
              <div class="col-md-12 text-center">
                <h2>{{tituloGlosario}}</h2>
              </div>
            </div>
            <!-- busqueda y nuevo elemento-->
            <div class="row justify-content-between">
              <div class="col-md-8 pt-2 pb-2 form-inline justify-content-center barraicono">
                <input class="form-control" id="buscador" type="text" placeholder="Buscar" v-model="buscador">
                <span class="search-icon"></span>
              </div>
              <div class="col-md-4">
                <button class="btn btnNC" id="btn-nuevo" v-on:click="nuevo">Nuevo Concepto</button>
              </div>
            </div>
            <!-- elementos -->
            <div class="row" style="margin-top: 20px;">
              <div class="col-md-11 d-flex flex-wrap justify-content-around align-content-start" id="elementos">
                <div v-for="obj in listaFiltrada">
                  <button v-bind:id="obj.id" class="btn btn-info btnConcepto" v-on:click="cargarInformacion(obj.id)">{{obj.id}}</button>
                </div>
              </div>
            </div>

          </div>

          <div class="col-md-5">
            <!-- show information -->
            <!-- titulo -->
            <div class="row">
              <div class="col-md-12 text-center">
                <h3 id="txt-titulo-concepto">{{tituloElemento}}</h3>
              </div>
            </div>
            <!-- information -->
            <div class="row">
              <div class="scroll-info" id="txt-info">
                <p v-html="txtInformacion"></p>
              </div>
            </div>
            <!-- edit and back -->
            <div class="row justify-content-between">
              <div class="col-md-4">
                <a class=" btn" v-on:click="editar">
                  <img src="../images/pencil.png" width="40" height="40">
                </a>
                <h5>Editar</h5>
              </div>
              <div class="col-md-2">
                <a id="btn-back" class=" btn btn-play" v-on:click="regresar">
                  <img src="../images/regre.png" width="55" height="55">
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  });


  const formularioApp = Vue.component('formularioApp', {
    data: function(){
      return {
        nombre: '',
        definicion: '',
        tipo: 'u',
        verBorrar: true
      }
    },
    methods: {
      regresar: function(){
        $('#formulario').fadeToggle();
        this.$root.$emit('regresarVistaE');
      },
      guardar: function(){
        if(this.nombre == '' || this.definicion == ''){
          swal('Error', 'Favor de llenar los campos', 'error');
          return;
        }
        $('#formulario').fadeToggle();
        this.$root.$emit('guardarConcepto', this.nombre, this.definicion, this.tipo);
      },
      borrar: function(){
        swal('Advertencia', '¿Estas seguro de borrar el concepto?', 'warning', {
          buttons: {
            cancelar: true,
            aceptar: true
          }
        })
          .then(value => {
            switch(value){
              case 'aceptar':
                $('#formulario').fadeToggle();
                this.$root.$emit('borrarConcepto');
                break;
            }
          })
      }
    },
    mounted: function(){
      $('#formulario').css('display', 'none');

      this.$root.$on('cambiarVistaF', (id, def, tipo) => {
        //cambiamos background
        $('body').css('background', '#000e29');
        //050429
        //mostrar elemento
        $('#formulario').fadeToggle();
        //limpiamos datos
        this.nombre = '';
        this.definicion = '';
        this.tipo = 'u';
        //asignamos datos
        this.nombre = id;
        this.tipo = tipo;
        switch (this.tipo) {
          case 'n':
            //ocultamos boton de borrado
            this.verBorrar=false;

            break;
          case 'e':
            //mostramos boton de borrado
            this.verBorrar=true;
            //transformamos br por \n
            this.definicion = def.replace(/<br>/g, '\n');

            break;
          default:
            //es un error
            swal('Error', 'No se ha registrado correctamente la funcion', 'error');
            break;
        }
      });
    },
    template: `
      <!-- Formulario -->
      <div class="container" id="formulario" >
        <div class="d-flex p-2 justify-content-center align-items-center fondo-formulario">
          <div class="contenedor p-5">

            <div class="row justify-content-center">
              <div class="col-md-12 text-center">
                <h3>Nombre del Concepto</h3>
              </div>
            </div>

            <div class="row pb-5 justify-content-center">
              <div class="col-md-7">
                <input class="form-control" id="txt-form-nombre" type="text" placeholder="Nombre" v-model="nombre">
              </div>
            </div>

            <div class="row justify-content-center">
              <div class="col-md-12 text-center">
                <h6>Definición</h6>
              </div>
            </div>

            <div class="row pb-2 justify-content-center">
              <div class="col-md-12">
                <textarea id="txt-form-def" v-model="definicion"></textarea>
              </div>
            </div>

            <div class="row justify-content-around">
              <div class="col-md-4">
                <a type="button" class="btn btn-outline-info" v-on:click="regresar">
                  <img src="../images/regre.png" width="40" height="40">
                </a>
              </div>
              <div class="col-md-4" v-if="verBorrar">
                <a type="button" class="btn btn-outline-info" v-on:click="borrar">
                  <img src="../images/borrar.png" width="40" height="40">
                </a>
              </div>
              <div class="col-md-4">
                <a type="button" class="btn btn-outline-info" v-on:click="guardar">
                  <img src="../images/save.png" width="40" height="40">
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
      'glosario-app': glosarioApp,
      'formulario-app': formularioApp
    }
  });
}

/*
*/
