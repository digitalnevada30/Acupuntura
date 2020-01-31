	var admin = require("firebase-admin");
	var serviceAccount = require("./acupuntura-7e1bb-firebase-adminsdk-wkoc0-fdddd57b53.json");

	var btnTest = document.getElementById('btnTest');

	admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://acupuntura-7e1bb.firebaseio.com"
	});

	const db = admin.firestore();

	var obj = {'nombre' : 'canal1'};

	console.log(obj);

	btnTest.addEventListener('click', e => {
		console.log("click");
		

		/*let docRef = db.collection('users').doc('alovelace');

		let setAda = docRef.set({
		  first: 'Ada',
		  last: 'Lovelace',
		  born: 1815
		});*/

		db.collection("users").add({
		    first: "Ada",
		    last: "Lovelace",
		    born: 1815
		})
		.then(function(docRef) {
		    console.log("Document written with ID: ", docRef.id);
		})
		.catch(function(error) {
		    console.error("Error adding document: ", error);
		});

		
	});



	// Your web app's Firebase configuration
	/*var firebaseConfig = {
	  apiKey: "AIzaSyC9xDYKshbqwnuuPHvaBMaRQljb_p11f0I",
	  authDomain: "acupuntura-7e1bb.firebaseapp.com",
	  databaseURL: "https://acupuntura-7e1bb.firebaseio.com",
	  projectId: "acupuntura-7e1bb",
	  storageBucket: "acupuntura-7e1bb.appspot.com",
	  messagingSenderId: "878968032686",
	  appId: "1:878968032686:web:acd33764d964bc796e8c3f"
	};
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);*/