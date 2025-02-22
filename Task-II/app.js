const express = require('express');  
const bodyParser = require('body-parser');  
const fs = require('fs');  
const path = require('path');  

const app = express();  
const PORT = 3000;  

app.get('/', (req, res) => {
    res.redirect('/tasks');
  });
  

app.set('view engine', 'ejs');  
app.use(express.static(path.join(__dirname, 'public')));  
app.use(bodyParser.urlencoded({ extended: true }));  

 
app.use((req, res, next) => {  
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);  
  next();  
});  

 
app.get('/tasks', (req, res) => {
    fs.readFile('./tasks.json', 'utf8', (err, data) => {
      if (err) return res.status(500).send('Error reading tasks');
      const tasks = JSON.parse(data);
      res.render('tasks', { tasks });
    });
  });

app.get('/task', (req, res) => {  
  const taskId = req.query.id;  
  fs.readFile('./tasks.json', 'utf8', (err, data) => {  
    if (err) throw err;  
    const tasks = JSON.parse(data);  
    const task = tasks.find(t => t.id == taskId);  
    res.render('task', { task });  
  });  
});  

app.get('/add-task', (req, res) => {  
  res.render('addTask');  
});  

app.post('/add-task', (req, res) => {  
  const newTask = { id: Date.now(), title: req.body.title, completed: false };  
  fs.readFile('./tasks.json', 'utf8', (err, data) => {  
    if (err) throw err;  
    const tasks = JSON.parse(data);  
    tasks.push(newTask);  
    fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2), err => {  
      if (err) throw err;  
      res.redirect('/tasks');  
    });  
  });  
});  

app.post('/update-task', (req, res) => {
    const taskId = parseInt(req.query.id);
    const { completed } = req.body;
  
    fs.readFile('./tasks.json', 'utf8', (err, data) => {
      if (err) return res.status(500).send('Error reading file');
  
      let tasks = JSON.parse(data);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
  
      if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
  
        fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2), (err) => {
          if (err) return res.status(500).send('Error writing file');
          res.json({ success: true });
        });
      } else {
        res.status(404).send('Task not found');
      }
    });
  });

  app.post('/update-task', (req, res) => {
    const taskId = parseInt(req.body.id);
    const completed = req.body.completed === 'true';
  
    fs.readFile('./tasks.json', 'utf8', (err, data) => {
      if (err) return res.status(500).send('Error reading tasks');
  
      let tasks = JSON.parse(data);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
  
      if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
  
        fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2), (err) => {
          if (err) return res.status(500).send('Error updating task');
          res.redirect('/tasks'); // Redirect back to tasks after updating
        });
      } else {
        res.status(404).send('Task not found');
      }
    });
  });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));  
