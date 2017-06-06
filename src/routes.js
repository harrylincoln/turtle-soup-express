const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const cors = require('cors');
const firebaseMiddleware = require('express-firebase-middleware');
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
const jwt = require('jsonwebtoken');
const NodeRSA = require('node-rsa');

let idToken = '';
const fbPrivateKey = serviceAccount.private_key;
const key = new NodeRSA(fbPrivateKey).exportKey('pkcs8-public-pem');
// console.log('Private key ---->', key);

router.use((req, res, next) => {
    next();
});

router.use('/api', cors(), firebaseMiddleware.auth);

router.get('/', (req, res) => {
    res.json({
        message: 'Home'
    });
});


router.get('sign-in-with-custom-token', cors(), (req, res) => {

});

router.get('/verifyIdToken', cors(), (req, res) => {
  let token = req.headers.authorization.split('Bearer ')[1];
console.log(req.headers);
  // jwt.verify(token, 'big-secret', /*{ algorithms: ['RS256'] },*/ function(err, decoded) {
    console.log('token', token);
  admin.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      idToken = decodedToken.uid;
      console.log('idToken saved on the backend ready for /api route', idToken);
    }).catch(function(error) {
      console.error('error', error);
    });
});

router.use('/get-token', cors(), (req, res) => {
    var uid = "big-secret";
    admin.auth().createCustomToken(uid)
      .then(function(customToken) {
        res.json({
          instanceID: customToken
        });
      })
      .catch(function(error) {
        console.log("Error creating custom token:", error);
    });
});

router.use('/create-user', (req, res) => {
  console.log('createUser: req', req.body);
    admin.auth().createUser({
      email: req.body.emailAddress,
      emailVerified: false,
      password: req.body.pass,
      displayName: "Client -> BE -> firebase",
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false
    })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
      res.json({
        message: 'successfully created a new user',
        userRecord: userRecord
      })
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
    });
});

router.get('/api/hello', (req, res) => {
    res.json({
        message: `You're logged in as ${res.locals.user.email} with Firebase UID: ${res.locals.user.uid}`
    });
});

module.exports = router;
