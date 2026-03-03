function assertEqual(testName, expected, actual) {
    const output = document.getElementById('test-output');
    const isPass = String(expected) === String(actual);
    const color = isPass ? 'text-green-600' : 'text-red-600';
    const mark = isPass ? '✅ PASS' : '❌ FAIL';
    
    output.innerHTML += `
        <div class="mb-2 p-3 border rounded ${isPass ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
            <div class="font-bold ${color}">${mark} : ${testName}</div>
            <div class="text-sm text-gray-600 mt-1">Expected: ${expected} | Actual: ${actual}</div>
        </div>
    `;
}

async function runAllTests() {
    document.getElementById('test-output').innerHTML = '<div class="text-gray-500">Membaca Database Asli...</div>';
    
    // 1. TARIK DATA PALING REAL-TIME DARI BROWSER
    const res = await API.getProducts();
    APP.products = res.data; 
    document.getElementById('test-output').innerHTML = ''; 

    // TEST 1: LOGIN
    const loginSukses = await API.login('admin', 'admin123');
    assertEqual("Fitur Login - Kredensial Benar", true, loginSukses.success);

    // TEST 2: TAMBAH BARANG KE DATABASE ASLI
    const jumlahBarangAwal = APP.products.length;
    await API.createProduct({ sku: 'HOS-TEST-001', nama: 'Barang Hasil Testing', kategori: 'Accessories', ukuran: 'One Size', warna: 'Merah', harga: 50000, stok: 10 });
    assertEqual(`Fitur Tambah Barang - Real Database Bertambah (Awal: ${jumlahBarangAwal})`, jumlahBarangAwal + 1, APP.products.length);

    // Ambil data produk ID 1 buat bahan test update & kasir
    let produkTest = APP.products.find(x => x.id === 1);
    
    if (produkTest) {
        // TEST 3: UPDATE STOK (DINAMIS SESUAI STOK LU SEKARANG)
        let stokSekarang = produkTest.stok;
        let hasilTambah = await API.updateStock(1, 10, "Test Nambah");
        assertEqual(`Fitur Update Stok - Nambah 10 (Stok Awal: ${stokSekarang})`, stokSekarang + 10, hasilTambah.data.stok);

        let stokSetelahTambah = hasilTambah.data.stok;
        let hasilKurang = await API.updateStock(1, -2, "Test Kurang");
        assertEqual(`Fitur Update Stok - Kurangi 2 (Stok Awal: ${stokSetelahTambah})`, stokSetelahTambah - 2, hasilKurang.data.stok);

        // TEST 4: TRANSAKSI KASIR
        let stokSebelumKasir = hasilKurang.data.stok;
        let cart = [{ id: 1, nama: produkTest.nama, harga: produkTest.harga, qty: 3, sku: produkTest.sku }]; // Beli 3 pcs
        let transaksi = await API.createTransaction(cart, produkTest.harga * 3);
        
        assertEqual("Fitur Kasir - Transaksi Berhasil Terekam", true, transaksi.success);
        
        // Tarik data ulang buat ngecek sisa stok
        let sisaStokPascaBeli = APP.products.find(x => x.id === 1).stok;
        assertEqual(`Fitur Kasir - Stok Otomatis Berkurang (Awal: ${stokSebelumKasir} - Beli 3)`, stokSebelumKasir - 3, sisaStokPascaBeli);
    }
}

window.onload = runAllTests;