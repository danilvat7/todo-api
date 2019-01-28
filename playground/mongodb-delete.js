const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    const db = client.db('TodoApp');
    // db.collection('Todos')
    //     .findOneAndDelete({
    //         _id: 123
    //     })
    //     .then((result) => {
    //         console.log(result);
    //     }, err => {
    //         console.log(('Unable to fetch todos'));
    //     });
    
    db.collection('Users')
        .findOneAndDelete({
            _id: new ObjectID('5c4f37ec625b5b0512cfdaa9')
        })
        .then((result) => {
            console.log(result);
        }, err => {
            console.log(('Unable to fetch todos'));
        });

    client.close();
});