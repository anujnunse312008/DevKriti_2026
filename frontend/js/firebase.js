// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

// Authentication
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Firestore
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyB2HpmADkjP2F1RqvRct-qYamZ1zBSoXfc",

    authDomain: "storyforgeai-53a0c.firebaseapp.com",

    projectId: "storyforgeai-53a0c",

    storageBucket: "storyforgeai-53a0c.firebasestorage.app",

    messagingSenderId: "348693819800",

    appId: "1:348693819800:web:0b41829461713bfbb07bed"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };