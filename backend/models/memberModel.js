const axios = require('axios');
const BASE = process.env.JSON_SERVER_URL;

const MemberModel = {
  async getAll() {
    const res = await axios.get(`${BASE}/members`);
    return res.data;
  },

  async getById(id) {
    const res = await axios.get(`${BASE}/members/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await axios.post(`${BASE}/members`, data);
    return res.data;
  },

  async update(id, data) {
    const res = await axios.put(`${BASE}/members/${id}`, data);
    return res.data;
  },

  async patch(id, data) {
    const res = await axios.patch(`${BASE}/members/${id}`, data);
    return res.data;
  },

  async remove(id) {
    const res = await axios.delete(`${BASE}/members/${id}`);
    return res.data;
  }
};

module.exports = MemberModel;
