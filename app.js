const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/task.js'); 
const app = express();
const port = 5000; 
const cors = require('cors');

app.use(express.json()); 
app.use(cors());
mongoose.connect('mongodb+srv://atifraza:123@cluster0.ptzftya.mongodb.net/TodoApp')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('Error connecting to MongoDB', err));

// Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Add a new task
app.post('/api/addtasks', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Task text is required' });

  try {
    const newTask = new Task({ text });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Update a task (including completion status)
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { text, isCompleted } = req.body;

  if (!text) return res.status(400).json({ error: 'Task text is required' });

  try {
    const task = await Task.findByIdAndUpdate(id, { text, isCompleted }, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Delete all tasks
app.delete('/api/tasks', async (req, res) => {
  try {
    await Task.deleteMany();
    res.json({ message: 'All tasks deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tasks' });
  }
});

app.get('/',(req,res)=>{
  res.send('Welcome to todo app')
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});




