// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANmV3rSdf9B3uhzNlwW5Q3ywSNBB_ifRc",
  authDomain: "helix-grid.firebaseapp.com",
  databaseURL:
    "https://helix-grid-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "helix-grid",
  storageBucket: "helix-grid.appspot.com",
  messagingSenderId: "647453374177",
  appId: "1:647453374177:web:249f9e00a43c307736a9a0",
  measurementId: "G-9MVJ3E67XZ",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
