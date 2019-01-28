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
    //     .findOneAndUpdate({
    //         _id: new ObjectID("5c4a42a121675a0f9caf8dc6")
    //     }, {
    //         $set: {
    //             completed: true
    //         }
    //     }, {
    //         returnOriginal: false
    //     })
    //     .then((result) => {
    //         console.log(result);
    //     }, err => {
    //         console.log((err));
    //     });
    db.collection('Users')
        .findOneAndUpdate({
            _id: new ObjectID("5c4a437d657ba618f05cee65")
        }, {
            $set: {
                name: 'Jhon'
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        })
        .then((result) => {
            console.log(result);
        }, err => {
            console.log((err));
        });



    client.close();
});