const {
    MongoClient,
    ObjectId
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    const db = client.db('TodoApp');
    // db.collection('Todos')
    //     .find({
    //         _id: new ObjectId('5c4f35b0a8cc8003f3f5cb15')
    //     })
    //     .toArray()
    //     .then((docs) => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));

    //     }, err => {
    //         console.log(('Unable to fetch todos'));
    //     });

    // db.collection('Todos')
    // .find()
    // .count()
    // .then((count) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(count, undefined, 2));

    // }, err => {
    //     console.log(('Unable to fetch todos'));
    // });

    db.collection('Users')
        .find({
            name: 'Jhon'
        })
        .toArray()
        .then((docs) => {
            console.log('User');
            console.log(JSON.stringify(docs, undefined, 2));

        }, err => {
            console.log(('Unable to fetch todos'));
        });


    client.close();
});