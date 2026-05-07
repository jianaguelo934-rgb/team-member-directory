const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const AuthController = {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ message: 'All fields are required.' });

      const existing = await UserModel.findByEmail(email);
      if (existing)
        return res.status(409).json({ message: 'Email already registered.' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ name, email, password: hashedPassword });

      const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Server error during signup.' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: 'Email and password are required.' });

      const user = await UserModel.findByEmail(email);
      if (!user)
        return res.status(401).json({ message: 'Invalid credentials.' });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ message: 'Invalid credentials.' });

      const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Server error during login.' });
    }
  },

  async me(req, res) {
    res.json({ user: req.user });
  }
};

module.exports = AuthController;
