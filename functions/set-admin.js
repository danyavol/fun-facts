const admin = require('firebase-admin');

const serviceAccount = require('./credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://fun-facts-2fa6e-default-rtdb.europe-west1.firebasedatabase.app',
});

const uid = 'userId'; // Change to real UID of user
admin
    .auth()
    .getUser(uid)
    .then((userRecord) => {
        return admin.auth().setCustomUserClaims(uid, {
            admin: true,
        });
    })
    .then(() => {
        console.log('Success');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
