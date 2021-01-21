
// Testing DB connection methods and troubleshooting

// const MongoClient = require('mongodb').MongoClient;
// const uri = process.env.DATABASE
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



require('dotenv').config()

// const MongoClient = require('mongodb').MongoClient;

const uri = process.env.DATABASE
// console.log(uri, typeof uri)

// const client = new MongoClient(uri, { useNewUrlParser: true });

// client.connect(uri, err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const mongoose = require('mongoose')

mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)

mongoose.connect(uri)

console.log('success')