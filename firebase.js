import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js'

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.11.0/firebase-analytics.js'

// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js'
import { getDatabase, ref, get, set, child, push, update, runTransaction } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBxXyl0q3avlL60VFrMh2faYAOhmcXgDwg",
    authDomain: "paygap-payback.firebaseapp.com",
    projectId: "paygap-payback",
    storageBucket: "paygap-payback.appspot.com",
    messagingSenderId: "1020192246724",
    appId: "1:1020192246724:web:6b13bfcde8e0fcc4ce3291",
    measurementId: "G-EM48ZRX044",
    databaseURL: "https://paygap-payback-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const coins = 'coins';
const targetCoins = 'targetCoins';

//add coins 
function addCoins(value) {
    const dbRef = getDatabase();
    const coinsRef = ref(dbRef, coins);

    runTransaction(coinsRef, (c) => {
        if (typeof (c) != "undefined" && c != null) {
            c += value;
        }
        return c;
    });
}

//get missing coins
function getMissingCoins() {
    return new Promise((resolve, reject) => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, coins)).then((ssCoins) => {
            if(ssCoins.exists()) {
                var c = ssCoins.val();

                get(child(dbRef, targetCoins)).then((ssTargetCoins) => {

                    if(ssTargetCoins.exists()) {
                        var tc = ssTargetCoins.val();
                        var result = tc > c ? tc - c : 0;
                        resolve(result);
                    }
    
                }).catch((error) => {
                    console.error(error);
                    reject(0);
                });
            }
            
        }).catch((error) => {
            console.error(error);
            reject(0);
        });
    });
}

window.fb = {
    getMissingCoins: getMissingCoins,
    addCoins: addCoins
};