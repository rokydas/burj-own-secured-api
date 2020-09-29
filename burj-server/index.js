const express = require('express'); 
const bodyParser = require('body-parser'); 

const app = express(); 

const username = 'arabian';
const password = 'roky-das-arabian';
const dbName = 'burj-al-arab';
const collectionName = 'bookings';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
        res.send('Hello I am your new node js project');
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${username}:${password}@cluster0.vetwi.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(dbName).collection(collectionName);
    console.log('database connection');
  client.close();
});


app.listen(5000); 