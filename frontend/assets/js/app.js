const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const flash = (msg, type = 'success') => {
  const box = qs('.flash');
  if (!box) return;
  box.textContent = msg;
  box.classList.add('alert');
  box.dataset.type = type;
};

const store = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }
};

const validators = {
  email(value) { return /\S+@\S+\.\S+/.test(value); },
  phone(value) { return /^\d{10}$/.test(value); },
  password(value) { return value.length >= 6; }
};

const registerForm = qs('#registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: qs('#fullName').value.trim(),
      email: qs('#email').value.trim(),
      password: qs('#password').value.trim(),
      phone: qs('#phone').value.trim(),
      age: qs('#age').value.trim(),
      gender: qs('#gender').value
    };

    const errors = [];
    if (!data.name) errors.push('Full name is required.');
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

    const users = store.get('hms_users', []);
    users.push(data);
    store.set('hms_users', users);
    flash('Registration successful. You can login now.');
    registerForm.reset();
  });
}

const loginForm = qs('#loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = qs('#loginRole') ? qs('#loginRole').value : 'patient';
    const email = qs('#loginEmail').value.trim();
    const password = qs('#loginPassword').value.trim();
    if (role === 'admin') {
      if (email === 'admin@medilane.com' && password === 'admin123') {
        store.set('hms_admin_session', { email, role: 'admin' });
        window.location.href = '../pages/admin.html';
      } else {
        flash('Invalid admin credentials.', 'error');
      }
      return;
    }

    const users = store.get('hms_users', []);
    const match = users.find(u => u.email === email && u.password === password);
    if (match) {
      store.set('hms_session', { ...match, role: 'patient' });
      window.location.href = '../pages/dashboard.html';
    } else {
      flash('Invalid credentials. Try again.', 'error');
    }
  });
}

const adminLoginForm = qs('#adminLoginForm');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = qs('#adminEmail').value.trim();
    const password = qs('#adminPassword').value.trim();
    if (email === 'admin@medilane.com' && password === 'admin123') {
      store.set('hms_admin_session', { email, role: 'admin' });
      window.location.href = '../pages/admin.html';
    } else {
      flash('Invalid admin credentials.', 'error');
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
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  if (service) {
    qs('#doctor').value = service;
  }
  const session = store.get('hms_session', null);
  if (!session || session.role !== 'patient') {
    window.location.href = '../pages/login.html';
  } else {
    if (qs('#patientName') && !qs('#patientName').value) {
      qs('#patientName').value = session.name || '';
    }
    if (qs('#patientPhone') && !qs('#patientPhone').value) {
      qs('#patientPhone').value = session.phone || '';
    }
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const appointmentId = Date.now();
    const booking = {
      id: appointmentId,
      email: session ? session.email : '',
      name: qs('#patientName').value.trim(),
      age: qs('#patientAge').value.trim(),
      phone: qs('#patientPhone').value.trim(),
      doctor: qs('#doctor').value,
      problem: qs('#problem').value.trim(),
      date: qs('#date').value,
      status: 'PENDING'
    };

    const errors = [];
    if (!booking.name) errors.push('Patient name required.');
    if (!booking.age || Number(booking.age) < 1) errors.push('Valid age required.');
    if (!validators.phone(booking.phone)) errors.push('Phone must be 10 digits.');
    if (!booking.doctor) errors.push('Select doctor.');
    if (!booking.problem) errors.push('Describe health problem.');
    if (!booking.date) errors.push('Choose appointment date.');

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

    const appointments = store.get('hms_appointments', []);
    appointments.push(booking);
    store.set('hms_appointments', appointments);
    store.set('hms_last_appointment', appointmentId);
    window.location.href = '../pages/payment.html';
  });
}

const paymentForm = qs('#paymentForm');
if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const method = qs('input[name="paymentMethod"]:checked');
    if (!method) {
      flash('Select a payment method to continue.', 'error');
      return;
    }
    const lastId = store.get('hms_last_appointment', null);
    if (lastId) {
      const appointments = store.get('hms_appointments', []);
      const idx = appointments.findIndex(a => a.id === lastId);
      if (idx !== -1) {
        appointments[idx].status = 'AWAITING_ADMIN';
        store.set('hms_appointments', appointments);
      }
    }
    const payments = store.get('hms_payments', []);
    payments.push({ method: method.value, date: new Date().toISOString() });
    store.set('hms_payments', payments);
    flash('Payment successful. Waiting for admin approval.');
    paymentForm.reset();
  });
}

const adminAppointments = qs('#adminAppointments');
if (adminAppointments) {
  const doctorImages = {
    'Full Body Checkup': '../assets/img/doctor-body.svg',
    'General Physician': '../assets/img/doctor-general.svg',
    'Heart Specialist': '../assets/img/doctor-heart.svg',
    'Orthopedic Doctor': '../assets/img/doctor-ortho.svg',
    'Skin Specialist': '../assets/img/doctor-skin.svg',
    'Eye Specialist': '../assets/img/doctor-eye.svg'
  };

  const renderAdminAppointments = () => {
    const appointments = store.get('hms_appointments', []);
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
      const img = doctorImages[a.doctor] || '../assets/img/doctor-general.svg';
      row.innerHTML = `
        <td>${idx + 1}</td>
        <td>${a.name}</td>
        <td>${a.phone}</td>
        <td>${a.doctor}</td>
        <td>${a.problem}</td>
        <td><img src="${img}" alt="${a.doctor}" style="width:48px;height:48px;border-radius:12px;"></td>
        <td><span class="badge">${a.status || 'PENDING'}</span></td>
        <td>
          <button class="btn btn-outline" type="button" data-action="accept" data-id="${a.id}">Accept</button>
          <button class="btn btn-outline" type="button" data-action="reject" data-id="${a.id}">Reject</button>
          <button class="btn btn-outline" type="button" data-action="delete" data-id="${a.id}">Delete</button>
        </td>
      `;
      body.appendChild(row);
    });
  };

  adminAppointments.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);
    const appointments = store.get('hms_appointments', []);
    const idx = appointments.findIndex(a => a.id === id);
    if (idx === -1) return;
    if (action === 'delete') {
      appointments.splice(idx, 1);
      const lastId = store.get('hms_last_appointment', null);
      if (lastId === id) {
        store.set('hms_last_appointment', null);
      }
      store.set('hms_appointments', appointments);
    } else {
      appointments[idx].status = action === 'accept' ? 'CONFIRMED' : 'REJECTED';
      store.set('hms_appointments', appointments);
    }
    renderAdminAppointments();
  });

  renderAdminAppointments();
}

const adminPatients = qs('#adminPatients');
if (adminPatients) {
  const users = store.get('hms_users', []);
  const body = adminPatients.querySelector('tbody');
  body.innerHTML = '';
  if (!users.length) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="6">No patients registered yet.</td>';
    body.appendChild(row);
  } else {
    users.forEach((u, idx) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${idx + 1}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.phone}</td>
        <td>${u.age}</td>
        <td>${u.gender}</td>
      `;
      body.appendChild(row);
    });
  }
}

const patientAppointments = qs('#patientAppointments');
if (patientAppointments) {
  const session = store.get('hms_session', null);
  const appointments = store.get('hms_appointments', []);
  const body = patientAppointments.querySelector('tbody');
  body.innerHTML = '';
  const mine = session ? appointments.filter(a => a.email === session.email) : [];
  if (!mine.length) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4">No appointments yet. Book one to see status.</td>';
    body.appendChild(row);
  } else {
    mine
      .slice()
      .reverse()
      .forEach((a, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${idx + 1}</td>
          <td>${a.doctor}</td>
          <td>${a.date}</td>
          <td><span class="badge">${a.status || 'PENDING'}</span></td>
        `;
        body.appendChild(row);
      });
  }
}

// Simple role-based access (frontend demo)
const roleGuards = () => {
  const page = document.body.dataset.page;
  if (!page) return;

  if (page === 'dashboard') {
    const session = store.get('hms_session', null);
    if (!session || session.role !== 'patient') {
      window.location.href = '../pages/login.html';
    }
  }

  if (page === 'admin') {
    const adminSession = store.get('hms_admin_session', null);
    if (!adminSession || adminSession.role !== 'admin') {
      window.location.href = '../pages/login.html';
    }
  }
};

roleGuards();

const logoutButtons = qsa('[data-logout]');
logoutButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('hms_session');
    localStorage.removeItem('hms_admin_session');
    window.location.href = '../pages/login.html';
  });
});
