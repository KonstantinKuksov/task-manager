const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  { useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      console.log('Unable to connect to database');
    }

    const db = client.db(databaseName);

    // db.collection('users').findOne({ _id: new ObjectID("604cbcc68f08d92890ec0034") }, (error, user) => {
    //   if (error) {
    //     return console.log('Unable to fetch');
    //   }
    //   console.log(user);
    // });

    // db.collection('users').find({age: 37}).toArray((error, users) => {
    //   if (error) {
    //     console.log('Unable to fetch');
    //   }
    //   console.log(users);
    // });

    // db.collection('users').find({age: 37}).count((error, count) => {
    //   if (error) {
    //     console.log('Unable to fetch');
    //   }
    //   console.log(count);
    // });

    db.collection('tasks').findOne({_id: new ObjectID("604cbc3980c96e15cc65f2bf")},  (error, task) => {
      if (error) {
        console.log('Unable to fetch');   
      }
      console.log(task);
    });

    db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
      console.log();
      console.log('Not completed tasks:');
      console.log(tasks);
    });
  }
);
