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

// app.use((req, res, next) => {
//   res.status(503).send('Server unavalible now. Please, try again later');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}.`);
});

// const main = async () => {
//   // const task = await Task.findById('6069c6cf89d5520e805e5a28');
//   // await task.populate('owner').execPopulate();
//   // console.log(task.owner);

//   const user = await User.findById('6069a1721f8a1430a0ea34c3');
//   await user.populate('tasks').execPopulate();
//   console.log(user.tasks);
// };

// main();
