const db = require('../config/db');
const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending')
});

exports.createTask = (req, res) => {
  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { title, description, status } = value;
  const userId = req.user.id;

  db.run(
    `INSERT INTO tasks (title, description, status, createdBy) VALUES (?, ?, ?, ?)`,
    [title, description, status, userId],
    function(err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      db.get(`SELECT * FROM tasks WHERE id = ?`, [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error' });
        res.status(201).json(row);
      });
    }
  );
};

exports.getTasks = (req, res) => {
  // optional query params: page, limit, q (search), status
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const offset = (page - 1) * limit;
  const q = req.query.q ? `%${req.query.q}%` : null;
  const status = req.query.status || null;

  if (req.user.role === 'admin') {
    // admin sees all tasks
    let base = `SELECT * FROM tasks`;
    const filters = [];
    const params = [];

    if (q) { filters.push(`(title LIKE ? OR description LIKE ?)`); params.push(q, q); }
    if (status) { filters.push(`status = ?`); params.push(status); }

    if (filters.length) base += ' WHERE ' + filters.join(' AND ');
    base += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.all(base, params, (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ page, limit, data: rows });
    });
  } else {
    // user: only own tasks
    let base = `SELECT * FROM tasks WHERE createdBy = ?`;
    const params = [req.user.id];
    if (q) { base += ' AND (title LIKE ? OR description LIKE ?)'; params.push(q, q); }
    if (status) { base += ' AND status = ?'; params.push(status); }
    base += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.all(base, params, (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ page, limit, data: rows });
    });
  }
};

exports.getTaskById = (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, task) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'admin' && task.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  });
};

exports.updateTask = (req, res) => {
  const id = req.params.id;
  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, task) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'admin' && task.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    db.run(
      `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`,
      [value.title, value.description, value.status, id],
      function(err2) {
        if (err2) return res.status(500).json({ message: 'DB error' });
        db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (e, row) => {
          if (e) return res.status(500).json({ message: 'DB error' });
          res.json(row);
        });
      }
    );
  });
};

exports.deleteTask = (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, task) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'admin' && task.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    db.run(`DELETE FROM tasks WHERE id = ?`, [id], function(deleteErr) {
      if (deleteErr) return res.status(500).json({ message: 'DB error' });
      res.json({ message: 'Task deleted' });
    });
  });
};
