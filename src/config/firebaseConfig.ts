import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getAnalytics} from "firebase/analytics";
import {Settings} from "../Settings";

const firebaseConfig = {
    apiKey: "AIzaSyBYOLGu7JKs3EAUErIUlVZz9sTHpURCZY0",
    authDomain: "kartai-v2.firebaseapp.com",
    projectId: "kartai-v2",
    storageBucket: "kartai-v2.appspot.com",
    messagingSenderId: "582361178551",
    appId: "1:582361178551:web:86cc1651f3a90e8bca0832",
    measurementId: "G-16BDG83M6N"
};

const app = initializeApp(firebaseConfig);

if (Settings.ALLOWS_COOKIES) {
    console.log("Initializing analytics...")
    getAnalytics(app);
}

const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth, provider}