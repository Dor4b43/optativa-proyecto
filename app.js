

const USERS = [
  { email: 'admin@deportivospro.com', password: 'admin123', role: 'Administrador', type: 'admin' },
  { email: 'staff@deportivospro.com', password: 'staff123', role: 'Staff',          type: 'admin' },
  { email: 'juan@mail.com',           password: 'juan123',  role: 'Juan Pérez',     type: 'user',  userId: 'u1' },
  { email: 'maria@mail.com',          password: 'maria123', role: 'María González', type: 'user',  userId: 'u2' },
  { email: 'carlos@mail.com',         password: 'carlos123',role: 'Carlos Rodríguez',type: 'user', userId: 'u3' },
];

let currentUser = null;

function doLogin() {
  const email = document.getElementById('email-input').value.trim();
  const pass  = document.getElementById('pass-input').value;
  const errEl = document.getElementById('login-error');

  const user = USERS.find(u => u.email === email && u.password === pass);

  if (!user) {
    errEl.classList.remove('hidden');
    setTimeout(() => errEl.classList.add('hidden'), 3000);
    return;
  }

  currentUser = user;
  document.getElementById('page-login').classList.add('hidden');

  if (user.type === 'user') {
    
    const udata = USER_DATA[user.userId];
    const initials = user.role.split(' ').map(w => w[0]).slice(0,2).join('');
    document.getElementById('u-nav-username').textContent   = user.role;
    document.getElementById('u-avatar-initials').textContent = initials;
    document.getElementById('u-avatar-lg').textContent      = initials;
    document.getElementById('u-profile-name').textContent   = udata.name;
    document.getElementById('u-profile-email').textContent  = udata.email;
    document.getElementById('u-member-since').textContent   = udata.memberSince;
    document.getElementById('u-profile-phone').textContent  = udata.phone;
    document.getElementById('u-edit-name').value  = udata.name;
    document.getElementById('u-edit-phone').value = udata.phone;
    document.getElementById('u-edit-email').value = udata.email;
    document.getElementById('u-edit-sport').value = udata.favSport;
    document.getElementById('page-user').classList.remove('hidden');
    userShowPage('inicio');
  } else {
    document.getElementById('nav-username').textContent = user.role;
    document.getElementById('page-app').classList.remove('hidden');
    showPage('dashboard');
  }
}

function doLogout() {
  currentUser = null;
  document.getElementById('page-login').classList.remove('hidden');
  document.getElementById('page-app').classList.add('hidden');
  document.getElementById('page-user').classList.add('hidden');
  
  document.querySelectorAll('.u-nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.u-section').forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
}

function showPage(page) {
  
  document.querySelectorAll('.content-section').forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));

  const section = document.getElementById('section-' + page);
  const navBtn  = document.getElementById('nav-' + page);

  if (section) {
    section.classList.remove('hidden');
    section.classList.add('active');
  }
  if (navBtn) navBtn.classList.add('active');

  if (page === 'reservas')   renderCalendar();
  if (page === 'inventario') renderInventory();
  if (page === 'canchas')    renderCanchas();
}

let adminReservations = [
  { id: 1,  client: 'Juan Pérez',       court: 'Fútbol 1',     sport: 'futbol',     date: '2026-02-16', start: 10, end: 11,   status: 'confirmed', cancelReason: null },
  { id: 2,  client: 'María González',   court: 'Fútbol 1',     sport: 'futbol',     date: '2026-02-16', start: 14, end: 15.5, status: 'confirmed', cancelReason: null },
  { id: 3,  client: 'Carlos R.',         court: 'Tenis 1',      sport: 'tenis',      date: '2026-02-16', start: 10, end: 11,   status: 'confirmed', cancelReason: null },
  { id: 4,  client: 'Ana Martínez',      court: 'Baloncesto 1', sport: 'baloncesto', date: '2026-02-16', start: 15, end: 16.5, status: 'confirmed', cancelReason: null },
  { id: 5,  client: 'Luis Sánchez',     court: 'Voleibol 1',   sport: 'voleibol',   date: '2026-02-16', start: 17, end: 18,   status: 'confirmed', cancelReason: null },
  { id: 6,  client: 'Juan Pérez',       court: 'Fútbol 2',     sport: 'futbol',     date: '2026-03-02', start: 14, end: 16,   status: 'confirmed', cancelReason: null },
  { id: 7,  client: 'María González',   court: 'Tenis 1',      sport: 'tenis',      date: '2026-04-22', start: 10, end: 12,   status: 'confirmed', cancelReason: null },
  { id: 8,  client: 'Carlos Rodríguez', court: 'Baloncesto 1', sport: 'baloncesto', date: '2026-04-16', start: 14, end: 15.5, status: 'confirmed', cancelReason: null },
  { id: 9,  client: 'María González',   court: 'Baloncesto 1', sport: 'baloncesto', date: '2026-03-15', start: 15, end: 17,   status: 'confirmed', cancelReason: null },
  { id: 10, client: 'Juan Pérez',       court: 'Fútbol 1',     sport: 'futbol',     date: '2026-04-20', start: 9,  end: 10,   status: 'confirmed', cancelReason: null },
  { id: 11, client: 'Ana Martínez',      court: 'Tenis 1',      sport: 'tenis',      date: '2026-04-25', start: 11, end: 12.5, status: 'confirmed', cancelReason: null },
  { id: 12, client: 'Luis Sánchez',     court: 'Fútbol 2',     sport: 'futbol',     date: '2026-04-28', start: 8,  end: 9,    status: 'confirmed', cancelReason: null },
];

const reservations = adminReservations.map(r => ({ ...r, client: r.client }));

const courts = [
  { id: 1, name: 'Fútbol 1',     type: 'Fútbol - Fútbol 5',     sport: 'futbol',     status: 'Activo',         surface: 'Césped Sintético', dims: '40m x 20m', cap: '10 personas',  rate: '$35.00', light: true,  covered: true  },
  { id: 2, name: 'Fútbol 2',     type: 'Fútbol - Fútbol 7',     sport: 'futbol',     status: 'Activo',         surface: 'Césped Sintético', dims: '60m x 40m', cap: '14 personas',  rate: '$45.00', light: true,  covered: true  },
  { id: 3, name: 'Tenis 1',      type: 'Tenis - Individual',     sport: 'tenis',      status: 'Activo',         surface: 'Polvo de Ladrillo',dims: '23.77m x 8.23m',cap: '2 personas',rate: '$20.00', light: true,  covered: false },
  { id: 4, name: 'Tenis 2',      type: 'Tenis - Individual',     sport: 'tenis',      status: 'Mantenimiento',  surface: 'Polvo de Ladrillo',dims: '23.77m x 8.23m',cap: '2 personas',rate: '$20.00', light: false, covered: false },
  { id: 5, name: 'Baloncesto 1', type: 'Baloncesto - Full Court', sport: 'baloncesto', status: 'Activo',         surface: 'Parquet',          dims: '28m x 15m', cap: '10 personas',  rate: '$40.00', light: true,  covered: true  },
  { id: 6, name: 'Voleibol 1',   type: 'Voleibol - Indoor',      sport: 'voleibol',   status: 'Activo',         surface: 'Parquet',          dims: '18m x 9m',  cap: '12 personas',  rate: '$30.00', light: true,  covered: true  },
];

let inventory = [
  { id: 1, name: 'Balones de Fútbol',      category: 'Balones',     stock: 3,   min: 10, location: 'Almacén A', price: '$25.99' },
  { id: 2, name: 'Balones de Baloncesto',  category: 'Balones',     stock: 12,  min: 5,  location: 'Almacén A', price: '$29.99' },
  { id: 3, name: 'Redes de Voleibol',      category: 'Equipamiento',stock: 1,   min: 3,  location: 'Almacén B', price: '$89.99' },
  { id: 4, name: 'Raquetas de Tenis',      category: 'Equipamiento',stock: 4,   min: 8,  location: 'Almacén B', price: '$79.99' },
  { id: 5, name: 'Conos de Entrenamiento', category: 'Equipamiento',stock: 25,  min: 10, location: 'Almacén A', price: '$12.99' },
  { id: 6, name: 'Chalecos Deportivos',    category: 'Ropa',        stock: 18,  min: 10, location: 'Almacén C', price: '$19.99' },
  { id: 7, name: 'Balones de Voleibol',    category: 'Balones',     stock: 6,   min: 4,  location: 'Almacén A', price: '$34.99' },
  { id: 8, name: 'Canastas de Baloncesto', category: 'Equipamiento',stock: 2,   min: 2,  location: 'Almacén B', price: '$199.99'},
];

const HOURS = [8,9,10,11,12,13,14,15,16,17,18,19,20];
const COURT_NAMES = ['Fútbol 1','Fútbol 2','Tenis 1','Tenis 2','Baloncesto 1','Voleibol 1'];
const COURT_TYPES = {
  'Fútbol 1':     'Fútbol 5',
  'Fútbol 2':     'Fútbol 7',
  'Tenis 1':      'Individual',
  'Tenis 2':      'Individual',
  'Baloncesto 1': 'Full Court',
  'Voleibol 1':   'Indoor',
};
const SPORT_COLORS = { futbol: '', tenis: 'tenis', baloncesto: 'baloncesto', voleibol: 'voleibol' };

function renderCalendar() {
  const dateVal  = document.getElementById('reservas-date').value;
  const sport    = document.getElementById('reservas-sport').value;
  const search   = document.getElementById('reservas-search').value.toLowerCase();

  document.getElementById('cal-title').textContent = `Calendario de Reservas – ${dateVal}`;

  
  const headRow = document.getElementById('cal-head-row');
  headRow.innerHTML = '<th class="cal-court-col">Cancha</th>';
  HOURS.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h.toString().padStart(2,'0') + ':00';
    headRow.appendChild(th);
  });

  const tbody = document.getElementById('cal-body');
  tbody.innerHTML = '';

  COURT_NAMES.forEach(courtName => {
    const courtSport = courts.find(c => c.name === courtName)?.sport || 'futbol';
    if (sport !== 'all' && courtSport !== sport) return;

    const tr = document.createElement('tr');

    
    const tdCourt = document.createElement('td');
    tdCourt.className = 'cal-court-cell';
    tdCourt.innerHTML = `<p class="cal-court-name">${courtName}</p><p class="cal-court-type">${COURT_TYPES[courtName] || ''}</p>`;
    tr.appendChild(tdCourt);

    
    HOURS.forEach(h => {
      const td = document.createElement('td');
      td.style.position = 'relative';

      const res = reservations.find(r =>
        r.court === courtName &&
        r.start <= h && r.end > h &&
        (search === '' || r.client.toLowerCase().includes(search))
      );

      if (res && res.start === h) {
        const span = res.end - res.start;
        const div = document.createElement('div');
        div.className = 'cal-reservation ' + (SPORT_COLORS[res.sport] || '');
        const shortName = res.client.split(' ').map((w,i) => i===0 ? w : w[0]+'.').join(' ');
        div.innerHTML = `<strong>${shortName}</strong><br>${span}h`;
        div.style.right = 'calc(' + ((span - 1) * -100) + '% - ' + ((span - 1) * 2) + 'px)';
        div.style.zIndex = '2';
        td.appendChild(div);
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

let currentAdminTab = 'calendario';
let cancellingResId = null;

function switchAdminTab(tab) {
  currentAdminTab = tab;
  document.getElementById('atab-calendario').classList.toggle('active', tab === 'calendario');
  document.getElementById('atab-gestion').classList.toggle('active',   tab === 'gestion');
  document.getElementById('apanel-calendario').classList.toggle('hidden', tab !== 'calendario');
  document.getElementById('apanel-gestion').classList.toggle('hidden',   tab !== 'gestion');
  if (tab === 'gestion') renderAdminResTable();
  if (tab === 'calendario') renderCalendar();
}

const SPORT_LABEL_MAP = { futbol: 'Fútbol', tenis: 'Tenis', baloncesto: 'Baloncesto', voleibol: 'Voleibol' };

function renderAdminResTable() {
  const search = (document.getElementById('mgmt-search')?.value || '').toLowerCase();
  const status = document.getElementById('mgmt-status')?.value || 'all';

  const filtered = adminReservations.filter(r =>
    (status === 'all' || r.status === status) &&
    (search === '' || r.client.toLowerCase().includes(search) || r.court.toLowerCase().includes(search))
  ).sort((a,b) => a.date.localeCompare(b.date));

  document.getElementById('mgmt-count').textContent = `Reservas (${filtered.length})`;

  const tbody = document.getElementById('mgmt-tbody');
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray-400)">No se encontraron reservas</td></tr>`;
    return;
  }

  filtered.forEach(r => {
    const endFmt = r.end % 1 === 0 ? `${r.end}:00` : `${Math.floor(r.end)}:30`;
    const cancelled = r.status === 'cancelled';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <p class="product-name">${r.client}${r.walkIn ? ' <span class="badge active" style="font-size:10px;vertical-align:middle">Walk-in</span>' : ''}</p>
        ${r.phone ? `<p style="font-size:11.5px;color:var(--gray-400)">${r.phone}</p>` : ''}
        ${r.notes ? `<p style="font-size:11.5px;color:var(--gray-400);font-style:italic">${r.notes}</p>` : ''}
      </td>
      <td>${r.court}</td>
      <td>${r.date}</td>
      <td>${r.start}:00 – ${endFmt}</td>
      <td>${SPORT_LABEL_MAP[r.sport] || r.sport}</td>
      <td>
        <span class="badge ${cancelled ? 'cancelled' : 'confirmed'}">${cancelled ? 'Cancelada' : 'Confirmada'}</span>
        ${cancelled && r.cancelReason ? `<p class="cancel-reason-cell" title="${r.cancelReason}">${r.cancelReason}</p>` : ''}
      </td>
      <td>
        ${cancelled
          ? `<span style="font-size:12px;color:var(--gray-400)">—</span>`
          : `<button class="action-btn delete" onclick="openCancelResModal(${r.id})" title="Cancelar reserva">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
             </button>`
        }
      </td>`;
    tbody.appendChild(tr);
  });
}

function openCancelResModal(id) {
  const r = adminReservations.find(x => x.id === id);
  if (!r) return;
  cancellingResId = id;
  const endFmt = r.end % 1 === 0 ? `${r.end}:00` : `${Math.floor(r.end)}:30`;
  document.getElementById('cancel-res-info').innerHTML =
    `<strong>${r.client}</strong> &mdash; ${r.court}<br><span style="color:var(--gray-500)">${r.date} · ${r.start}:00 &ndash; ${endFmt}</span>`;
  document.getElementById('cancel-reason-input').value = '';
  document.getElementById('modal-cancel-res').classList.remove('hidden');
}

function confirmCancelRes() {
  const reason = document.getElementById('cancel-reason-input').value.trim();
  if (!reason) {
    document.getElementById('cancel-reason-input').style.borderColor = 'var(--red)';
    return;
  }
  document.getElementById('cancel-reason-input').style.borderColor = '';
  const r = adminReservations.find(x => x.id === cancellingResId);
  if (r) { r.status = 'cancelled'; r.cancelReason = reason; }
  document.getElementById('modal-cancel-res').classList.add('hidden');
  cancellingResId = null;
  renderAdminResTable();
}

function closeCancelModal(e) {
  if (e.target.classList.contains('modal-overlay'))
    document.getElementById('modal-cancel-res').classList.add('hidden');
}

function openNewResModal() {
  
  document.getElementById('nr-client').value = '';
  document.getElementById('nr-phone').value  = '';
  document.getElementById('nr-notes').value  = '';
  document.getElementById('nr-start').value  = '10';
  document.getElementById('nr-dur').value    = '1';

  
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('nr-date').value = today;

  
  const sel = document.getElementById('nr-court');
  sel.innerHTML = '';
  courts
    .filter(c => c.status !== 'Mantenimiento')
    .forEach(c => {
      const opt = document.createElement('option');
      opt.value       = c.id;
      opt.textContent = `${c.name} (${c.type}) — ${c.rate}/h`;
      sel.appendChild(opt);
    });

  updateNewResPreview();
  document.getElementById('modal-new-res').classList.remove('hidden');
}

function updateNewResPreview() {
  const courtId = parseInt(document.getElementById('nr-court')?.value);
  const date    = document.getElementById('nr-date')?.value;
  const start   = parseFloat(document.getElementById('nr-start')?.value);
  const dur     = parseFloat(document.getElementById('nr-dur')?.value);
  const preview = document.getElementById('nr-preview');

  const court = courts.find(c => c.id === courtId);
  if (!court || !date) {
    preview.textContent = 'Selecciona cancha y fecha para ver el precio';
    return;
  }

  const rate    = parseFloat(court.rate.replace('$', ''));
  const total   = (rate * dur).toFixed(2);
  const end     = start + dur;
  const endFmt  = end % 1 === 0 ? `${end}:00` : `${Math.floor(end)}:30`;

  preview.innerHTML =
    `📍 <strong>${court.name}</strong> · ${court.surface}<br>` +
    `📅 <strong>${date}</strong> · ${start}:00 – ${endFmt} (${dur === 0.5 ? '30 min' : dur + (dur === 1 ? ' hora' : ' horas')})<br>` +
    `💰 Total estimado: <strong style="color:var(--blue);font-size:15px">$${total}</strong>`;
}

function saveNewAdminRes() {
  const client  = document.getElementById('nr-client').value.trim();
  const courtId = parseInt(document.getElementById('nr-court').value);
  const date    = document.getElementById('nr-date').value;
  const start   = parseFloat(document.getElementById('nr-start').value);
  const dur     = parseFloat(document.getElementById('nr-dur').value);

  
  if (!client) {
    document.getElementById('nr-client').style.borderColor = 'var(--red)';
    document.getElementById('nr-client').focus();
    return;
  }
  if (!date) {
    document.getElementById('nr-date').style.borderColor = 'var(--red)';
    return;
  }
  document.getElementById('nr-client').style.borderColor = '';
  document.getElementById('nr-date').style.borderColor   = '';

  const court = courts.find(c => c.id === courtId);
  if (!court) return;

  const rate  = parseFloat(court.rate.replace('$', ''));
  const newId = Math.max(0, ...adminReservations.map(r => r.id)) + 1;

  adminReservations.push({
    id:           newId,
    client:       client,
    phone:        document.getElementById('nr-phone').value.trim() || null,
    court:        court.name,
    sport:        court.sport,
    date:         date,
    start:        start,
    end:          start + dur,
    status:       'confirmed',
    cancelReason: null,
    notes:        document.getElementById('nr-notes').value.trim() || null,
    price:        rate * dur,
    walkIn:       true,   
  });

  document.getElementById('modal-new-res').classList.add('hidden');
  renderAdminResTable();
}

function closeNewResModal(e) {
  if (e.target.classList.contains('modal-overlay'))
    document.getElementById('modal-new-res').classList.add('hidden');
}

function getStockStatus(stock, min) {
  if (stock <= min * 0.4) return 'critic';
  if (stock < min) return 'low';
  return 'normal';
}

function filterInventory() {
  const search = document.getElementById('inv-search').value.toLowerCase();
  const cat    = document.getElementById('inv-cat').value;

  const filtered = inventory.filter(p =>
    (cat === 'all' || p.category === cat) &&
    (search === '' || p.name.toLowerCase().includes(search))
  );

  renderInventory(filtered);
}

function renderInventory(data) {
  if (!data) data = inventory;

  
  const lowCount = inventory.filter(i => i.stock < i.min).length;
  document.querySelector('.alert-banner-title').textContent =
    lowCount > 0 ? `Atención: ${lowCount} producto${lowCount > 1 ? 's' : ''} con stock bajo` : 'Stock en orden';

  document.getElementById('inv-count').textContent = `Lista de Productos (${data.length})`;

  const tbody = document.getElementById('inv-tbody');
  tbody.innerHTML = '';

  data.forEach(item => {
    const status  = getStockStatus(item.stock, item.min);
    const label   = status === 'critic' ? 'Crítico' : (status === 'low' ? 'Bajo' : 'Normal');
    const badgeCls = status === 'normal' ? 'normal' : 'critic';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><p class="product-name">${item.name}</p></td>
      <td>${item.category}</td>
      <td>
        <div class="stock-controls">
          <button class="stock-btn minus" onclick="adjustStock(${item.id}, -1)" title="Reducir stock">−</button>
          <span class="stock-num" id="stock-num-${item.id}">${item.stock}</span>
          <button class="stock-btn plus"  onclick="adjustStock(${item.id}, +1)" title="Aumentar stock">+</button>
        </div>
        <div class="stock-bar-container" style="margin-top:5px">
          <div class="stock-bar-bg2"><div class="stock-bar2 ${status !== 'normal' ? 'low' : 'normal'}" id="stock-bar-${item.id}" style="width:${Math.min(100, Math.round((item.stock/(item.min*2))*100))}%"></div></div>
        </div>
      </td>
      <td><span class="badge ${badgeCls}" id="stock-badge-${item.id}">${label}</span></td>
      <td>${item.location}</td>
      <td>${item.price}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn edit" onclick="openProductModal(${item.id})" title="Editar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="action-btn delete" onclick="deleteProduct(${item.id})" title="Eliminar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

function adjustStock(id, delta) {
  const item = inventory.find(i => i.id === id);
  if (!item) return;
  item.stock = Math.max(0, item.stock + delta);

  
  const numEl   = document.getElementById('stock-num-'  + id);
  const barEl   = document.getElementById('stock-bar-'  + id);
  const badgeEl = document.getElementById('stock-badge-'+ id);
  if (numEl)   numEl.textContent = item.stock;

  const status  = getStockStatus(item.stock, item.min);
  const label   = status === 'critic' ? 'Crítico' : (status === 'low' ? 'Bajo' : 'Normal');
  const pct     = Math.min(100, Math.round((item.stock / (item.min * 2)) * 100));

  if (barEl) {
    barEl.style.width = pct + '%';
    barEl.className   = 'stock-bar2 ' + (status !== 'normal' ? 'low' : 'normal');
  }
  if (badgeEl) {
    badgeEl.textContent = label;
    badgeEl.className   = 'badge ' + (status === 'normal' ? 'normal' : 'critic');
  }

  
  const lowCount = inventory.filter(i => i.stock < i.min).length;
  document.querySelector('.alert-banner-title').textContent =
    lowCount > 0 ? `Atención: ${lowCount} producto${lowCount > 1 ? 's' : ''} con stock bajo` : 'Stock en orden';
}

let editingProductId = null;

function openProductModal(id) {
  editingProductId = id;
  document.getElementById('product-modal-title').textContent = id ? 'Editar Producto' : 'Nuevo Producto';
  if (id) {
    const p = inventory.find(i => i.id === id);
    if (!p) return;
    document.getElementById('p-name').value     = p.name;
    document.getElementById('p-cat').value      = p.category;
    document.getElementById('p-stock').value    = p.stock;
    document.getElementById('p-min').value      = p.min;
    document.getElementById('p-price').value    = p.price;
    document.getElementById('p-location').value = p.location;
  } else {
    document.getElementById('p-name').value     = '';
    document.getElementById('p-cat').value      = 'Balones';
    document.getElementById('p-stock').value    = '0';
    document.getElementById('p-min').value      = '5';
    document.getElementById('p-price').value    = '';
    document.getElementById('p-location').value = '';
  }
  document.getElementById('modal-product').classList.remove('hidden');
}

function saveProduct() {
  const name     = document.getElementById('p-name').value.trim();
  const category = document.getElementById('p-cat').value;
  const stock    = parseInt(document.getElementById('p-stock').value) || 0;
  const min      = parseInt(document.getElementById('p-min').value)   || 5;
  const price    = document.getElementById('p-price').value.trim();
  const location = document.getElementById('p-location').value.trim();
  if (!name) { alert('El nombre es obligatorio.'); return; }

  if (editingProductId) {
    const p = inventory.find(i => i.id === editingProductId);
    if (p) { p.name = name; p.category = category; p.stock = stock; p.min = min; p.price = price; p.location = location; }
  } else {
    const newId = Math.max(0, ...inventory.map(i => i.id)) + 1;
    inventory.push({ id: newId, name, category, stock, min, price, location });
  }
  document.getElementById('modal-product').classList.add('hidden');
  filterInventory();
}

function closeProductModalOverlay(e) {
  if (e.target.classList.contains('modal-overlay'))
    document.getElementById('modal-product').classList.add('hidden');
}

function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  inventory = inventory.filter(i => i.id !== id);
  filterInventory();
}

let editingCanchaId = null;

function openCanchaModal(id) {
  editingCanchaId = id;
  document.getElementById('modal-title').textContent = id ? 'Editar Cancha' : 'Nueva Cancha';
  if (id) {
    const c = courts.find(x => x.id === id);
    if (!c) return;
    document.getElementById('m-name').value    = c.name;
    document.getElementById('m-status').value  = c.status;
    document.getElementById('m-surface').value = c.surface;
    document.getElementById('m-dims').value    = c.dims;
    document.getElementById('m-cap').value     = c.cap;
    document.getElementById('m-rate').value    = c.rate;
    document.getElementById('m-sport').value   = c.sport;
    document.getElementById('m-type').value    = c.type;
    document.getElementById('m-light').checked   = c.light;
    document.getElementById('m-covered').checked = c.covered;
  } else {
    document.getElementById('m-name').value    = '';
    document.getElementById('m-status').value  = 'Activo';
    document.getElementById('m-surface').value = '';
    document.getElementById('m-dims').value    = '';
    document.getElementById('m-cap').value     = '';
    document.getElementById('m-rate').value    = '';
    document.getElementById('m-sport').value   = 'futbol';
    document.getElementById('m-type').value    = '';
    document.getElementById('m-light').checked   = false;
    document.getElementById('m-covered').checked = false;
  }
  document.getElementById('modal-cancha').classList.remove('hidden');
}

function openEditCancha(id) { openCanchaModal(id); }

function renderCanchas() {
  const grid = document.getElementById('canchas-grid');
  grid.innerHTML = '';

  courts.forEach(c => {
    const isMaint = c.status === 'Mantenimiento';
    const card = document.createElement('div');
    card.className = 'cancha-card';
    card.innerHTML = `
      <div class="cancha-card-header ${isMaint ? 'maint-header' : ''}">
        <div>
          <p class="cancha-card-name">${c.name}</p>
          <p class="cancha-card-type">${c.type}</p>
        </div>
        <span class="badge ${isMaint ? 'maint' : 'active'}">${c.status}</span>
      </div>
      <div class="cancha-card-body">
        <div class="cancha-details">
          <div>
            <p class="cancha-detail-label">Superficie</p>
            <p class="cancha-detail-val">${c.surface}</p>
          </div>
          <div>
            <p class="cancha-detail-label">Dimensiones</p>
            <p class="cancha-detail-val">${c.dims}</p>
          </div>
          <div>
            <p class="cancha-detail-label">Capacidad</p>
            <p class="cancha-detail-val">${c.cap}</p>
          </div>
          <div>
            <p class="cancha-detail-label">Tarifa/Hora</p>
            <p class="cancha-detail-val">${c.rate}</p>
          </div>
        </div>
        <div class="cancha-amenities">
          <div class="amenity">
            <div class="amenity-dot" style="background:${c.light ? 'var(--green)' : 'var(--gray-300)'}"></div>
            Iluminación
          </div>
          <div class="amenity">
            <div class="amenity-dot" style="background:${c.covered ? 'var(--green)' : 'var(--gray-300)'}"></div>
            Techada
          </div>
        </div>
        <div class="cancha-actions">
          <button class="btn-edit-cancha" onclick="openCanchaModal(${c.id})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </button>
          <button class="btn-del-cancha" onclick="deleteCancha(${c.id})" title="Eliminar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function openEditCancha(id) { openCanchaModal(id); }

function saveCancha() {
  const name    = document.getElementById('m-name').value.trim();
  const status  = document.getElementById('m-status').value;
  const surface = document.getElementById('m-surface').value.trim();
  const dims    = document.getElementById('m-dims').value.trim();
  const cap     = document.getElementById('m-cap').value.trim();
  const rate    = document.getElementById('m-rate').value.trim();
  const sport   = document.getElementById('m-sport').value;
  const type    = document.getElementById('m-type').value.trim();
  const light   = document.getElementById('m-light').checked;
  const covered = document.getElementById('m-covered').checked;

  if (!name) { alert('El nombre es obligatorio.'); return; }

  if (editingCanchaId) {
    const c = courts.find(x => x.id === editingCanchaId);
    if (c) { c.name = name; c.status = status; c.surface = surface; c.dims = dims; c.cap = cap; c.rate = rate; c.sport = sport; c.type = type; c.light = light; c.covered = covered; }
  } else {
    const newId = Math.max(0, ...courts.map(c => c.id)) + 1;
    courts.push({ id: newId, name, type, sport, status, surface, dims, cap, rate, light, covered });
  }
  document.getElementById('modal-cancha').classList.add('hidden');
  renderCanchas();
}

function deleteCancha(id) {
  if (!confirm('¿Eliminar esta cancha?')) return;
  const idx = courts.findIndex(c => c.id === id);
  if (idx !== -1) courts.splice(idx, 1);
  renderCanchas();
}

function closeModal(e) {
  if (e.target.classList.contains('modal-overlay')) {
    document.getElementById('modal-cancha').classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !document.getElementById('page-login').classList.contains('hidden')) {
    doLogin();
  }
});

const USER_DATA = {
  u1: {
    name: 'Juan Pérez',
    email: 'juan@mail.com',
    phone: '+57 310 123 4567',
    memberSince: 'Enero 2024',
    favSport: 'Fútbol',
    reservations: [
      { id: 'r1', court: 'Fútbol 1', sport: 'futbol', date: '2026-02-16', start: 10, end: 11,  status: 'confirmed', price: 35   },
      { id: 'r2', court: 'Fútbol 2', sport: 'futbol', date: '2026-03-02', start: 14, end: 16,  status: 'confirmed', price: 90   },
      { id: 'r3', court: 'Fútbol 1', sport: 'futbol', date: '2026-04-20', start: 9,  end: 10,  status: 'confirmed', price: 35   },
      { id: 'r4', court: 'Tenis 1',   sport: 'tenis',  date: '2025-12-15', start: 11, end: 12,  status: 'past',      price: 20   },
      { id: 'r5', court: 'Fútbol 1', sport: 'futbol', date: '2025-11-28', start: 16, end: 18,  status: 'past',      price: 70   },
      { id: 'r6', court: 'Fútbol 2', sport: 'futbol', date: '2025-10-10', start: 10, end: 11,  status: 'past',      price: 45   },
    ],
    achievements: [
      { icon: '🏆', name: 'Primer Reserva',  desc: 'Hiciste tu primera reserva',      unlocked: true },
      { icon: '🔥', name: '5 Reservas',      desc: 'Completaste 5 reservas',           unlocked: true },
      { icon: '⚽',  name: 'Fan del Fútbol', desc: 'Más de 3 reservas de fútbol',     unlocked: true },
      { icon: '🏅', name: 'Jugador Estrella', desc: 'Completa 10 reservas',           unlocked: false },
      { icon: '❤️',  name: 'Leal',            desc: 'Miembro por más de 1 año',       unlocked: false },
    ],
  },
  u2: {
    name: 'María González',
    email: 'maria@mail.com',
    phone: '+57 320 987 6543',
    memberSince: 'Marzo 2023',
    favSport: 'Tenis',
    reservations: [
      { id: 'r1', court: 'Tenis 1',      sport: 'tenis',      date: '2026-02-16', start: 11, end: 12,  status: 'confirmed', price: 20  },
      { id: 'r2', court: 'Tenis 1',      sport: 'tenis',      date: '2026-04-22', start: 10, end: 12,  status: 'confirmed', price: 40  },
      { id: 'r3', court: 'Baloncesto 1', sport: 'baloncesto', date: '2026-03-15', start: 15, end: 17,  status: 'confirmed', price: 80  },
      { id: 'r4', court: 'Tenis 1',      sport: 'tenis',      date: '2025-11-20', start: 9,  end: 10,  status: 'past',      price: 20  },
      { id: 'r5', court: 'Tenis 1',      sport: 'tenis',      date: '2025-10-05', start: 11, end: 12.5,status: 'past',      price: 30  },
      { id: 'r6', court: 'Tenis 1',      sport: 'tenis',      date: '2025-09-18', start: 14, end: 16,  status: 'past',      price: 40  },
      { id: 'r7', court: 'Tenis 1',      sport: 'tenis',      date: '2025-08-10', start: 10, end: 11,  status: 'past',      price: 20  },
      { id: 'r8', court: 'Voleibol 1',   sport: 'voleibol',   date: '2025-07-22', start: 16, end: 17,  status: 'past',      price: 30  },
    ],
    achievements: [
      { icon: '🎾', name: 'Tenista',        desc: 'Primera reserva de tenis',        unlocked: true  },
      { icon: '🏝️', name: 'Veterana',       desc: 'Miembro por más de 2 años',     unlocked: true  },
      { icon: '🌟', name: '5 Reservas',     desc: 'Completaste 5 reservas',           unlocked: true  },
      { icon: '🌈', name: 'Multideporte',   desc: 'Reservas en 3 deportes distintos', unlocked: true  },
      { icon: '🏅', name: '10 Reservas',    desc: 'Completa 10 reservas',             unlocked: false },
    ],
  },
  u3: {
    name: 'Carlos Rodríguez',
    email: 'carlos@mail.com',
    phone: '+57 300 456 7890',
    memberSince: 'Junio 2025',
    favSport: 'Baloncesto',
    reservations: [
      { id: 'r1', court: 'Baloncesto 1', sport: 'baloncesto', date: '2026-04-16', start: 14, end: 15.5, status: 'confirmed', price: 60  },
      { id: 'r2', court: 'Fútbol 1',     sport: 'futbol',     date: '2025-12-28', start: 10, end: 11,   status: 'past',      price: 35  },
      { id: 'r3', court: 'Baloncesto 1', sport: 'baloncesto', date: '2025-11-15', start: 16, end: 17.5,  status: 'past',      price: 60  },
    ],
    achievements: [
      { icon: '🏀', name: 'Basquetbolista', desc: 'Primera reserva de baloncesto', unlocked: true  },
      { icon: '🌱', name: 'Nuevo Miembro',  desc: 'Bienvenido a DeportivosPro',   unlocked: true  },
      { icon: '🔥', name: '5 Reservas',     desc: 'Completa 5 reservas',           unlocked: false },
      { icon: '🏅', name: 'Jugador Estrella', desc: 'Completa 10 reservas',        unlocked: false },
    ],
  },
};

const SPORT_EMOJIS  = { futbol: '⚽', tenis: '🎾', baloncesto: '🏀', voleibol: '🏐' };
const SPORT_COLORS2 = { futbol: '#DBEAFE', tenis: '#D1FAE5', baloncesto: '#FEF9C3', voleibol: '#F5F3FF' };
const SPORT_LABELS  = { futbol: 'Fútbol', tenis: 'Tenis', baloncesto: 'Baloncesto', voleibol: 'Voleibol' };
const SPORT_DOT_COLORS = { futbol: '#2563EB', tenis: '#10B981', baloncesto: '#F59E0B', voleibol: '#8B5CF6' };

let selectedCourtId = null;
let currentTab      = 'upcoming';
let selectedSport   = 'futbol';

function userShowPage(page) {
  document.querySelectorAll('.u-section').forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  document.querySelectorAll('.u-nav-link').forEach(l => l.classList.remove('active'));

  const section = document.getElementById('u-section-' + page);
  const btn     = document.getElementById('u-nav-' + page);
  if (section) { section.classList.remove('hidden'); section.classList.add('active'); }
  if (btn)     btn.classList.add('active');

  if (page === 'inicio')      renderUserDashboard();
  if (page === 'misreservas') renderMyReservations();
  if (page === 'reservar')    renderCourtPicker();
  if (page === 'perfil')      renderProfile();
}

function getUserData() {
  if (!currentUser || currentUser.type !== 'user') return null;
  return USER_DATA[currentUser.userId];
}

function renderUserDashboard() {
  const udata = getUserData();
  if (!udata) return;

  
  const firstName = udata.name.split(' ')[0];
  document.getElementById('u-greeting').textContent = `¡Hola de nuevo, ${firstName}! 👋`;

  
  const allRes   = udata.reservations;
  const totalHrs = allRes.reduce((sum, r) => sum + (r.end - r.start), 0);
  const sportCount = {};
  const courtCount = {};
  allRes.forEach(r => {
    sportCount[r.sport] = (sportCount[r.sport] || 0) + 1;
    courtCount[r.court] = (courtCount[r.court] || 0) + 1;
  });
  const favSport = Object.entries(sportCount).sort((a,b) => b[1]-a[1])[0];
  const favCourt = Object.entries(courtCount).sort((a,b) => b[1]-a[1])[0];

  document.getElementById('u-stat-total').textContent = allRes.length;
  document.getElementById('u-stat-hours').textContent = totalHrs + 'h';
  document.getElementById('u-stat-sport').textContent = favSport ? SPORT_LABELS[favSport[0]] : '—';
  document.getElementById('u-stat-court').textContent = favCourt ? favCourt[0] : '—';

  
  const today    = new Date().toISOString().slice(0,10);
  const upcoming = allRes.filter(r => r.date >= today && r.status === 'confirmed').slice(0,4);
  const upDiv    = document.getElementById('u-upcoming-list');
  upDiv.innerHTML = '';
  if (upcoming.length === 0) {
    upDiv.innerHTML = `<div class="u-empty"><div class="u-empty-icon">📅</div><p>No tienes reservas próximas</p><p style="margin-top:4px"><a href="#" onclick="userShowPage('reservar')" style="color:var(--blue);font-weight:600">Reservar ahora</a></p></div>`;
  } else {
    upcoming.forEach(r => {
      const div = document.createElement('div');
      div.className = 'u-res-item';
      div.innerHTML = `
        <div class="u-res-left">
          <p class="u-res-title"><span class="u-res-sport-dot" style="background:${SPORT_DOT_COLORS[r.sport]}"></span>${r.court}</p>
          <p class="u-res-sub">${String(r.start).padStart(2,'0')}:00 – ${String(r.end % 1 === 0 ? r.end : Math.floor(r.end)).padStart(2,'0')}:${r.end % 1 === 0 ? '00' : '30'}</p>
        </div>
        <div class="u-res-right">
          <p class="u-res-date">${r.date}</p>
          <span class="badge confirmed">Confirmada</span>
        </div>`;
      upDiv.appendChild(div);
    });
  }

  
  const total = allRes.length || 1;
  const barsDiv = document.getElementById('u-sport-bars');
  barsDiv.innerHTML = '';
  const sports = ['futbol','tenis','baloncesto','voleibol'];
  sports.forEach(s => {
    const cnt = sportCount[s] || 0;
    if (cnt === 0) return;
    const pct = Math.round((cnt / total) * 100);
    const div = document.createElement('div');
    div.className = 'u-sport-bar-item';
    div.innerHTML = `
      <div class="u-sport-bar-label">
        <span>${SPORT_EMOJIS[s]} ${SPORT_LABELS[s]}</span>
        <span>${cnt} reservas</span>
      </div>
      <div class="u-bar-bg"><div class="u-bar-fill" style="width:${pct}%;background:${SPORT_DOT_COLORS[s]}"></div></div>`;
    barsDiv.appendChild(div);
  });
  if (barsDiv.innerHTML === '') {
    barsDiv.innerHTML = '<p class="u-empty">No hay actividad registrada aún.</p>';
  }
}

function renderMyReservations() {
  const udata = getUserData();
  if (!udata) return;

  const today   = new Date().toISOString().slice(0,10);
  const byTab   = udata.reservations.filter(r =>
    currentTab === 'upcoming'
      ? (r.date >= today && r.status === 'confirmed')
      : (r.date < today  || r.status === 'past')
  ).sort((a,b) => a.date.localeCompare(b.date) * (currentTab === 'past' ? -1 : 1));

  const listDiv = document.getElementById('u-myres-list');
  listDiv.innerHTML = '';

  if (byTab.length === 0) {
    const emptyMsg = currentTab === 'upcoming' ? 'No tienes reservas próximas.' : 'Tu historial está vacío.';
    listDiv.innerHTML = `<div class="u-empty"><div class="u-empty-icon">${currentTab === 'upcoming' ? '📅' : '📂'}</div><p>${emptyMsg}</p></div>`;
    return;
  }

  byTab.forEach(r => {
    const isPast = currentTab === 'past';
    const endFmt = r.end % 1 === 0 ? `${r.end}:00` : `${Math.floor(r.end)}:30`;
    const card = document.createElement('div');
    card.className = 'u-myres-card' + (isPast ? ' past' : '');
    card.innerHTML = `
      <div class="u-myres-left">
        <div class="u-myres-sport-icon" style="background:${SPORT_COLORS2[r.sport]}">${SPORT_EMOJIS[r.sport]}</div>
        <div>
          <p class="u-myres-title">${r.court}</p>
          <p class="u-myres-detail">${r.date} · ${r.start}:00 – ${endFmt} · ${SPORT_LABELS[r.sport]}</p>
        </div>
      </div>
      <div class="u-myres-right">
        <p class="u-myres-price">$${r.price.toFixed(2)}</p>
        ${ isPast
            ? `<span class="badge confirmed">Completada</span>`
            : `<button class="u-btn-cancel" onclick="cancelReservation('${r.id}')">Cancelar</button>`
        }
      </div>`;
    listDiv.appendChild(card);
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('u-tab-upcoming').classList.toggle('active', tab === 'upcoming');
  document.getElementById('u-tab-past').classList.toggle('active', tab === 'past');
  renderMyReservations();
}

function cancelReservation(id) {
  if (!confirm('¿Cancelar esta reserva?')) return;
  const udata = getUserData();
  const res   = udata.reservations.find(r => r.id === id);
  if (res) res.status = 'past';
  renderMyReservations();
  renderUserDashboard();
}

function renderCourtPicker() {
  selectedCourtId = null;
  updateBookingSummary();
  renderCourtsForSport(selectedSport);
}

function selectSport(sport, btn) {
  selectedSport   = sport;
  selectedCourtId = null;
  document.querySelectorAll('.u-sport-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCourtsForSport(sport);
  updateBookingSummary();
}

function renderCourtsForSport(sport) {
  const grid = document.getElementById('u-court-cards');
  grid.innerHTML = '';
  const filtered = courts.filter(c => c.sport === sport);
  filtered.forEach(c => {
    const isMaint = c.status === 'Mantenimiento';
    const card    = document.createElement('div');
    card.className = 'u-court-pick-card' + (isMaint ? ' maint' : '');
    card.id        = 'cpc-' + c.id;
    card.innerHTML = `
      <p class="u-court-pick-name">${c.name}</p>
      <p class="u-court-pick-type">${c.type}</p>
      <p class="u-court-pick-rate">${c.rate}/hora</p>
      <p class="u-court-pick-info">📍 ${c.surface} · ${c.dims}</p>
      <span class="u-court-pick-badge${isMaint ? ' maint':''}">${ isMaint ? 'En mantenimiento' : 'Disponible' }</span>`;
    if (!isMaint) {
      card.onclick = () => pickCourt(c.id);
    }
    grid.appendChild(card);
  });
}

function pickCourt(id) {
  selectedCourtId = id;
  document.querySelectorAll('.u-court-pick-card').forEach(c => c.classList.remove('active'));
  const el = document.getElementById('cpc-' + id);
  if (el) el.classList.add('active');
  updateBookingSummary();
}

function updateBookingSummary() {
  const btn     = document.getElementById('u-btn-confirm');
  const content = document.getElementById('u-summary-content');

  if (!selectedCourtId) {
    content.textContent = 'Selecciona una cancha para ver el resumen';
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor  = 'not-allowed';
    return;
  }

  const court = courts.find(c => c.id === selectedCourtId);
  const date  = document.getElementById('u-book-date').value;
  const start = document.getElementById('u-book-start').value;
  const dur   = document.getElementById('u-book-dur').value;
  const price = (parseFloat(court.rate.replace('$','')) * parseFloat(dur)).toFixed(2);
  const end   = parseFloat(start) + parseFloat(dur);
  const endFmt = end % 1 === 0 ? `${end}:00` : `${Math.floor(end)}:30`;

  content.innerHTML = `
    <strong>${court.name}</strong> · ${court.surface}<br>
    📅 <strong>${date}</strong> · ${start}:00 – ${endFmt} (${dur}h)<br>
    💰 Total: <strong style="color:var(--blue)">$${price}</strong>`;

  btn.disabled = false;
  btn.style.opacity = '1';
  btn.style.cursor  = 'pointer';
}

function confirmBooking() {
  const udata = getUserData();
  if (!udata || !selectedCourtId) return;

  const court = courts.find(c => c.id === selectedCourtId);
  const date  = document.getElementById('u-book-date').value;
  const start = parseInt(document.getElementById('u-book-start').value);
  const dur   = parseFloat(document.getElementById('u-book-dur').value);
  const price = parseFloat(court.rate.replace('$','')) * dur;
  const newId = 'new-' + Date.now();

  udata.reservations.push({
    id: newId, court: court.name, sport: court.sport,
    date, start, end: start + dur, status: 'confirmed', price
  });

  const endFmt = (start + dur) % 1 === 0 ? `${start+dur}:00` : `${Math.floor(start+dur)}:30`;
  document.getElementById('booking-confirm-msg').innerHTML =
    `Tu reserva para <strong>${court.name}</strong> el <strong>${date}</strong><br>` +
    `de <strong>${start}:00</strong> a <strong>${endFmt}</strong> ha sido confirmada.<br><br>` +
    `️ Total cargado: <strong>$${price.toFixed(2)}</strong>`;

  document.getElementById('modal-booking').classList.remove('hidden');
  selectedCourtId = null;
}

function closeBookingModal(e) {
  if (e.target.classList.contains('modal-overlay')) {
    document.getElementById('modal-booking').classList.add('hidden');
  }
}

function renderProfile() {
  const udata = getUserData();
  if (!udata) return;

  
  const div = document.getElementById('u-achievements');
  div.innerHTML = '';
  udata.achievements.forEach(a => {
    const el = document.createElement('div');
    el.className = 'u-achievement' + (a.unlocked ? '' : ' locked');
    el.innerHTML = `
      <div class="u-achievement-icon">${a.icon}</div>
      <div>
        <p class="u-achievement-name">${a.name}</p>
        <p class="u-achievement-desc">${a.unlocked ? a.desc : '🔒 Bloqueado'}</p>
      </div>`;
    div.appendChild(el);
  });
}

function saveProfile() {
  const udata = getUserData();
  if (!udata) return;
  const name  = document.getElementById('u-edit-name').value.trim();
  const phone = document.getElementById('u-edit-phone').value.trim();
  const email = document.getElementById('u-edit-email').value.trim();
  const sport = document.getElementById('u-edit-sport').value;

  udata.name      = name;
  udata.phone     = phone;
  udata.email     = email;
  udata.favSport  = sport;
  currentUser.role = name;

  const initials = name.split(' ').map(w => w[0]).slice(0,2).join('');
  document.getElementById('u-nav-username').textContent   = name;
  document.getElementById('u-avatar-initials').textContent = initials;
  document.getElementById('u-avatar-lg').textContent      = initials;
  document.getElementById('u-profile-name').textContent   = name;
  document.getElementById('u-profile-email').textContent  = email;
  document.getElementById('u-member-since').textContent   = udata.memberSince;
  document.getElementById('u-profile-phone').textContent  = phone;

  alert('Perfil actualizado correctamente.');
}
