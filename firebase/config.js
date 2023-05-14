import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHzIsu9eH35ojYdV70difJcrdyV5L38mQ",
  authDomain: "photo-project-81463.firebaseapp.com",
  projectId: "photo-project-81463",
  storageBucket: "photo-project-81463.appspot.com",
  messagingSenderId: "960404949122",
  appId: "1:960404949122:web:a0055b9f5e552ebffe8c9b",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
