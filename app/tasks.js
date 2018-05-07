const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../auth');

const createRouter = () => {
  const router = express.Router();

  router.get('/', auth, (req, res) => {

    Task.find({user: req.user._id})
      .then((results) => res.send(results))
      .catch(() => res.sendStatus(500))
  });

  router.post('/', auth, async (req, res) => {
    const token = req.get('Token');

    const user = await User.findOne({token});
    if (!user) {
      res.status(401).send({error: 'user not authorised!'})
    } else {
      const taskData = {
        user: user._id,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
      };
      const task = new Task(taskData);
      task.save()
        .then(task => res.send(task))
        .catch(error => res.status(400).send(error));
    }
  });

  router.put('/:id', auth, async (req, res) => {
    const task = await Task.findOne({_id: req.params.id});
    const putTask = req.user._id.toString() === task.user.toString();
    if (!putTask) {
      return res.status(403).send({error: 'Access denied!'});
    } else {
      task.title = req.body.title;
      task.description = req.body.description;
      task.status = req.body.status;
      task.save()
        .then(newTask => res.send(newTask))
        .catch(error => res.status(400).send(error));
    }
  });

  router.delete('/:id', auth, async (req, res) => {
    const task = await Task.findOne({_id: req.params.id});

    const deleteTask = req.user._id.toString() === task.user.toString();

    if (!deleteTask) {
      return res.status(403).send({error: 'Access denied!'});
    } else {
      task.remove()
        .then(() => res.send('task was deleted!'))
        .catch(error => res.status(400).send(error));
    }
  });

  return router;
};

module.exports = createRouter;
