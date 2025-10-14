const admin = require('firebase-admin');
const serviceAccount = require('../firebase/bansal-classes-2f088-firebase-adminsdk-fbsvc-2a379a2e16.json'); // replace with actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;