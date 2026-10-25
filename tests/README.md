# Tes regresi CongklaTika

Jalankan seluruh pemeriksaan dengan Node.js 20 atau lebih baru:

```sh
npm install
npx playwright install chromium
npm run test:all
```

`npm test` menjalankan uji deterministik logika congklak, termasuk jumlah 98 biji, lumbung lawan, capture, relay, giliran ekstra, undo AI, dan pembatalan animasi. `npm run test:browser` membuka server lokal sementara dan menguji alur aplikasi di Chromium, termasuk asesmen, penyimpanan, narasi, profil, aksesibilitas, dan lebar ponsel 320–390 px.

Jika Chromium sudah tersedia di lokasi lain, set `CHROMIUM_PATH=/jalur/ke/chromium` saat menjalankan `npm run test:browser`. Tes menggunakan profil browser terisolasi dan tidak membaca atau mengubah data pengguna di browser lain.
