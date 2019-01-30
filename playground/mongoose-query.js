const {
    ObjectID
} = require('mongodb');
const {
    mongoose
} = require('./../server/db/mongoose');
const {
    Todo
} = require('./../server/models/todo');
const {
    User
} = require('./../server/models/user');
// const id = '5c50c7a0f2f15b2234f351b3';

// if (!ObjectID.isValid(id)) {
//     return console.log('ID not valid');

// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);

// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     console.log('Todo by id', todo);
// }).catch(e => console.log(e));

const userID = '5c5209e83e7cf4983e05f762';
User.findById(userID).then((user) => {
    console.log('User by id', user);
}).catch(e => console.log(e));