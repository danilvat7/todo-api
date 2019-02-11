require('./config/config');

const _ = require('lodash');
const express = require('express');

const bodyParser = require('body-parser')

const bcrypt = require('bcryptjs');

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

const {
    authenticate
} = require('./middleware/authenticate');

const {
    bodyPick
} = require('./helpers/helpers');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// todos routes
app.post('/todos', authenticate, (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        _creator: req.user.id
    });

    todo.save().then(doc => {
        res.status(200).send(doc);
    }, err => {
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then(todos => {
        res.send({
            todos
        });
    }, err => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    const {
        id
    } = req.params;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
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

app.delete('/todos/:id', authenticate, (req, res) => {
    const {
        id
    } = req.params;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
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

app.patch('/todos/:id', authenticate, (req, res) => {
    const {
        id
    } = req.params;
    const body = bodyPick(req, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
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
    const body = bodyPick(req);
    const user = new User(body);
    user.save().then(_ => {
            return user.generateAuthToken();
        })
        .then(token => {
            res.header('x-auth', token).send(user);
        }).catch(err => {
            res.status(400).send(err);
        });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
});

app.post('/users/login', (req, res) => {
    const body = bodyPick(req);
    User.findByCredentials(body).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });
    }).catch(err => {
        res.status(400).send(err);
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(_ => {
        res.status(200).send();
    }, _ => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};