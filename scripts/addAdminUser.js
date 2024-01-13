const admin = require('firebase-admin')
require('dotenv').config()
const serviceAccount = require('../config/serviceAccountKey.json')

// Initialize the Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

// Make a user an admin
admin
    .auth()
    .getUserByEmail('admin@user.email')
    .then((user) => {
        // Set custom user claims
        return admin.auth().setCustomUserClaims(user.uid, { admin: true })
    })
    .then(() => {
        console.log('User successfully granted admin privileges')
    })
    .catch((error) => {
        console.log('Error granting admin privileges:', error)
    })
