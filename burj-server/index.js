const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors');

const app = express(); 

const username = 'arabian';
const password = 'roky-das-arabian';
const dbName = 'burj-al-arab';
const collectionName = 'bookings';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var admin = require("firebase-admin");

var serviceAccount = require("burj-al-arab-roky-firebase-adminsdk-t2q8i-baf1d981b1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-arab-roky.firebaseio.com"
});


app.get('/', (req, res) => {
  res.send('Hello I am your new node js project');
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${username}:${password}@cluster0.vetwi.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db(dbName).collection(collectionName);
    
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
    console.log(req.headers.authorization);
    collection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

});


app.listen(5000); 