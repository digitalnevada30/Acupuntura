// Modules
const {app, BrowserWindow} = require('electron')

const express = require('express');
const expressApp = express();
const path = require('path');
const bodyParser = require('body-parser');

const fire = require('./fire.js');
const admJSON = require('./administradorJSON');

expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use(bodyParser.json()); //support json encoded bodies
expressApp.use(bodyParser.urlencoded({extended: true})); //support encoded bodies

expressApp.post('/canales', async function(req, res,next){
  console.log('Post method: upload channel information');
  console.log(req.body.params);
  var resp = await fire.addReg(req.body.params);
  console.log(resp);
  res.status(200).send(resp);
});

expressApp.post('/testWrite', async function(req, res){
  console.log('Post method: upload JSON file');
  console.log(req.body.params);
  var resp = await admJSON.writeData(req.body.params);
  console.log(resp);
  res.status(200).send(resp);
});

expressApp.get('/testRead', async function(req, res){
  console.log('Get method: Read JSON file');
  console.log(req.query);
  var resp = await admJSON.readData(req.query);
  console.log(resp);
  res.status(200).send(resp);
});

expressApp.get('/getCanal', async function(req, res){
  console.log('Get method: read document information');
  console.log(req.query);
  var resp = await fire.readReg(req.query); 
  console.log(resp);
  res.status(200).send(resp);
});

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
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})