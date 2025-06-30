// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAzzhTP3nm_X1DM9nbTTnCSDh1Vpu4_OZ8",
  authDomain: "pod-auth-c7a93.firebaseapp.com",
  projectId: "pod-auth-c7a93",
  appId: "1:1092007688965:web", // You can leave this as placeholder for now
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
