import { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import './style.css';
import { bacaMenu, bacaKeranjang, simpanKeranjang, cariProduk, rupiah, daftarKategori } from './MenuData.js';
import { tambahPesanan } from './DataPesanan.js';


function Pemesanan() {
  const [menu] = useState(bacaMenu);
  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [catatan, setCatatan] = useState('');
  const [bayar, setBayar] = useState('');
  const [jenisPesanan, setJenisPesanan] = useState('');
  const [items, setItems] = useState(() => bacaKeranjang(menu));
  const [pilih, setPilih] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [err, setErr] = useState({});
  const [step, setStep] = useState(null); // kosong | konfirmasi | qris | sukses
  const [pesanan, setPesanan] = useState(null);
  const [strukModal, setStrukModal] = useState(false);

  const cari = (id) => cariProduk(id, menu);
  const GRUP_ID = daftarKategori(menu)
    .map((label) => [label, menu.filter((p) => p.kategori === label)])
    .filter(([, list]) => list.length > 0);
  const total = items.reduce((s, c) => s + c.qty * (cari(c.id)?.harga || 0), 0);
  const jumlahItem = items.reduce((s, c) => s + c.qty, 0);

  const ubahItems = (list) => { setItems(list); simpanKeranjang(list); };

  const tambah = () => {
    const id = Number(pilih);
    const j = parseInt(jumlah, 10);
    if (!id || !(j >= 1)) {
      setErr((e) => ({ ...e, produk: 'Pilih menu dan isi jumlah minimal 1.' }));
      return;
    }
    setErr((e) => ({ ...e, produk: '' }));
    const ada = items.find((c) => c.id === id);
    ubahItems(ada
      ? items.map((c) => (c.id === id ? { ...c, qty: Math.min(99, c.qty + j) } : c))
      : [...items, { id, qty: j }]);
    setPilih('');
    setJumlah(1);
  };

  const ubahQty = (id, d) =>
    ubahItems(items
      .map((c) => (c.id === id ? { ...c, qty: Math.min(99, c.qty + d) } : c))
      .filter((c) => c.qty > 0));
  const hapus = (id) => ubahItems(items.filter((c) => c.id !== id));

  const submit = (e) => {
    e.preventDefault();
    const hpBersih = hp.replace(/[\s-]/g, '');
    const baru = {
      nama: nama.trim().length < 2 ? 'Nama belum diisi.' : '',
      hp: /^08\d{8,12}$/.test(hpBersih) ? '' : 'Nomor HP-nya kurang pas. Contoh: 08123456789',
      produk: items.length ? '' : 'Pilih minimal satu menu dulu.',
      jenisPesanan: jenisPesanan ? '' : 'Pilih dulu jenis pesanannya.',
      bayar: bayar ? '' : 'Pilih dulu metode bayarnya.',
    };
    setErr(baru);
    if (Object.values(baru).some(Boolean)) return;
    setPesanan({
      no: 'AGJ-' + String(Date.now()).slice(-6),
      nama: nama.trim(),
      hp: hp.trim(),
      catatan: catatan.trim(),
      jenisPesanan: jenisPesanan,
      bayar,
      waktu: new Date().toISOString(),
      items: items.map((c) => ({ ...c })), total,
    });
    setStep('konfirmasi');
  };

  const konfirmasi = () => {
    try {
      const itemDetail = pesanan.items.map((c) => {
        const p = cari(c.id);
        return {
          id: c.id,
          qty: c.qty,
          nama: p?.nama || 'Produk',
          harga: p?.harga || 0,
          subtotal: (p?.harga || 0) * c.qty,
        };
      });
      tambahPesanan({
        ...pesanan,
        id: pesanan.no,
        status: 'Dikonfirmasi',
        waktu: new Date().toISOString(),
        items: itemDetail,
      });
    } catch { /* simpan gagal, tetap lanjut */ }
    if (pesanan.bayar === 'QRIS') setStep('qris');
    else selesai();
  };

  const selesai = () => {
    ubahItems([]);
    setNama(''); setHp(''); setCatatan(''); setJenisPesanan(''); setBayar(''); setErr({});
    setStep('sukses');
  };

  const infoBayar = pesanan && (
    pesanan.bayar === 'QRIS' ? 'Pembayaranmu akan kami cek ya.'
      : pesanan.bayar === 'Cash' ? 'Siapkan uang pas pas ambil pesanan.'
      : 'Debit dibayar pas pesanan diambil.');

  const daftarPesanan = (list) => list.map((c) => {
    const p = cari(c.id);
    return (
      <div className="kv" key={c.id}>
        <span>{p.nama} × {c.qty}</span>
        <span>{rupiah(p.harga * c.qty)}</span>
      </div>
    );
  });

  // detail menu buat struk
  const strukItemDetail = (list = []) => list.map((c) => {
    const p = cari(c.id);
    return {
      id: c.id, qty: c.qty,
      nama: p?.nama || 'Produk',
      harga: p?.harga || 0,
      subtotal: (p?.harga || 0) * c.qty,
    };
  });

  const htmlEscape = (s) => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const waktuStruk = (waktu) => (waktu ? new Date(waktu).toLocaleString('id-ID') : '-');

  // struk versi file HTML, biar bisa disimpan
  const strukHtml = (p) => {
    const baris = strukItemDetail(p.items).map((c) =>
      `<tr><td>${htmlEscape(c.nama)} <small>× ${c.qty}</small></td>` +
      `<td style="text-align:right">${rupiah(c.harga)}</td>` +
      `<td style="text-align:right;font-weight:700">${rupiah(c.subtotal)}</td></tr>`).join('');
    const kv = (label, nilai) => `<div class="kv"><span>${htmlEscape(label)}</span><span>${htmlEscape(nilai)}</span></div>`;
    const catatanBaris = p.catatan ? kv('Catatan', p.catatan) : '';
    return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>Struk ${htmlEscape(p.no || '')}</title>
<style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#2e1c05;max-width:460px;margin:24px auto;padding:0 14px}
h2{font-size:20px;text-align:center;margin:0 0 12px}
.kv{display:flex;justify-content:space-between;gap:12px;padding:4px 0;border-bottom:1px solid #e0c486}
table{width:100%;border-collapse:collapse;margin:12px 0}
td{padding:3px 0}
td small{font-size:11px;color:#8a6a3c}
tr td:last-child{text-align:right}
.total{border-top:2px solid #2e1c05;padding-top:8px;margin-top:12px}
.total span:first-child{font-weight:700}
.total b{font-size:18px}
.foot{font-size:11px;color:#8a6a3c;text-align:center;margin-top:14px}
</style></head>
<body>
<h2>Struk Pembelian</h2>
${kv('No. Struk', p.no || '')}
${kv('Waktu', waktuStruk(p.waktu))}
${kv('Nama Pemesan', p.nama || '')}
${kv('Nomor HP', p.hp || '')}
${kv('Jenis Pesanan', p.jenisPesanan || '')}
${kv('Metode Pembayaran', p.bayar || '')}
${catatanBaris}
<table>${baris}</table>
<div class="total"><span>Total Harga</span><b>${rupiah(p.total || 0)}</b></div>
<p class="foot">Ayam Geybok Bang Jarwo — makasih ya!</p>
</body></html>`;
  };

  const tampilStruk = () => {
    setStrukModal(true);
    setStep(null);
  };

  const simpanStruk = () => {
    if (!pesanan) return;
    const blob = new Blob([strukHtml(pesanan)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Struk-${pesanan.no || 'AGJ'}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pemesanan-page">
      {/* HEADER */}
      <Navbar expand="md" className="header-bar" sticky="top">
        <Container>
          <Navbar.Brand href="/">
            <img src="/image/logo.jpg" alt="Logo Ayam Geybok Bang Jarwo" className="logo-img" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="menu-utama" />
          <Navbar.Collapse id="menu-utama">
            <Nav className="ms-auto align-items-md-center gap-md-2 fw-bold">
              <Nav.Link href="/">HOME</Nav.Link>
              <Nav.Link href="/produk">PRODUK</Nav.Link>
              <NavDropdown title="INFORMASI" align="end">
                <NavDropdown.Item href="/#produk-unggulan">PRODUK UNGGULAN</NavDropdown.Item>
                <NavDropdown.Item href="/#lokasi">LOKASI</NavDropdown.Item>
                <NavDropdown.Item href="/pemesanan">PEMESANAN</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/admin">ADMIN</NavDropdown.Item>
              </NavDropdown>
              <a className="cart-btn" href="#ringkasan" aria-label="Lihat ringkasan pesanan">
                <i className="fa-solid fa-cart-shopping" />
                <Badge pill bg="" className="cart-badge">{jumlahItem}</Badge>
              </a>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* JUDUL */}
      <Container className="isi">
        <div className="judul d-flex align-items-center justify-content-between gap-3">
          <div>
            <h1>Form Pemesanan</h1>
            <p>Silahkan isi data dan produk yang anda inginkan</p>
          </div>
          <img src="/image/geybok.jpg" alt="Ayam Geybok" className="judul-img d-none d-md-block" />
        </div>

        {/* FORM */}
        <Form className="kartu" noValidate onSubmit={submit}>
          <Row className="mb-3">
            <Form.Group as={Col} md={6} controlId="nama" className="mb-3 mb-md-0">
              <Form.Label>Nama<span className="req">*</span></Form.Label>
              <Form.Control
                type="text" placeholder="Nama kamu" autoComplete="name"
                value={nama} onChange={(e) => setNama(e.target.value)} isInvalid={!!err.nama}
              />
              <Form.Control.Feedback type="invalid">{err.nama}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="hp">
              <Form.Label>Nomor HP<span className="req">*</span></Form.Label>
              <Form.Control
                type="tel" inputMode="numeric" placeholder="08xxxxxxxxxx" autoComplete="tel"
                value={hp} onChange={(e) => setHp(e.target.value)} isInvalid={!!err.hp}
              />
              <Form.Control.Feedback type="invalid">{err.hp}</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3 align-items-end g-2">
            <Form.Group as={Col} xs={12} md controlId="produk">
              <Form.Label>Pilih Produk<span className="req">*</span></Form.Label>
              <Form.Select value={pilih} onChange={(e) => setPilih(e.target.value)} isInvalid={!!err.produk}>
                <option value="">Pilih menu</option>
                {GRUP_ID.map(([label, list]) => (
                  <optgroup label={label} key={label}>
                    {list.map((p) => (
                      <option value={p.id} key={p.id}>{p.nama} - {rupiah(p.harga)}</option>
                    ))}
                  </optgroup>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={5} md="auto" controlId="jumlah" className="jumlah-col">
              <Form.Label>Jumlah<span className="req">*</span></Form.Label>
              <Form.Control
                type="number" min="1" max="99"
                value={jumlah} onChange={(e) => setJumlah(e.target.value)}
              />
            </Form.Group>
            <Col xs={7} md="auto">
              <Button type="button" className="btn-tambah w-100" onClick={tambah}>
                <i className="fa-solid fa-plus" /> Tambah
              </Button>
            </Col>
            {err.produk && <div className="text-danger small mt-1">{err.produk}</div>}
          </Row>

          <Form.Group className="mb-3" controlId="catatan">
            <Form.Label>Catatan</Form.Label>
            <Form.Control
              as="textarea" rows={3} placeholder="Catatan kalau ada..."
              value={catatan} onChange={(e) => setCatatan(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Jenis Pesanan<span className="req">*</span></Form.Label>
            <div className="pay">
              {['Take Away', 'Dine In', 'Delivered'].map((m) => (
                <Form.Check
                  key={m}
                  type="radio"
                  name="jenisPesanan"
                  id={`jenis-${m}`}
                  label={m}
                  className={'pay-opt' + (jenisPesanan === m ? ' aktif' : '')}

                  checked={jenisPesanan === m}
                  onChange={() => setJenisPesanan(m)}
                />
              ))}
            </div>

            {err.jenisPesanan && (
              <div className="text-danger small mt-1">{err.jenisPesanan}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Metode Pembayaran<span className="req">*</span></Form.Label>
            <div className="pay">
              {['QRIS', 'Cash', 'Debit'].map((m) => (
                <Form.Check
                  key={m} type="radio" name="bayar" id={`bayar-${m}`} label={m}
                  className={'pay-opt' + (bayar === m ? ' aktif' : '')}
                  checked={bayar === m} onChange={() => setBayar(m)} isInvalid={!!err.bayar}
                />
              ))}
            </div>
            {err.bayar && <div className="text-danger small mt-1">{err.bayar}</div>}
          </Form.Group>

          {/* RINGKASAN PESANAN */}
          <section className="ringkasan" id="ringkasan" aria-live="polite">
            <h2>Ringkasan Pesanan</h2>
            {items.length ? items.map((c) => {
              const p = cari(c.id);
              return (
                <div className="baris" key={c.id}>
                  <div className="nm">
                    {p.nama}
                    <small>{rupiah(p.harga)} / porsi</small>
                  </div>
                  <div className="qty">
                    <button type="button" onClick={() => ubahQty(c.id, -1)} aria-label="Kurangi">−</button>
                    <span>{c.qty}</span>
                    <button type="button" onClick={() => ubahQty(c.id, 1)} aria-label="Tambah">+</button>
                  </div>
                  <div className="sub">{rupiah(p.harga * c.qty)}</div>
                  <button type="button" className="hapus" onClick={() => hapus(c.id)} aria-label={`Hapus ${p.nama}`}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              );
            }) : (
              <p className="kosong">
                Belum ada menu. Pilih di atas terus klik Tambah, atau <a href="/produk">cek halaman Produk</a>.
              </p>
            )}
            <div className="total">
              <span>Total Harga</span>
              <b>{rupiah(total)}</b>
            </div>
          </section>

          <Button type="submit" className="btn-submit w-100">SUBMIT</Button>
          <p className="catatan-kecil">* Wajib diisi. Cek dulu ya sebelum kirim.</p>
        </Form>
      </Container>

      {/* FOOTER */}
      <footer className="footer-bar">
        <h3>AYAM GEYBOK BANG JARWO</h3>
        <p>Ayam enak, harga bersahabat.</p>
        <div className="social">
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook" /></a>
          <a href="#" aria-label="WhatsApp"><i className="fab fa-whatsapp" /></a>
        </div>
      </footer>

      {/* MODAL: konfirmasi, QRIS, sukses */}
      <Modal
        show={step !== null} centered size="lg" className="modal-geybok"
        onHide={() => step === 'konfirmasi' && setStep(null)}
        backdrop={step === 'konfirmasi' ? true : 'static'} keyboard={step === 'konfirmasi'}
      >
        {step === 'konfirmasi' && pesanan && (
          <>
            <Modal.Header closeButton><Modal.Title>Cek dulu pesananmu</Modal.Title></Modal.Header>
            <Modal.Body>
              <div className="kv"><span>Nama</span><span>{pesanan.nama}</span></div>
              <div className="kv"><span>Nomor HP</span><span>{pesanan.hp}</span></div>
              <div className="kv"><span>Catatan</span><span>{pesanan.catatan || '-'}</span></div>
              <div className="kv"><span>Jenis Pesanan</span><span>{pesanan.jenisPesanan === 'Dine In' && 'Dine In - Makan di tempat'}
                {pesanan.jenisPesanan === 'Take Away' && 'Take Away - Dibungkus untuk dibawa pulang'}
                {pesanan.jenisPesanan === 'Delivered' && 'Delivered - Diantar ke alamat pelanggan'}</span></div>
              <div className="kv"><span>Pembayaran</span><span>{pesanan.bayar}</span></div>
              {daftarPesanan(pesanan.items)}
              <div className="total"><span>Total Harga</span><b>{rupiah(pesanan.total)}</b></div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-abu" onClick={() => setStep(null)}>Ubah pesanan</Button>
              <Button className="btn-gelap" onClick={konfirmasi}>Konfirmasi pesanan</Button>
            </Modal.Footer>
          </>
        )}

        {step === 'sukses' && pesanan && (
          <>
            <Modal.Body>
              <div className="sukses">
                <div className="tick"><i className="fa-solid fa-circle-check" /></div>
                <h3>Pesanan berhasil </h3>
                <div className="no-pesanan">{pesanan.no}</div>
                <p>Makasih, {pesanan.nama}! {infoBayar}</p>
              </div>
              {daftarPesanan(pesanan.items)}
              <div className="total"><span>Total Harga</span><b>{rupiah(pesanan.total)}</b></div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-gelap" onClick={tampilStruk}><i className="fa-solid fa-print" /> Cetak Struk</Button>
              <Button className="btn-gelap" href="/produk">Kembali ke Produk</Button>
            </Modal.Footer>
          </>
        )}

        {step === 'qris' && pesanan && (
          <>
            <Modal.Header><Modal.Title>Pembayaran QRIS</Modal.Title></Modal.Header>
            <Modal.Body>
              <Row className="g-3">
                <Col md={5}>
                  <div className="qris">
                    <img
                      src="/image/qris.jpg" alt="Kode QRIS"
                      onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'block'; }}
                    />
                    <div className="ph">Taruh QRIS di <b>public/image/qris.jpg</b></div>
                    <p className="mt-2 mb-0"><b>{rupiah(pesanan.total)}</b></p>
                  </div>
                </Col>
                <Col md={7}>
                  <b>Cara bayar:</b>
                  <ol className="cara">
                    <li>Buka e-wallet atau m-banking kamu.</li>
                    <li>Pilih Scan QR / QRIS.</li>
                    <li>Arahkan kamera ke QR-nya.</li>
                    <li>Cek nominalnya dulu ya.</li>
                    <li>Konfirmasi di aplikasi.</li>
                    <li>Setelah bayar, klik "Sudah Bayar".</li>
                  </ol>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-gelap" onClick={selesai}>Sudah Bayar</Button>
            </Modal.Footer>
          </>
        )}

      </Modal>

      {/* MODAL: struk pembelian */}
      <Modal
        show={strukModal && !!pesanan}
        onHide={() => setStrukModal(false)}
        centered
        className="modal-geybok modal-struk"
      >
        <Modal.Header closeButton><Modal.Title>Struk Pembelian</Modal.Title></Modal.Header>
        <Modal.Body>
          {pesanan && (
            <>
              <div className="kv"><span>No. Struk</span><span>{pesanan.no}</span></div>
              <div className="kv"><span>Waktu</span><span>{waktuStruk(pesanan.waktu)}</span></div>
              <div className="kv"><span>Nama Pemesan</span><span>{pesanan.nama}</span></div>
              <div className="kv"><span>Nomor HP</span><span>{pesanan.hp}</span></div>
              <div className="kv"><span>Metode Pembayaran</span><span>{pesanan.bayar}</span></div>
              {pesanan.catatan && <div className="kv"><span>Catatan</span><span>{pesanan.catatan}</span></div>}
              <div className="struk-baris">
                <div className="struk-judul">Menu Pembelian</div>
                {strukItemDetail(pesanan.items).map((c) => (
                  <div className="struk-item" key={c.id}>
                    <span className="struk-nm">{c.nama} <small>× {c.qty}</small></span>
                    <span className="struk-tt">@ {rupiah(c.harga)}</span>
                    <span className="struk-sub">{rupiah(c.subtotal)}</span>
                  </div>
                ))}
                <div className="struk-total"><span>Total</span><b>{rupiah(pesanan.total)}</b></div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-gelap" onClick={simpanStruk}><i className="fa-solid fa-download" /> Download Struk</Button>
          <Button className="btn-abu" onClick={() => setStrukModal(false)}>Tutup</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Pemesanan;
