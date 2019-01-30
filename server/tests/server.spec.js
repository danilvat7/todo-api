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

const todosMock = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todosMock)
    }).then(() => done());
});

describe('POST /todos', () => {
    it('create a new todo', (done) => {
        const text = "Test to do";

        request(app)
            .post('/todos')
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
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).to.equal(2)
            })
            .end(done);
    })
});

describe('GET /todo/:id', () => {
    it('should get todo by id', (done) => {
        request(app)
            .get(`/todos/${todosMock[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).to.equal(todosMock[0].text)
            })
            .end(done);
    });

    it('should get todo by id', (done) => {
        request(app)
            .get(`/todos/${todosMock[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).to.equal(todosMock[0].text)
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if for not valid id', (done) => {
        request(app)
            .get(`/todos/123asdd`)
            .expect(404)
            .end(done);
    });
});