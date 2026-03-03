/* ============================================================
   API SERVICE LAYER
   Ganti BASE_URL dengan URL backend lo saat integrasi
============================================================ */
const API = {
  BASE_URL: '/api', // TODO: ganti dengan URL backend

  // AUTH
  async login(username, password) {
    // MOCK: hardcoded credentials untuk demo
    return new Promise(resolve => {
      setTimeout(() => {
        if (username === 'admin' && password === 'admin123') {
          resolve({ success: true, token: 'mock-token', user: { name: 'Admin', username } });
        } else {
          resolve({ success: false, message: 'Invalid credentials' });
        }
      }, 400);
    });
  },

  // PRODUK
  async getProducts() {
    return { success: true, data: getMockProducts() };
  },

  async createProduct(data) {
    return new Promise(resolve => setTimeout(() => {
      const p = { ...data, id: Date.now() };
      APP.products.push(p);
      resolve({ success: true, data: p });
    }, 300));
  },

  async updateStock(productId, qty, note) {
    return new Promise(resolve => setTimeout(() => {
      const p = APP.products.find(x => x.id === productId);
      if (p) p.stok += qty;
      resolve({ success: true, data: p });
    }, 300));
  },

  async createTransaction(items, total) {
    return new Promise(resolve => setTimeout(() => {
      items.forEach(item => {
        const p = APP.products.find(x => x.id === item.id);
        if (p) p.stok -= item.qty;
      });
      resolve({ success: true, txId: 'TRX-' + Date.now() });
    }, 300));
  }
};

/* ============================================================
   MOCK DATA
============================================================ */
function getMockProducts() {
  return [
    { id: 1, sku: 'HOS-TEE-001', nama: 'Oversized Tee Black',    kategori: 'T-Shirt',     ukuran: 'L',        warna: 'Black', harga: 299000, stok: 45 },
    { id: 2, sku: 'HOS-TEE-002', nama: 'Oversized Tee White',    kategori: 'T-Shirt',     ukuran: 'M',        warna: 'White', harga: 299000, stok: 38 },
    { id: 3, sku: 'HOS-HDI-002', nama: 'Washed Hoodie Grey',     kategori: 'Hoodie',      ukuran: 'XL',       warna: 'Grey',  harga: 599000, stok: 20 },
    { id: 4, sku: 'HOS-JKT-003', nama: 'Bomber Jacket Olive',    kategori: 'Jacket',      ukuran: 'L',        warna: 'Olive', harga: 899000, stok: 12 },
    { id: 5, sku: 'HOS-PNT-004', nama: 'Cargo Pants Black',      kategori: 'Pants',       ukuran: 'M',        warna: 'Black', harga: 499000, stok: 30 },
    { id: 6, sku: 'HOS-ACC-005', nama: 'Logo Cap White',         kategori: 'Accessories', ukuran: 'One Size', warna: 'White', harga: 179000, stok: 55 },
    { id: 7, sku: 'HOS-HDI-006', nama: 'Zip Hoodie Black',       kategori: 'Hoodie',      ukuran: 'L',        warna: 'Black', harga: 649000, stok: 18 },
    { id: 8, sku: 'HOS-TEE-007', nama: 'Graphic Tee Cream',      kategori: 'T-Shirt',     ukuran: 'S',        warna: 'Cream', harga: 349000, stok: 25 },
    { id: 9, sku: 'HOS-JKT-008', nama: 'Denim Jacket Indigo',    kategori: 'Jacket',      ukuran: 'M',        warna: 'Indigo',harga: 799000, stok: 8  },
    { id:10, sku: 'HOS-PNT-009', nama: 'Jogger Pants Grey',      kategori: 'Pants',       ukuran: 'L',        warna: 'Grey',  harga: 399000, stok: 22 },
    { id:11, sku: 'HOS-TEE-010', nama: 'Polo Shirt Navy',        kategori: 'T-Shirt',     ukuran: 'XL',       warna: 'Navy',  harga: 359000, stok: 14 },
    { id:12, sku: 'HOS-ACC-011', nama: 'Canvas Tote Bag',        kategori: 'Accessories', ukuran: 'One Size', warna: 'Black', harga: 149000, stok: 40 },
  ];
}

/* ============================================================
   APP STATE
============================================================ */
const APP = {
  user: null,
  products: [],
  cart: [],
  monitorPage: 1,
  monitorPerPage: 8,
  selectedUpdateItem: null,
  skuCounters: { 'T-Shirt': 10, 'Hoodie': 6, 'Jacket': 8, 'Pants': 9, 'Accessories': 11, 'Outerwear': 0, 'Shorts': 0 },
};

const SKU_PREFIX = {
  'T-Shirt': 'TEE', 'Hoodie': 'HDI', 'Jacket': 'JKT',
  'Pants': 'PNT', 'Accessories': 'ACC', 'Outerwear': 'OUT', 'Shorts': 'SHT'
};

/* ============================================================
   UTILITIES
============================================================ */
function fmtRp(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 2500);
}

function togglePassword() {
  const inp = document.getElementById('login-password');
  const show = document.getElementById('pw-icon-show');
  const hide = document.getElementById('pw-icon-hide');
  if (inp.type === 'password') {
    inp.type = 'text';
    show.style.display = 'none';
    hide.style.display = 'block';
  } else {
    inp.type = 'password';
    show.style.display = 'block';
    hide.style.display = 'none';
  }
}

/* ============================================================
   AUTH
============================================================ */
async function doLogin() {
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;
  const err = document.getElementById('login-error');
  const btn = document.querySelector('.btn-login');

  if (!u || !p) { err.textContent = 'Username dan password wajib diisi.'; err.classList.add('show'); return; }

  btn.textContent = 'LOADING...';
  btn.disabled = true;

  const res = await API.login(u, p);
  btn.textContent = 'LOGIN';
  btn.disabled = false;

  if (res.success) {
    err.classList.remove('show');
    APP.user = res.user;
    await loadProducts();
    document.getElementById('page-login').classList.remove('active');
    document.getElementById('page-app').classList.add('active');
    navigate('dashboard');
  } else {
    err.textContent = 'Username atau password salah. Coba lagi.';
    err.classList.add('show');
  }
}

document.getElementById('login-password').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
document.getElementById('login-username').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

function doLogout() {
  APP.user = null; APP.cart = []; APP.products = [];
  document.getElementById('page-app').classList.remove('active');
  document.getElementById('page-login').classList.add('active');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
}

/* ============================================================
   NAVIGATION
============================================================ */
function navigate(view) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');

  if (view === 'kasir') renderPosProducts();
  if (view === 'monitoring') { APP.monitorPage = 1; renderMonitorTable(); }
}

/* ============================================================
   LOAD PRODUCTS
============================================================ */
async function loadProducts() {
  const res = await API.getProducts();
  if (res.success) APP.products = res.data;
}

/* ============================================================
   TAMBAH BARANG
============================================================ */
function updateSkuPreview() {
  const kat = document.getElementById('tb-kategori').value;
  const nama = document.getElementById('tb-nama').value.trim();
  const preview = document.getElementById('sku-preview');
  if (!kat || !nama) { preview.textContent = '—'; return; }
  const prefix = SKU_PREFIX[kat] || 'ITM';
  const count = (APP.skuCounters[kat] || 0) + 1;
  const num = String(count).padStart(3, '0');
  preview.textContent = `HOS-${prefix}-${num}`;
}

async function tambahBarang() {
  const nama = document.getElementById('tb-nama').value.trim();
  const kat = document.getElementById('tb-kategori').value;
  const ukuran = document.getElementById('tb-ukuran').value;
  const warna = document.getElementById('tb-warna').value.trim();
  const harga = parseInt(document.getElementById('tb-harga').value) || 0;
  const stok = parseInt(document.getElementById('tb-stok').value) || 0;

  if (!nama || !kat || !ukuran || !warna || !harga) {
    showToast('Lengkapi semua field yang wajib diisi', 'error'); return;
  }

  const prefix = SKU_PREFIX[kat] || 'ITM';
  const count = (APP.skuCounters[kat] || 0) + 1;
  const sku = `HOS-${prefix}-${String(count).padStart(3, '0')}`;

  const btn = document.querySelector('#view-tambah .btn-primary');
  btn.textContent = 'MENYIMPAN...'; btn.disabled = true;

  const res = await API.createProduct({ sku, nama, kategori: kat, ukuran, warna, harga, stok });

  btn.textContent = 'SIMPAN BARANG'; btn.disabled = false;

  if (res.success) {
    APP.skuCounters[kat] = count;
    showToast(`${nama} berhasil ditambahkan!`, 'success');
    // Reset form
    ['tb-nama','tb-kategori','tb-ukuran','tb-warna','tb-harga','tb-stok'].forEach(id => {
      const el = document.getElementById(id);
      el.value = el.tagName === 'SELECT' ? '' : (id === 'tb-stok' ? '0' : '');
    });
    document.getElementById('sku-preview').textContent = '—';
  } else {
    showToast('Gagal menyimpan. Coba lagi.', 'error');
  }
}

/* ============================================================
   UPDATE STOK
============================================================ */
function searchUpdateItems() {
  const q = document.getElementById('update-search').value.trim().toLowerCase();
  const results = document.getElementById('update-results');
  if (!q) { results.innerHTML = ''; return; }

  const filtered = APP.products.filter(p =>
    p.sku.toLowerCase().includes(q) || p.nama.toLowerCase().includes(q)
  );

  if (!filtered.length) {
    results.innerHTML = '<div class="empty-state"><div class="empty-state-text">Produk tidak ditemukan</div></div>';
    return;
  }

  results.innerHTML = filtered.map(p => `
    <div class="search-result-item" onclick="selectUpdateItem(${p.id})">
      <div>
        <div class="search-result-name">${p.nama}</div>
        <div class="search-result-meta">${p.sku} · ${p.ukuran} · ${p.warna}</div>
      </div>
      <div class="search-result-stok">Stok: ${p.stok}</div>
    </div>
  `).join('');
}

function selectUpdateItem(id) {
  const p = APP.products.find(x => x.id === id);
  if (!p) return;
  APP.selectedUpdateItem = p;

  document.getElementById('sel-name').textContent = p.nama;
  document.getElementById('sel-sku').textContent = p.sku + ' · ' + p.ukuran + ' · ' + p.warna;
  document.getElementById('sel-stok').textContent = 'Stok: ' + p.stok;
  document.getElementById('update-qty').value = 1;
  document.getElementById('update-note').value = '';
  document.getElementById('update-form').classList.add('show');
  document.getElementById('update-results').innerHTML = '';
  document.getElementById('update-search').value = '';
}

function adjustQty(delta) {
  const inp = document.getElementById('update-qty');
  const val = parseInt(inp.value) || 1;
  inp.value = Math.max(1, val + delta);
}

async function submitUpdateStok(action) {
  const p = APP.selectedUpdateItem;
  if (!p) return;
  
  const inputQty = parseInt(document.getElementById('update-qty').value) || 1;
  const note = document.getElementById('update-note').value.trim();

  // Validasi: Cegah kurangi stok kalau sisa barang lebih dikit dari yang mau dikurangin
  if (action === 'kurang' && p.stok < inputQty) {
    showToast(`Gagal: Stok saat ini (${p.stok}) tidak cukup dikurangi ${inputQty}`, 'error');
    return;
  }

  // Ubah input jadi angka minus kalau tombol yang diklik "Kurangi Stok"
  const finalQty = action === 'kurang' ? -inputQty : inputQty;

  // Disable kedua tombol biar nggak sengaja kepencet 2 kali (spam click)
  const btns = document.querySelectorAll('#view-update .btn-primary');
  btns.forEach(b => { b.textContent = 'PROSES...'; b.disabled = true; });

  // Kirim data ke API (API mock kita udah nanganin angka minus)
  const res = await API.updateStock(p.id, finalQty, note);

  // Balikin teks dan state tombol seperti semula
  btns[0].textContent = 'KURANGI STOK'; btns[0].disabled = false;
  btns[1].textContent = 'TAMBAH STOK';  btns[1].disabled = false;

  if (res.success) {
    document.getElementById('sel-stok').textContent = 'Stok: ' + res.data.stok;
    
    // Bikin notifikasi toast-nya dinamis sesuai aksi
    const actionText = action === 'kurang' ? `dikurangi (-${inputQty})` : `ditambah (+${inputQty})`;
    showToast(`Stok ${p.nama} berhasil ${actionText}`, 'success');
    
    document.getElementById('update-form').classList.remove('show');
    APP.selectedUpdateItem = null;
  } else {
    showToast('Gagal update stok. Coba lagi.', 'error');
  }
}

/* ============================================================
   KASIR / POS
============================================================ */
function renderPosProducts() {
  const q = document.getElementById('pos-search').value.trim().toLowerCase();
  const list = document.getElementById('pos-product-list');

  const filtered = q
    ? APP.products.filter(p => p.nama.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    : APP.products;

  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-state-text">Produk tidak ditemukan</div></div>';
    return;
  }

  list.innerHTML = filtered.map(p => `
    <div class="pos-product-item ${p.stok <= 0 ? 'out-of-stock' : ''}" 
         onclick="${p.stok > 0 ? `addToCart(${p.id})` : ''}">
      <div>
        <div class="pos-prod-name">${p.nama}</div>
        <div class="pos-prod-meta">${p.sku} · ${p.ukuran} · Stok: ${p.stok}</div>
      </div>
      <div class="pos-prod-price">${fmtRp(p.harga)}</div>
    </div>
  `).join('');
}

function addToCart(id) {
  const p = APP.products.find(x => x.id === id);
  if (!p || p.stok <= 0) return;

  const existing = APP.cart.find(x => x.id === id);
  if (existing) {
    if (existing.qty >= p.stok) { showToast('Stok tidak mencukupi', 'error'); return; }
    existing.qty++;
  } else {
    APP.cart.push({ id: p.id, nama: p.nama, harga: p.harga, qty: 1, sku: p.sku });
  }
  renderCart();
  showToast(p.nama + ' ditambahkan ke keranjang', 'success');
}

function updateCartQty(id, delta) {
  const item = APP.cart.find(x => x.id === id);
  if (!item) return;
  const p = APP.products.find(x => x.id === id);
  item.qty += delta;
  if (item.qty <= 0) APP.cart = APP.cart.filter(x => x.id !== id);
  else if (p && item.qty > p.stok) { item.qty = p.stok; showToast('Stok tidak mencukupi', 'error'); }
  renderCart();
}

function renderCart() {
  const container = document.getElementById('pos-cart-items');
  const badge = document.getElementById('cart-count-badge');
  const total = APP.cart.reduce((s, i) => s + i.harga * i.qty, 0);
  const count = APP.cart.reduce((s, i) => s + i.qty, 0);

  document.getElementById('pos-total').textContent = fmtRp(total);
  document.getElementById('btn-checkout').disabled = APP.cart.length === 0;
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);

  if (!APP.cart.length) {
    container.innerHTML = `<div class="cart-empty">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <div class="cart-empty-text">Keranjang kosong</div></div>`;
    return;
  }

  container.innerHTML = APP.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nama}</div>
        <div class="cart-item-price">${fmtRp(item.harga)} / pcs</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-qty-btn" onclick="updateCartQty(${item.id},-1)">−</button>
        <span class="cart-qty-val">${item.qty}</span>
        <button class="cart-qty-btn" onclick="updateCartQty(${item.id},1)">+</button>
      </div>
      <div class="cart-item-subtotal">${fmtRp(item.harga * item.qty)}</div>
    </div>
  `).join('');
}

async function doCheckout() {
  if (!APP.cart.length) return;
  const total = APP.cart.reduce((s, i) => s + i.harga * i.qty, 0);
  const btn = document.getElementById('btn-checkout');
  btn.textContent = 'MEMPROSES...'; btn.disabled = true;

  const res = await API.createTransaction(APP.cart, total);

  btn.textContent = 'PROSES TRANSAKSI';

  if (res.success) {
    const now = new Date();
    const timeStr = now.toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'});
    document.getElementById('modal-sub-text').textContent = `ID: ${res.txId} · ${timeStr}`;

    const rows = APP.cart.map(i =>
      `<tr><td>${i.nama} × ${i.qty}</td><td>${fmtRp(i.harga * i.qty)}</td></tr>`
    ).join('');
    document.getElementById('receipt-table').innerHTML = rows +
      `<tr class="receipt-total-row"><td>Total</td><td>${fmtRp(total)}</td></tr>`;

    document.getElementById('modal-sukses').classList.add('show');
    APP.cart = [];
    renderCart();
    renderPosProducts();
  } else {
    showToast('Transaksi gagal. Coba lagi.', 'error');
    btn.disabled = false;
  }
}

function tutupModal() {
  document.getElementById('modal-sukses').classList.remove('show');
}

function printReceipt() {
  const content = document.getElementById('modal-sukses').innerHTML;
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>Struk</title>
    <style>body{font-family:monospace;padding:20px;max-width:300px;margin:0 auto}
    table{width:100%;border-collapse:collapse}td{padding:4px 0}
    td:last-child{text-align:right}.receipt-total-row td{border-top:1px solid #000;padding-top:8px;font-weight:bold}
    </style></head><body>${document.getElementById('receipt-table').outerHTML}</body></html>`);
  w.document.close(); w.print();
}

/* ============================================================
   MONITORING
============================================================ */
function renderMonitorTable() {
  const q = document.getElementById('monitor-search').value.trim().toLowerCase();
  const LOW_STOCK = 15;

  let filtered = q
    ? APP.products.filter(p =>
        p.sku.toLowerCase().includes(q) ||
        p.nama.toLowerCase().includes(q) ||
        p.kategori.toLowerCase().includes(q))
    : APP.products;

  // Low stock alert
  const lowItems = APP.products.filter(p => p.stok <= LOW_STOCK);
  const banner = document.getElementById('low-stock-banner');
  if (lowItems.length) {
    banner.style.display = 'flex';
    document.getElementById('low-stock-text').textContent =
      `${lowItems.length} produk memiliki stok rendah (≤${LOW_STOCK}): ${lowItems.map(p=>p.nama).join(', ')}`;
  } else {
    banner.style.display = 'none';
  }

  const total = filtered.length;
  const perPage = APP.monitorPerPage;
  const totalPages = Math.ceil(total / perPage);
  APP.monitorPage = Math.min(APP.monitorPage, totalPages || 1);

  const start = (APP.monitorPage - 1) * perPage;
  const page = filtered.slice(start, start + perPage);

  document.getElementById('monitor-info').textContent =
    total ? `Menampilkan ${start+1}-${Math.min(start+perPage, total)} dari ${total}` : 'Tidak ada data';

  document.getElementById('pg-prev').disabled = APP.monitorPage <= 1;
  document.getElementById('pg-next').disabled = APP.monitorPage >= totalPages;

  const tbody = document.getElementById('monitor-tbody');
  if (!page.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state-text">Data tidak ditemukan</div></div></td></tr>`;
    return;
  }

  tbody.innerHTML = page.map(p => `
    <tr>
      <td class="td-sku">${p.sku}</td>
      <td class="td-name">${p.nama}</td>
      <td>${p.kategori}</td>
      <td>${p.ukuran}</td>
      <td>${p.warna}</td>
      <td class="td-stok">
        ${p.stok <= LOW_STOCK
          ? `<span class="badge-low">${p.stok}</span>`
          : `<span class="badge-ok">${p.stok}</span>`}
      </td>
    </tr>
  `).join('');
}

function changePage(delta) {
  APP.monitorPage += delta;
  renderMonitorTable();
}