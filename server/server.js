const express = require('express');

const bodyParser = require('body-parser')

const {
    ObjectID
} = require('mongodb');
const {
    mongoose
} = require('./db/mongoose');
const {
    Todo
} = require('./models/todo');
const {
    User
} = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        completed: req.body.completed
    });

    todo.save().then(doc => {
        res.status(200).send(doc);
    }, err => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({
            todos
        });
    }, err => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    const {
        id
    } = req.params;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }, err => {
        res.status(400).send(err);
    });
});
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};