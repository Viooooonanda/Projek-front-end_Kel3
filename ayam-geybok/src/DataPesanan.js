// File JS untuk menyimpan dan mengelola data riwayat pemesanan
// Data disimpan di localStorage browser agar tetap ada setelah halaman direfresh.

export const PESANAN_KEY = 'pesananGeybok';

export const STATUS_PESANAN = ['Dikonfirmasi', 'Diproses', 'Selesai', 'Dibatalkan'];

export function bacaPesanan() {
  try {
    const data = JSON.parse(localStorage.getItem(PESANAN_KEY));
    if (Array.isArray(data)) {
      return data.map((p, i) => ({
        id: p.id || p.no || `lama-${i}`,
        status: p.status || 'Dikonfirmasi',
        ...p,
      }));
    }
  } catch (error) {
    console.warn('Data pesanan tidak dapat dibaca:', error);
  }
  return [];
}

export function simpanPesanan(list) {
  try {
    localStorage.setItem(PESANAN_KEY, JSON.stringify(list));
    return true;
  } catch (error) {
    console.error('Data pesanan gagal disimpan:', error);
    return false;
  }
}

export function tambahPesanan(pesanan) {
  const list = bacaPesanan();
  list.push(pesanan);
  simpanPesanan(list);
  return list;
}

export function updateStatusPesanan(id, status) {
  const list = bacaPesanan().map((p) =>
    String(p.id || p.no) === String(id)
      ? { ...p, status, diupdatePada: new Date().toISOString() }
      : p
  );
  simpanPesanan(list);
  return list;
}

export function hapusPesanan(id) {
  const list = bacaPesanan().filter((p) => String(p.id || p.no) !== String(id));
  simpanPesanan(list);
  return list;
}
