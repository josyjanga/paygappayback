import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js'
import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/9.11.0/firebase-app-check.js'
// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.11.0/firebase-analytics.js'

// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js'
import { getDatabase, ref, get, set, child, push, update, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-database.js";

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
const nameCoins = 'coins';
const nameTargetCoins = 'targetCoins';
const db = getDatabase();
const coinsRef = ref(db, nameCoins);
const targetCoinsRef = ref(db, nameTargetCoins);
let globalCoinValue = 0;
let globalCoinTarget = 0;

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LciGe4iAAAAAOGixngZeNGSjv9a9g7CA8E5Zh7L'),
  
    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
  });

//add listener for coins to always have the correct value for 
onValue(coinsRef, (snapshot) => {
    const data = snapshot.val();
    globalCoinValue = data;
});  
onValue(targetCoinsRef, (snapshot) => {
    const data = snapshot.val();
    globalCoinTarget = data;
}); 

//add coins 
function addCoins(value) {
    const coinsRef = ref(db, nameCoins);
    runTransaction(coinsRef, (c) => {
        if (typeof (c) != "undefined" && c != null) {
            c += value;
        }
        return c;
    });
}

//get missing coins
function getMissingCoins() {
    return globalCoinTarget > globalCoinValue
        ? globalCoinTarget - globalCoinValue
        : 0;
}

window.fb = {
    getMissingCoins: getMissingCoins,
    addCoins: addCoins
};