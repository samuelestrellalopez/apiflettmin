const firebase = require('firebase/compat/app');
require('firebase/compat/firestore'); 
require('firebase/compat/storage');


const firebaseConfig = {
    apiKey: "AIzaSyAD6HS5Hx9mVJrxgH0rbpQ2lU4cvCO_NGg",
    authDomain: "apiflet.firebaseapp.com",
    projectId: "apiflet",
    storageBucket: "apiflet.appspot.com",
    messagingSenderId: "364633043807",
    appId: "1:364633043807:web:fdf0fb9e70f1f298833cea",
    measurementId: "G-Y64HPLF58M"
  };

  
 try {
    firebase.initializeApp(firebaseConfig);
} catch (error) {
    console.error('Firebase initialization error:', error.stack);
}

const db = firebase.firestore();
const Driver = db.collection("Drivers");  
const Flete = db.collection("Fletes");
const User = db.collection("Users");

const storage = firebase.storage();

module.exports = {
    User,
    Driver,
    Flete,
    storage
};