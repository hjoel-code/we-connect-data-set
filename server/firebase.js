
require('dotenv').config()

var admin = require("firebase-admin");

var serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG)

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}


module.exports = {
    firestore: admin.firestore()
}