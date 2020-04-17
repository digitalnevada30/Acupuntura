var admin = require("firebase-admin");
var serviceAccount = require("./acupuntura-7e1bb-firebase-adminsdk-wkoc0-fdddd57b53.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://acupuntura-7e1bb.firebaseio.com"
  });

const db = admin.firestore();

exports.readFile = function(params){
    return new Promise(resolve => {
        var data;
        db.collection('Canales').doc(params['name']).get()
        .then(doc => {
            if(!doc.exists){
                console.log('No such Document');
                resolve({error:"No such document"});
            }else{
                data = doc.data();
                console.log('Document ' + params['name'] + ' was downloaded successfully');
                resolve(data);
            }
        })
        .catch(error => {
            console.log('Error while fetching object', error);
            resolve({error : "Error"});
        })
    });
}

exports.readConfig = function(){
    return new Promise(resolve => {
        var data;
        db.collection('Canales').doc('config').get()
        .then(doc => {
            if(!doc.exists){
                console.log('No such Document');
                resolve({error:"No such document"});
            }else{
                data = doc.data();
                console.log(data);
                resolve(data);
            }
        })
        .catch(error => {
            console.log('Error while fetching object', error);
            resolve({error : "Error"});
        })

    });
};

exports.uploadFile = function(documentName, info){
    return new Promise(resolve => {
        db.collection('Canales').doc(documentName).set(info)
            .then(function(docRef) {
                resolve({OK:"Message got successfuly"});
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                resolve({error:'Error'});
            });
    });
}

exports.updateDate = function(fecha){
  return new Promise(resolve => {
    db.collection('Canales').doc('config').update({fecha: fecha})
      .then(function(docRef){
        resolve({OK: "Fecha actualizada"});
      })
      .catch(function(error){
        resolve({error:'Error al actualizar la fecha'});
      })
  });
}

exports.uploadConfig = function(info){
    return new Promise(resolve => {
        db.collection('Canales').doc('config').set(info)
            .then(function(docRef) {
                resolve({OK:"Message got successfuly"});
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                resolve({error:'Error'});
            });
    });
}
