const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();
console.log(id);

MongoClient.connect(
  connectionURL,
  { useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      console.log('Unable to connect to database');
    }

    const db = client.db(databaseName);

    // db.collection('users').insertOne({
    //   name: 'Kostya',
    //   age: 37,
    // }, (error, result) => {
    //   if (error) {
    //     console.log('Unable to insert user');
    //   }

    //   console.log(result.ops);
    // });

    // db.collection('users').insertMany([
    //   {
    //     name: 'Olga',
    //     age: 37,
    //   },
    //   {
    //     name: 'Victor',
    //     age: 42
    //   }
    // ], (error, result) => {
    //   if (error) {
    //     console.log('Unable to insert documents');
    //   }
    //   console.log(result.ops);
    // });

    // db.collection('tasks').insertMany([
    //   {
    //     description: 'visit a doctor',
    //     completed: 'false',
    //   },
    //   {
    //     description: 'take a lunch',
    //     completed: 'true',
    //   },
    //   {
    //     description: 'drink some coffee',
    //     completed: 'false',
    //   }
    // ], (error, result) => {
    //   if (error) {
    //     console.log('Unable to insert tasks');
    //   }
    //   console.log(result.ops);
    // });
  }
);
