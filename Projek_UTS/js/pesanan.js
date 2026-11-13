// Pengelolaan data riwayat pesanan (disimpan di localStorage browser)
const STORAGE_KEY = 'riwayatPesanan';

function ambilPesanan() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Gagal membaca riwayat pesanan:', e);
    return [];
  }
}

function simpanPesanan(daftar) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(daftar));
}

function formatRupiah(angka) {
  const n = Number(angka) || 0;
  return 'Rp ' + n.toLocaleString('id-ID');
}

function buatIdPesanan() {
  return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function tambahPesanan(pesanan) {
  const daftar = ambilPesanan();
  daftar.unshift(pesanan);
  simpanPesanan(daftar);
  return pesanan;
}

function updateStatusPesanan(id, statusBaru) {
  const daftar = ambilPesanan();
  const idx = daftar.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  daftar[idx].status = statusBaru;
  daftar[idx].diupdatePada = new Date().toISOString();
  simpanPesanan(daftar);
  return true;
}

function hapusPesanan(id) {
  const daftar = ambilPesanan().filter((p) => p.id !== id);
  simpanPesanan(daftar);
  return daftar;
}

// Inisialisasi form pemesanan (halaman pemesanan.html)
function initFormPemesanan() {
  const form = document.getElementById('form-pemesanan');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const nomor = document.getElementById('nomor').value.trim();
    const produkSelect = document.getElementById('produk');
    const produk = produkSelect.value;
    const harga = Number(produkSelect.selectedOptions[0]?.dataset.harga || 0);
    const jumlah = Number(document.getElementById('jumlah').value || 0);
    const catatan = document.getElementById('catatan').value.trim();
    const paymentInput = form.querySelector('input[name="payment"]:checked');
    const payment = paymentInput ? paymentInput.value : '';

    if (!nama || !nomor || !produk || !jumlah || !payment) {
      alert('Mohon lengkapi semua data yang wajib diisi.');
      return;
    }

    const yakin = confirm(
      'Konfirmasi pesanan?\n\n' +
        'Nama: ' + nama + '\n' +
        'Produk: ' + produk + '\n' +
        'Jumlah: ' + jumlah + '\n' +
        'Total: ' + formatRupiah(harga * jumlah) + '\n' +
        'Pembayaran: ' + payment
    );
    if (!yakin) return;

    const pesanan = {
      id: buatIdPesanan(),
      nama,
      nomor,
      produk,
      harga,
      jumlah,
      total: harga * jumlah,
      catatan,
      payment,
      status: 'Dikonfirmasi',
      dibuatPada: new Date().toISOString(),
      diupdatePada: new Date().toISOString(),
    };

    tambahPesanan(pesanan);
    alert('Pesanan berhasil dikonfirmasi dan masuk ke riwayat admin.');
    form.reset();
    document.getElementById('jumlah').value = 1;
  });
}

// Render riwayat pesanan (halaman admin.html)
function renderRiwayatAdmin() {
  const container = document.getElementById('riwayat-container');
  if (!container) return;

  const daftar = ambilPesanan();
  if (daftar.length === 0) {
    container.innerHTML = '<p class="admin-empty">Belum ada riwayat pemesanan.</p>';
    return;
  }

  const rows = daftar
    .map((p, i) => {
      const tanggal = p.dibuatPada ? new Date(p.dibuatPada).toLocaleString('id-ID') : '-';
      const statusClass = 'status-' + String(p.status || '').toLowerCase().replace(/\s+/g, '-');
      return `
        <tr>
          <td data-label="No">
            <div class="admin-no-cell">
              <span>${i + 1}</span>
              <button type="button" class="btn-hapus-pesanan" data-id="${p.id}" aria-label="Hapus riwayat">Hapus</button>
            </div>
          </td>
          <td data-label="Waktu">${tanggal}</td>
          <td data-label="Nama">${escapeHtml(p.nama || '-')}</td>
          <td data-label="Nomor HP">${escapeHtml(p.nomor || '-')}</td>
          <td data-label="Produk">${escapeHtml(p.produk || '-')}</td>
          <td data-label="Jumlah">${p.jumlah || 0}</td>
          <td data-label="Total">${formatRupiah(p.total || 0)}</td>
          <td data-label="Pembayaran">${escapeHtml(p.payment || '-')}</td>
          <td data-label="Catatan">${escapeHtml(p.catatan || '-')}</td>
          <td data-label="Status"><span class="status-badge ${statusClass}">${escapeHtml(p.status || '-')}</span></td>
          <td data-label="Aksi">
            <select class="status-select" data-id="${p.id}" aria-label="Ubah status pesanan">
              <option value="Dikonfirmasi" ${p.status === 'Dikonfirmasi' ? 'selected' : ''}>Dikonfirmasi</option>
              <option value="Diproses" ${p.status === 'Diproses' ? 'selected' : ''}>Diproses</option>
              <option value="Selesai" ${p.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
              <option value="Dibatalkan" ${p.status === 'Dibatalkan' ? 'selected' : ''}>Dibatalkan</option>
            </select>
          </td>
        </tr>`;
    })
    .join('');

  container.innerHTML = `
    <div class="table-wrap admin-table-wrap">
      <table class="product-table admin-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Waktu</th>
            <th>Nama</th>
            <th>Nomor HP</th>
            <th>Produk</th>
            <th>Jumlah</th>
            <th>Total</th>
            <th>Pembayaran</th>
            <th>Catatan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  container.querySelectorAll('.status-select').forEach((sel) => {
    sel.addEventListener('change', function () {
      const id = this.getAttribute('data-id');
      const statusBaru = this.value;
      if (updateStatusPesanan(id, statusBaru)) {
        renderRiwayatAdmin();
      }
    });
  });

  container.querySelectorAll('.btn-hapus-pesanan').forEach((btn) => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      if (confirm('Hapus riwayat pesanan ini?')) {
        hapusPesanan(id);
        renderRiwayatAdmin();
      }
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', function () {
  initFormPemesanan();
  renderRiwayatAdmin();
});
