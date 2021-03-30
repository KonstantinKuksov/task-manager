const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const PORT = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.send('GET requests are disabled');
//   } else {
//     next();
//   }
// });

app.use((req, res, next) => {
  res.status(503).send('Server unavalible now. Please, try again later');
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}.`);
});

const jwt = require('jsonwebtoken');

const myFunc = async () => {
  const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', {
    expiresIn: '7 days',
  });
  console.log(token);

  const data = jwt.verify(token, 'thisismynewcourse');
  console.log(data);
};

myFunc();
