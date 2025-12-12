const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../credentials.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://placement-portal-7fb64-default-rtdb.firebaseio.com/"
});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, 
  messagingSenderId: process.env.FIREBASE_MESSSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.FIREBASE_DB_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const bucket = getStorage(app, process.env.FIREBASE_BUCKET_URL);

module.exports = {
  bucket,
  firebaseAdmin
}