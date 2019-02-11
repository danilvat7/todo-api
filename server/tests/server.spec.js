const request = require('supertest');
const {
    expect
} = require('chai');


const {
    ObjectID
} = require('mongodb');

const {
    app
} = require('./../server');
const {
    Todo
} = require('./../models/todo');

const {
    User
} = require('./../models/user');

const {
    populateTodos,
    todosMock,
    populateUsers,
    usersMock
} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
    it('create a new todo', (done) => {
        const text = "Test to do";

        request(app)
            .post('/todos')
            .set('x-auth', usersMock[0].tokens[0].token)
            .send({
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.text).to.equal(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({
                    text
                }).then(todos => {
                    expect(todos.length).to.equal(1);
                    expect(todos[0].text).to.equal(text);
                    done();
                }).catch(err => done(err))
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', usersMock[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then(todos => {
                    expect(todos.length).to.equal(2);
                    done();
                }).catch(err => done(err))
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).to.equal(1)
            })
            .end(done);
    })
});

describe('GET /todo/:id', () => {
    it('should get todo by id', (done) => {
        request(app)
            .get(`/todos/${todosMock[0]._id.toHexString()}`)
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).to.equal(todosMock[0].text)
            })
            .end(done);
    });

    it('should not return todo create by another user', (done) => {
        request(app)
            .get(`/todos/${todosMock[1]._id.toHexString()}`)
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if for not valid id', (done) => {
        request(app)
            .get(`/todos/123asdd`)
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todo/:id', () => {
    it('should delete todo by id', (done) => {
        request(app)
            .delete(`/todos/${todosMock[1]._id.toHexString()}`)
            .set('x-auth', usersMock[1].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).to.equal(todosMock[1].text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.findById(todosMock[1]._id.toHexString()).then(todo => {
                    expect(todo).to.equal(null);
                    done();
                }).catch(err => done(err));
            });
    });

    it('should not delete todo created by another user', (done) => {
        request(app)
            .delete(`/todos/${todosMock[1]._id.toHexString()}`)
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id not valid', (done) => {
        request(app)
            .delete(`/todos/123asdd`)
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todo/:id', () => {
    it('should update todo by id - completed: false', (done) => {
        const firstTodoId = todosMock[0]._id.toHexString();
        request(app)
            .patch(`/todos/${firstTodoId}`)
            .set('x-auth', usersMock[0].tokens[0].token)
            .send({
                completed: true,
                text: 'text'
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).to.equal('text');
                expect(res.body.todo.completed).to.equal(true);
                expect(res.body.todo.completedAt).to.be.a('number');
            })
            .end(done);
    });

    it('should not update todo created by another user', (done) => {
        const firstTodoId = todosMock[0]._id.toHexString();
        request(app)
            .patch(`/todos/${firstTodoId}`)
            .set('x-auth', usersMock[1].tokens[0].token)
            .send({
                completed: true,
                text: 'text'
            })
            .expect(404)
            .end(done);
    });

    it('should update todo by id - completed: false', (done) => {
        const secondTodoId = todosMock[1]._id.toHexString();
        request(app)
            .patch(`/todos/${secondTodoId}`)
            .set('x-auth', usersMock[1].tokens[0].token)
            .send({
                completed: false
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).to.equal(false);
                expect(res.body.todo.completedAt).to.equal(null);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .patch(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id not valid', (done) => {
        request(app)
            .patch(`/todos/123asdd`)
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', usersMock[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).to.equal(usersMock[0]._id.toHexString());
                expect(res.body.email).to.equal(usersMock[0].email);
            })
            .end(done);
    });

    it('should return 401 if no authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', '')
            .expect(401)
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create new user', (done) => {
        const user = {
            email: 'em@em.com',
            password: 'Password'
        }

        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).to.be.a('string');
                expect(res.body.email).to.equal(user.email);
            })
            .end(done);
    });

    it('should returns validators error', (done) => {
        const user = {
            email: 'invalid',
            password: 'Password'
        };
        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .end(done);
    });

    it('should not create user if exist email', (done) => {
        const user = {
            email: 'em@em.com',
            password: 'Password'
        };
        new User(user).save();

        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should return user', (done) => {
        const {
            email,
            password
        } = usersMock[0];

        request(app)
            .post('/users/login')
            .send({
                email,
                password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).to.be.a('string');
                expect(res.body.email).to.equal(email);
            })
            .end(done);
    });

    it('should returns validators error', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: 'email@em.com',
                password: 'password'
            })
            .expect(400)
            .end(done);
    });

});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {

        const {
            _id,
            tokens
        } = usersMock[0];
        request(app)
            .delete('/users/me/token')
            .set('x-auth', tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(_id).then(user => {
                        expect(user.tokens.length).to.equal(0);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            });
    });
});