import { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Figure from 'react-bootstrap/Figure';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import './style.css';
import { bacaMenu, bacaKeranjang, simpanKeranjang, cariProduk, rupiah } from './MenuData.js';

const KATEGORI = [
  { k: 'Semua', ikon: '' },
  { k: 'Makanan', ikon: 'fa-solid fa-drumstick-bite' },
  { k: 'Minuman', ikon: 'fa-solid fa-glass-water' },
  { k: 'Snack', ikon: 'fa-solid fa-cookie-bite' },
];


function Produk() {
  const [menu] = useState(bacaMenu);
  const [kategori, setKategori] = useState('Semua');
  const [qty, setQty] = useState({});
  const [cart, setCart] = useState(() => bacaKeranjang(menu));
  const cari = (id) => cariProduk(id, menu);
  const [bukaCart, setBukaCart] = useState(false);
  const [pesan, setPesan] = useState('');

  const daftar = menu.filter((p) => kategori === 'Semua' || p.kategori === kategori);
  const jumlahItem = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + c.qty * cari(c.id).harga, 0);

  const simpan = (list) => {
    setCart(list);
    simpanKeranjang(list);
  };

  const ubahQty = (id, d) =>
    setQty((q) => ({ ...q, [id]: Math.min(99, Math.max(1, (q[id] || 1) + d)) }));

  const tambahKeKeranjang = (p) => {
    const j = qty[p.id] || 1;
    const ada = cart.find((c) => c.id === p.id);
    simpan(ada
      ? cart.map((c) => (c.id === p.id ? { ...c, qty: Math.min(99, c.qty + j) } : c))
      : [...cart, { id: p.id, qty: j }]);
    setQty((q) => ({ ...q, [p.id]: 1 }));
    setPesan(`${p.nama} masuk keranjang`);
  };

  const ubahItem = (id, d) =>
    simpan(cart
      .map((c) => (c.id === id ? { ...c, qty: Math.min(99, c.qty + d) } : c))
      .filter((c) => c.qty > 0));
  const hapusItem = (id) => simpan(cart.filter((c) => c.id !== id));

  const checkout = () => { window.location.href = '/pemesanan'; };

  const klikIkonKeranjang = () => {
    if (window.matchMedia('(min-width: 992px)').matches) {
      document.getElementById('panel-keranjang')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setBukaCart(true);
    }
  };

  /* isi keranjang, dipakai di panel samping (desktop) dan Offcanvas (mobile) */
  const isiKeranjang = (
    <>
      <div className="daftar-keranjang">
        {cart.length ? cart.map((c) => {
          const p = cari(c.id);
          return (
            <div className="item-keranjang" key={c.id}>
              <Figure className="m-0">
                <Figure.Image width={56} height={56} alt={p.nama} src={p.gambar} className="img-mini" />
              </Figure>
              <div className="info">
                <b>{p.nama}</b>
                <small>{rupiah(p.harga)}</small>
                <div className="qty-pr">
                  <button type="button" onClick={() => ubahItem(p.id, -1)} aria-label="Kurangi">−</button>
                  <span>{c.qty}</span>
                  <button type="button" onClick={() => ubahItem(p.id, 1)} aria-label="Tambah">+</button>
                </div>
              </div>
              <button type="button" className="hapus-pr" onClick={() => hapusItem(p.id)} aria-label={`Hapus ${p.nama}`}>
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          );
        }) : (
          <p className="kosong-pr">Keranjang masih kosong.<br />Pilih menu favoritmu dulu!</p>
        )}
      </div>
      <div className="total-pr">
        <span>Total Harga</span>
        <b>{rupiah(total)}</b>
      </div>
      <Button className="btn-checkout" disabled={!jumlahItem} onClick={checkout}>
        <i className="fa-solid fa-cart-shopping" /> Checkout
      </Button>
    </>
  );

  return (
    <div className="produk-page">
      {/* HEADER */}
      <Navbar expand="md" className="header-pr" sticky="top">
        <Container>
          <Navbar.Brand href="/">
            <img src="/image/logo.jpg" alt="Logo Ayam Geybok Bang Jarwo" className="logo-img" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="menu-utama" />
          <Navbar.Collapse id="menu-utama">
            <Nav className="ms-auto align-items-md-center gap-md-2 fw-bold">
              <Nav.Link href="/">HOME</Nav.Link>
              <Nav.Link href="/produk" active>PRODUK</Nav.Link>
              <NavDropdown title="INFORMASI" align="end">
                <NavDropdown.Item href="App.jsx/#produk-unggulan">PRODUK UNGGULAN</NavDropdown.Item>
                <NavDropdown.Item href="App.jsx/#lokasi">LOKASI</NavDropdown.Item>
                <NavDropdown.Item href="Pemesanan.jsx/pemesanan">PEMESANAN</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/admin">ADMIN</NavDropdown.Item>
              </NavDropdown>
              <button type="button" className="cart-btn" onClick={klikIkonKeranjang} aria-label="Buka keranjang">
                <i className="fa-solid fa-cart-shopping" />
                <Badge pill bg="" className="cart-badge">{jumlahItem}</Badge>
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="isi-pr">
        {/* BANNER */}
        <section className="banner">
          <div>
            <h1>Daftar Produk</h1>
            <p>Nikmati kelezatan ayam dengan harga terbaik!</p>
          </div>
          <img src="/image/blonde.jpg" alt="produk ayam geybok" className="banner-img d-none d-md-block" />
        </section>

        {/* FILTER KATEGORI */}
        <div className="filter-bar">
          {KATEGORI.map(({ k, ikon }) => (
            <Button
              key={k}
              className={'btn-filter' + (kategori === k ? ' aktif' : '')}
              onClick={() => setKategori(k)}
            >
              {ikon && <i className={ikon} />} {k}
            </Button>
          ))}
        </div>

        <Row className="g-4">
          {/* DAFTAR PRODUK */}
          <Col lg={9}>
            <Row xs={1} sm={2} md={3} className="g-3">
              {daftar.map((p) => (
                <Col key={p.id}>
                  <Card className="kartu-produk h-100">
                    <Figure className="figure-produk">
                      <Figure.Image
                        width={240}
                        height={180}
                        alt={p.nama}
                        src={p.gambar}
                        loading="lazy"
                        className="img-produk"
                      />
                    </Figure>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="nama-produk">{p.nama}</Card.Title>
                      <Card.Text className="harga">{rupiah(p.harga)}</Card.Text>
                      <div className="beli mt-auto">
                        <div className="qty-pr">
                          <button type="button" onClick={() => ubahQty(p.id, -1)} aria-label="Kurangi jumlah">−</button>
                          <span>{qty[p.id] || 1}</span>
                          <button type="button" onClick={() => ubahQty(p.id, 1)} aria-label="Tambah jumlah">+</button>
                        </div>
                        <Button className="btn-add" onClick={() => tambahKeKeranjang(p)} aria-label={`Tambah ${p.nama} ke keranjang`}>
                          <i className="fa-solid fa-cart-plus" />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              {!daftar.length && <p className="kosong-pr">Belum ada produk di kategori ini.</p>}
            </Row>
          </Col>

          {/* KERANJANG (desktop) */}
          <Col lg={3} className="d-none d-lg-block">
            <aside className="panel-keranjang" id="panel-keranjang">
              <h2><i className="fa-solid fa-cart-shopping" /> Keranjang Saya</h2>
              {isiKeranjang}
            </aside>
          </Col>
        </Row>
      </Container>

      {/* KERANJANG (mobile) */}
      <Offcanvas show={bukaCart} onHide={() => setBukaCart(false)} placement="end" className="offcanvas-geybok">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><i className="fa-solid fa-cart-shopping" /> Keranjang Saya</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">{isiKeranjang}</Offcanvas.Body>
      </Offcanvas>

      {/* FOOTER */}
      <footer className="footer-pr">
        <h3>AYAM GEYBOK BANG JARWO</h3>
        <p>Kuliner ayam dengan cita rasa khas dan harga terjangkau.</p>
        <div className="social">
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook" /></a>
          <a href="#" aria-label="WhatsApp"><i className="fab fa-whatsapp" /></a>
        </div>
      </footer>

      <ToastContainer position="bottom-center" className="p-3 position-fixed">
        <Toast show={!!pesan} onClose={() => setPesan('')} delay={1800} autohide className="toast-geybok">
          <Toast.Body>{pesan}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Produk;
