const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Kostya',
      email: 'kostya@example.com',
      password: 'MyPass777!',
    })
    .expect(201);
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  expect(response.body).toMatchObject({
    user: {
      name: 'Kostya',
      email: 'kostya@example.com',
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe('MyPass777!');
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should login nonexisting user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'man@some.com',
      password: '123456',
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile', async () => {
  await request(app).get('/users/me').send().expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenificated user', async () => {
  await request(app).delete('/users/me').send().expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Tomas',
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toBe('Tomas');
});

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Rome',
    })
    .expect(400);
});

test('Should not signup user with invalid email/password', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Kostya',
      email: 'mike@example.com',
      password: 'MyPass777!',
    })
    .expect(400);
  await request(app)
    .post('/users')
    .send({
      name: 'Kostya',
      email: 'notCorrectEmail',
      password: 'MyPass777!',
    })
    .expect(400);
  await request(app)
    .post('/users')
    .send({
      name: 'Kostya',
      email: 'kostya123@example.com',
      password: 'password',
    })
    .expect(400);
});

test('Should not update user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      name: 'Tomas',
    })
    .expect(401);
});

test('Should not update user with invalid email/password', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: 'invalidEmail',
    })
    .expect(400);
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      password: 'invlidPassword123!',
    })
    .expect(400);
  const user = await User.findById(userOneId);
  expect(user.email).not.toBe('invalidEmail');
  expect(user.password).not.toBe('invlidPassword123!');
});
