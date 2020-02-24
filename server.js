// Modules
const {app, BrowserWindow} = require('electron')

const express = require('express');
const expressApp = express();
const path = require('path');
const bodyParser = require('body-parser');
const internetAvailable = require('internet-available');

const fire = require('./fire.js');
const admJSON = require('./administradorJSON');

let Update = false;

expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use(bodyParser.json()); //support json encoded bodies
expressApp.use(bodyParser.urlencoded({extended: true})); //support encoded bodies

expressApp.post('/canales', async function(req, res,next){
  console.log('Post method: upload channel information to firestore');
  console.log(req.body.params);
  var resp = await fire.addReg(req.body.params);
  //console.log(resp);
  res.status(200).send(resp);
});

expressApp.post('/testWrite', async function(req, res){
  console.log('Post method: upload JSON file');
  console.log(req.body.params);
  var resp = await admJSON.writeData(req.body.params);
  //console.log(resp);
  res.status(200).send(resp);
});

expressApp.post('/updatePoint',async function(req, res){
  console.log('Post method: upload JSON point');
  console.log(req.body.params);
  var resp = await admJSON.writePoint(req.body.params);
  //console.log(resp);
  res.status(200).send(resp);
});

expressApp.post('/updateDate', async function(req, res){
  console.log('Post method: upload JSON point');
  console.log(req.body.params);
  var resp = await admJSON.updateDate(req.body.params);
  Update = true;
  console.log('update var has been changed');
  res.status(200).send(resp);
});

expressApp.get('/testRead', async function(req, res){
  console.log('Get method: Read JSON file');
  console.log(req.query);
  var resp = await admJSON.readData(req.query);
  //console.log(resp);
  res.status(200).send(resp);
});

expressApp.get('/getCanal', async function(req, res){
  console.log('Get method: read document information from firestore');
  console.log(req.query);
  var resp = await fire.readReg(req.query); 
  //console.log(resp);
  res.status(200).send(resp);
});

expressApp.get('/readConfig', async function(req, res){
  console.log('Get method: read config file');
  var resp = await fire.readConfig();
  //console.log(resp);
  res.status(200).send(resp);
});

expressApp.post('/downloadFS', async function(req, res){
  console.log('Post method: download Content');
  /*THIS METHOD IS IN WARNING*/
  //download config
  //download each file
  res.status(200).send(resp);
})

expressApp.listen(3000, function(){
  console.log('Example app listening on port 3000');
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: { nodeIntegration: true }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadURL('http://127.0.0.1:3000/init')

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
        var resp = await admJSON.readData({name : 'config.json'});
        
        if(resp['OK']){
          for(let prop in resp['canales']){
            console.log(prop);
            //readfile
            var tmp = await admJSON.readData({name : resp['canales'][prop]['archivo']});
            //console.log(tmp);
            if(tmp['OK']){
              var info = {puntos : tmp['puntos']};
              //upload files
              await fire.uploadFile(prop, info);
            }
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