const BASE_URL = '/api';

const api = {
  getToken() {
    return localStorage.getItem('token');
  },

  headers(auth = true) {
    const h = { 'Content-Type': 'application/json' };
    if (auth) h['Authorization'] = `Bearer ${this.getToken()}`;
    return h;
  },

  async request(method, path, body = null, auth = true) {
    const opts = { method, headers: this.headers(auth) };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${BASE_URL}${path}`, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },

  get: (path, auth) => api.request('GET', path, null, auth),
  post: (path, body, auth) => api.request('POST', path, body, auth),
  put: (path, body) => api.request('PUT', path, body),
  delete: (path) => api.request('DELETE', path),

  auth: {
    login: (body) => api.post('/auth/login', body, false),
    signup: (body) => api.post('/auth/signup', body, false),
    me: () => api.get('/auth/me'),
  },

  members: {
    getAll: () => api.get('/members'),
    getOne: (id) => api.get(`/members/${id}`),
    create: (body) => api.post('/members', body),
    update: (id, body) => api.put(`/members/${id}`, body),
    remove: (id) => api.delete(`/members/${id}`),
  }
};
