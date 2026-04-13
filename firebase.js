// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";
import { ref } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";
import { get } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMcOgQeIhymv86NsISdP1WgQXPh19D_Hc",
  authDomain: "reaction-game-6ba73.firebaseapp.com",
  databaseURL:
    "https://reaction-game-6ba73-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reaction-game-6ba73",
  storageBucket: "reaction-game-6ba73.firebasestorage.app",
  messagingSenderId: "762088583051",
  appId: "1:762088583051:web:56a25eb3105b07b160498e",
  measurementId: "G-HZB097HP7H",
};

export { initializeApp, getDatabase, ref, get };
