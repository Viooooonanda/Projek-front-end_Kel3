import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Ratio from 'react-bootstrap/Ratio';
import './style.css';
import Produk from './Produk.jsx';
import Pemesanan from './Pemesanan.jsx';
import AdminDashboard from './Admin.jsx';
import { bacaMenu, rupiah, bacaKonten } from './MenuData.js';


function App() {
  const [menu] = useState(bacaMenu);
  const [konten] = useState(bacaKonten);
  const produkUnggulan = [konten.unggulan.pertama, konten.unggulan.kedua, konten.unggulan.ketiga]
    .map((id) => menu.find((item) => item.id === Number(id)))
    .filter(Boolean);

  // halaman ditentukan dari URL, jadi tanpa router
  const halaman = window.location.pathname.replace(/\/+$/, '') || '/';

  if (halaman === '/produk') return <Produk />;
  if (halaman === '/pemesanan') return <Pemesanan />;
  if (halaman === '/admin') return <AdminDashboard />;

  return (
    <div className="bj-page">
      {/* header */}
      <Navbar expand="lg" className="navbar-bj">
        <Container fluid className="px-0">
          <Navbar.Brand href="#home">
            <img src="/image/logo.jpg" alt="Logo Ayam Geybok Bang Jarwo" className="bj-logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-lg-center">
              <Nav.Link href="#home" active>HOME</Nav.Link>
              <Nav.Link href="/produk">PRODUK</Nav.Link>
              <NavDropdown title="INFORMASI" id="basic-nav-dropdown" align="end">
                <NavDropdown.Item href="#produk-unggulan">PRODUK UNGGULAN</NavDropdown.Item>
                <NavDropdown.Item href="#lokasi">LOKASI</NavDropdown.Item>
                <NavDropdown.Item href="/pemesanan">PEMESANAN</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/admin">ADMIN</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* hero */}
      <section className="bj-hero" id="home">
        <Container fluid>
          <Row className="align-items-center justify-content-between gx-5 gy-4">
            <Col lg={6} className="bj-hero-text">
              <h1>{konten.beranda.judul}</h1>
              <p>{konten.beranda.deskripsi}</p>
              <Button variant="outline-dark" href="/produk" className="bj-btn">{konten.beranda.tombolProduk}</Button>
            </Col>
            <Col lg={6} className="d-flex justify-content-center">
              <img
                src={konten.gambar.hero}
                alt="Ayam Geybok Bang Jarwo"
                className="bj-hero-image"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* produk unggulan */}
      <section className="bj-products" id="produk-unggulan">
        <h2>{konten.beranda.produkUnggulan}</h2>
        <Row className="bj-product-row">
          {produkUnggulan.map((item) => (
            <Col key={item.nama} xs={12} sm={4}>
              <Card className="bj-product-card h-100 text-center">
                <Card.Img variant="top" src={item.gambar} alt={item.nama} loading="lazy" />
                <Card.Body>
                  <Card.Title>{item.nama}</Card.Title>
                  <Card.Text>{rupiah(item.harga)}</Card.Text>
                  <Button variant="dark" href="/produk" className="bj-btn bj-btn-small">
                    PESAN SEKARANG
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* lokasi */}
      <Container fluid className="location" id="lokasi">
        <Row className="align-items-center g-4">
          <Col lg={6}>
            <Container className="location-text">
              <h2>{konten.beranda.lokasiJudul}</h2>
              <p>{konten.beranda.lokasiAlamat}</p>
            </Container>
          </Col>

          <Col lg={6}>
            <Ratio aspectRatio="16x9">
              <iframe
                title="Lokasi Ayam Geybok Bang Jarwo Trisakti (Tomang)"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.724034854093!2d106.79082577476268!3d-6.167697193819518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f7003b8c254d%3A0x86d32a15542ced8f!2sAyam%20Geybok%20Bang%20Jarwo%20Trisakti%20(Tomang)!5e0!3m2!1sen!2sus!4v1794808156971!5m2!1sen!2sus"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </Ratio>
          </Col>
        </Row>
      </Container>

      {/* footer */}
      <Container fluid as="footer" className="bj-footer">
        <Row className="justify-content-center text-center">
          <Col xs={12}>
            <h3>AYAM GEYBOK BANG JARWO</h3>

            <p>Ayam enak, harga bersahabat.</p>

            <Row className="justify-content-center">
              <Col xs="auto">
                <a href="#" aria-label="Instagram">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </Col>

              <Col xs="auto">
                <a href="#" aria-label="Facebook">
                  <i className="fa-brands fa-facebook"></i>
                </a>
              </Col>

              <Col xs="auto">
                <a href="#" aria-label="WhatsApp">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;