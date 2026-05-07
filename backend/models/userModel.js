const axios = require('axios');
const BASE = process.env.JSON_SERVER_URL;

const UserModel = {
  async findByEmail(email) {
    const res = await axios.get(`${BASE}/users?email=${encodeURIComponent(email)}`);
    return res.data[0] || null;
  },

  async findById(id) {
    const res = await axios.get(`${BASE}/users/${id}`);
    return res.data;
  },

  async create(userData) {
    const res = await axios.post(`${BASE}/users`, userData);
    return res.data;
  }
};

module.exports = UserModel;
