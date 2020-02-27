var admin = require("firebase-admin");
var serviceAccount = require("./acupuntura-7e1bb-firebase-adminsdk-wkoc0-fdddd57b53.json");
exports.flag = 0;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://acupuntura-7e1bb.firebaseio.com"
  });

const db = admin.firestore();

exports.addReg = function (params){
    return new Promise(resolve => {
        //db.collection("users").add(params)
        db.collection('users').doc(params['name']).set({
            age : params['age'],
            number : params['number']
        })
            .then(function(docRef) {
                resolve({OK:"Message got successfuly"});
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                resolve({error:'Error'});
            });
    });
};

exports.readReg = function(params){
    return new Promise(resolve => {
        var data;
        db.collection('users').doc(params['name']).get()
        .then(doc => {
            if(!doc.exists){
                console.log('No such Document');
                resolve({OK:"No such document"});
            }else{
                data = doc.data();
                data['OK'] = 'data is back!';
                console.log('Document data: ', data);
                resolve(data);
            }
        })
        .catch(error => {
            console.log('Error getting document', err);
            resolve({error:"Error"});
        })
    });
};

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
                data['OK'] = "data is back!";
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