// const {
//     MongoClient,
//     ObjectID
// } = require('mongodb');

// MongoClient.connect('mongodb://localhost:27017', (err, client) => {
//     if (err) {
//         return console.log('Unable to connect to MongoDB server');
//     }
//     const db = client.db('TodoApp');
//     db.collection('Todos').insertOne({
//         text: 'Some to do',
//         completed: false
//     }, (err, result) => {
//         if (err) {
//             return console.log('Unable to insert user', err);
//         }
//         console.log(JSON.stringify(result.ops, undefined, 2));

//     });
//     db.collection('Users').insertOne({
//         name: 'Jhon',
//         age: 30,
//         location: 'London'
//     }, (err, result) => {
//         if (err) {
//             return console.log('Unable to insert user', err);
//         }
//         console.log(JSON.stringify(result.ops[0]._id.getTimestamp()))

//     });
//     client.close();
// });