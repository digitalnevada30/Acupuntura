// Modules
const {app, BrowserWindow} = require('electron')

const internetAvailable = require('internet-available');

let Update = false;
let UpdateGlossary = false;
let checkDownload = true;

exports.enviaApp = function(){
  return app;
}

exports.setUpdate = function(val){
  Update = val;
}

exports.setUpdateGlossary = function(val){
  UpdateGlossary = val;
}

exports.setCheckDownload = function(val){
  checkDownload = val;
}

exports.getCheckDownload = function(){
  return checkDownload;
}

const fire = require('./Firestore.js');
const admJSON = require('./AdministradorJSON');
var express = require('./Express');

express = new express.Express();
express.init();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: { nodeIntegration: true, webSecurity : false },
    show: false
  })

  mainWindow.maximize()

  mainWindow.show()

  // Load index.html into the new BrowserWindow
  mainWindow.loadURL('http://127.0.0.1:3000/init')
  //mainWindow.loadURL('http://127.0.0.1:3000/Prototipo?name=higado')

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed',(event) => {
  if (process.platform !== 'darwin'){
    event.preventDefault()
    internetAvailable().then(async function(){
      if(Update){
        console.log('actualizando Canales');
        var resp = await admJSON.readData({name : 'config.json'});

        if(!resp['error']){
          //subimos la informacion de los canales
          for(let prop in resp['canales']){
            console.log(prop);
            //leemos la informacion de cada archivo de los canales
            var tmp = await admJSON.readData({name : resp['canales'][prop]['archivo']});
            if(!tmp['error']){
              //upload files
              await fire.uploadFile(prop, tmp);
            }
          }
          //subimos el archivo config
          await fire.uploadFile('config',resp);
          console.log('config');
          //actualizamos la fecha
          await fire.updateDate(resp['fecha']);
        }
      }

      if(UpdateGlossary){
        console.log('actualizando Glosario');
        var resp = await admJSON.readData({name : 'config.json'});
        if(!resp['error']){
          var tmp = await admJSON.readData({name : resp['glosario']});
          if(!tmp['error']){
            await fire.uploadFile('glosario', tmp);
            //actualizamos la fecha
            await fire.updateDate(resp['fecha']);
          }
        }
      }

      app.quit()
    }).catch(function(){
      console.log('there is no internet');
      app.quit()
    });
  }
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
