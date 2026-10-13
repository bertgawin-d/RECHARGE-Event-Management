/* =========================================================
   RECHARGE — script.js
   Frontend-only demo. All data lives in LocalStorage.
   NOTE: This is NOT secure authentication. Passwords are kept
   in the browser only to simulate accounts for an academic demo.
   ========================================================= */
'use strict';

/* ---------- 1. Sample event data ---------- */
const EVENTS = [
  {
    id: 'codefest',
    title: 'CodeFest',
    category: 'Coding',
    date: '2026-11-06',
    time: '10:00 AM',
    venue: 'CS Block, Lab 3',
    organizer: 'Coding Club',
    seats: 120,
    icon: '💻',
    accent: '#2f8bff',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
    description: 'A three-round competitive coding contest testing logic, speed and problem solving.',
    details: 'Solve algorithmic challenges across three timed rounds. Individual participation, any language allowed. Top three coders win cash prizes and internship referrals.'
  },
  {
    id: 'hack-the-future',
    title: 'Hack the Future',
    category: 'Hackathon',
    date: '2026-11-14',
    time: '9:00 AM',
    venue: 'Innovation Hub',
    organizer: 'IEEE Student Branch',
    seats: 200,
    icon: '🚀',
    accent: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    description: 'A 24-hour hackathon where teams build solutions for smart campus and sustainability.',
    details: 'Form teams of up to four and build a working prototype in 24 hours. Mentors, meals and Wi-Fi provided. Final demos are judged by industry experts.'
  },
  {
    id: 'flow-fest',
    title: 'Flow Fest',
    category: 'Cultural',
    date: '2026-11-21',
    time: '5:00 PM',
    venue: 'Open Air Theatre',
    organizer: 'Cultural Committee',
    seats: 1500,
    icon: '🎉',
    accent: '#ff3ea5',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    description: 'The flagship cultural festival with dance, drama, fashion walk and a DJ night.',
    details: 'An evening of performances from every department, followed by a fashion walk and a headline DJ set. Food stalls and photo booths open from 4 PM.'
  },
  {
    id: 'technova',
    title: 'TechNova',
    category: 'Technical',
    date: '2026-11-28',
    time: '9:30 AM',
    venue: 'Main Auditorium',
    organizer: 'Department of IT',
    seats: 400,
    icon: '🧠',
    accent: '#22e4ff',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    description: 'A national-level technical symposium with paper presentations and expert talks.',
    details: 'Present your research paper, attend keynote talks on AI and IoT, and compete in technical quiz and project expo events. Certificates for all participants.'
  },
  {
    id: 'designverse',
    title: 'DesignVerse',
    category: 'Workshop',
    date: '2026-12-03',
    time: '2:00 PM',
    venue: 'Design Studio, Block B',
    organizer: 'UI/UX Society',
    seats: 60,
    icon: '🎨',
    accent: '#ffc24b',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    description: 'A hands-on UI/UX workshop covering wireframing, prototyping and design systems.',
    details: 'Learn the full design process from user research to high-fidelity prototypes. Bring a laptop. Limited seats so the session stays interactive.'
  },
  {
    id: 'battle-of-bands',
    title: 'Battle of Bands',
    category: 'Music',
    date: '2026-12-11',
    time: '6:00 PM',
    venue: 'Central Lawn Stage',
    organizer: 'Music Club',
    seats: 800,
    icon: '🎸',
    accent: '#ff5470',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
    description: 'College bands go head-to-head on the big stage for the ultimate music trophy.',
    details: 'Each band gets a 15-minute slot judged on originality, performance and crowd energy. Audience voting counts for 30% of the final score.'
  },
  {
    id: 'bug-bounty-blitz',
    title: 'Bug Bounty Blitz',
    category: 'Coding',
    date: '2026-12-16',
    time: '11:00 AM',
    venue: 'Cyber Security Lab',
    organizer: 'Cyber Security Cell',
    seats: 80,
    icon: '🛡️',
    accent: '#2ee6a6',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    description: 'Find and report bugs in a deliberately vulnerable practice app before time runs out.',
    details: 'A capture-the-flag style debugging challenge on a sandboxed practice application. Points for every valid bug report. Beginners welcome.'
  },
  {
    id: 'unplugged-night',
    title: 'Unplugged Night',
    category: 'Music',
    date: '2026-12-19',
    time: '7:00 PM',
    venue: 'Amphitheatre',
    organizer: 'Music Club',
    seats: 300,
    icon: '🎤',
    accent: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80',
    description: 'An acoustic open-mic evening for singers, poets and solo performers.',
    details: 'Sign up for a five-minute slot or just come to listen. Fairy lights, hot chocolate and a relaxed end-of-semester vibe.'
  }
];

/* ---------- 2. LocalStorage keys & helpers ---------- */
const KEYS = {
  users: 'recharge_users',
  session: 'recharge_session',
  regs: 'recharge_registrations'
};

// Read JSON safely from LocalStorage
function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

// Write JSON safely to LocalStorage
function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    showToast('Could not save data in this browser.', 'error');
    return false;
  }
}

const getUsers = () => readStore(KEYS.users, []);
const saveUsers = (users) => writeStore(KEYS.users, users);
const getAllRegistrations = () => readStore(KEYS.regs, []);
const saveAllRegistrations = (regs) => writeStore(KEYS.regs, regs);

// Returns the logged-in user object, or null
function getCurrentUser() {
  const email = readStore(KEYS.session, null);
  if (!email) return null;
  return getUsers().find((u) => u.email === email) || null;
}

// Registrations that belong to the logged-in user
function getMyRegistrations() {
  const user = getCurrentUser();
  if (!user) return [];
  return getAllRegistrations().filter((r) => r.userEmail === user.email);
}

// Has the logged-in user already registered for this event?
function isRegistered(eventId) {
  return getMyRegistrations().some((r) => r.eventId === eventId);
}

/* ---------- 3. Small utilities ---------- */
const $ = (selector) => document.querySelector(selector);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Escape user-entered text before putting it into HTML
function escapeHTML(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, (c) => map[c]);
}

// "2026-11-06" -> "Fri, 6 Nov 2026"
function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function findEvent(id) {
  return EVENTS.find((e) => e.id === id);
}

/* ---------- 4. Toast messages ---------- */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  $('#toastContainer').appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ---------- 5. Form error helpers ---------- */
function setFieldError(input, message) {
  const field = input.closest('.field');
  field.classList.toggle('invalid', Boolean(message));
  field.querySelector('.error-msg').textContent = message || '';
}

function clearFormErrors(form) {
  form.querySelectorAll('.field').forEach((field) => {
    field.classList.remove('invalid');
    const msg = field.querySelector('.error-msg');
    if (msg) msg.textContent = '';
  });
  const formError = form.querySelector('.form-error');
  if (formError) formError.textContent = '';
}

// Put every password field in a form back to hidden
function resetPasswordToggles(form) {
  form.querySelectorAll('.toggle-pass').forEach((btn) => {
    document.getElementById(btn.dataset.target).type = 'password';
    btn.textContent = 'Show';
    btn.setAttribute('aria-label', 'Show password');
  });
}

/* ---------- 6. Show / hide password ---------- */
document.querySelectorAll('.toggle-pass').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Hide' : 'Show';
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
});

/* ---------- 7. Switch between Login and Signup ---------- */
function showAuthForm(which) {
  const login = $('#loginForm');
  const signup = $('#signupForm');
  login.classList.toggle('hidden', which !== 'login');
  signup.classList.toggle('hidden', which !== 'signup');
  clearFormErrors(login);
  clearFormErrors(signup);
}

document.querySelectorAll('[data-auth]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showAuthForm(link.dataset.auth);
  });
});

/* ---------- 8. Signup ---------- */
const signupForm = $('#signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    clearFormErrors(form);

    const nameInput = $('#signupName');
    const emailInput = $('#signupEmail');
    const deptInput = $('#signupDept');
    const passInput = $('#signupPassword');
    const confirmInput = $('#signupConfirm');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    let valid = true;

    if (name.length < 3) {
      setFieldError(nameInput, 'Please enter your full name (at least 3 characters).');
      valid = false;
    }

    if (!EMAIL_RE.test(email)) {
      setFieldError(emailInput, 'Please enter a valid college email.');
      valid = false;
    } else if (getUsers().some((u) => u.email === email)) {
      setFieldError(emailInput, 'An account with this email already exists.');
      valid = false;
    }

    if (!deptInput.value) {
      setFieldError(deptInput, 'Please select your department.');
      valid = false;
    }

    if (passInput.value.length < 6) {
      setFieldError(passInput, 'Password must be at least 6 characters.');
      valid = false;
    }

    if (!confirmInput.value || confirmInput.value !== passInput.value) {
      setFieldError(confirmInput, 'Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    const users = getUsers();
    users.push({ name, email, department: deptInput.value, password: passInput.value });
    if (!saveUsers(users)) return;

    form.reset();
    resetPasswordToggles(form);
    showAuthForm('login');
    $('#loginEmail').value = email;
    $('#loginPassword').focus();
    showToast('Account created! Please log in.');
  });
}

/* ---------- 9. Login ---------- */
const loginForm = $('#loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    clearFormErrors(form);

    const emailInput = $('#loginEmail');
    const passInput = $('#loginPassword');
    const email = emailInput.value.trim().toLowerCase();
    let valid = true;

    if (!EMAIL_RE.test(email)) {
      setFieldError(emailInput, 'Please enter a valid email.');
      valid = false;
    }
    if (!passInput.value) {
      setFieldError(passInput, 'Please enter your password.');
      valid = false;
    }
    if (!valid) return;

    const user = getUsers().find((u) => u.email === email);
    if (!user || user.password !== passInput.value) {
      $('#loginError').textContent = 'Invalid email or password.';
      return;
    }

    writeStore(KEYS.session, user.email);
    form.reset();
    resetPasswordToggles(form);
    enterApp();
    showToast(`Welcome, ${user.name.split(' ')[0]}! ⚡`);
  });
}

/* ---------- 10. Enter app / show auth / logout ---------- */
function enterApp() {
  const user = getCurrentUser();
  if (!user) {
    showAuth();
    return;
  }
  $('#authView').classList.add('hidden');
  $('#appView').classList.remove('hidden');
  $('#welcomeName').textContent = user.name;
  buildFilters();
  renderAll();
  switchView('home');
}

function showAuth() {
  $('#appView').classList.add('hidden');
  $('#authView').classList.remove('hidden');
  showAuthForm('login');
}

const logoutBtn = $('#logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(KEYS.session);
    closeAllModals();
    closeMobileNav();
    activeCategory = 'All';
    searchTerm = '';
    $('#searchInput').value = '';
    $('#quickSearchInput').value = '';
    showAuth();
    showToast('You have been logged out.', 'info');
  });
}

/* ---------- 11. Navigation between views ---------- */
const VIEWS = ['home', 'explore', 'registrations'];

function switchView(view) {
  VIEWS.forEach((v) => $(`#${v}View`).classList.toggle('hidden', v !== view));
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.view === view);
  });
  closeMobileNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (view === 'registrations') renderRegistrations();
  observeReveals();
}

// Any element with data-view switches the view
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-view]');
  if (!link) return;
  e.preventDefault();
  switchView(link.dataset.view);
});

/* ---------- 12. Mobile menu ---------- */
const navToggle = $('#navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = $('#navLinks').classList.toggle('open');
    $('#navToggle').classList.toggle('open', open);
    $('#navToggle').setAttribute('aria-expanded', String(open));
  });
}

function closeMobileNav() {
  const navLinks = $('#navLinks');
  const navToggleEl = $('#navToggle');
  if (navLinks) navLinks.classList.remove('open');
  if (navToggleEl) {
    navToggleEl.classList.remove('open');
    navToggleEl.setAttribute('aria-expanded', 'false');
  }
}

/* ---------- 13. Event card rendering ---------- */
function eventCardHTML(ev) {
  const registered = isRegistered(ev.id);
  return `
    <article class="event-card glass reveal">
      <div class="poster" data-icon="${ev.icon}" style="--accent:${ev.accent}">
        <img src="${ev.image}" alt="${ev.title} poster" loading="lazy">
        <span class="badge">${ev.category}</span>
        ${registered ? '<span class="badge badge-success">Registered</span>' : ''}
      </div>
      <div class="card-body">
        <h3>${ev.title}</h3>
        <ul class="meta">
          <li>📅 ${formatDate(ev.date)} · ${ev.time}</li>
          <li>📍 ${ev.venue}</li>
        </ul>
        <p>${ev.description}</p>
        <div class="card-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-action="details" data-id="${ev.id}">View Details</button>
          <button type="button" class="btn btn-primary btn-sm" data-action="register" data-id="${ev.id}" ${registered ? 'disabled' : ''}>
            ${registered ? 'Registered ✓' : 'Register Now'}
          </button>
        </div>
      </div>
    </article>`;
}

// If a poster image fails, remove it and show the gradient + icon
function attachImageFallbacks(container) {
  container.querySelectorAll('.poster img').forEach((img) => {
    img.addEventListener('error', () => {
      img.parentElement.classList.add('no-image');
      img.remove();
    }, { once: true });
  });
}

/* ---------- 14. Search & category filter ---------- */
let activeCategory = 'All';
let searchTerm = '';

function getCategories() {
  return ['All', ...new Set(EVENTS.map((e) => e.category))];
}

// Build filter chips on both Explore and Home
function buildFilters() {
  $('#filterBar').innerHTML = getCategories()
    .map((c) => `<button type="button" class="chip ${c === activeCategory ? 'active' : ''}" data-category="${c}">${c}</button>`)
    .join('');

  $('#quickCats').innerHTML = getCategories()
    .filter((c) => c !== 'All')
    .map((c) => `<button type="button" class="chip" data-quick-category="${c}">${c}</button>`)
    .join('');
}

function getFilteredEvents() {
  const q = searchTerm.trim().toLowerCase();
  return EVENTS.filter((ev) => {
    const matchCategory = activeCategory === 'All' || ev.category === activeCategory;
    const text = `${ev.title} ${ev.category} ${ev.venue} ${ev.description}`.toLowerCase();
    return matchCategory && (!q || text.includes(q));
  });
}

function renderExplore() {
  const grid = $('#eventsGrid');
  const list = getFilteredEvents();
  grid.innerHTML = list.map(eventCardHTML).join('');
  attachImageFallbacks(grid);
  $('#resultCount').textContent = `Showing ${list.length} of ${EVENTS.length} events`;
  $('#noResults').classList.toggle('hidden', list.length > 0);
  observeReveals();
}

// Explore: category chip clicked
const filterBar = $('#filterBar');
if (filterBar) {
  filterBar.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeCategory = chip.dataset.category;
    $('#filterBar').querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === chip));
    renderExplore();
  });
}

// Explore: live search
const searchInput = $('#searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderExplore();
  });
}

// Explore: clear filters from empty state
const clearFiltersBtn = $('#clearFilters');
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', () => {
    activeCategory = 'All';
    searchTerm = '';
    $('#searchInput').value = '';
    buildFilters();
    renderExplore();
  });
}

// Home: quick search submits to Explore
const quickSearchForm = $('#quickSearchForm');
if (quickSearchForm) {
  quickSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchTerm = $('#quickSearchInput').value;
    $('#searchInput').value = searchTerm;
    activeCategory = 'All';
    buildFilters();
    renderExplore();
    switchView('explore');
  });
}

// Home: quick category chips jump to Explore with that filter
const quickCats = $('#quickCats');
if (quickCats) {
  quickCats.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-quick-category]');
    if (!chip) return;
    activeCategory = chip.dataset.quickCategory;
    searchTerm = '';
    $('#searchInput').value = '';
    buildFilters();
    renderExplore();
    switchView('explore');
  });
}

/* ---------- 15. Upcoming events & statistics ---------- */
function renderUpcoming() {
  const grid = $('#upcomingGrid');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = EVENTS
    .filter((ev) => new Date(ev.date + 'T00:00:00') >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  grid.innerHTML = upcoming.length
    ? upcoming.map(eventCardHTML).join('')
    : '<p class="muted">No upcoming events right now. Check back soon!</p>';
  attachImageFallbacks(grid);
}

function updateStats() {
  const count = getMyRegistrations().length;
  $('#statEvents').textContent = EVENTS.length;
  $('#statRegs').textContent = count;
  $('#statCats').textContent = getCategories().length - 1;
  $('#navBadge').textContent = count;
  $('#regsCount').textContent = `You have ${count} registration${count === 1 ? '' : 's'}.`;
}

// Re-draw everything that depends on registrations
function renderAll() {
  updateStats();
  renderUpcoming();
  renderExplore();
  renderRegistrations();
}

/* ---------- 16. Modals ---------- */
function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal.open')) document.body.classList.remove('no-scroll');
}

function closeAllModals() {
  document.querySelectorAll('.modal.open').forEach((m) => closeModal(m.id));
}

// Close on backdrop click or any [data-close] button
document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('[data-close]')) closeModal(modal.id);
  });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

/* ---------- 17. Card / list button actions ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'details') openDetails(id);
  if (btn.dataset.action === 'register') openRegister(id);
  if (btn.dataset.action === 'cancel') askCancel(id);
});

/* ---------- 18. Event details modal ---------- */
function openDetails(eventId) {
  const ev = findEvent(eventId);
  if (!ev) return;
  const registered = isRegistered(ev.id);
  const content = $('#detailsContent');

  content.innerHTML = `
    <div class="poster details-poster" data-icon="${ev.icon}" style="--accent:${ev.accent}">
      <img src="${ev.image}" alt="${ev.title} poster">
      <span class="badge">${ev.category}</span>
    </div>
    <h2 id="detailsTitle">${ev.title}</h2>
    <p class="muted">${ev.details}</p>
    <div class="detail-grid">
      <div class="detail-item"><span>Date</span>${formatDate(ev.date)}</div>
      <div class="detail-item"><span>Time</span>${ev.time}</div>
      <div class="detail-item"><span>Venue</span>${ev.venue}</div>
      <div class="detail-item"><span>Organized by</span>${ev.organizer}</div>
      <div class="detail-item"><span>Seats</span>${ev.seats}</div>
      <div class="detail-item"><span>Your status</span>${registered ? 'Registered ✓' : 'Not registered'}</div>
    </div>
    <div class="modal-actions">
      <button type="button" class="btn btn-ghost" data-close>Close</button>
      <button type="button" class="btn btn-primary" data-action="register" data-id="${ev.id}" ${registered ? 'disabled' : ''}>
        ${registered ? 'Registered ✓' : 'Register Now'}
      </button>
    </div>`;

  attachImageFallbacks(content);
  openModal('detailsModal');
}

/* ---------- 19. Registration modal ---------- */
let selectedEventId = null;

function openRegister(eventId) {
  const ev = findEvent(eventId);
  const user = getCurrentUser();
  if (!ev) return;

  if (!user) {
    showToast('Please log in to continue with registration.', 'info');
    showAuth();
    return;
  }

  if (isRegistered(eventId)) {
    showToast(`You're already registered for ${ev.title}.`, 'info');
    return;
  }

  window.location.href = `register.html?event=${encodeURIComponent(eventId)}`;
}

const registerForm = $('#registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    clearFormErrors(form);

    const nameInput = $('#regName');
    const emailInput = $('#regEmail');
    const deptInput = $('#regDept');
    const yearInput = $('#regYear');
    let valid = true;

    if (nameInput.value.trim().length < 3) {
      setFieldError(nameInput, 'Please enter your full name.');
      valid = false;
    }
    if (!EMAIL_RE.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'Please enter a valid email.');
      valid = false;
    }
    if (!deptInput.value) {
      setFieldError(deptInput, 'Please select your department.');
      valid = false;
    }
    if (!yearInput.value) {
      setFieldError(yearInput, 'Please select your year of study.');
      valid = false;
    }
    if (!valid) return;

    const user = getCurrentUser();
    const ev = findEvent(selectedEventId);
    if (!user || !ev) {
      closeModal('registerModal');
      showToast('Your session has ended. Please log in again.', 'error');
      showAuth();
      return;
    }

    if (isRegistered(ev.id)) {
      closeModal('registerModal');
      showToast(`You're already registered for ${ev.title}.`, 'error');
      return;
    }

    const regs = getAllRegistrations();
    regs.push({
      id: 'REG' + Date.now(),
      eventId: ev.id,
      userEmail: user.email,
      name: nameInput.value.trim(),
      email: emailInput.value.trim().toLowerCase(),
      department: deptInput.value,
      year: yearInput.value,
      eventType: 'Technical',
      teamName: '',
      teamMembers: '',
      status: 'Confirmed',
      registeredAt: new Date().toISOString()
    });
    if (!saveAllRegistrations(regs)) return;

    closeModal('registerModal');
    renderAll();
    showToast(`You're registered for ${ev.title}! 🎉`);
  });
}

function initRegisterPage() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('event');
  const ev = findEvent(eventId);

  if (!ev) {
    showToast('Selected event was not found.', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
    return;
  }

  if (isRegistered(eventId)) {
    showToast(`You're already registered for ${ev.title}.`, 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
    return;
  }

  const excludedTeamEvents = ['flow-fest', 'battle-of-bands', 'unplugged-night'];
  const requiresTeam = !excludedTeamEvents.includes(ev.id);
  const teamFields = document.getElementById('teamFields');
  const teamName = document.getElementById('teamName');
  const teamMembers = document.getElementById('teamMembers');

  if (teamFields) {
    teamFields.classList.toggle('hidden', !requiresTeam);
  }

  const selectedEventName = $('#selectedEventName');
  const selectedEventMeta = $('#selectedEventMeta');
  if (selectedEventName) selectedEventName.textContent = `${ev.icon} ${ev.title}`;
  if (selectedEventMeta) selectedEventMeta.textContent = `${ev.category} · ${formatDate(ev.date)} · ${ev.time} · ${ev.venue}`;

  const nameInput = $('#regPageName');
  const emailInput = $('#regPageEmail');
  const deptInput = $('#regPageDept');
  if (nameInput) nameInput.value = user.name;
  if (emailInput) emailInput.value = user.email;
  if (deptInput) deptInput.value = user.department;

  const pageForm = $('#registerPageForm');
  if (!pageForm) return;

  pageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors(pageForm);

    const formMessage = $('#registerPageMessage');
    const eventType = document.querySelector('input[name="eventType"]:checked')?.value || 'Technical';
    const yearInput = $('#regPageYear');

    let valid = true;

    if (requiresTeam) {
      if (!teamName.value.trim()) {
        setFieldError(teamName, 'Please enter your team name.');
        valid = false;
      }
      if (!teamMembers.value.trim()) {
        setFieldError(teamMembers, 'Please enter team members names.');
        valid = false;
      }
    }

    if (!yearInput.value) {
      setFieldError(yearInput, 'Please select your year of study.');
      valid = false;
    }

    if (!valid) {
      if (formMessage) {
        formMessage.textContent = 'Please complete the highlighted fields.';
        formMessage.classList.add('error');
      }
      return;
    }

    const regs = getAllRegistrations();
    regs.push({
      id: 'REG' + Date.now(),
      eventId: ev.id,
      userEmail: user.email,
      name: nameInput.value.trim(),
      email: emailInput.value.trim().toLowerCase(),
      department: deptInput.value,
      year: yearInput.value,
      eventType,
      teamName: requiresTeam ? teamName.value.trim() : '',
      teamMembers: requiresTeam ? teamMembers.value.trim() : '',
      status: 'Confirmed',
      registeredAt: new Date().toISOString()
    });

    if (!saveAllRegistrations(regs)) return;

    if (formMessage) {
      formMessage.textContent = `Registration successful for ${ev.title}! Redirecting...`;
      formMessage.classList.remove('error');
    }

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 900);
  });
}

/* ---------- 20. My Registrations ---------- */
function renderRegistrations() {
  const list = $('#registrationsList');
  const mine = getMyRegistrations()
    .map((r) => ({ reg: r, ev: findEvent(r.eventId) }))
    .filter((item) => item.ev)
    .sort((a, b) => a.ev.date.localeCompare(b.ev.date));

  list.innerHTML = mine.map(({ reg, ev }) => `
    <article class="reg-card glass">
      <div class="poster reg-thumb" data-icon="${ev.icon}" style="--accent:${ev.accent}">
        <img src="${ev.image}" alt="${ev.title} poster" loading="lazy">
      </div>
      <div class="reg-info">
        <h3>${ev.title}</h3>
        <div class="reg-meta">
          <span>📅 ${formatDate(ev.date)} · ${ev.time}</span>
          <span>📍 ${ev.venue}</span>
          <span>🎓 ${escapeHTML(reg.name)} · ${escapeHTML(reg.year)}</span>
          ${reg.teamName ? `<span>👥 ${escapeHTML(reg.teamName)}</span>` : ''}
          ${reg.teamMembers ? `<span>🧑‍🤝‍🧑 ${escapeHTML(reg.teamMembers.replace(/\n/g, ', '))}</span>` : ''}
        </div>
        <span class="status">${reg.status}</span>
      </div>
      <button type="button" class="btn btn-danger-outline btn-sm" data-action="cancel" data-id="${reg.id}">Cancel</button>
    </article>`).join('');

  attachImageFallbacks(list);
  $('#emptyRegistrations').classList.toggle('hidden', mine.length > 0);
}

/* ---------- 21. Cancel registration (with confirmation) ---------- */
let pendingCancelId = null;

function askCancel(regId) {
  const reg = getAllRegistrations().find((r) => r.id === regId);
  if (!reg) return;
  const ev = findEvent(reg.eventId);
  pendingCancelId = regId;
  $('#confirmText').textContent = `Your seat for ${ev ? ev.title : 'this event'} will be released. This cannot be undone.`;
  openModal('confirmModal');
}

const confirmYes = $('#confirmYes');
if (confirmYes) {
  confirmYes.addEventListener('click', () => {
    if (!pendingCancelId) return;
    const regs = getAllRegistrations();
    const reg = regs.find((r) => r.id === pendingCancelId);
    const remaining = regs.filter((r) => r.id !== pendingCancelId);
    pendingCancelId = null;

    if (!saveAllRegistrations(remaining)) return;
    closeModal('confirmModal');
    renderAll();

    const ev = reg ? findEvent(reg.eventId) : null;
    showToast(`Registration for ${ev ? ev.title : 'the event'} cancelled.`, 'info');
  });
}

/* ---------- 22. Scroll-reveal animations ---------- */
const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 })
  : null;

function observeReveals() {
  document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('visible');
  });
}

/* ---------- 23. Start the app ---------- */
function init() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const authView = $('#authView');
  const appView = $('#appView');
  const registerPage = $('#registerPageForm');

  if (registerPage) {
    initRegisterPage();
    return;
  }

  if (!authView || !appView) return;

  if (getCurrentUser()) {
    enterApp();
  } else {
    showAuth();
  }
}

init();
