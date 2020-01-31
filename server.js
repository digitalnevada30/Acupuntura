// Modules
const {app, BrowserWindow} = require('electron')

var express = require('express');
var expressApp = express();
var path = require('path');
var bodyParser = require('body-parser');

var admin = require("firebase-admin");
var serviceAccount = require("./acupuntura-7e1bb-firebase-adminsdk-wkoc0-fdddd57b53.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://acupuntura-7e1bb.firebaseio.com"
  });

const db = admin.firestore();

expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use(bodyParser.json()); //support json encoded bodies
expressApp.use(bodyParser.urlencoded({extended: true})); //support encoded bodies

expressApp.post('/example', function(req, res,next){
  console.log('Post method');
  console.log(req.body.params);
  //res.status(200).send({OK:'Message got successfuly'});
  
  db.collection("users").add(req.body.params)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        res.status(200).send({OK:'Message got successfuly'});
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        res.status(200).send({error:'Error'});
    });


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
  mainWindow.loadURL('http://127.0.0.1:3000')

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