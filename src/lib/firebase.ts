import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCVs4NICKpGw7IxKQO5eXZ0duWM2Tmu0qQ",
  authDomain: "vdctraca.firebaseapp.com",
  projectId: "vdctraca",
  storageBucket: "vdctraca.firebasestorage.app",
  messagingSenderId: "1057430074003",
  appId: "1:1057430074003:web:57a7ede7e41c7270cb5366",
  measurementId: "G-6RN0G5ZF5W"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation des services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Activation des logs en développement
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase initialisé avec la configuration:', firebaseConfig);
}

export default app;