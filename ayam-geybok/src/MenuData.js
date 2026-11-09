// Data menu dipakai bersama oleh halaman Produk, Pemesanan, dan Admin.
export const MENU_KEY = 'ayamGeybokMenu';
export const CART_KEY = 'keranjangGeybok';

const G = "/image/geybok.jpg", B = "/image/blonde.jpg", K = "/image/kriuk.jpg", E = "/image/empalGeybok.jpg";
const g = s => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc" + s + "&s=10";

/* [nama, harga, gambar, kategori] - nomor produk mengikuti urutan lama */
const DATA = [
  ["Paket Promo Happy 1",29000,G,"Makanan"],["Paket Promo Happy 2",29000,G,"Makanan"],["Paket Promo Happy 3",29000,B,"Makanan"],
  ["Paket Promo Semua Kenyang",109000,K,"Makanan"],["Paket Promo Ber-2 Puas",52000,G,"Makanan"],["Paket Promo Ber-2 Nikmat",52000,B,"Makanan"],
  ["Paket Promo Ceria 1",29000,B,"Makanan"],["Paket Promo Ceria 2",25000,K,"Makanan"],
  ["Paket Ayam Geybok 1",23000,G,"Makanan"],["Paket Ayam Blonde",23000,B,"Makanan"],["Paket Ayam Kriuk",19000,K,"Makanan"],
  ["Paket Ayam Geybok 2",24000,G,"Makanan"],["Paket Empal Geybok 3",23000,E,"Makanan"],["Paket Empal Geybok 4",24000,E,"Makanan"],
  ["Paket Ayam Blonkrik",23000,B,"Makanan"],
  ["Ayam Geybok",18000,G,"Makanan"],["Empal Geybok",18000,E,"Makanan"],["Ayam Blonde",19000,B,"Makanan"],["Ayam Kriuk",15000,K,"Makanan"],["Ayam Blonkrik",19000,B,"Makanan"],
  ["Nasi Putih",5000,g("SYdSrejE0-8qYnqCm-JxQfAVuEmXO-v1PDupq-rgA9YQ"),"Makanan"],
  ["Nasi Uduk",7000,g("TPZFTt1mvK0FRQwrYMWxdOXvYJ3_EUUiPFWZYhz_Js1g"),"Makanan"],
  ["Sayur Asem",5000,g("TOjAnKnJtWk8uxU1zhj6XjBdAdnjdtG08l0O_XSx9Z2g"),"Makanan"],
  ["Tempe",2500,g("StnPfY6Hx42Wr6OztUY2BgybTv4MhxdDuKuc2bRuAmeg"),"Snack"],
  ["Tahu",2500,g("RClsr80o9KUmV6z268DtvnVwIJi3P63aeP18f1H1A-ow"),"Snack"],
  ["Telur Dadar",5000,g("Ql_yov3A8-T2pB2BKhAFWYE_D1s7pRxZqexSlaI3-LUQ"),"Makanan"],
  ["Sate Kulit",4000,g("RYYTYa-W69lSc4zjA3iw69JXaDXSk6drzCWRunn4flSA"),"Snack"],
  ["Sate Ati Ampela",5000,g("TEtFwxovtILsuz1cZIF1DFMZGl9dr4Hs6-XV_ogacDeA"),"Snack"],
  ["Kerupuk",3000,g("Rb49yKpqdEGn6GNA2Y-S4o1O0iAnfSe6PKXu61E09lRA"),"Snack"],
  ["Sate Usus",4000,g("SwiXkAaM4OoY6ucCtOrvClEzNo40fiec0gaP0k94m_Yw"),"Snack"],
  ["Ikan Piyik Geybok",10000,g("QSnINm7JpKP7f1qtlkrfDGA3KJ8hPf6MlBaE6Qgdxnjw"),"Makanan"],
  ["Jengkol Goreng",6000,g("TGi6MGJrJIU8dZYxGOyGs-NCMWErihldmDSDfrzKcDY_0YTL33Z7qWYUQ"),"Makanan"],
  ["Jengkol Semur",6000,g("TQ5YavP6NCU1mNmQQ-dxQyyTELkyXPrwDehnsvwLTe-Kg"),"Makanan"],
  ["Pete",8000,g("TB9l6LzPh52VAfiwrC4eOH_mti__YBkJbfbn-HdPvGmg"),"Makanan"],
  ["Terong Goreng",5000,g("SwrAf_0Xb9twKFJscraPSl5t6_CmQw_D5_duEi797v3w"),"Makanan"],
  ["Kol Goreng",5000,g("Sm5d4jFB4jxYHO6HMmNETaM-PHMgFWGAnwfeM24nZ1oA"),"Makanan"],
  ["Keju",5000,"https://rumahsehatherbaholistic.com/wp-content/uploads/2025/11/manfaat-dan-nutrisi-keju-mozarella.jpg","Snack"],
  ["Es Tekit (Teh Jeruk Sonkit)",8000,g("QFmI5RJ08JrAvsPwkHPXgBRr-uDL9UjsZFbUXlnlwY_w"),"Minuman"],
  ["Es Teh Tawar",3000,g("RC909gLFFmX-51p_BopZrjbDwEjZyYv-yvBRVzHQ-aUw"),"Minuman"],
  ["Teh Pucuk",5000,g("T0ZZzgPkVYh69_bnhMOaOYJzG3-EY-Yddjc2xIc7W7-w"),"Minuman"],
  ["Air Mineral Botol",5000,g("S6QJlXyv3cdDwS4r51NXCajObkDxVz_gcZ4U-YEXmSEw"),"Minuman"],
  ["Cincau Madu",2000,g("SfMY79l7wHJYga7CAZHnIHif6TheZWT4bH7SveG1N7SQ"),"Minuman"],
  ["Teh Tawar",2000,g("SgpqlB_jWDBPHlLgB0GZ0ObQQPS6NfIte-NguRQ715bQ"),"Minuman"],
  ["Teh Botol / S-Tee",5000,g("TCCVfVlLcWU97F_REim5a5bNZ3K7ej2XlpxyyEUJ3pyA"),"Minuman"]
].map((d, i) => ({ id: i + 1, nama: d[0], harga: d[1], gambar: d[2], kategori: d[3], deskripsi: '' }));

export const MENU_AWAL = DATA;

export function bacaMenu() {
  try {
    const tersimpan = JSON.parse(localStorage.getItem(MENU_KEY));
    if (Array.isArray(tersimpan)) {
      const dataLama = tersimpan.map((item) => ({
        ...item,
        kategori: item.kategori || item.kat || 'Makanan',
        deskripsi: item.deskripsi || '',
        harga: Number(item.harga) || 0,
      }));

      // Versi admin sebelumnya menyimpan tiga menu contoh saja.
      // Pertahankan editannya, tetapi lengkapi katalog awal yang berisi 44 produk.
      const seedLama = dataLama.length === 3 &&
        dataLama.every((item, index) => item.id === MENU_AWAL[index]?.id);
      if (seedLama) {
        return MENU_AWAL.map((awal) =>
          dataLama.find((item) => item.id === awal.id) || awal
        );
      }
      return dataLama;
    }
  } catch (error) {
    console.warn('Data menu tidak dapat dibaca:', error);
  }
  return MENU_AWAL;
}

export function simpanMenu(list) {
  try {
    localStorage.setItem(MENU_KEY, JSON.stringify(list));
    return true;
  } catch (error) {
    console.error('Data menu gagal disimpan:', error);
    return false;
  }
}

export function bacaKeranjang(menu = bacaMenu()) {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    if (Array.isArray(data)) {
      return data.filter((item) =>
        menu.some((produk) => produk.id === item.id) &&
        Number.isInteger(item.qty) && item.qty > 0
      );
    }
  } catch (error) {
    console.warn('Data keranjang tidak dapat dibaca:', error);
  }
  return [];
}

export function simpanKeranjang(list) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(list));
    return true;
  } catch (error) {
    console.error('Keranjang gagal disimpan:', error);
    return false;
  }
}

export const cariProduk = (id, menu = bacaMenu()) =>
  menu.find((produk) => produk.id === Number(id));

export const rupiah = (nominal) =>
  'Rp ' + Number(nominal || 0).toLocaleString('id-ID');
