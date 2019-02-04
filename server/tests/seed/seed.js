const {
    ObjectID
} = require('mongodb');

const jwt = require('jsonwebtoken');

const {
    Todo
} = require('./../../models/todo');

const {
    User
} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const usersMock = [{
        _id: userOneId,
        email: 'email@test.com',
        password: 'userOnePass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({
                _id: userOneId.toHexString(),
                access: 'auth'
            }, 'secret').toString()
        }]
    },
    {
        _id: userTwoId,
        email: '3121@test.com',
        password: 'userTwoPass'
    }
];

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        const userOne = new User(usersMock[0]).save();
        const userTwo = new User(usersMock[1]).save();
      return  Promise.all([userOne, userTwo]);
    }).then(() => done());
};

const todosMock = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todosMock)
    }).then(() => done());
};

module.exports = {
    todosMock,
    populateTodos,
    populateUsers,
    usersMock
};