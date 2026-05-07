const Members = (() => {
  let allMembers = [];
  let editingId  = null;

  // ── Department badge color ──
  const DEPT_CLASSES = {
    engineering: 'dept-engineering', design: 'dept-design', product: 'dept-product',
    analytics: 'dept-analytics', marketing: 'dept-marketing', hr: 'dept-hr',
    finance: 'dept-finance', operations: 'dept-operations'
  };
  function deptClass(dept) {
    return DEPT_CLASSES[(dept || '').toLowerCase()] || 'dept-default';
  }

  // ── Animated counter ──
  function animateCount(el, target) {
    const duration = 600;
    const start = performance.now();
    const from = parseInt(el.textContent) || 0;
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (target - from) * ease);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── Toast ──
  function showToast(msg, type = 'success') {
    const icons = {
      success: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      error:   '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'
    };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">${icons[type] || icons.success}</svg><span>${msg}</span>`;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 3200);
  }

  function openModal(id)  { document.getElementById(id).classList.add('open'); }
  function closeModal(id) { document.getElementById(id).classList.remove('open'); }

  // ── Skeleton ──
  function renderSkeletons() {
    document.getElementById('members-grid').innerHTML = Array(6).fill().map(() => `
      <div class="skeleton-card">
        <div class="skeleton skeleton-avatar"></div>
        <div class="skeleton skeleton-line w-80"></div>
        <div class="skeleton skeleton-line w-60"></div>
        <div class="skeleton skeleton-line w-40"></div>
        <div class="skeleton skeleton-line w-100"></div>
      </div>`).join('');
    document.getElementById('members-list').innerHTML = '';
  }

  // ── Stats ──
  function updateStats() {
    const total    = allMembers.length;
    const active   = allMembers.filter(m => m.status === 'active').length;
    const inactive = total - active;
    const depts    = new Set(allMembers.map(m => m.department)).size;

    animateCount(document.getElementById('stat-total'),    total);
    animateCount(document.getElementById('stat-active'),   active);
    animateCount(document.getElementById('stat-inactive'), inactive);
    animateCount(document.getElementById('stat-depts'),    depts);

    const deptFilter = document.getElementById('dept-filter');
    const cur = deptFilter.value;
    deptFilter.innerHTML = '<option value="">All Departments</option>' +
      [...new Set(allMembers.map(m => m.department))].sort().map(d => `<option value="${d}">${d}</option>`).join('');
    deptFilter.value = cur;
  }

  // ── Render ──
  function renderMembers(members) {
    const grid  = document.getElementById('members-grid');
    const list  = document.getElementById('members-list');
    const empty = document.getElementById('empty-state');

    if (!members.length) {
      grid.innerHTML = ''; list.innerHTML = '';
      empty.style.display = 'block'; return;
    }
    empty.style.display = 'none';

    grid.innerHTML = members.map(m => `
      <div class="member-card" data-id="${m.id}">
        <div class="card-actions">
          <button class="btn-icon" data-action="edit" data-id="${m.id}" title="Edit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon danger" data-action="delete" data-id="${m.id}" title="Delete">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
        <img src="${m.avatar}" alt="${m.name}" class="member-avatar" />
        <span class="dept-badge ${deptClass(m.department)}">${m.department}</span>
        <div class="member-name">${m.name}</div>
        <div class="member-role">${m.role}</div>
        <div class="member-contact">
          <span><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>${m.email}</span>
          ${m.phone ? `<span><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>${m.phone}</span>` : ''}
        </div>
        <span class="status-badge ${m.status}"><span class="status-dot"></span>${m.status}</span>
      </div>`).join('');

    list.innerHTML = members.map(m => `
      <div class="list-item" data-id="${m.id}">
        <img src="${m.avatar}" alt="${m.name}" class="list-avatar" />
        <div class="list-info">
          <div class="list-name">${m.name}</div>
          <div class="list-meta">
            <span>${m.role}</span>
            <span>•</span>
            <span class="dept-badge ${deptClass(m.department)}" style="margin:0;">${m.department}</span>
            <span class="status-badge ${m.status}" style="margin:0;"><span class="status-dot"></span>${m.status}</span>
          </div>
        </div>
        <div class="list-actions">
          <button class="btn-icon" data-action="edit" data-id="${m.id}" title="Edit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon danger" data-action="delete" data-id="${m.id}" title="Delete">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>`).join('');

    document.querySelectorAll('[data-action="edit"]').forEach(btn => btn.addEventListener('click', (e) => {
      e.stopPropagation(); openEditModal(btn.dataset.id);
    }));
    document.querySelectorAll('[data-action="delete"]').forEach(btn => btn.addEventListener('click', (e) => {
      e.stopPropagation(); openDeleteModal(btn.dataset.id);
    }));
    document.querySelectorAll('.member-card, .list-item').forEach(card =>
      card.addEventListener('click', () => openDetailModal(card.dataset.id))
    );
  }

  function filterMembers() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const dept   = document.getElementById('dept-filter').value;
    const status = document.getElementById('status-filter').value;
    renderMembers(allMembers.filter(m =>
      (!search || m.name.toLowerCase().includes(search) || m.role.toLowerCase().includes(search) || m.department.toLowerCase().includes(search)) &&
      (!dept   || m.department === dept) &&
      (!status || m.status === status)
    ));
  }

  // ── Detail Modal ──
  function openDetailModal(id) {
    const m = allMembers.find(x => x.id === id);
    if (!m) return;
    document.getElementById('detail-modal-body').innerHTML = `
      <div class="detail-header">
        <img src="${m.avatar}" alt="${m.name}" class="detail-avatar" />
        <div class="detail-info">
          <h3>${m.name}</h3>
          <p>${m.role}</p>
          <span class="dept-badge ${deptClass(m.department)}" style="margin-top:.4rem;">${m.department}</span>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-field"><label>Email</label><span>${m.email}</span></div>
        <div class="detail-field"><label>Phone</label><span>${m.phone || 'N/A'}</span></div>
        <div class="detail-field"><label>Status</label><span class="status-badge ${m.status}"><span class="status-dot"></span>${m.status}</span></div>
        <div class="detail-field"><label>Joined</label><span>${new Date(m.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</span></div>
      </div>`;
    document.getElementById('detail-edit-btn').onclick = () => { closeModal('detail-modal'); openEditModal(id); };
    openModal('detail-modal');
  }

  // ── Avatar upload ──
  function initAvatarUpload() {
    const fileInput   = document.getElementById('m-avatar-file');
    const preview     = document.getElementById('avatar-preview');
    const previewImg  = document.getElementById('avatar-preview-img');
    const placeholder = document.getElementById('avatar-placeholder');
    const urlInput    = document.getElementById('m-avatar');

    preview.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { showToast('Larawan ay dapat wala pang 2MB.', 'error'); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
        placeholder.style.display = 'none';
        urlInput.value = '';
      };
      reader.readAsDataURL(file);
    });

    urlInput.addEventListener('input', () => {
      const url = urlInput.value.trim();
      if (url) {
        previewImg.src = url;
        previewImg.style.display = 'block';
        placeholder.style.display = 'none';
        fileInput.value = '';
      } else {
        resetAvatarPreview();
      }
    });
  }

  function resetAvatarPreview() {
    const previewImg  = document.getElementById('avatar-preview-img');
    const placeholder = document.getElementById('avatar-placeholder');
    previewImg.src = '';
    previewImg.style.display = 'none';
    placeholder.style.display = 'flex';
    document.getElementById('m-avatar-file').value = '';
  }

  function setAvatarPreview(src) {
    const previewImg  = document.getElementById('avatar-preview-img');
    const placeholder = document.getElementById('avatar-placeholder');
    if (src) {
      previewImg.src = src;
      previewImg.style.display = 'block';
      placeholder.style.display = 'none';
    } else {
      resetAvatarPreview();
    }
  }

  function getAvatarValue(name) {
    const fileInput  = document.getElementById('m-avatar-file');
    const urlInput   = document.getElementById('m-avatar');
    const previewImg = document.getElementById('avatar-preview-img');
    if (fileInput.files[0] && previewImg.src.startsWith('data:')) return previewImg.src;
    if (urlInput.value.trim()) return urlInput.value.trim();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`;
  }

  // ── Add/Edit Modal ──
  function openAddModal() {
    editingId = null;
    document.getElementById('member-modal-title').textContent = 'Magdagdag ng Miyembro';
    document.getElementById('member-form').reset();
    document.getElementById('member-id').value = '';
    resetAvatarPreview();
    document.querySelectorAll('#member-modal .form-group').forEach(g => g.classList.remove('has-error'));
    document.getElementById('member-form-alert').classList.remove('show');
    openModal('member-modal');
  }

  function openEditModal(id) {
    const m = allMembers.find(x => x.id === id);
    if (!m) return;
    editingId = id;
    document.getElementById('member-modal-title').textContent = 'I-edit ang Miyembro';
    document.getElementById('member-id').value      = m.id;
    document.getElementById('m-name').value         = m.name;
    document.getElementById('m-email').value        = m.email;
    document.getElementById('m-role').value         = m.role;
    document.getElementById('m-department').value   = m.department;
    document.getElementById('m-phone').value        = m.phone || '';
    document.getElementById('m-status').value       = m.status;
    document.getElementById('m-avatar').value       = m.avatar || '';
    setAvatarPreview(m.avatar);
    document.querySelectorAll('#member-modal .form-group').forEach(g => g.classList.remove('has-error'));
    document.getElementById('member-form-alert').classList.remove('show');
    openModal('member-modal');
  }

  function openDeleteModal(id) {
    const m = allMembers.find(x => x.id === id);
    if (!m) return;
    document.getElementById('confirm-member-name').textContent = m.name;
    document.getElementById('confirm-delete-btn').onclick = () => deleteMember(id);
    openModal('confirm-modal');
  }

  // ── Save ──
  async function saveMember() {
    const name       = document.getElementById('m-name').value.trim();
    const email      = document.getElementById('m-email').value.trim();
    const role       = document.getElementById('m-role').value.trim();
    const department = document.getElementById('m-department').value.trim();
    const phone      = document.getElementById('m-phone').value.trim();
    const status     = document.getElementById('m-status').value;

    if (!name || !email || !/\S+@\S+\.\S+/.test(email) || !role || !department) {
      document.getElementById('member-form-alert').textContent = 'Please fill all required fields correctly.';
      document.getElementById('member-form-alert').classList.add('show');
      return;
    }
    const data = {
      name, email, role, department, phone, status,
      avatar: getAvatarValue(name)
    };
    try {
      if (editingId) {
        await api.members.update(editingId, data);
        showToast('Member updated successfully');
      } else {
        await api.members.create(data);
        showToast('Member added successfully');
      }
      closeModal('member-modal');
      await loadMembers();
    } catch (err) {
      document.getElementById('member-form-alert').textContent = err.message;
      document.getElementById('member-form-alert').classList.add('show');
    }
  }

  // ── Delete ──
  async function deleteMember(id) {
    try {
      await api.members.remove(id);
      closeModal('confirm-modal');
      showToast('Member deleted successfully');
      await loadMembers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // ── Load ──
  async function loadMembers() {
    renderSkeletons();
    try {
      allMembers = await api.members.getAll();
      updateStats();
      filterMembers();
    } catch (err) {
      if (/token|denied/i.test(err.message)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        location.reload();
      } else {
        showToast(err.message, 'error');
      }
    }
  }

  // ── Init ──
  function init() {
    initAvatarUpload();
    document.getElementById('add-member-btn').addEventListener('click', openAddModal);
    document.getElementById('save-member-btn').addEventListener('click', saveMember);
    document.getElementById('search-input').addEventListener('input', filterMembers);
    document.getElementById('dept-filter').addEventListener('change', filterMembers);
    document.getElementById('status-filter').addEventListener('change', filterMembers);

    document.getElementById('grid-view-btn').addEventListener('click', () => {
      document.getElementById('grid-view-btn').classList.add('active');
      document.getElementById('list-view-btn').classList.remove('active');
      document.getElementById('members-grid').classList.remove('hidden');
      document.getElementById('members-list').classList.remove('visible');
    });
    document.getElementById('list-view-btn').addEventListener('click', () => {
      document.getElementById('list-view-btn').classList.add('active');
      document.getElementById('grid-view-btn').classList.remove('active');
      document.getElementById('members-grid').classList.add('hidden');
      document.getElementById('members-list').classList.add('visible');
    });

    document.querySelectorAll('[data-close]').forEach(btn =>
      btn.addEventListener('click', () => closeModal(btn.dataset.close))
    );
    document.querySelectorAll('.modal-overlay').forEach(overlay =>
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay.id); })
    );

    loadMembers();
  }

  return { init };
})();
