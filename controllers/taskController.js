const Task = require('../models/Task');
const Notification = require('../models/Notification');
const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({ user: task.assignedTo, message: `New task assigned: ${task.title}` });
    }
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const getTasks = async (req, res) => {
  const { query, status, priority, dueDate } = req.query;
  const filter = {
    $or: [
      { title: new RegExp(query, 'i') },
      { description: new RegExp(query, 'i') },
    ],
    ...(status && { status }),
    ...(priority && { priority }),
    ...(dueDate && { dueDate: { $lte: new Date(dueDate) } }),
  };
  const tasks = await Task.find(filter);
  res.json(tasks);
};
const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
};
const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};
const myDashboard = async (req, res) => {
  const assigned = await Task.find({ assignedTo: req.user._id });
  const created = await Task.find({ createdBy: req.user._id });
  const overdue = await Task.find({ assignedTo: req.user._id, dueDate: { $lt: new Date() }, status: { $ne: 'Completed' } });
  res.json({ assigned, created, overdue });
};
module.exports = { createTask, getTasks, updateTask, deleteTask, myDashboard };
