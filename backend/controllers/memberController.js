const MemberModel = require('../models/memberModel');

const MemberController = {
  async getAll(req, res) {
    try {
      const members = await MemberModel.getAll();
      res.json(members);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch members.' });
    }
  },

  async getOne(req, res) {
    try {
      const member = await MemberModel.getById(req.params.id);
      res.json(member);
    } catch (err) {
      res.status(404).json({ message: 'Member not found.' });
    }
  },

  async create(req, res) {
    try {
      const { name, role, department, email, phone, avatar, status } = req.body;
      if (!name || !role || !department || !email)
        return res.status(400).json({ message: 'Name, role, department, and email are required.' });

      const member = await MemberModel.create({
        name, role, department, email,
        phone: phone || '',
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`,
        status: status || 'active',
        createdAt: new Date().toISOString()
      });
      res.status(201).json(member);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create member.' });
    }
  },

  async update(req, res) {
    try {
      const member = await MemberModel.update(req.params.id, req.body);
      res.json(member);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update member.' });
    }
  },

  async remove(req, res) {
    try {
      await MemberModel.remove(req.params.id);
      res.json({ message: 'Member deleted successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete member.' });
    }
  }
};

module.exports = MemberController;
