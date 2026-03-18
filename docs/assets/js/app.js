const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const API_BASE = 'http://localhost:8080';

const apiFetch = async (path, options = {}) => {
  const headers = options.headers || {};
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

const flash = (msg, type = 'success') => {
  const box = qs('.flash');
  if (!box) return;
  box.textContent = msg;
  box.classList.add('alert');
  box.dataset.type = type;
};

const validators = {
  email(value) { return /\S+@\S+\.\S+/.test(value); },
  phone(value) { return /^\d{10}$/.test(value); },
  password(value) { return value.length >= 6; }
};

const registerForm = qs('#registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      fullName: qs('#fullName').value.trim(),
      email: qs('#email').value.trim(),
      password: qs('#password').value.trim(),
      phone: qs('#phone').value.trim(),
      age: Number(qs('#age').value.trim()),
      gender: qs('#gender').value
    };

    const errors = [];
    if (!data.fullName) errors.push('Full name is required.');
    if (!validators.email(data.email)) errors.push('Enter a valid email.');
    if (!validators.password(data.password)) errors.push('Password must be at least 6 characters.');
    if (!validators.phone(data.phone)) errors.push('Phone must be 10 digits.');
    if (!data.age || Number(data.age) < 1) errors.push('Enter a valid age.');
    if (!data.gender) errors.push('Select gender.');

    const errorBox = qs('#formErrors');
    errorBox.innerHTML = '';
    if (errors.length) {
      errors.forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;
        errorBox.appendChild(li);
      });
      return;
    }

    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      flash('Registration successful. You can login now.');
      registerForm.reset();
    } catch (err) {
      flash(err.message, 'error');
    }
  });
}

const loginForm = qs('#loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const role = qs('#loginRole') ? qs('#loginRole').value : 'patient';
    const payload = {
      role,
      email: qs('#loginEmail').value.trim(),
      password: qs('#loginPassword').value.trim()
    };

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.role === 'ADMIN') {
        window.location.href = '../pages/admin.html';
      } else {
        window.location.href = '../pages/dashboard.html';
      }
    } catch (err) {
      flash(err.message, 'error');
    }
  });
}

const adminLoginForm = qs('#adminLoginForm');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      role: 'admin',
      email: qs('#adminEmail').value.trim(),
      password: qs('#adminPassword').value.trim()
    };

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.role === 'ADMIN') {
        window.location.href = '../pages/admin.html';
      }
    } catch (err) {
      flash(err.message, 'error');
    }
  });
}

const serviceButtons = qsa('[data-service]');
serviceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const service = btn.dataset.service;
    window.location.href = `booking.html?service=${encodeURIComponent(service)}`;
  });
});

const bookingForm = qs('#bookingForm');
if (bookingForm) {
  const doctorSelect = qs('#doctor');
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');

  const loadDoctors = async () => {
    const doctors = await apiFetch('/api/doctors');
    doctorSelect.innerHTML = '<option value="">Choose service</option>';
    doctors.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = `${doc.specialty} - ${doc.name}`;
      option.dataset.specialty = doc.specialty;
      doctorSelect.appendChild(option);
    });

    if (service) {
      const match = Array.from(doctorSelect.options)
        .find(opt => opt.dataset.specialty === service);
      if (match) {
        doctorSelect.value = match.value;
      }
    }
  };

  loadDoctors().catch(err => flash(err.message, 'error'));

  apiFetch('/api/auth/me')
    .then(me => {
      if (me.fullName && qs('#patientName')) qs('#patientName').value = me.fullName;
      if (me.phone && qs('#patientPhone')) qs('#patientPhone').value = me.phone;
      if (me.age && qs('#patientAge')) qs('#patientAge').value = me.age;
    })
    .catch(() => {});

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const booking = {
      doctorId: Number(doctorSelect.value),
      problemDescription: qs('#problem').value.trim(),
      appointmentDate: qs('#date').value
    };

    const errors = [];
    if (!booking.doctorId) errors.push('Select doctor.');
    if (!booking.problemDescription) errors.push('Describe health problem.');
    if (!booking.appointmentDate) errors.push('Choose appointment date.');

    const errorBox = qs('#bookingErrors');
    errorBox.innerHTML = '';
    if (errors.length) {
      errors.forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;
        errorBox.appendChild(li);
      });
      return;
    }

    try {
      const res = await apiFetch('/api/patient/appointments', {
        method: 'POST',
        body: JSON.stringify(booking)
      });
      sessionStorage.setItem('hms_last_appointment_id', String(res.id));
      window.location.href = '../pages/payment.html';
    } catch (err) {
      flash(err.message, 'error');
    }
  });
}

const paymentForm = qs('#paymentForm');
if (paymentForm) {
  paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const method = qs('input[name="paymentMethod"]:checked');
    const amount = qs('#amount') ? qs('#amount').value.trim() : '';
    if (!method) {
      flash('Select a payment method to continue.', 'error');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      flash('Enter a valid amount.', 'error');
      return;
    }

    const lastId = sessionStorage.getItem('hms_last_appointment_id');
    if (!lastId) {
      flash('No appointment found to pay for.', 'error');
      return;
    }

    try {
      await apiFetch('/api/patient/payments', {
        method: 'POST',
        body: JSON.stringify({
          appointmentId: Number(lastId),
          amount: Number(amount),
          method: method.value
        })
      });
      flash('Payment successful. Waiting for admin approval.');
      paymentForm.reset();
    } catch (err) {
      flash(err.message, 'error');
    }
  });
}

const adminAppointments = qs('#adminAppointments');
if (adminAppointments) {
  const renderAdminAppointments = (appointments) => {
    const body = adminAppointments.querySelector('tbody');
    body.innerHTML = '';
    if (!appointments.length) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="8">No appointments yet.</td>';
      body.appendChild(row);
      return;
    }

    appointments.forEach((a, idx) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${idx + 1}</td>
        <td>${a.user?.fullName || '-'}</td>
        <td>${a.user?.phone || '-'}</td>
        <td>${a.doctor?.specialty || '-'}</td>
        <td>${a.problemDescription || '-'}</td>
        <td><span class="badge">${a.status || 'PENDING'}</span></td>
        <td>${a.appointmentDate || '-'}</td>
        <td>
          <button class="btn btn-outline" type="button" data-action="accept" data-id="${a.id}">Accept</button>
          <button class="btn btn-outline" type="button" data-action="reject" data-id="${a.id}">Reject</button>
          <button class="btn btn-outline" type="button" data-action="delete" data-id="${a.id}">Delete</button>
        </td>
      `;
      body.appendChild(row);
    });
  };

  const loadAdminAppointments = async () => {
    const appointments = await apiFetch('/api/admin/appointments');
    renderAdminAppointments(appointments);
  };

  adminAppointments.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);
    try {
      if (action === 'delete') {
        await apiFetch(`/api/admin/appointments/${id}`, { method: 'DELETE' });
      } else {
        const status = action === 'accept' ? 'CONFIRMED' : 'REJECTED';
        await apiFetch(`/api/admin/appointments/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status })
        });
      }
      await loadAdminAppointments();
    } catch (err) {
      flash(err.message, 'error');
    }
  });

  loadAdminAppointments().catch(err => flash(err.message, 'error'));
}

const adminPatients = qs('#adminPatients');
if (adminPatients) {
  const loadPatients = async () => {
    const users = await apiFetch('/api/admin/patients');
    const body = adminPatients.querySelector('tbody');
    body.innerHTML = '';
    if (!users.length) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="6">No patients registered yet.</td>';
      body.appendChild(row);
      return;
    }
    users.forEach((u, idx) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${idx + 1}</td>
        <td>${u.fullName}</td>
        <td>${u.email}</td>
        <td>${u.phone}</td>
        <td>${u.age}</td>
        <td>${u.gender}</td>
      `;
      body.appendChild(row);
    });
  };

  loadPatients().catch(err => flash(err.message, 'error'));
}

const patientAppointments = qs('#patientAppointments');
if (patientAppointments) {
  const loadMyAppointments = async () => {
    const appointments = await apiFetch('/api/patient/appointments');
    const body = patientAppointments.querySelector('tbody');
    body.innerHTML = '';
    if (!appointments.length) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="4">No appointments yet. Book one to see status.</td>';
      body.appendChild(row);
      return;
    }
    appointments.forEach((a, idx) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${idx + 1}</td>
        <td>${a.doctor?.specialty || '-'}</td>
        <td>${a.appointmentDate || '-'}</td>
        <td><span class="badge">${a.status || 'PENDING'}</span></td>
      `;
      body.appendChild(row);
    });
  };

  loadMyAppointments().catch(err => flash(err.message, 'error'));
}

const roleGuards = async () => {
  const page = document.body.dataset.page;
  if (!page) return;

  try {
    const me = await apiFetch('/api/auth/me');
    if (page === 'dashboard' || page === 'booking' || page === 'payment') {
      if (me.role !== 'PATIENT') {
        window.location.href = '../pages/login.html';
      }
    }
    if (page === 'admin') {
      if (me.role !== 'ADMIN') {
        window.location.href = '../pages/login.html';
      }
    }
  } catch {
    if (page !== 'login' && page !== 'register') {
      window.location.href = '../pages/login.html';
    }
  }
};

roleGuards();

const logoutButtons = qsa('[data-logout]');
logoutButtons.forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '../pages/login.html';
    }
  });
});
