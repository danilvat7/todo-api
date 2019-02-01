require('./config/config');

const _ = require('lodash');
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

// todos routes
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

app.delete('/todos/:id', (req, res) => {
    const {
        id
    } = req.params;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then(todo => {
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

app.patch('/todos/:id', (req, res) => {
    const {
        id
    } = req.params;
    const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then(todo => {
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

// users routes
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    const user =  new User(body)
    console.log(JSON.stringify(body, undefined,2));
    
    user.save().then(doc => {
        res.status(200).send(doc);
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