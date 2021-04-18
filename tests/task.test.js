const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test',
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test('Should fetch user tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toBe(1);
});

test('Should not delete other users tasks', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test('Should not create task with invalid description', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: '',
    })
    .expect(400);
  const task = await Task.findById(response.body._id);
  expect(task).toBeNull();
});

test('Should not create task with invalid completed', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'some velid description',
      completed: 'not boolean',
    })
    .expect(400);
  const task = await Task.findById(response.body._id);
  expect(task).toBeNull();
});

test('Should not update task with invalid description', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: '',
    })
    .expect(500);
  const task = await Task.findById(taskOne._id);
  expect(task.description).not.toBe('');
});

test('Should not update task with invalid completed', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      completed: 'some invalid completed',
    })
    .expect(500);
  const task = await Task.findById(taskOne._id);
  expect(task.completed).not.toBe('some invalid completed');
});

test('Should delete user task', async () => {
  await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  const task = await Task.findById(taskThree._id);
  expect(task).toBeNull();
});

test('Should not delete task if unauthenticated', async () => {
  await request(app).delete(`/tasks/${taskTwo._id}`).send().expect(401);
  const task = await Task.findById(taskTwo._id);
  expect(task).not.toBeNull();
});

test('Should not update other users task', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: 'another description',
    })
    .expect(400);
  const task = await Task.findById(taskOne._id);
  expect(task.description).not.toBe('another description');
});

test('Should fetch user task by id', async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not fetch user task by id if unauthenticated', async () => {
  await request(app).get(`/tasks/${taskOne._id}`).send().expect(401);
});

test('Should not fetch other users task by id', async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(400);
});

test('Should fetch only completed tasks', async () => {
  const response = await request(app)
    .get('/tasks?completed=true')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toBe(1);
});

test('Should fetch only incomplete tasks', async () => {
  const response = await request(app)
    .get('/tasks?completed=false')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toBe(2);
});

test('Should sort tasks by createdAt', async () => {
  const response = await request(app)
    .get('/tasks?sortBy=createdAt:desc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body[0].description).toBe('fourth task');
  expect(response.body[1].description).toBe('second task');
  expect(response.body[2].description).toBe('first task');
});

test('Should sort tasks by updatedAt', async () => {
  const response = await request(app)
    .get('/tasks?sortBy=updatedAt:desc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body[0].description).toBe('fourth task');
  expect(response.body[1].description).toBe('second task');
  expect(response.body[2].description).toBe('first task');
});

test('Should sort tasks by description', async () => {
  const response = await request(app)
    .get('/tasks?sortBy=description:asc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body[0].description).toBe('first task');
  expect(response.body[1].description).toBe('fourth task');
  expect(response.body[2].description).toBe('second task');
});

test('Should sort tasks by completed', async () => {
  const response = await request(app)
    .get('/tasks?sortBy=completed:asc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body[0].completed).toBe(false);
  expect(response.body[1].completed).toBe(false);
  expect(response.body[2].completed).toBe(true);
});

test('Should fetch page of tasks', async () => {
  const response = await request(app)
    .get('/tasks?limit=2&skip=0')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toBe(2);
});
