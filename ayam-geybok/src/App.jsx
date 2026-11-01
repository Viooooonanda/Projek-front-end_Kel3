import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './style.css';

// Taruh semua gambar di folder  public/image/
const produk = [
  { nama: 'Paket Ayam Blonde', harga: 'Rp 23.000', gambar: '/image/blonde.jpg' },
  { nama: 'Paket Ayam Geybok', harga: 'Rp 23.000', gambar: '/image/geybok.jpg' },
  { nama: 'Paket Ayam Kriuk', harga: 'Rp 19.000', gambar: '/image/kriuk.jpg' },
];

function App() {
  return (
    <div className="bj-page">
      {/* ===== HEADER / NAVBAR ===== */}
      <Navbar expand="lg" className="navbar-bj">
        <Container fluid className="px-0">
          <Navbar.Brand href="#home">
            <img src="/image/logo.jpg" alt="Logo UMKM" className="bj-logo" />
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
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ===== HERO ===== */}
      <section className="bj-hero" id="home">
        <Container fluid>
          <Row className="align-items-center justify-content-between gx-5 gy-4">
            <Col lg={6} className="bj-hero-text">
              <h1>AYAM GEYBOK BANG JARWO</h1>
              <p>
                Ayam Geybok Bang Jarwo hadir menyajikan kelezatan kuliner
                nusantara dengan cita rasa khas yang menggugah selera.
                Menggunakan bahan-bahan segar dan racikan bumbu spesial, kami
                siap memanjakan lidah anda dengan sensasi pedas gurih yang
                tiada tanding.
              </p>
              <Button variant="dark" href="/produk" className="bj-btn">
                LIHAT PRODUK
              </Button>
            </Col>
            <Col lg={6} className="d-flex justify-content-center">
              <img
                src="/image/images1.jpg"
                alt="Ayam Geybok Bang Jarwo"
                className="bj-hero-image"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* ===== PRODUK UNGGULAN ===== */}
      <section className="bj-products" id="produk-unggulan">
        <h2>Produk Unggulan</h2>
        <Row className="bj-product-row">
          {produk.map((item) => (
            <Col key={item.nama} xs={12} sm={4}>
              <Card className="bj-product-card h-100 text-center">
                <Card.Img variant="top" src={item.gambar} alt={item.nama} loading="lazy" />
                <Card.Body>
                  <Card.Title>{item.nama}</Card.Title>
                  <Card.Text>{item.harga}</Card.Text>
                  <Button variant="dark" href="/pemesanan" className="bj-btn bj-btn-small">
                    PESAN SEKARANG
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
}

export default App;
