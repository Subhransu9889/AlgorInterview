// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBxbmCVr5A3Z3KrV2auDYyAVKz73A1akPo",
    authDomain: "algorinterview.firebaseapp.com",
    projectId: "algorinterview",
    storageBucket: "algorinterview.firebasestorage.app",
    messagingSenderId: "1096802899057",
    appId: "1:1096802899057:web:e87b77fd69a43f24db37d0",
    measurementId: "G-KWQRLE8RXH"
};

// Initialize Firebase
const app = !getApps().length? initializeApp(firebaseConfig) : getApps();

// @ts-ignore
export const auth = getAuth(app);
// @ts-ignore
export const db = getFirestore(app);
