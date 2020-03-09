window.onload = async function(){
	//variables
	let buscador = document.getElementById('buscador');
	let btnNuevo = document.getElementById('btn-nuevo');
	let elementos = document.getElementById('elementos');

	let btnEditar = document.getElementById('btn-editar');
	let btnBack = document.getElementById('btn-back');

	//formulario

	let formView = false;
	let edit = false;

	let txtFormNombre = document.getElementById('txt-form-nombre');
	let txtFormDesc = document.getElementById('txt-form-def');

	let btnFormRegresar = document.getElementById('btn-form-regresar');
	let btnFormBorrar = document.getElementById('btn-form-borrar');
	let btnFormGuardar = document.getElementById('btn-form-guardar');

	//need to read config file to read what is the glossary file
	let nombreGlosario = await obtenerNombreGlosario();
	infoGlosario = await obtenerInfoGlosario(nombreGlosario);
	let tam = Object.keys(infoGlosario).length;

	//colocamos los conceptos en pantalla
	for(let el in infoGlosario){
		agregarBoton(el);
	}
	//add components
	btnBack.addEventListener('click', e => {
		location.replace('http://127.0.0.1:3000/Educativo');
	});

	btnFormBorrar.addEventListener('click', e => {
		let resp = confirm("¿Seguro que deseas eliminarlo?");
		if(resp === true){
			//eliminamos elemento de glosario
			delete infoGlosario[conceptoActual];
			//eliminamos el boton
			document.getElementById(conceptoActual).remove();
			//cambiamos variable actual
			conceptoActual = '';
			//establecemos datos en blanco
			cambiarDatos(conceptoActual);
			//guardamos la informacion
			guardarInformacion();
			actualizafechaJSON();
			//limpiamos el formulario
			limpiarFormulario();
			//eliminamos busqueda
			buscador.value = '';
			ejectuarFiltro();
			//regresamos
			cambiarVisualizacion();

		}
	});

	btnFormGuardar.addEventListener('click', e => {
		let nombre = txtFormNombre.value;
		if(edit){
			//se edita un registro
			//guardamos la definicion del registro
			infoGlosario[conceptoActual] = txtFormDesc.value.replace(/\n/g , '<br>');	
			//revisamos si ha cambiado el nombre
			if(infoGlosario[nombre] === undefined){
				//el nombre existe, no hay mas que hacer
				infoGlosario[nombre] = infoGlosario[conceptoActual];
				delete infoGlosario[conceptoActual];
				//cambiamos el ID del elemento que cambio de nombre
				document.getElementById(conceptoActual).setAttribute("id", nombre );
				document.getElementById(nombre).innerHTML = nombre
				conceptoActual = nombre;
			}

		}else{
			//se ingresa uno nuevo
			//revisamos que no exista
			if(infoGlosario[nombre] !== undefined){
				//el registro ya existe
				alert('ese concepto ya existe, por favor cambia el nombre');
				return;
			}else{
				//insertamos el registro
				infoGlosario[nombre] = txtFormDesc.value.replace(/\n/g , '<br>');
				agregarBoton(nombre);
			}
		}
		limpiarFormulario();
		//no debemos esperar por los cambios
		guardarInformacion();
		actualizafechaJSON();
		cambiarDatos(nombre);
		cambiarVisualizacion();
	});

	btnEditar.addEventListener('click', e => {
		if(conceptoActual === ''){
			alert('Selecciona un concepto');
			return;
		}
		cambiarVisualizacion();
		esconderBotonBorrar(false);
		limpiarFormulario();
		establecerDatos();
		edit = true;
	});

	btnNuevo.addEventListener('click', e => {
		cambiarVisualizacion();
		limpiarFormulario();
		esconderBotonBorrar(true);
		edit = false;
	});

	btnFormRegresar.addEventListener('click', e => {
		limpiarFormulario();
		cambiarVisualizacion();
	});

	buscador.addEventListener('keyup', e => {
		ejectuarFiltro();
	});

	function ejectuarFiltro(){
		let filtro = buscador.value;
		let botones = document.getElementsByClassName('btnConcepto');
		if(!filtro){	
			for(let i=0 ; i < botones.length ; i++){
				botones[i].style.display = 'block';
			}
		}else{
			for(let i=0 ; i < botones.length ; i++){
				let hasMatch = botones[i].innerText.toLowerCase().includes(filtro);
				botones[i].style.display = hasMatch ? 'block' : 'none';
			}
		}
	}

	function guardarInformacion(){
		let datos = {
			name : nombreGlosario,
			data : infoGlosario
		}
		axios.post('/testWrite',{
			params:datos
		})
		.then(res => {

		})
		.catch(error => {
			alert('error al subir los datos');
		})
	}

	function cambiarDatos(nombre){
		let txtInfo = document.getElementById('txt-info');
		if(nombre === ''){
			document.getElementById('txt-titulo-concepto').innerHTML = 'Sin Elemento';
			txtInfo.innerHTML = '';
		}else{
			document.getElementById('txt-titulo-concepto').innerHTML = nombre;
			let tmp = '<p>' + infoGlosario[nombre] + '</p>';
			txtInfo.innerHTML = tmp;
		}
	}
	function establecerDatos(){
		let infoConcepto = infoGlosario[conceptoActual];
		//establecemos el nombre
		txtFormNombre.value = conceptoActual;
		//establecemos el definicion
		//cambiamos los br por saltos de linea
		txtFormDesc.value = infoConcepto.replace(/<br>/g, '\n');
	}

	function esconderBotonBorrar(condicion){
		if(condicion){
			btnFormBorrar.style.display = 'none';
		}else{
			btnFormBorrar.style.display = 'block';
		}
	}

	function limpiarFormulario(){
		txtFormNombre.value = "";
		txtFormDesc.value = "";
	}

	function cambiarVisualizacion(){
		$('#principal').fadeToggle();
		$('#formulario').fadeToggle();
		formView = !formView;
		if(formView){
			$('body').css('background', '#050429');
		}else{
			$('body').css('background', '#ffffff');
		}
	}
	function agregarBoton(nombre){
		var tmpNode = document.createElement('BUTTON');
		tmpNode.setAttribute("id", nombre );
		tmpNode.setAttribute("class", "btn btn-info btnConcepto");
		tmpNode.setAttribute("onmouseup", "clickElement(event)");
		tmpNode.innerHTML = nombre
		document.getElementById('elementos').appendChild(tmpNode);
	}

	function obtenerNombreGlosario(){
		return new Promise(resolve => {
			let data = {name : "config.json"};
			axios.get('/testRead', {
				params:data
			})
			.then(function(res){
				resolve(res.data['glosario']);
			})
			.catch(function(error){
				resolve({error : 'Got an error'});
			})
		});
	}

	function obtenerInfoGlosario(nombre){
		return new Promise(resolve => {
			let data = {name : nombre};
			axios.get('/testRead', {
				params:data
			})
			.then(function(res){
				resolve(res.data);
			})
			.catch(function(error){
				resolve({error : 'Got an error'});
			})
		});
	}

	function actualizafechaJSON(){
	    let myDate = Date.now();
	    let data = {fecha : myDate};
	    axios.post('/updateDateGlosario',{
	      params : data
	    })
	    .then(function(res){
	      console.log(res.data);
	      if(res.data['error']){
	        alert('Error al actualizar la fecha');
	      }

	    })
	    
	}
}