const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors');
require('dotenv').config();

const app = express(); 

const dbUsername = process.env.dbUsername;
const dbPassword = process.env.dbPassword;
const dbName = process.env.dbName;
const dbCollectionName = process.env.dbCollectionName;
// console.log(dbUsername, dbPassword, dbName, dbCollectionName);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var admin = require('firebase-admin');

var serviceAccount = require('./burj-al-arab-roky-firebase-adminsdk-t2q8i-baf1d981b1.json');

admin.initializeApp({ 
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-arab-roky.firebaseio.com"
});

app.get('/', (req, res) => {
  res.send('Hello I am your new node js project');
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.vetwi.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db(dbName).collection(dbCollectionName);
    
  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    // console.log(newBooking);
    collection.insertOne(newBooking)
    .then(result => {
      // console.log(result);
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;
    if(bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      // console.log({idToken});

      admin.auth().verifyIdToken(idToken)
      .then(decodedToken => {
        // let uid = decodedToken.uid;
        const tokenEmail = decodedToken.email;
        const queryEmail = req.query.email;
        // console.log(tokenEmail, queryEmail);
        if(tokenEmail == queryEmail) {
          collection.find({email: req.query.email})
          .toArray((err, documents) => {
            res.send(documents);
          })
        }
        console.log({uid});
      })
      .catch(error => {
        // res.status(401).send('Unauthorized Access');
      })
    }
    else {
      res.status(401).send('Unauthorized Access');
    }
  })

});


app.listen(5000); 