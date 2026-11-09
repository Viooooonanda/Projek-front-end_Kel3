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
import { bacaMenu, bacaKeranjang, simpanKeranjang, cariProduk, rupiah } from './MenuData.js';


function Pemesanan() {
  const [menu] = useState(bacaMenu);
  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [catatan, setCatatan] = useState('');
  const [bayar, setBayar] = useState('');
  const [items, setItems] = useState(() => bacaKeranjang(menu));
  const [pilih, setPilih] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [err, setErr] = useState({});
  const [step, setStep] = useState(null); // null | 'konfirmasi' | 'qris' | 'sukses'
  const [pesanan, setPesanan] = useState(null);

  const cari = (id) => cariProduk(id, menu);
  const GRUP_ID = ['Makanan', 'Minuman', 'Snack'].map((label) => [label, menu.filter((p) => p.kategori === label)]);
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
      nama: nama.trim().length < 2 ? 'Nama wajib diisi.' : '',
      hp: /^08\d{8,12}$/.test(hpBersih) ? '' : 'Masukkan nomor HP yang benar, contoh 08123456789.',
      produk: items.length ? '' : 'Tambahkan minimal satu produk ke pesanan.',
      bayar: bayar ? '' : 'Pilih metode pembayaran.',
    };
    setErr(baru);
    if (Object.values(baru).some(Boolean)) return;
    setPesanan({
      no: 'AGJ-' + String(Date.now()).slice(-6),
      nama: nama.trim(), hp: hp.trim(), catatan: catatan.trim(), bayar,
      items: items.map((c) => ({ ...c })), total,
    });
    setStep('konfirmasi');
  };

  const konfirmasi = () => {
    try {
      const lama = JSON.parse(localStorage.getItem('pesananGeybok')) || [];
      lama.push({ ...pesanan, waktu: new Date().toISOString() });
      localStorage.setItem('pesananGeybok', JSON.stringify(lama));
    } catch (e) { /* abaikan */ }
    if (pesanan.bayar === 'QRIS') setStep('qris');
    else selesai();
  };

  const selesai = () => {
    ubahItems([]);
    setNama(''); setHp(''); setCatatan(''); setBayar(''); setErr({});
    setStep('sukses');
  };

  const infoBayar = pesanan && (
    pesanan.bayar === 'QRIS' ? 'Pembayaranmu akan kami cek. Terima kasih!'
      : pesanan.bayar === 'Cash' ? 'Siapkan uang pas saat mengambil pesanan.'
        : 'Pembayaran debit dilakukan saat pesanan diambil.');

  const daftarPesanan = (list) => list.map((c) => {
    const p = cari(c.id);
    return (
      <div className="kv" key={c.id}>
        <span>{p.nama} × {c.qty}</span>
        <span>{rupiah(p.harga * c.qty)}</span>
      </div>
    );
  });

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
            <p>Isi data di bawah untuk melakukan pemesanan.</p>
          </div>
          <img src="/image/geybok.jpg" alt="Ayam Geybok" className="judul-img d-none d-md-block" />
        </div>

        {/* FORM */}
        <Form className="kartu" noValidate onSubmit={submit}>
          <Row className="mb-3">
            <Form.Group as={Col} md={6} controlId="nama" className="mb-3 mb-md-0">
              <Form.Label>Nama<span className="req">*</span></Form.Label>
              <Form.Control
                type="text" placeholder="Masukkan nama" autoComplete="name"
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
              as="textarea" rows={3} placeholder="Tambahkan catatan pesanan..."
              value={catatan} onChange={(e) => setCatatan(e.target.value)}
            />
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
                Belum ada produk. Pilih menu di atas lalu klik Tambah, atau <a href="/produk">lihat halaman Produk</a>.
              </p>
            )}
            <div className="total">
              <span>Total Harga</span>
              <b>{rupiah(total)}</b>
            </div>
          </section>

          <Button type="submit" className="btn-submit w-100">SUBMIT</Button>
          <p className="catatan-kecil">* Wajib diisi. Pastikan data pesanan sudah benar sebelum menekan Submit.</p>
        </Form>
      </Container>

      {/* FOOTER */}
      <footer className="footer-bar">
        <h3>AYAM GEYBOK BANG JARWO</h3>
        <p>Kuliner ayam dengan cita rasa khas dan harga terjangkau.</p>
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
            <Modal.Header closeButton><Modal.Title>Periksa kembali pesananmu</Modal.Title></Modal.Header>
            <Modal.Body>
              <div className="kv"><span>Nama</span><span>{pesanan.nama}</span></div>
              <div className="kv"><span>Nomor HP</span><span>{pesanan.hp}</span></div>
              <div className="kv"><span>Catatan</span><span>{pesanan.catatan || '-'}</span></div>
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
                    <div className="ph">Taruh gambar QRIS di <b>public/image/qris.jpg</b></div>
                    <p className="mt-2 mb-0"><b>{rupiah(pesanan.total)}</b></p>
                  </div>
                </Col>
                <Col md={7}>
                  <b>Cara Pembayaran:</b>
                  <ol className="cara">
                    <li>Buka aplikasi e-wallet atau mobile banking.</li>
                    <li>Pilih menu Scan QR atau QRIS.</li>
                    <li>Arahkan kamera ke kode QRIS.</li>
                    <li>Pastikan nominal pembayaran sudah sesuai.</li>
                    <li>Konfirmasi pembayaran di aplikasimu.</li>
                    <li>Klik tombol "Sudah Bayar" setelah transaksi berhasil.</li>
                  </ol>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-gelap" onClick={selesai}>Sudah Bayar</Button>
            </Modal.Footer>
          </>
        )}

        {step === 'sukses' && pesanan && (
          <>
            <Modal.Body>
              <div className="sukses">
                <div className="tick"><i className="fa-solid fa-circle-check" /></div>
                <h3>Pesanan berhasil dikirim</h3>
                <div className="no-pesanan">{pesanan.no}</div>
                <p>Terima kasih, {pesanan.nama}! {infoBayar}</p>
              </div>
              {daftarPesanan(pesanan.items)}
              <div className="total"><span>Total Harga</span><b>{rupiah(pesanan.total)}</b></div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-gelap" href="/produk">Kembali ke Produk</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}

export default Pemesanan;
