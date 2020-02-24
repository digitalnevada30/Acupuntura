window.onload = async function(){
  let titulo = document.getElementById('titulo');
  let txtLoc = document.getElementById('txtLoc');
  let txtFun = document.getElementById('txtFun');
  let txtObs = document.getElementById('txtObs');
  let txtImp = document.getElementById('txtImp');
  let btnBack = document.getElementById('btnBack');
  let btnSave = document.getElementById('btnSave');

  let canal = window.location.search.substr(1).split('=')[1].split('-')[1];
  let punto = window.location.search.substr(1).split('=')[1].split('-')[0];
  let datos = await obtenerInformacionCanal();
  let puntoInfo = await obtenerInformacionPuntos(datos['archivo']);

  //set information in the boxes, change <br> to \n
  txtLoc.value = puntoInfo['puntos'][punto]['localizacion'].replace(/<br>/g, '\n');
  txtFun.value = puntoInfo['puntos'][punto]['funcion'].replace(/<br>/g, '\n');
  txtObs.value = puntoInfo['puntos'][punto]['observaciones'].replace(/<br>/g, '\n');
  txtImp.value = puntoInfo['puntos'][punto]['importancia'];
  

  titulo.innerHTML = datos['titulo'];

  txtImp.addEventListener("change", e => {
    if(txtImp.value < 0) txtImp.value = 0;
    else if(txtImp.value > 5) txtImp.value = 5;
  });

  btnSave.addEventListener("click", e => {
    //to save we replace \n to <br>
    puntoInfo['puntos'][punto]['localizacion'] = txtLoc.value.replace(/\n/g , '<br>');
    puntoInfo['puntos'][punto]['funcion'] = txtFun.value.replace(/\n/g , '<br>');
    puntoInfo['puntos'][punto]['observaciones'] = txtObs.value.replace(/\n/g , '<br>');
    puntoInfo['puntos'][punto]['importancia'] = txtImp.value;

    actualizarPunto();
  });

  function obtenerInformacionCanal(){
    return new Promise(resolve => {
      let data = {name : "config.json"};
      axios.get('/testRead', {
        params:data
      })
      .then(function (res){
        resolve(res.data['canales'][canal]) ;
      })
      .catch(function (error){
        //console.log(error);
        resolve({error:"Got an error"});
      })
    });
  }

  function obtenerInformacionPuntos(nombre){
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

  function actualizarPunto(){
    //return new Promise(resolve => {
      let data = {
        id : punto
      };

      data[punto] = puntoInfo['puntos'][punto];
      data['nombre'] = datos['archivo'];
      axios.post('/updatePoint', {
        params: data
      })
      .then(async function(res){
        //console.log(res);
        //resolve(res.data);
        //return (res.data);
        if(res.data['error']){
          alert('Error al guardar el punto');
        }else{
          await actualizafechaJSON();
          alert('finish upload Date');
          location.replace('http://127.0.0.1:3000/Canales?name=' + canal);
        }
      })
      .catch(function(error){
        console.log(error);
        //return({error : 'Got an error'});
        alert('Error al guardar el punto');
      })
    //});
  }

  function actualizafechaJSON(){
    return new Promise(resolve => {
      let myDate = Date.now();
      let data = {fecha : myDate};
      axios.post('/updateDate',{
        params : data
      })
      .then(function(res){
        console.log(res.data);
        if(res.data['error']){
          alert('Error al actualizar la fecha');
          resolve();
        }else{
          resolve();
        }

      })
    });
  }

}