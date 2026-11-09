import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import './style.css';
import { MENU_AWAL, bacaMenu, simpanMenu as simpanMenuStorage, rupiah } from './MenuData.js';

const KATEGORI = ['Makanan', 'Minuman', 'Snack'];
const AWAL = MENU_AWAL;
const KOSONG = { nama: '', harga: '', kategori: 'Makanan', deskripsi: '', gambar: '' };

const rp = rupiah;

/* perkecil gambar supaya muat di localStorage */
function kecilkanGambar(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const skala = Math.min(1, 480 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = img.width * skala;
        c.height = img.height * skala;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const HALAMAN = {
  dashboard: ['Dashboard Admin', 'Kelola menu dan informasi website dengan mudah!', '🏠'],
  pengaturan: ['Pengaturan', 'Atur data aplikasi admin.', '⚙️'],
};

function Admin() {
  const [menu, setMenu] = useState(bacaMenu);
  const [halaman, setHalaman] = useState('dashboard');
  const [sidebarBuka, setSidebarBuka] = useState(false);
  const [form, setForm] = useState(null); // null = tertutup, objek = terbuka
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState({});
  const [pesan, setPesan] = useState('');

  const simpan = (list) => {
    setMenu(list);
    if (!simpanMenuStorage(list)) {
      setPesan('Penyimpanan penuh. Coba pakai gambar yang lebih kecil.');
    }
  };

  const bukaForm = (m) => {
    setEditId(m ? m.id : null);
    setForm(m ? { ...KOSONG, ...m } : { ...KOSONG });
    setErr({});
  };
  const tutupForm = () => setForm(null);
  const isi = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pilihGambar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = await kecilkanGambar(file);
    setForm((f) => ({ ...f, gambar: data }));
  };

  const submit = (e) => {
    e.preventDefault();
    const harga = parseInt(form.harga, 10);
    const baru = {
      nama: form.nama.trim() ? '' : 'Nama menu wajib diisi.',
      harga: harga >= 0 ? '' : 'Masukkan harga berupa angka.',
    };
    setErr(baru);
    if (baru.nama || baru.harga) return;

    const data = {
      nama: form.nama.trim(), harga, kategori: form.kategori,
      deskripsi: form.deskripsi.trim(), gambar: form.gambar,
    };
    if (editId) {
      simpan(menu.map((m) => (m.id === editId ? { ...m, ...data } : m)));
      setPesan('Menu diperbarui');
    } else {
      simpan([...menu, { id: Date.now(), ...data }]);
      setPesan('Menu ditambahkan');
    }
    tutupForm();
  };

  const hapus = (m) => {
    if (window.confirm(`Hapus "${m.nama}"?`)) {
      simpan(menu.filter((x) => x.id !== m.id));
      setPesan('Menu dihapus');
    }
  };

  const buka = (nama) => { setHalaman(nama); setSidebarBuka(false); };
  const [judul, subjudul] = HALAMAN[halaman];

  return (
    <div className="adm-page">
      {/* SIDEBAR */}
      <aside className={'adm-sidebar' + (sidebarBuka ? ' buka' : '')}>
        <div className="adm-brand">
          <div className="logo">🐔</div>
          <h2>Ayam Geybok<br />Bang Jarwo</h2>
        </div>
        <nav className="adm-nav">
          {Object.entries(HALAMAN).map(([k, [nama, , ikon]]) => (
            <button key={k} type="button" className={halaman === k ? 'aktif' : ''} onClick={() => buka(k)}>
              <span className="ic">{ikon}</span>
              {k === 'menu' ? 'Kelola Menu' : nama.replace(' Admin', '')}
            </button>
          ))}
        </nav>
        <hr />
        <nav className="adm-nav">
          <button
            type="button"
            onClick={() => {
              const yakin = window.confirm('Yakin ingin logout?');

              if (yakin) {
                window.location.href = '/#home';
              }
            }}
          >
            <span className="ic">🚪</span>
            Logout
          </button>
        </nav>
      </aside>

      <div className="adm-main">
        {/* HEADER */}
        <header className="adm-header">
          <button type="button" className="adm-burger" onClick={() => setSidebarBuka((b) => !b)} aria-label="Buka menu navigasi">☰</button>
          <div className="adm-profile" title="Admin">👤</div>
        </header>

        <main className="adm-content">
          <h1>{judul}</h1>
          <p className="adm-sub">{subjudul}</p>

          {halaman !== 'pengaturan' ? (
            <>
              {/* SAMBUTAN + TAMBAH MENU */}
              <Row className="g-3 mb-4">
                <Col md={9}>
                  <Card className="adm-welcome">
                    <Card.Body className="d-flex align-items-center gap-3">
                      <div className="logo">🐔</div>
                      <div>
                        <Card.Title className="mb-1">Ayam Geybok Bang Jarwo</Card.Title>
                        <Card.Text>Selamat datang, Admin!</Card.Text>
                      </div>
                      <div className="adm-stat ms-auto">
                        <b>{menu.length}</b>
                        <span>Total menu</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Button className="adm-btn-utama w-100 h-100" onClick={() => bukaForm(null)}>＋ Tambah Menu</Button>
                </Col>
              </Row>

              {/* DAFTAR MENU (CARD) */}
              <h2 className="adm-judul-daftar">🍴 Daftar Menu</h2>
              {menu.length ? (
                <Row xs={1} sm={2} md={3} xl={4} className="g-4">
                  {menu.map((m) => (
                    <Col key={m.id}>
                      <Card className="adm-card h-100">
                        {m.gambar
                          ? <Card.Img variant="top" src={m.gambar} alt={m.nama} className="adm-img" />
                          : <div className="adm-img adm-noimg">🍗</div>}
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="d-flex justify-content-between align-items-start gap-2">
                            <span>{m.nama}</span>
                            <Badge className="adm-badge">{m.kategori || 'Makanan'}</Badge>
                          </Card.Title>
                          {m.deskripsi && <Card.Text className="adm-desk">{m.deskripsi}</Card.Text>}
                          <Card.Text className="adm-harga">{rp(m.harga)}</Card.Text>
                          <div className="adm-aksi mt-auto">
                            <Button className="adm-btn-edit" onClick={() => bukaForm(m)}>✏️ Edit</Button>
                            <Button className="adm-btn-hapus" onClick={() => hapus(m)}>🗑️ Hapus</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="adm-kosong">Belum ada menu. Klik “Tambah Menu” untuk mulai.</p>
              )}
            </>
          ) : (
            <Card className="adm-card">
              <Card.Body>
                <Card.Title>⚙️ Pengaturan</Card.Title>
                <Card.Text>Tombol di bawah akan menghapus semua data menu dan mengembalikannya ke data awal.</Card.Text>
                <Button
                  className="adm-btn-hapus"
                  onClick={() => { if (window.confirm('Kembalikan menu ke data awal?')) { simpan(AWAL); setPesan('Data direset'); } }}
                >
                  Reset data menu
                </Button>
              </Card.Body>
            </Card>
          )}
        </main>
      </div>

      {/* FORM TAMBAH / EDIT */}
      <Modal show={form !== null} onHide={tutupForm} centered className="adm-modal">
        {form && (
          <Form noValidate onSubmit={submit}>
            <Modal.Header closeButton>
              <Modal.Title>{editId ? 'Edit Menu' : 'Tambah Menu'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formGambar">
                <Form.Label>Gambar menu</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={pilihGambar} />
                {form.gambar && <img src={form.gambar} alt="Pratinjau gambar menu" className="adm-preview" />}
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formNama">
                  <Form.Label>Nama menu</Form.Label>
                  <Form.Control
                    placeholder="Contoh: Paket Ayam Geybok"
                    value={form.nama} onChange={isi('nama')} isInvalid={!!err.nama}
                  />
                  <Form.Control.Feedback type="invalid">{err.nama}</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Form.Group className="mb-3" controlId="formDeskripsi">
                <Form.Label>Deskripsi menu</Form.Label>
                <Form.Control
                  as="textarea" rows={3} placeholder="Ceritakan menu ini secara singkat"
                  value={form.deskripsi} onChange={isi('deskripsi')}
                />
              </Form.Group>

              <Row className="mb-2">
                <Form.Group as={Col} controlId="formHarga">
                  <Form.Label>Harga menu (Rp)</Form.Label>
                  <Form.Control
                    type="number" min="0" step="500" placeholder="23000"
                    value={form.harga} onChange={isi('harga')} isInvalid={!!err.harga}
                  />
                  <Form.Control.Feedback type="invalid">{err.harga}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="formKategori">
                  <Form.Label>Kategori</Form.Label>
                  <Form.Select value={form.kategori} onChange={isi('kategori')}>
                    {KATEGORI.map((k) => <option key={k}>{k}</option>)}
                  </Form.Select>
                </Form.Group>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button className="adm-btn-abu" type="button" onClick={tutupForm}>Batal</Button>
              <Button className="adm-btn-utama" type="submit">Simpan</Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>

      <ToastContainer position="bottom-end" className="p-3 position-fixed">
        <Toast show={!!pesan} onClose={() => setPesan('')} delay={2200} autohide className="adm-toast">
          <Toast.Body>{pesan}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Admin;
