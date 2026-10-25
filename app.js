const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const KEY = 'congklatika.v1';
const SFX_KEY = 'congklatika.sfx';

const topics = [
  {id:'addition',name:'Penjumlahan',icon:'➕',tag:'Menggabungkan',desc:'Gabungkan dua kelompok benda.',lesson:'Penjumlahan membantu kita menggabungkan dua kelompok. Tanda tambahnya adalah +. Yuk, hitung semua bijinya bersama-sama!',example:'Ada 6 biji di satu lubang dan 4 biji di lubang lain. Semuanya ada 6 + 4 = 10 biji.',tip:'Mulai dari angka yang lebih besar, lalu hitung maju pelan-pelan.'},
  {id:'subtraction',name:'Pengurangan',icon:'➖',tag:'Mengambil sebagian',desc:'Cari tahu berapa yang masih ada.',lesson:'Pengurangan dipakai saat ada benda yang diambil atau berpindah. Tanda kurangnya adalah −. Hitung berapa biji yang masih tersisa, ya!',example:'Buji punya 9 biji. Lalu 4 biji dipindahkan. Sekarang tersisa 9 − 4 = 5 biji.',tip:'Kamu bisa menghitung mundur, satu angka setiap kali.'},
  {id:'multiplication',name:'Perkalian',icon:'✖️',tag:'Kelompok sama banyak',desc:'Penjumlahan berulang jadi lebih cepat.',lesson:'Perkalian adalah cara cepat untuk menghitung beberapa kelompok yang isinya sama banyak. Tanda kalinya adalah ×.',example:'Ada 3 lubang. Setiap lubang berisi 4 biji. Jadi 4 + 4 + 4 sama dengan 3 × 4 = 12 biji.',tip:'Pastikan tiap kelompok isinya sama, lalu hitung jumlah semua kelompok.'},
  {id:'division',name:'Pembagian',icon:'➗',tag:'Berbagi rata',desc:'Bagikan benda sama banyak.',lesson:'Pembagian membantu kita membagi benda dengan adil. Setiap kelompok mendapat jumlah yang sama. Tanda baginya adalah ÷.',example:'12 biji dibagikan rata ke 3 lubang. Setiap lubang mendapat 12 ÷ 3 = 4 biji.',tip:'Bagikan satu biji ke tiap kelompok bergiliran sampai bijinya habis.'},
  {id:'fraction',name:'Pecahan',icon:'½',tag:'Bagian dari satu utuh',desc:'Lihat bagian yang sama besar.',lesson:'Pecahan menunjukkan bagian dari satu benda utuh. Pada ½, angka di bawah menunjukkan berapa bagian sama besar. Angka di atas menunjukkan berapa bagian yang kita ambil.',example:'Satu kue dipotong menjadi 4 bagian sama besar. Satu potong dari kue itu ditulis ¼.',tip:'Bagian-bagiannya harus sama besar supaya adil.'}
];


const lessonGuides = {
  addition: [
    {concept:'Penjumlahan menyatukan dua kelompok. Tanda + berarti ditambah, sedangkan tanda = menunjukkan jumlah yang sama.',bridge:['Di lubang A ada 4 biji dan di lubang B ada 3 biji.','Satukan kedua kelompok. Mulai dari 4, lalu hitung maju: 5, 6, 7.','Ceritanya menjadi 4 + 3 = 7.'],exampleTitle:'Contoh terpecahkan · gabungkan dua lubang',example:'Buji punya 4 biji dan menemukan 3 biji lagi. Berapa biji semuanya?',worked:['Mulai dengan 4 biji.','Tambahkan 3: hitung maju 5, 6, 7.','Jadi, 4 + 3 = 7 biji.'],summary:'Tambah berarti menggabungkan. Menukar urutan kelompok tidak mengubah jumlah: 4 + 3 sama dengan 3 + 4.',congklak:'Bayangkan satu lubang berisi 4 biji dan lubang lain 3 biji. Hitung kedua lubang bersama untuk mengetahui jumlah seluruhnya.'},
    {concept:'Bilangan dua angka terdiri dari puluhan dan satuan. Memecahnya membuat penjumlahan lebih mudah.',bridge:['Soal 27 + 18 berarti menggabungkan dua kelompok biji.','Pecah 18 menjadi 10 dan 8. Tambahkan puluhan dahulu, lalu satuan.','Tulis langkahnya dengan tanda + dan = supaya mudah diperiksa.'],exampleTitle:'Contoh terpecahkan · puluhan dan satuan',example:'Hitung 27 + 18 dengan memecah 18 menjadi 10 dan 8.',worked:['27 + 10 = 37.','37 + 8 = 45.','Jadi, 27 + 18 = 45.'],summary:'Pisahkan puluhan dan satuan, lalu jumlahkan bertahap. Periksa lagi hasil akhirnya.',congklak:'Kelompokkan biji menjadi ikatan puluhan dan biji satuan. Tambahkan tiap kelompok, lalu gabungkan hasilnya.'},
    {concept:'Saat satuan berjumlah lebih dari 9, kumpulkan 10 satuan menjadi satu puluhan. Nilai jumlah tetap sama.',bridge:['Untuk 56 + 37, pisahkan 56 menjadi 50 dan 6; pisahkan 37 menjadi 30 dan 7.','Hitung puluhan: 50 + 30 = 80. Hitung satuan: 6 + 7 = 13.','Ubah 13 menjadi 10 + 3, lalu gabungkan dengan 80.'],exampleTitle:'Contoh terpecahkan · mengelompokkan satuan',example:'Hitung 56 + 37 dengan menggabungkan puluhan dan satuan.',worked:['50 + 30 = 80 dan 6 + 7 = 13.','80 + 13 = 80 + 10 + 3 = 93.','Jadi, 56 + 37 = 93.'],summary:'Jumlahkan puluhan dan satuan. Jika satuan mencapai 10, kelompokkan lagi sebagai satu puluhan.',congklak:'Sepuluh biji dapat diikat menjadi satu kelompok puluhan. Gabungkan ikatan puluhan dan biji satuan agar hitungan tetap rapi.'}
  ],
  subtraction: [
    {concept:'Pengurangan mencari sisa atau selisih. Tanda − berarti ada sejumlah benda yang diambil.',bridge:['Mulai dengan 9 biji di satu lubang.','Pindahkan 4 biji ke tempat lain.','Hitung biji yang tertinggal: 5 biji.'],exampleTitle:'Contoh terpecahkan · mencari sisa',example:'Ada 9 biji. Sebanyak 4 biji dipindahkan. Berapa biji yang tersisa?',worked:['Mulai dari 9 biji.','Ambil 4 biji satu per satu.','Tersisa 5 biji, jadi 9 − 4 = 5.'],summary:'Kurangi berarti mengambil atau membandingkan. Hasilnya tidak lebih besar daripada jumlah awal.',congklak:'Pindahkan beberapa biji dari satu lubang, kemudian hitung biji yang masih tertinggal di lubang itu.'},
    {concept:'Pengurangan bilangan dua angka dapat dilakukan bertahap. Kurangi puluhan dahulu, lalu satuan.',bridge:['Untuk 42 − 17, pecah 17 menjadi 10 dan 7.','Kurangi 10 dari 42, kemudian kurangi 7 dari hasil sementara.','Periksa dengan penjumlahan: hasil ditambah 17 harus kembali menjadi 42.'],exampleTitle:'Contoh terpecahkan · kurangi bertahap',example:'Hitung 42 − 17 dengan memecah 17 menjadi 10 dan 7.',worked:['42 − 10 = 32.','32 − 7 = 25.','Periksa: 25 + 17 = 42. Jadi, 42 − 17 = 25.'],summary:'Pecah bilangan pengurang menjadi puluhan dan satuan. Kurangi satu bagian demi satu bagian.',congklak:'Pindahkan 10 biji dahulu, lalu 7 biji. Menghitung perubahan di papan membantu melihat sisa pada setiap langkah.'},
    {concept:'Jika satuan yang dikurangi lebih besar daripada satuan awal, kita dapat menukar satu puluhan menjadi 10 satuan.',bridge:['Pada 90 − 38, pecah 38 menjadi 30 dan 8.','Kurangi puluhan: 90 − 30 = 60. Dari 60, ambil 8 satuan.','Enam puluhan menjadi 5 puluhan dan 10 satuan; setelah 8 diambil, tersisa 52.'],exampleTitle:'Contoh terpecahkan · kurangi bertahap',example:'Hitung 90 − 38 dengan mengurangi puluhan lalu satuan.',worked:['90 − 30 = 60.','60 − 8 = 52. Cara menukar 1 puluhan menjadi 10 satuan membantu melihat langkah kedua.','Jadi, 90 − 38 = 52.'],summary:'Lakukan pengurangan secara teratur. Saat satuan belum cukup, tukar satu puluhan menjadi 10 satuan.',congklak:'Bayangkan 10 biji diikat sebagai satu puluhan. Urai satu ikatan menjadi 10 biji satuan saat perlu mengambil biji satuan.'}
  ],
  multiplication: [
    {concept:'Perkalian adalah penjumlahan berulang dari kelompok yang isinya sama. Tanda × dibaca “kali”.',bridge:['Buat 3 kelompok yang sama banyak.','Isi setiap kelompok dengan 4 biji.','Hitung 4 + 4 + 4, atau tulis 3 × 4.'],exampleTitle:'Contoh terpecahkan · kelompok sama banyak',example:'Ada 3 lubang, masing-masing berisi 4 biji. Berapa semuanya?',worked:['Kelompok pertama: 4 biji; kelompok kedua: 4 biji; kelompok ketiga: 4 biji.','4 + 4 + 4 = 12.','Jadi, 3 × 4 = 12 biji.'],summary:'Perkalian menghitung banyak kelompok dikali isi tiap kelompok.',congklak:'Perhatikan beberapa lubang yang masing-masing berisi jumlah biji sama. Hitung semua kelompok tanpa melewatkan satu pun.'},
    {concept:'Perkalian dapat dihitung dengan melompat pada bilangan yang sama besar. Delapan kelompok berisi 7 biji dapat dihitung per 7.',bridge:['Ada 8 kelompok, setiap kelompok berisi 7 biji.','Hitung berurutan: 7, 14, 21, 28, 35, 42, 49, 56.','Jumlah 8 kelompok itu ditulis 8 × 7 = 56.'],exampleTitle:'Contoh terpecahkan · hitung kelompok berulang',example:'Delapan lubang masing-masing berisi 7 biji. Berapa semua bijinya?',worked:['Hitung 7 untuk kelompok pertama.','Lanjutkan menghitung per 7 sampai kelompok kedelapan: hasilnya 56.','Jadi, 8 × 7 = 56 biji.'],summary:'Gunakan hitung loncat atau penjumlahan berulang. Pastikan banyak kelompok dan isi tiap kelompok tidak tertukar.',congklak:'Beberapa lubang dapat dipandang sebagai kelompok setara. Biji di setiap lubang menunjukkan banyak benda per kelompok.'},
    {concept:'Untuk kelompok yang lebih banyak, pecah bilangan menjadi puluhan dan satuan agar perkalian lebih ringan.',bridge:['Soal 12 × 8 berarti ada 12 kelompok, setiap kelompok berisi 8 biji.','Pecah 12 menjadi 10 + 2. Hitung 10 × 8 dan 2 × 8 secara terpisah.','Jumlahkan kedua hasil untuk mendapatkan banyak biji semuanya.'],exampleTitle:'Contoh terpecahkan · pecah kelompok',example:'Hitung 12 × 8 dengan memisahkan 12 kelompok menjadi 10 dan 2.',worked:['10 × 8 = 80 dan 2 × 8 = 16.','80 + 16 = 96.','Jadi, 12 × 8 = 96 biji.'],summary:'Pecah salah satu faktor menjadi bagian yang mudah dihitung, lalu jumlahkan hasilnya.',congklak:'Bayangkan 10 lubang berisi 8 biji dan 2 lubang lagi berisi 8 biji. Kedua kelompok besar itu menunjukkan 12 × 8.'}
  ],
  division: [
    {concept:'Pembagian membagikan benda sama rata. Tanda ÷ berarti dibagi menjadi beberapa kelompok.',bridge:['Siapkan 12 biji dan 3 lubang tujuan.','Bagikan satu biji ke setiap lubang bergiliran sampai habis.','Setiap lubang mendapat 4 biji, jadi 12 ÷ 3 = 4.'],exampleTitle:'Contoh terpecahkan · berbagi rata',example:'Dua belas biji dibagikan sama rata ke 3 lubang. Berapa isi setiap lubang?',worked:['Bagikan biji satu per satu secara bergiliran.','Setiap lubang menerima 4 biji.','Jadi, 12 ÷ 3 = 4 biji per lubang.'],summary:'Dalam pembagian rata, setiap kelompok harus mendapat jumlah yang sama.',congklak:'Gunakan beberapa lubang tujuan. Bagikan biji bergiliran dan bandingkan isinya untuk memastikan pembagian adil.'},
    {concept:'Pembagian berkaitan dengan perkalian. Untuk mencari hasil bagi, tanyakan: berapa kali pembagi dapat membentuk jumlah awal?',bridge:['Untuk 72 ÷ 8, cari banyak kelompok berisi 8 biji yang membentuk 72.','Hitung 8 × 9 = 72.','Maka 72 ÷ 8 = 9, karena 9 kelompok berisi 8 biji.'],exampleTitle:'Contoh terpecahkan · hubungkan dengan perkalian',example:'Bagikan 72 biji sama rata ke 8 lubang.',worked:['Tanyakan berapa kali 8 menghasilkan 72.','8 × 9 = 72, jadi ada 9 biji di tiap lubang.','Jadi, 72 ÷ 8 = 9.'],summary:'Perkalian dapat membantu memeriksa pembagian: hasil bagi × pembagi harus sama dengan jumlah awal.',congklak:'Susun 72 biji ke dalam 8 kelompok sama banyak. Perkalian membantu memeriksa apakah setiap lubang berisi 9 biji.'},
    {concept:'Pembagian jumlah yang lebih besar tetap dapat dilakukan dengan mencari kelompok-kelompok sama banyak.',bridge:['Pada 96 ÷ 12, ada 96 biji dan 12 lubang tujuan.','Bagi rata, atau cari bilangan yang jika dikali 12 hasilnya 96.','Karena 12 × 8 = 96, setiap lubang berisi 8 biji.'],exampleTitle:'Contoh terpecahkan · bagi ke banyak kelompok',example:'Bagikan 96 biji sama rata ke 12 lubang.',worked:['Gunakan hubungan 12 × 8 = 96.','Artinya, 12 kelompok masing-masing berisi 8 biji.','Jadi, 96 ÷ 12 = 8 biji per lubang.'],summary:'Pembagian rata dapat diperiksa dengan perkalian. Semua kelompok harus berisi jumlah yang sama.',congklak:'Susun biji secara merata ke 12 lubang. Periksa isi tiap lubang agar semuanya sama, yaitu 8 biji.'}
  ],
  fraction: [
    {concept:'Pecahan menunjukkan bagian dari satu utuh. Bagian-bagiannya harus sama besar agar adil.',bridge:['Bayangkan satu utuh dibagi menjadi 4 bagian yang sama besar.','Ambil 1 bagian dari 4 bagian itu.','Tulis sebagai 1/4: angka 4 menunjukkan jumlah bagian, angka 1 bagian yang diambil.'],exampleTitle:'Contoh terpecahkan · satu bagian dari empat',example:'Satu kue dipotong menjadi 4 bagian sama besar. Bagaimana menulis satu potong?',worked:['Jumlah seluruh bagian sama besar adalah 4.','Bagian yang diambil adalah 1.','Jadi, satu potong ditulis 1/4, dibaca satu per empat.'],summary:'Angka bawah menunjukkan jumlah semua bagian yang sama besar. Angka atas menunjukkan bagian yang dipilih.',congklak:'Empat lubang pada gambar mewakili empat bagian dengan ukuran sama. Satu bagian yang dipilih mewakili 1/4.'},
    {concept:'Pecahan berbeda dapat bernilai sama jika bagian-bagian kecilnya digabungkan dengan tepat.',bridge:['Empat bagian sama besar membentuk satu utuh.','Dua bagian dari empat ditulis 2/4.','Dua bagian itu sama luasnya dengan satu dari dua bagian utuh, jadi 2/4 = 1/2.'],exampleTitle:'Contoh terpecahkan · pecahan senilai',example:'Dua dari empat bagian sama besar ditulis 2/4. Pecahan itu sama dengan berapa?',worked:['Kelompokkan 4 bagian menjadi 2 pasangan yang sama.','Dua bagian yang dipilih membentuk 1 dari 2 pasangan.','Jadi, 2/4 = 1/2.'],summary:'Pecahan senilai terlihat berbeda, tetapi menunjukkan ukuran bagian yang sama.',congklak:'Warnai dua dari empat bagian pada gambar. Kedua bagian itu menutup separuh dari satu utuh.'},
    {concept:'Untuk menjumlahkan pecahan, ukuran bagiannya harus sama. Ubah pecahan menjadi bagian dengan penyebut yang sama.',bridge:['Pada 1/2 + 1/4, bayangkan satu utuh dibagi menjadi 4 bagian sama besar.','Setengah utuh sama dengan 2/4. Tambahkan 1/4 lagi.','Jumlahnya 3/4 karena ada 3 bagian perempat yang terpilih.'],exampleTitle:'Contoh terpecahkan · samakan ukuran bagian',example:'Hitung 1/2 + 1/4 dengan mengubah setengah menjadi bagian perempat.',worked:['1/2 = 2/4 karena setengah memuat dua bagian perempat.','2/4 + 1/4 = 3/4.','Jadi, 1/2 + 1/4 = 3/4.'],summary:'Samakan penyebut lebih dahulu. Setelah ukuran bagian sama, jumlahkan bagian yang dipilih.',congklak:'Empat bagian sama besar membantu melihatnya: dua bagian menunjukkan 1/2, lalu satu bagian lagi membuat 3/4.'}
  ]
};

const quizBanks = {
  pre: {
    addition: [
      {cat:'addition',q:'Di lubang ada 4 biji. Buji menambah 3 biji. Berapa jumlahnya?',options:['6 biji','7 biji','8 biji'],answer:1},
      {cat:'addition',q:'8 + 5 = ...',options:['12','13','14'],answer:1}
    ],
    subtraction: [
      {cat:'subtraction',q:'Ada 9 biji. 4 biji dipindahkan. Berapa sisanya?',options:['4 biji','5 biji','6 biji'],answer:1},
      {cat:'subtraction',q:'23 − 8 = ...',options:['13','15','17'],answer:1}
    ],
    multiplication: [
      {cat:'multiplication',q:'Ada 3 lubang, masing-masing berisi 4 biji. Berapa semua bijinya?',options:['7','10','12'],answer:2},
      {cat:'multiplication',q:'9 × 8 = ...',options:['63','72','81'],answer:1}
    ],
    division: [
      {cat:'division',q:'12 biji dibagi rata ke 3 lubang. Tiap lubang mendapat ...',options:['3 biji','4 biji','5 biji'],answer:1},
      {cat:'division',q:'72 ÷ 8 = ...',options:['8','9','10'],answer:1}
    ],
    fraction: [
      {cat:'fraction',q:'Satu benda dibagi menjadi 4 bagian sama besar. Satu bagian ditulis ...',options:['¼','⅓','½'],answer:0},
      {cat:'fraction',q:'Pada pecahan ⅔, angka 3 menunjukkan ...',options:['Bagian yang diambil','Jumlah seluruh bagian sama besar','Jumlah benda utuh'],answer:1}
    ]
  },
  post: {
    addition: [
      {cat:'addition',q:'Ada 5 biji di satu lubang dan 4 biji lagi di lubang lain. Berapa semuanya?',options:['8 biji','9 biji','10 biji'],answer:1},
      {cat:'addition',q:'9 + 6 = ...',options:['14','15','16'],answer:1}
    ],
    subtraction: [
      {cat:'subtraction',q:'Buji punya 10 biji. 3 biji dipindahkan. Berapa yang tersisa?',options:['6 biji','7 biji','8 biji'],answer:1},
      {cat:'subtraction',q:'25 − 9 = ...',options:['14','16','17'],answer:1}
    ],
    multiplication: [
      {cat:'multiplication',q:'Ada 4 kelompok. Setiap kelompok berisi 3 biji. Berapa semuanya?',options:['7','12','14'],answer:1},
      {cat:'multiplication',q:'7 × 8 = ...',options:['54','56','64'],answer:1}
    ],
    division: [
      {cat:'division',q:'16 biji dibagikan sama rata ke 4 lubang. Tiap lubang mendapat ...',options:['3 biji','4 biji','5 biji'],answer:1},
      {cat:'division',q:'63 ÷ 7 = ...',options:['8','9','10'],answer:1}
    ],
    fraction: [
      {cat:'fraction',q:'Satu kue dipotong menjadi 3 bagian sama besar. Satu bagian ditulis ...',options:['⅓','½','⅔'],answer:0},
      {cat:'fraction',q:'Pada pecahan ¾, angka 4 menunjukkan ...',options:['Bagian yang diambil','Jumlah seluruh bagian sama besar','Jumlah kue'],answer:1}
    ]
  }
};
const quizExtras={
  pre:{
    addition:[{cat:'addition',q:'14 + 8 = ...',options:['20','22','24'],answer:1}],
    subtraction:[{cat:'subtraction',q:'31 − 6 = ...',options:['24','25','27'],answer:1}],
    multiplication:[{cat:'multiplication',q:'5 kelompok, masing-masing 3 biji. Berapa semuanya?',options:['8','15','20'],answer:1}],
    division:[{cat:'division',q:'18 biji dibagi rata ke 6 lubang. Tiap lubang mendapat ...',options:['2','3','4'],answer:1}],
    fraction:[{cat:'fraction',q:'Dua dari empat bagian sama besar ditulis ...',options:['¼','½','¾'],answer:1}]
  },
  post:{
    addition:[{cat:'addition',q:'38 + 24 = ...',options:['52','62','64'],answer:1}],
    subtraction:[{cat:'subtraction',q:'53 − 28 = ...',options:['25','35','31'],answer:0}],
    multiplication:[{cat:'multiplication',q:'6 × 9 = ...',options:['45','54','56'],answer:1}],
    division:[{cat:'division',q:'84 biji dibagi rata ke 7 lubang. Tiap lubang mendapat ...',options:['11','12','13'],answer:1}],
    fraction:[{cat:'fraction',q:'½ sama nilainya dengan ...',options:['2/3','2/4','3/4'],answer:1}]
  }
};
const quizReasons={
  addition:'Penjumlahan menggabungkan dua jumlah. Pisahkan puluhan dan satuan bila angkanya lebih besar.',
  subtraction:'Pengurangan mencari selisih atau sisa. Kurangi bagian-bagiannya dengan langkah yang teratur.',
  multiplication:'Perkalian menghitung kelompok-kelompok yang jumlahnya sama dengan penjumlahan berulang.',
  division:'Pembagian sama rata memberi setiap kelompok jumlah yang sama.',
  fraction:'Pecahan menunjukkan bagian dari satu utuh. Bagian yang dibandingkan harus sama besar.'
};
function baseQuizQuestionsFor(kind='pre'){
  const normalized=kind==='post'?'post':'pre',bank=quizBanks[normalized];
  return topics.flatMap(t=>[...bank[t.id],...quizExtras[normalized][t.id]].map(q=>({...q,why:quizReasons[t.id]})));
}
function quizQuestionsFor(kind=quiz.kind){
  if(quiz.kind===kind&&Array.isArray(quiz.questions)&&quiz.questions.length)return quiz.questions;
  return baseQuizQuestionsFor(kind);
}
function shuffled(list){const result=list.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
function createQuiz(kind){
  const bank=kind==='post'?'post':'pre';
  const selected=shuffled(topics.flatMap(t=>shuffled([...quizBanks[bank][t.id],...quizExtras[bank][t.id]]).slice(0,2).map(q=>({...q,why:quizReasons[t.id]}))));
  const correctSlots=shuffled([0,0,0,1,1,1,2,2,2,1]);
  return selected.map((q,index)=>{
    const correct=q.options[q.answer],wrong=shuffled(q.options.filter((_,i)=>i!==q.answer)),answer=correctSlots[index],options=wrong.slice();options.splice(answer,0,correct);
    return {...q,options,answer};
  });
}

const levelChallenges = {
  addition:[['4 + 3 = …',['6','7','8'],1],['27 + 18 = …',['35','45','55'],1],['56 + 37 = …',['83','93','97'],1]],
  subtraction:[['9 − 4 = …',['4','5','6'],1],['42 − 17 = …',['25','35','45'],0],['90 − 38 = …',['42','52','62'],1]],
  multiplication:[['3 × 4 = …',['7','12','14'],1],['8 × 7 = …',['54','56','64'],1],['12 × 8 = …',['86','96','98'],1]],
  division:[['12 ÷ 3 = …',['3','4','5'],1],['72 ÷ 8 = …',['8','9','10'],1],['96 ÷ 12 = …',['6','8','9'],1]],
  fraction:[['Satu dari 4 bagian sama besar ditulis …',['¼','⅓','½'],0],['2 dari 4 bagian sama besar sama dengan …',['½','⅓','¾'],0],['½ + ¼ = …',['½','¾','1'],1]]
};
const levelMissions=['Mulai dari hitungan sederhana','Coba strategi hitung yang lebih seru','Tantangan angka sampai 99'];
const challengeHints={addition:['Mulai dari 4, lalu hitung maju tiga langkah.','Pisahkan 18 menjadi 10 dan 8. Tambah 10 dulu, lalu 8.','Tambah puluhan dulu: 56 + 30. Setelah itu tambah 7.'],subtraction:['Hitung mundur empat langkah dari 9.','Kurangi 10 lebih dulu, lalu kurangi 7.','Kurangi 30 dahulu, lalu kurangi 8.'],multiplication:['Tambahkan 4 sebanyak tiga kali: 4 + 4 + 4.','Hitung 7, 14, 21, dan seterusnya sampai 8 kelompok.','Pisahkan 12 menjadi 10 + 2. Hitung 10 × 8, lalu 2 × 8.'],division:['Bagikan 12 satu per satu ke 3 lubang secara bergiliran.','Cari angka yang jika dikali 8 hasilnya 72.','Cari angka yang jika dikali 12 hasilnya 96.'],fraction:['Satu dari empat bagian sama besar disebut seperempat.','Bayangkan empat bagian sama besar dibagi menjadi dua pasangan.','Ubah 1/2 menjadi dua bagian perempat, lalu tambahkan satu bagian perempat.']};
const emptyLevelProgress=()=>({1:[],2:[],3:[]});
const defaultState={page:'home',name:'',profileSaved:false,activeLevel:1,preScores:null,postScores:null,preAttempts:[],postAttempts:[],lastQuizAttempt:null,quizDraft:null,quizDrafts:{pre:null,post:null},levelProgress:emptyLevelProgress(),practice:{},game:null};
let storageWarningShown=false;
let storageRecoveryNotice=false;
let state=loadState();
let quiz=state.quizDraft?{kind:state.quizDraft.kind,index:state.quizDraft.index,answers:state.quizDraft.answers.slice(),questions:state.quizDraft.questions.slice(),baselineId:state.quizDraft.baselineId||null}:{kind:null,index:0,answers:[],questions:[],baselineId:null};
let visualModel={multiplication:{groups:3,seeds:4},division:{groups:3,total:12},fraction:{parts:4,selected:1}};
let practiceAnswered={};
let playMode='traditional';
let studyTopic='addition';
let studyQuestion=null;
let music={on:false,ctx:null,timer:null,step:0};
let effects={on:loadEffectsPreference(),ctx:null,voices:new Set()};
let speechVoice=null;
let narrationRequest=0;
let narrationActive=false;
let focusRestoreKey=null;
let activeMoveSnapshot=null;
let moveGeneration=0;
let aiGeneration=0;
let musicMaster=null;

function reducedMotion(){return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false}
function motionBehavior(){return reducedMotion()?'auto':'smooth'}
function loadEffectsPreference(){try{return localStorage.getItem(SFX_KEY)!=='off'}catch(e){return true}}
function effectsIcon(){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/>${effects.on?'<path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>':'<path d="m16 9 5 6m0-6-5 6"/>'}</svg>`}
function effectsButton(full=false){return `<button class="sfx-toggle ${full?'ghost-button':'music-button'}" data-sfx-toggle ${full?'data-sfx-full="true"':''} aria-pressed="${effects.on}" aria-label="${effects.on?'Matikan':'Nyalakan'} efek suara">${effectsIcon()}<span>${full?`Efek suara: ${effects.on?'Aktif':'Nonaktif'}`:'Suara'}</span></button>`}
function updateEffectsControls(){
  $$('[data-sfx-toggle]').forEach(button=>{
    button.setAttribute('aria-pressed',String(effects.on));
    button.setAttribute('aria-label',`${effects.on?'Matikan':'Nyalakan'} efek suara`);
    button.title=`Efek suara ${effects.on?'aktif':'nonaktif'} · terpisah dari musik`;
    button.innerHTML=effectsIcon()+`<span>${button.dataset.sfxFull?`Efek suara: ${effects.on?'Aktif':'Nonaktif'}`:'Suara'}</span>`;
  });
}
function primeEffects(){
  if(!effects.on)return false;
  try{const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return false;if(!effects.ctx)effects.ctx=new AudioCtx();effects.ctx.resume().catch(()=>{});return true}catch(e){return false}
}
function toggleEffects(){
  effects.on=!effects.on;
  if(effects.on&&!primeEffects()){effects.on=false;toast('Efek suara belum tersedia di browser ini.');}
  if(!effects.on){effects.voices.forEach(voice=>{try{voice.stop()}catch(e){}});effects.voices.clear();}
  try{localStorage.setItem(SFX_KEY,effects.on?'on':'off')}catch(e){}
  updateEffectsControls();
  if(effects.on)playEffect('click');
}

function cleanUndoStack(value){if(!Array.isArray(value))return [];return value.slice(-40).filter(item=>item&&Array.isArray(item.pits)&&item.pits.length===16&&item.pits.every(n=>Number.isInteger(n)&&n>=0)&&item.pits.reduce((a,b)=>a+b,0)===98&&[0,1].includes(item.turn)).map(item=>({pits:item.pits.slice(),turn:item.turn,over:Boolean(item.over),message:String(item.message||'')}))}
function validPage(page){return ['home','learn','quiz','quiz-result','play','history','report','team','profile'].includes(page)}
function cleanScores(value){
  if(!value||typeof value!=='object'||!Number.isInteger(value.total)||value.total<0||value.total>10)return null;
  const scores={total:value.total};let correctSum=0;
  for(const topic of topics){
    const raw=value[topic.id];let correct;
    if(raw&&typeof raw==='object'&&Number.isInteger(raw.correct)&&raw.correct>=0&&raw.correct<=2)correct=raw.correct;
    else if(Number.isInteger(raw)&&raw>=0&&raw<=100)correct=raw>2?Math.max(0,Math.min(2,Math.round(raw/50))):raw;
    else return null;
    scores[topic.id]={correct,total:2};correctSum+=correct;
  }
  return correctSum===value.total?scores:null;
}
function cleanQuestion(q){
  if(!q||!topics.some(t=>t.id===q.cat)||typeof q.q!=='string'||!Array.isArray(q.options)||q.options.length<2||q.options.length>5||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)return null;
  return {cat:q.cat,q:q.q.slice(0,400),options:q.options.map(x=>String(x).slice(0,160)),answer:q.answer,why:String(q.why||quizReasons[q.cat]).slice(0,400)};
}
function cleanAttempt(value,kind){
  if(!value||value.kind!==kind)return null;const scores=cleanScores(value.scores);if(!scores)return null;
  const questions=Array.isArray(value.questions)?value.questions.map(cleanQuestion).filter(Boolean):[];
  const answers=Array.isArray(value.answers)?value.answers.slice(0,questions.length).map(a=>Number.isInteger(a)&&a>=0&&a<5?a:null):[];
  return {id:String(value.id||Date.now()).slice(0,48),kind,at:String(value.at||'').slice(0,40),scores,questions,answers,baselineId:value.baselineId?String(value.baselineId).slice(0,48):null};
}
function cleanDraft(value){
  if(!value||!['pre','post'].includes(value.kind)||!Array.isArray(value.questions)||value.questions.length!==10)return null;
  const questions=value.questions.map(cleanQuestion);if(questions.some(q=>!q))return null;
  const answers=Array.isArray(value.answers)?value.answers.slice(0,10).map((a,i)=>Number.isInteger(a)&&a>=0&&a<questions[i].options.length?a:null):Array(10).fill(null);
  while(answers.length<10)answers.push(null);
  return {kind:value.kind,index:Math.max(0,Math.min(9,Math.trunc(Number(value.index)||0))),questions,answers,baselineId:value.kind==='post'&&typeof value.baselineId==='string'?value.baselineId.slice(0,48):null};
}
function loadState(){
  try{
    const raw=localStorage.getItem(KEY),saved=raw?JSON.parse(raw):{};
    if(!saved||typeof saved!=='object'||Array.isArray(saved))throw new Error('Format data tidak sesuai');
    const next={...defaultState,...saved};
    next.name=typeof saved.name==='string'?saved.name.trim().slice(0,24):'';
    next.profileSaved=Boolean(next.name);next.practice={};
    next.activeTopic=topics.some(t=>t.id===saved.activeTopic)?saved.activeTopic:null;
    if(!saved.levelProgress){
      const oldDone=Object.keys(saved.learned||{}).filter(id=>saved.learned[id]);
      next.levelProgress=emptyLevelProgress();next.levelProgress[1]=oldDone;next.activeLevel=1;
    }else{
      next.levelProgress={...emptyLevelProgress(),...saved.levelProgress};
      next.activeLevel=Math.min(3,Math.max(1,Math.trunc(Number(saved.activeLevel)||1)));
    }
    const allowed=new Set(topics.map(t=>t.id)),clean=emptyLevelProgress();
    for(const level of [1,2,3]){
      const rawLevel=next.levelProgress[level];
      clean[level]=Array.isArray(rawLevel)?[...new Set(rawLevel.filter(id=>allowed.has(id)))]:[];
      if(level>1&&clean[level-1].length!==topics.length)clean[level]=[];
    }
    next.levelProgress=clean;
    const highest=clean[1].length===topics.length?(clean[2].length===topics.length?3:2):1;
    next.activeLevel=Math.min(next.activeLevel,highest);
    next.preScores=cleanScores(saved.preScores);next.postScores=cleanScores(saved.postScores);
    next.preAttempts=(Array.isArray(saved.preAttempts)?saved.preAttempts.map(x=>cleanAttempt(x,'pre')).filter(Boolean):[]).slice(-50);
    next.postAttempts=(Array.isArray(saved.postAttempts)?saved.postAttempts.map(x=>cleanAttempt(x,'post')).filter(Boolean):[]).slice(-50);
    if(next.preScores&&!next.preAttempts.length)next.preAttempts.push({id:'legacy-pre',kind:'pre',at:'',scores:next.preScores,questions:[],answers:[],baselineId:null});
    // Versi lama mewajibkan pretest sebelum posttest dan menghapus posttest saat pretest diulang; pasangan skor legacy yang tersisa karenanya berurutan.
    if(next.postScores&&!next.postAttempts.length)next.postAttempts.push({id:'legacy-post',kind:'post',at:'',scores:next.postScores,questions:[],answers:[],baselineId:next.preScores?next.preAttempts.at(-1)?.id||null:null});
    next.lastQuizAttempt=cleanAttempt(saved.lastQuizAttempt,saved.lastQuizAttempt?.kind)||null;
    const activeDraft=cleanDraft(saved.quizDraft),storedDrafts=saved.quizDrafts&&typeof saved.quizDrafts==='object'&&!Array.isArray(saved.quizDrafts)?saved.quizDrafts:{};
    next.quizDrafts={pre:cleanDraft(storedDrafts.pre),post:cleanDraft(storedDrafts.post)};
    if(activeDraft)next.quizDrafts[activeDraft.kind]=activeDraft;
    next.quizDraft=activeDraft;
    next.resultKind=['pre','post'].includes(saved.resultKind)?saved.resultKind:null;
    const g=saved.game;
    next.game=g&&Array.isArray(g.pits)&&g.pits.length===16&&g.pits.every(n=>Number.isInteger(n)&&n>=0)&&g.pits.reduce((a,b)=>a+b,0)===98&&[0,1].includes(g.turn)?{...g,mode:g.mode==='ai'?'ai':'two',animating:false,aiThinking:false,undoStack:cleanUndoStack(g.undoStack)}:null;
    delete next.grade;delete next.gradeDone;delete next.learned;
    const route=(window.location?.hash||'').slice(1);
    if(validPage(route))next.page=route;
    else if(validPage(saved.page))next.page=saved.page;
    if(next.quizDraft){next.page='quiz';}
    if(!next.profileSaved&&next.page==='profile')next.page='home';
    if(next.page==='quiz'&&!next.quizDraft)next.page='home';
    return next;
  }catch(e){storageRecoveryNotice=true;return {...defaultState,levelProgress:emptyLevelProgress()}}
}
function persistedSnapshot(){
  const snapshot={...state};
  if(state.game?.animating&&activeMoveSnapshot)snapshot.game={...activeMoveSnapshot,animating:false,aiThinking:false};
  else if(state.game?.aiThinking)snapshot.game={...state.game,animating:false,aiThinking:false};
  return snapshot;
}
function storageWarning(){if(storageWarningShown)return;storageWarningShown=true;setTimeout(()=>toast('Penyimpanan browser tidak tersedia atau penuh. Belajar tetap berjalan, tetapi perubahan ini mungkin tidak tersimpan.'),0)}
function save(){
  try{localStorage.setItem(KEY,JSON.stringify(persistedSnapshot()));updateHeader();return true}
  catch(e){storageWarning();updateHeader();return false}
}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function currentTopic(){return topics.find(t=>t.id===state.activeTopic)||topics[0]}
function topicDone(level,id){return (state.levelProgress[level]||[]).includes(id)}
function levelDone(level){return topics.every(t=>topicDone(level,t.id))}
function levelUnlocked(level){return level===1||levelDone(level-1)}
function allLevelsDone(){return [1,2,3].every(levelDone)}
function bottomRouteForPage(){if(state.page==='home')return'home';if(state.page==='learn')return'learn';if(state.page==='play')return'play';if(state.page==='quiz'||state.page==='quiz-result')return'quiz';if(state.page==='history'||state.page==='report')return'info';return null}
function updateHeader(){const av=$('#header-avatar'),lb=$('#login-button');if(av)av.textContent=state.name?state.name.trim().charAt(0).toUpperCase():'☺';if(lb)lb.textContent='Profil';$$('.nav-link').forEach(x=>{x.classList.toggle('active',x.dataset.page===state.page);if(x.dataset.page===state.page)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')});const active=bottomRouteForPage();$$('[data-bottom-route]').forEach(button=>{const selected=button.dataset.bottomRoute===active;button.classList.toggle('active',selected);if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});updateEffectsControls()}
function draftFor(kind){return state.quizDrafts?.[kind]||(state.quizDraft?.kind===kind?state.quizDraft:null)}
function hasQuizDraft(){return state.page==='quiz'&&!!state.quizDraft}
function commitPage(page,push=true){
  if(state.page!==page){
    if(state.game?.animating)cancelInFlightMove();
    if(state.game?.aiThinking){aiGeneration++;state.game.aiThinking=false;state.game.message='Giliran Buji siap dilanjutkan saat papan dibuka kembali.';save()}
    stopNarration();
  }
  if(page==='learn')state.activeTopic=null;
  state.page=page;
  if(push&&window.history?.pushState)window.history.pushState({congklatika:true,page},'',`#${page}`);
  else if(!push&&window.history?.replaceState)window.history.replaceState({congklatika:true,page},'',`#${page}`);
  save();render();window.scrollTo({top:0,behavior:motionBehavior()});$('#main-nav')?.classList.remove('open');$('#menu-toggle')?.setAttribute('aria-expanded','false');
  if(page==='play'&&state.game?.mode==='ai'&&state.game.turn===1&&!state.game.over)setTimeout(runAiTurn,250);
}
function setPage(page){
  if(!validPage(page))page='home';
  if(hasQuizDraft()&&page!=='quiz'&&typeof window.confirm==='function'&&!window.confirm('Tes belum selesai. Draf jawaban tersimpan di perangkat ini. Tinggalkan tes sekarang?'))return;
  commitPage(page,true);
}
function saveQuizDraft(){
  if(!quiz.kind||quiz.questions.length!==10)return;
  const draft={kind:quiz.kind,index:quiz.index,questions:quiz.questions,answers:quiz.answers.slice(),baselineId:quiz.baselineId||null};state.quizDraft=draft;state.quizDrafts={...(state.quizDrafts||{}),[quiz.kind]:draft};save();
}
function restoreDraftQuiz(kind){
  const draft=draftFor(kind);if(draft){state.quizDraft=draft;quiz={kind,index:draft.index,questions:draft.questions.slice(),answers:draft.answers.slice(),baselineId:draft.baselineId||null};setPage('quiz');return true}
  return false;
}
function resetFocus(key){focusRestoreKey=key||focusRestoreKey}
function toast(message){const box=$('#toast-region');const el=document.createElement('div');el.className='toast';el.textContent=message;box.append(el);setTimeout(()=>el.remove(),2800)}
function popConfetti(){if(reducedMotion())return;const colors=['#eab348','#62a46f','#e07758','#6a9fc0','#f4d67b'];for(let i=0;i<42;i++){const p=document.createElement('i');p.className='confetti';p.style.left=Math.random()*100+'vw';p.style.background=colors[i%colors.length];p.style.animationDelay=(Math.random()*.45)+'s';p.style.transform=`rotate(${Math.random()*180}deg)`;document.body.append(p);setTimeout(()=>p.remove(),2100)}}
function startPretest(){
  if(restoreDraftQuiz('pre')){toast('Draf pretest dibuka kembali.');return}
  quiz={kind:'pre',index:0,questions:createQuiz('pre'),answers:Array(10).fill(null),baselineId:null};
  saveQuizDraft();setPage('quiz');
}
function startPosttest(){
  if(!allLevelsDone()){toast('Selesaikan semua materi di ketiga level dulu, ya!');setPage('learn');return}
  if(restoreDraftQuiz('post')){toast('Draf posttest dibuka kembali.');return}
  quiz={kind:'post',index:0,questions:createQuiz('post'),answers:Array(10).fill(null),baselineId:state.preAttempts.at(-1)?.id||null};
  saveQuizDraft();setPage('quiz');
}
function openQuizFromBottomNav(){
  if(state.page==='quiz'&&state.quizDraft)return;
  const kind=state.quizDraft?.kind||(draftFor('post')?'post':draftFor('pre')?'pre':allLevelsDone()&&state.preScores&&!state.postScores?'post':'pre');
  if(restoreDraftQuiz(kind))return;
  if(kind==='post'){startPosttest();return}
  startPretest();
}
function beginJourney(){setPage('learn')}
function totalProgress(){const total=[1,2,3].reduce((n,l)=>n+(state.levelProgress[l]||[]).length,0);return Math.round(total/(topics.length*3)*100)}
function bujiCard(message='Hai, teman! Aku Buji. Yuk, belajar sedikit demi sedikit dan jangan takut mencoba!'){return `<div class="buji-card"><img src="./buji-avatar-optimized.webp" alt="Buji, pemandu CongklaTika" width="640" height="640" loading="lazy" decoding="async"><div class="buji-bubble"><b>Buji berbisik:</b> ${message}</div></div>`}
function pageHeading(kicker,title,sub,withBuji=true){return `<div class="page-heading ${withBuji?'with-buji':''}"><div><span class="eyebrow">${kicker}</span><h1 tabindex="-1" data-focus-key="page-heading">${title}</h1><p>${sub}</p></div>${withBuji?'<img src="./buji-avatar-optimized.webp" alt="" width="640" height="640" loading="lazy" decoding="async">':''}</div>`}
function topicCard(t){return `<button class="topic-card" data-topic="${t.id}"><div class="topic-top"><span class="topic-icon">${t.icon}</span></div><h3>${t.name}</h3><p>${t.desc}</p><span class="topic-status">Lihat materi <span>→</span></span></button>`}
function renderHome(){
  const startLabel=state.preScores||totalProgress()>0?'Lanjutkan belajar':'Mulai belajar';
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow"><span class="dot"></span> Petualangan matematika bersama Buji</span><h1 class="display">Belajar asyik,<br><em>main congklak!</em></h1><p class="lead">Berhitung dan bermain bersama Buji. Kamu boleh langsung belajar tanpa tes—pelan-pelan saja, tak perlu takut salah.</p><div class="hero-actions"><button class="primary-button large" data-action="start">${startLabel} <span aria-hidden="true">→</span></button><button class="secondary-button large" data-page="play">Coba main congklak <span aria-hidden="true">⌁</span></button></div><div class="hero-note"><div class="tiny-avatars"><span>🌱</span><span>🔢</span><span>🌟</span></div><span>Belajar kapan saja · pretest hanya pilihan</span></div></div><div class="seed-bubble">Psst… ada misi baru! ✨</div><div class="hero-sticker"><img src="./buji-avatar-optimized.webp" alt="Buji melambaikan tangan" width="640" height="640" loading="lazy" decoding="async"></div></section>
  <section class="section" id="fitur"><div class="container"><div class="section-heading"><span class="eyebrow">Peta petualangan</span><h2>Satu papan, banyak hal seru</h2><p>Belajar konsep matematika lewat cerita, latihan, dan permainan budaya yang seru.</p></div><div class="feature-grid"><article class="feature-card"><div class="feature-icon">🧭</div><h3>Jalur belajar</h3><p>Kenali tambah, kurang, kali, bagi, dan pecahan lewat contoh biji congklak yang dekat dengan keseharian.</p></article><article class="feature-card"><div class="feature-icon">🪵</div><h3>Main congklak</h3><p>Belajar strategi, bergiliran, dan berhitung. Ajak teman atau tantang komputer!</p></article><article class="feature-card"><div class="feature-icon">📈</div><h3>Lihat kemajuan</h3><p>Kalau mau, bandingkan hasil sebelum dan sesudah belajar. Setiap langkah kecil tetap berarti!</p></article></div></div></section>
  <section class="section" style="padding-top:0"><div class="container"><div class="band"><div class="band-emoji">🧺</div><div><h2>Petualanganmu menunggu!</h2><p>Pilih materi yang ingin dipelajari. Pretest hanya pilihan untuk melihat bekal awalmu.</p></div><button class="primary-button" data-action="start">${state.preScores||totalProgress()>0?'Lanjut belajar':'Pilih materi'} →</button></div></div></section>
  <section class="section" style="padding-top:0"><div class="container"><div class="section-heading"><span class="eyebrow">Belajar sesuai langkahmu</span><h2>Dari biji kecil jadi ide besar</h2><p>Lima materi matematika dengan tantangan yang makin seru di setiap level.</p></div><div class="topic-grid">${topics.map(topicCard).join('')}</div></div></section>
  <section class="section" style="padding-top:0"><div class="container"><div class="band"><div class="band-emoji">📖</div><div><h2>Kisah di balik papan congklak</h2><p>Kenali permainan tradisional yang punya banyak nama, cerita, dan aturan di berbagai daerah.</p></div><button class="primary-button" data-page="history">Jelajahi kisahnya →</button></div></div></section>`;
}
function renderLearn(){
  const topic=state.activeTopic?currentTopic():null;
  const done=(state.levelProgress[state.activeLevel]||[]).length;
  const pct=totalProgress();
  let html=`<div class="container page-wrap">${pageHeading('Ruang belajar','Ayo, belajar bareng Buji!','Pilih level dan kumpulkan bintang sedikit demi sedikit.')}${bujiCard(topic?topic.tip:'Pilih satu materi. Kita lihat contoh sederhana, lalu coba satu soal. Jawaban salah boleh dicoba lagi!')}<div class="page-toolbar"><span class="tag">Pilih level</span><div class="spacer"></div><span class="small muted">Level ${state.activeLevel}: ${done} dari 5 materi selesai</span></div><div class="levels-grid">${[1,2,3].map(n=>{const unlocked=levelUnlocked(n);return `<button class="level-card ${state.activeLevel===n?'selected':''} ${unlocked?'':'locked'}" data-level="${n}" ${unlocked?'':'disabled'} aria-pressed="${state.activeLevel===n}" aria-label="Level ${n}${unlocked?'':' terkunci'}"><span class="level-no">${unlocked?n:'🔒'}</span><small>Level ${n}</small></button>`}).join('')}</div><div class="progress-row"><span>🌱 Progres petualangan</span><span>${pct}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><div class="small muted" style="margin-top:7px">Level ${state.activeLevel} · ${levelMissions[state.activeLevel-1]}${state.activeLevel<3?' · semua materi level sebelumnya membuka level ini':''}</div>`;
  if(topic)html+=renderLesson(topic);
  else{
    html+=`<div class="page-toolbar" style="margin-top:25px"><span class="eyebrow">Pilih misi belajar · Level ${state.activeLevel}</span><div class="spacer"></div>${draftFor('pre')?`<button class="ghost-button" data-action="start-pretest">Lanjutkan draf pretest</button>`:state.preScores?`<span class="tag">Cek awal terbaru: ${state.preScores.total}/10 benar</span>`:totalProgress()===0?`<button class="ghost-button" data-action="start-pretest">Pretest awal · opsional</button>`:`<span class="tag">Pretest dilewati · tetap hebat!</span>`}</div><div class="topic-grid">${topics.map(t=>{const completed=topicDone(state.activeLevel,t.id);return `<button class="topic-card ${completed?'topic-complete':''}" data-topic="${t.id}"><div class="topic-top"><span class="topic-icon">${t.icon}</span></div><h3>${t.name}</h3><p>${t.desc}</p><span class="topic-status ${completed?'done':''}">${completed?'Selesai di level ini ✓':'Mulai tantangan →'}</span></button>`}).join('')}</div>`;
    if(levelDone(state.activeLevel)&&state.activeLevel<3)html+=`<div class="band level-unlock" style="margin-top:20px"><div class="band-emoji">🔓</div><div><h2>Level ${state.activeLevel+1} terbuka!</h2><p>Kerja bagus! Semua materi level ini sudah kamu selesaikan.</p></div><button class="primary-button" data-level="${state.activeLevel+1}">Lanjut ke level ${state.activeLevel+1} →</button></div>`;
    const ready=allLevelsDone();
    html+=`<div class="panel" style="margin-top:20px"><div class="page-toolbar" style="margin:0"><div><h2 style="margin:0 0 4px;font:800 24px var(--display)">Evaluasi akhir · opsional</h2><span class="small muted">${ready?(state.preScores?'Semua level selesai. Jika mau, bandingkan hasil belajarmu!':'Semua materi selesai. Posttest boleh dikerjakan meski pretest dilewati.'):'Selesaikan semua materi di tiga level dahulu.'}</span></div><div class="spacer"></div>${draftFor('post')?'<button class="primary-button" data-action="start-posttest">Lanjutkan draf posttest →</button>':`<button class="primary-button" data-action="start-posttest" ${ready?'':'disabled title="Selesaikan semua level dulu"'}>${state.postScores?'Ulangi posttest':'Mulai posttest'} →</button>`}</div></div>`;
  }
  return html+'</div>';
}
function visualStepper(topic,key,value,label,min,max){return `<div class="visual-control"><span>${label}</span><div><button class="stepper-button" data-focus-key="visual-${topic}-${key}-minus" data-visual-topic="${topic}" data-visual-key="${key}" data-step="-1" ${value<=min?'disabled':''} aria-label="Kurangi ${label.toLowerCase()}">−</button><strong>${value}</strong><button class="stepper-button" data-focus-key="visual-${topic}-${key}-plus" data-visual-topic="${topic}" data-visual-key="${key}" data-step="1" ${value>=max?'disabled':''} aria-label="Tambah ${label.toLowerCase()}">+</button></div></div>`}
function seedDots(count){
  const shown=Math.min(count,12),extra=Math.max(0,count-shown);
  return Array.from({length:shown},()=>'<i class="seed seed-dot" aria-hidden="true">●</i>').join('')+(extra?`<b class="seed-overflow" aria-label="dan ${extra} biji lagi">+${extra}</b>`:'');
}
function questionSeedMarks(count){
  if(count>=10){const tens=Math.floor(count/10),ones=count%10;return `<span class="question-tens" aria-hidden="true">${Array.from({length:tens},()=>'<i class="question-tens-bundle">10</i>').join('')}</span>${Array.from({length:ones},()=>'<i class="question-seed"></i>').join('')}`}
  return Array.from({length:count},()=>'<i class="question-seed"></i>').join('');
}
function renderQuestionPit(label,count,muted=false,display=String(count)){
  const labelText=label?`, ${label}`:'';
  const marks=count>0?questionSeedMarks(count):'';
  return `<div class="question-pit${muted?' is-muted':''}${count>0?' is-active':''}" aria-label="Lubang congklak, ${count} biji${esc(labelText)}"><span class="question-pit-label" aria-hidden="true">${esc(label)}</span><span class="question-pit-seeds" aria-hidden="true">${marks}</span><strong class="question-pit-count">${esc(String(display))}</strong></div>`;
}
function renderQuestionIllustration(t,prompt){
  const level=state.activeLevel;let title='',description='',operation='',legend='';
  const counts=Array(14).fill(0),labels=Array(14).fill('');
  if(t.id==='addition'){
    const match=prompt[0].match(/(\d+)\s*\+\s*(\d+)/);if(!match)return '';
    const a=Number(match[1]),b=Number(match[2]);title='Gabungkan dua kelompok';description='Setiap lubang yang berisi biji menunjukkan satu kelompok dari soal.';operation=`${a} biji + ${b} biji`;counts[2]=a;counts[4]=b;labels[2]='A';labels[4]='B';legend='Hitung biji pada kelompok A dan B, lalu jumlahkan.';
  }else if(t.id==='subtraction'){
    const match=prompt[0].match(/(\d+)\s*−\s*(\d+)/);if(!match)return '';
    const a=Number(match[1]),b=Number(match[2]);title='Pindahkan sebagian biji';description='Lubang A menunjukkan jumlah semula; lubang B menunjukkan biji yang dipindahkan.';operation=`${a} biji − ${b} biji`;counts[2]=a;counts[4]=b;labels[2]='A';labels[4]='B';legend='Cari tahu berapa biji yang tertinggal setelah sebagian dipindahkan.';
  }else if(t.id==='multiplication'){
    const match=prompt[0].match(/(\d+)\s*×\s*(\d+)/);if(!match)return '';
    const groups=Number(match[1]),seeds=Number(match[2]);title='Kelompok yang sama banyak';description=`Setiap lubang berisi ${seeds} biji. Lubang berisi menunjukkan kelompok pada soal.`;operation=`${groups} lubang × ${seeds} biji`;for(let i=0;i<Math.min(groups,14);i++)counts[i]=seeds;legend='Bandingkan isi setiap lubang, lalu hitung semua kelompok.';
  }else if(t.id==='division'){
    const match=prompt[0].match(/(\d+)\s*÷\s*(\d+)/);if(!match)return '';
    const total=Number(match[1]),groups=Number(match[2]),each=total/groups;title='Bagikan biji dengan rata';description=`Sebanyak ${total} biji dibagikan sama banyak ke ${groups} lubang.`;operation=`${total} biji ÷ ${groups} lubang`;for(let i=0;i<Math.min(groups,14);i++)counts[i]=each;legend='Setiap lubang menerima jumlah yang sama; gunakan perkalian untuk memeriksa.';
  }else if(t.id==='fraction'){
    title='Bagian sama besar di papan';
    description=level===1?'Empat bagian yang sama besar mewakili satu utuh.':level===2?'Dua dari empat bagian sama besar membentuk setengah.':'Samakan ukuran bagian sebelum menjumlahkan pecahan.';
    operation=level===1?'1 dari 4 bagian':level===2?'2/4 sama dengan 1/2':'1/2 + 1/4 = 3/4';
    for(let i=0;i<4;i++){counts[i+1]=1;labels[i+1]='1/4'}
    legend=level===3?'Dua bagian perempat sama dengan setengah; satu bagian lagi membuat 3/4.':'Bagian berwarna menunjukkan bagian yang dipilih; semuanya harus sama besar.';
  }else return '';
  const firstRow=Array.from({length:7},(_,i)=>renderQuestionPit(labels[i],counts[i],counts[i]===0,counts[i]===0?'0':labels[i]||String(counts[i]))).join('');
  const secondRow=Array.from({length:7},(_,i)=>{const index=i+7;return renderQuestionPit(labels[index],counts[index],counts[index]===0,counts[index]===0?'0':labels[index]||String(counts[index]))}).join('');
  const rowLabels=counts.map((count,i)=>`Lubang ${i+1}: ${count} biji`).join('; ');
  return `<section class="question-illustration" data-question-illustration="${t.id}-${level}" aria-label="Ilustrasi congklak untuk ${esc(t.name)}, level ${level}"><div class="question-illustration-heading"><span class="eyebrow">Ilustrasi ${esc(t.name.toLowerCase())}</span><strong>${title}</strong><p>${description}</p></div><div class="question-board" role="img" aria-label="Papan congklak dengan 14 lubang kecil dalam dua baris, tujuh lubang tiap baris, dan dua lumbung di ujung. ${esc(operation)}. ${esc(description)}. ${rowLabels}."><div class="question-board-row"><span class="question-board-store" aria-hidden="true">Lumbung</span><div class="question-pit-rows"><div class="question-pit-row" aria-hidden="true">${firstRow}</div><div class="question-pit-row" aria-hidden="true">${secondRow}</div></div><span class="question-board-store" aria-hidden="true">Lumbung</span></div></div><p class="question-operation">${operation}</p><p class="question-legend">${legend}</p></section>`;
}
function renderVisualPractice(t){
  const prompt=levelChallenges[t.id][state.activeLevel-1],questionDiagram=renderQuestionIllustration(t,prompt);
  const m=visualModel[t.id];if(!m)return questionDiagram;
  let title='',controls='',picture='',equation='';
  if(t.id==='multiplication'){
    title='Buat kelompok biji yang sama banyak';
    controls=visualStepper(t.id,'groups',m.groups,'Kelompok',2,5)+visualStepper(t.id,'seeds',m.seeds,'Biji tiap kelompok',1,6);
    picture=`<div class="visual-groups">${Array.from({length:m.groups},(_,i)=>`<div class="visual-group" aria-label="Kelompok ${i+1}, ${m.seeds} biji"><span>${seedDots(m.seeds)}</span></div>`).join('')}</div>`;
    equation=`${m.groups} kelompok × ${m.seeds} biji = <strong>${m.groups*m.seeds} biji</strong>`;
  }else if(t.id==='division'){
    const each=m.total/m.groups,choices=[2,3,4,6],at=choices.indexOf(m.groups);
    title='Bagikan biji sama rata';
    controls=`<div class="visual-control"><span>Lubang tujuan</span><div><button class="stepper-button" data-visual-topic="division" data-visual-key="groups" data-step="-1" data-focus-key="visual-division-groups-minus" ${at<=0?'disabled':''} aria-label="Kurangi jumlah lubang">−</button><strong>${m.groups}</strong><button class="stepper-button" data-visual-topic="division" data-visual-key="groups" data-step="1" data-focus-key="visual-division-groups-plus" ${at>=choices.length-1?'disabled':''} aria-label="Tambah jumlah lubang">+</button></div></div><span class="visual-note">Jumlah biji tetap ${m.total}</span>`;
    picture=`<div class="visual-groups">${Array.from({length:m.groups},(_,i)=>`<div class="visual-group" aria-label="Lubang ${i+1}, ${each} biji"><span>${seedDots(each)}</span></div>`).join('')}</div>`;
    equation=`${m.total} biji ÷ ${m.groups} lubang = <strong>${each} biji tiap lubang</strong>`;
  }else{
    title='Lihat bagian dari satu utuh';
    controls=visualStepper(t.id,'parts',m.parts,'Bagian sama besar',2,4)+visualStepper(t.id,'selected',m.selected,'Bagian yang diambil',1,m.parts);
    picture=`<div class="fraction-bar" role="img" aria-label="${m.selected} dari ${m.parts} bagian diwarnai">${Array.from({length:m.parts},(_,i)=>`<span class="fraction-part ${i<m.selected?'chosen':''}"></span>`).join('')}</div>`;
    equation=`${m.selected} dari ${m.parts} bagian sama besar = <strong>${m.selected}/${m.parts}</strong>`;
  }
  return `${questionDiagram}<section class="visual-practice" aria-label="Latihan visual ${t.name}"><div class="visual-heading"><span class="eyebrow">Coba sendiri · latihan visual</span><h3>${title}</h3><p>Tekan + atau −, lalu amati perubahan gambar dan hitungannya.</p></div><div class="visual-controls">${controls}</div>${picture}<div class="visual-equation" aria-live="polite">${equation}</div></section>`;
}
function renderLessonGuide(t){
  const guide=lessonGuides[t.id][state.activeLevel-1];
  return `<section class="lesson-guide" aria-labelledby="lesson-guide-title"><div class="lesson-guide-intro"><span class="eyebrow">Belajar langkah demi langkah · Level ${state.activeLevel}</span><h3 id="lesson-guide-title">Pahami ${esc(t.name.toLowerCase())}</h3><p>${esc(guide.concept)}</p></div><div class="lesson-guide-bridge"><h4>Dari benda ke simbol</h4><ol>${guide.bridge.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></div><div class="lesson-guide-summary"><h4>Ringkasan</h4><p>${esc(guide.summary)}</p><p><strong>Hubungkan dengan congklak:</strong> ${esc(guide.congklak)}</p></div></section>`;
}
function workedExample(t){
  const guide=lessonGuides[t.id][state.activeLevel-1];
  return `<div class="example-box worked-example"><strong>${esc(guide.exampleTitle)}</strong><p>${esc(guide.example)}</p><ol>${guide.worked.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></div>`;
}
function renderMaterialProgress(t){
  const position=topics.findIndex(item=>item.id===t.id)+1,completed=(state.levelProgress[state.activeLevel]||[]).length,percent=Math.round(position/topics.length*100);
  return `<section class="lesson-progress" data-material-progress="${t.id}"><div class="progress-row"><span>Materi ${position} dari ${topics.length} · Level ${state.activeLevel}</span><span>${completed} dari ${topics.length} selesai</span></div><div class="progress-track" role="progressbar" aria-label="Posisi materi di Level ${state.activeLevel}" aria-valuemin="1" aria-valuemax="${topics.length}" aria-valuenow="${position}" aria-valuetext="Materi ${position} dari ${topics.length}, Level ${state.activeLevel}"><div class="progress-fill" style="width:${percent}%"></div></div></section>`;
}
function renderLesson(t){
  const practiced=practiceAnswered[t.id],prompt=levelChallenges[t.id][state.activeLevel-1],solved=practiced===prompt[2],completed=topicDone(state.activeLevel,t.id);
  return `<div class="lesson-layout" style="margin-top:22px"><article class="lesson-card"><div class="page-toolbar"><span class="topic-icon">${t.icon}</span><span class="tag">${t.tag} · Level ${state.activeLevel}</span><div class="spacer"></div><button class="ghost-button audio-toggle" data-action="read-current" aria-pressed="${narrationActive}">${narrationActive?'⏹ Hentikan bacaan':'🔊 Dengarkan Buji'}</button></div>${renderMaterialProgress(t)}<h2>${t.name}</h2><p>${esc(t.lesson)}</p>${renderLessonGuide(t)}${workedExample(t)}${renderVisualPractice(t)}<div class="mini-question"><strong>🎯 Tantangan mini</strong><p style="margin:5px 0 0">${esc(prompt[0])}</p><div class="answer-row" role="radiogroup" aria-label="Pilihan jawaban untuk tantangan ${t.name}">${prompt[1].map((a,i)=>`<button class="answer-chip ${practiced===i?'selected':''}" role="radio" aria-checked="${practiced===i}" tabindex="${practiced===i||practiced===undefined&&i===0?0:-1}" data-focus-key="practice-${t.id}-${i}" data-practice="${t.id}" data-answer="${i}">${esc(a)}</button>`).join('')}</div>${practiced!==undefined?`<p class="inline-message ${solved?'':'error'}" aria-live="polite">${solved?'Hebat, jawabanmu tepat! 🌟':`Belum cocok—tidak apa-apa! ${esc(challengeHints[t.id][state.activeLevel-1])} Coba pilih lagi, ya.`}</p>`:''}</div><div class="page-toolbar" style="margin-top:20px"><button class="ghost-button" data-action="back-topics">← Semua materi</button><div class="spacer"></div><button class="primary-button" data-action="complete-topic" data-topic-id="${t.id}" ${solved||completed?'':'disabled'}>${completed?'Selesai di level ini ✓':'Tandai materi selesai'}</button></div></article><aside class="lesson-aside"><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">💡 Tips dari Buji</h3><p class="muted small" style="margin:0">${esc(t.tip)}</p></div><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">🗺️ Jalur 3 level</h3><p class="muted small">Selesaikan semua lima materi di satu level untuk membuka level berikutnya. Soal makin menantang, tetapi semua angka tetap di bawah 100.</p><span class="tag">Sekarang: Level ${state.activeLevel}</span></div><div class="panel"><h3 style="font:800 21px var(--display);margin:0 0 8px">🎧 Dengarkan</h3><p class="muted small" style="margin:0">Buji membacakan materi dan tantangan yang sedang terbuka. Musik akan dipelankan sementara.</p></div></aside></div>`;
}
function renderQuiz(){
  const questions=quizQuestionsFor(quiz.kind),q=questions[quiz.index],isPre=quiz.kind==='pre',label=isPre?'Pretest awal':'Posttest akhir',ans=quiz.answers[quiz.index],answered=quiz.answers.filter(x=>x!==null).length;
  return `<div class="container page-wrap">${pageHeading(isPre?'Sebelum petualangan':'Akhir petualangan',isPre?'Cek bekal awalmu!':'Tunjukkan yang kamu pelajari!','Ini latihan, bukan ujian sekolah. Baca pelan-pelan dan pilih jawaban yang menurutmu tepat.')} ${bujiCard(isPre?'Tidak apa-apa kalau belum tahu semuanya. Kita mulai dari sini, ya!':'Kamu sudah berlatih. Tarik napas, baca soal pelan-pelan, dan lakukan yang terbaik!')}<div class="quiz-card"><div class="quiz-top"><span class="quiz-category">${label} · ${topics.find(t=>t.id===q.cat).name}</span><span>Soal ${quiz.index+1} dari ${questions.length}</span></div><div class="progress-track quiz-answer-progress" role="progressbar" aria-label="Soal kuis yang sudah dijawab" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="${answered}" aria-valuetext="${answered} dari ${questions.length} soal terjawab; sedang melihat soal ${quiz.index+1}"><div class="progress-fill" style="width:${answered/questions.length*100}%"></div></div><div class="progress-row"><span>Soal ${quiz.index+1} dari ${questions.length}</span><span>${answered}/${questions.length} terjawab</span></div><h2>${esc(q.q)}</h2><button class="ghost-button audio-toggle" data-action="read-current" aria-pressed="${narrationActive}">${narrationActive?'⏹ Hentikan bacaan':'🔊 Dengarkan soal'}</button><div class="quiz-options" role="radiogroup" aria-label="Pilihan jawaban soal ${quiz.index+1}">${q.options.map((o,i)=>`<button class="quiz-option ${ans===i?'selected':''}" role="radio" aria-checked="${ans===i}" tabindex="${ans===i||ans===null&&i===0?0:-1}" data-focus-key="quiz-${quiz.index}-${i}" data-quiz-answer="${i}"><span class="option-letter">${String.fromCharCode(65+i)}</span>${esc(o)}</button>`).join('')}</div><div class="quiz-footer"><button class="ghost-button" data-action="quiz-prev" ${quiz.index===0?'disabled':''}>← Kembali</button><span class="small muted">Draf tes tersimpan otomatis</span>${quiz.index===questions.length-1?'<button class="primary-button" data-action="quiz-submit">Lihat hasil ✨</button>':'<button class="primary-button" data-action="quiz-next">Berikutnya →</button>'}</div></div></div>`;
}
function scoresByCategory(answers,questions=quizQuestionsFor(quiz.kind)){
  const scores={};topics.forEach(t=>{const indexes=questions.map((q,i)=>q.cat===t.id?i:-1).filter(i=>i>=0);scores[t.id]={correct:indexes.filter(i=>answers[i]===questions[i].answer).length,total:indexes.length}});
  scores.total=answers.filter((a,i)=>a===questions[i].answer).length;return scores;
}
function finishQuiz(){
  const questions=quizQuestionsFor(quiz.kind);if(quiz.answers.some(a=>a===null)){toast('Jawab semua soal dulu agar hasilnya lengkap.');return}
  const kind=quiz.kind,scores=scoresByCategory(quiz.answers,questions),id=`${kind}-${Date.now()}`,attempt={id,kind,at:new Date().toISOString(),scores,answers:quiz.answers.slice(),questions:questions.map(q=>({...q,options:q.options.slice()})),baselineId:kind==='post'?quiz.baselineId||null:null};
  if(kind==='pre'){state.preScores=scores;state.preAttempts=[...state.preAttempts,attempt].slice(-50)}
  else{state.postScores=scores;state.postAttempts=[...state.postAttempts,attempt].slice(-50)}
  state.lastQuizAttempt=attempt;state.quizDraft=null;state.quizDrafts={...(state.quizDrafts||{}),[kind]:null};state.page='quiz-result';state.resultKind=kind;
  history.replaceState?.({congklatika:true,page:'quiz-result'},'','#quiz-result');save();popConfetti();render();window.scrollTo({top:0,behavior:motionBehavior()});
}
function adjustVisual(topic,key,step){
  const model=visualModel[topic];if(!model)return;
  if(topic==='division'){const choices=[2,3,4,6],at=choices.indexOf(model.groups);model.groups=choices[Math.max(0,Math.min(choices.length-1,at+step))]}
  else if(topic==='fraction'&&key==='parts'){model.parts=Math.max(2,Math.min(4,model.parts+step));model.selected=Math.min(model.selected,model.parts)}
  else{const limits=topic==='multiplication'?(key==='groups'?[2,5]:[1,6]):(key==='selected'?[1,model.parts]:[2,4]);model[key]=Math.max(limits[0],Math.min(limits[1],model[key]+step))}
  render();
}
function renderQuizResult(){
  const pre=state.resultKind==='pre',scores=pre?state.preScores:state.postScores,attempt=state.lastQuizAttempt,questions=attempt?.questions||[],answers=attempt?.answers||[];
  const review=questions.length?`<section class="panel quiz-review"><h3>Yuk lihat alasannya</h3>${questions.map((q,i)=>{const right=answers[i]===q.answer;return `<details><summary>Soal ${i+1} · ${right?'Jawabanmu benar':'Mari lihat jawabannya'}</summary><p><strong>${esc(q.q)}</strong></p><p>Jawaban benar: ${esc(q.options[q.answer])}. ${esc(q.why||quizReasons[q.cat])}</p></details>`}).join('')}</section>`:'';
  return `<div class="container page-wrap"><div class="quiz-card"><div class="result-hero"><div class="result-star">${pre?'🌱':'🏆'}</div><span class="eyebrow">${pre?'Pretest selesai':'Posttest selesai'}</span><h2>${pre?'Ini titik awal petualanganmu!':'Lihat seberapa jauh kamu tumbuh!'}</h2><div class="score-big">${scores.total}<span style="font-size:24px;color:var(--muted)"> / 10 benar</span></div><p class="muted">${pre?'Hasil ini tersimpan sebagai percobaan pretest terbaru.':'Kamu sudah menyelesaikan evaluasi akhir. Hebat sekali!'}</p></div><div class="panel" style="box-shadow:none"><h3 style="font:800 23px var(--display);margin-bottom:4px">Jawaban benar per kategori</h3><p class="small muted" style="margin-top:0">Ditampilkan sebagai jumlah soal benar dari 2 soal, bukan persentase.</p><div style="overflow:auto"><table class="score-table"><thead><tr><th>Kategori</th><th>Benar</th><th>Gambaran</th></tr></thead><tbody>${topics.map(t=>{const n=scores[t.id].correct;return `<tr><td>${t.icon} ${t.name}</td><td><strong>${n}/2</strong></td><td><div class="bar-compare"><div aria-label="${n} dari 2 benar"><span style="width:${n*50}%"></span></div></div></td></tr>`}).join('')}</tbody></table></div></div>${review}<div class="quiz-footer"><button class="ghost-button" data-page="report">Lihat laporan</button><button class="primary-button" data-action="result-continue">${pre?'Pilih materi belajar':'Lihat perjalananku'} →</button></div></div></div>`;
}
function levelReport(){return [1,2,3].map(level=>`<li>Level ${level}: ${(state.levelProgress[level]||[]).length} dari ${topics.length} materi selesai</li>`).join('')}
function renderReport(){
  if(!state.preScores){
    const latest=state.postScores;
    return `<div class="container page-wrap">${pageHeading('Catatan perjalanan','Perjalanan belajarmu','Kemajuan materi tetap tercatat walaupun kamu melewati pretest.')}${bujiCard('Tidak mengerjakan pretest juga tidak apa-apa. Laporan ini menunjukkan materi yang sudah kamu jelajahi dan hasil posttest jika kamu memilihnya.') }<div class="report-summary"><div class="metric"><strong>${totalProgress()}%</strong><span>Materi dipelajari</span></div><div class="metric"><strong>${latest?`${latest.total}/10`:'—'}</strong><span>${latest?'Benar di posttest terakhir':'Posttest belum dikerjakan'}</span></div><div class="metric"><strong>${state.postAttempts.length}</strong><span>Percobaan posttest</span></div></div><div class="panel report-materials"><h2>Materi yang sudah dipelajari</h2><ul class="level-report">${levelReport()}</ul><p class="source-note">Pretest awal dilewati, jadi tidak ada nilai awal untuk dibandingkan. Kamu tidak perlu mengulang atau mengejar pretest.</p>${latest?`<h3>Posttest terakhir</h3><p><strong>${latest.total} dari 10 soal benar.</strong> Jumlah benar ditampilkan langsung agar mudah dipahami.</p><div class="category-counts">${topics.map(t=>`<span>${t.name}: ${latest[t.id].correct}/2</span>`).join('')}</div>`:''}</div><div class="page-toolbar"><button class="primary-button" data-page="learn">Kembali belajar →</button>${allLevelsDone()?`<button class="ghost-button" data-action="start-posttest">${draftFor('post')?'Lanjutkan draf posttest':'Mulai posttest · opsional'}</button>`:''}</div></div>`;
  }
  const hasPost=!!state.postScores,preCorrect=state.preScores.total,postCorrect=hasPost?state.postScores.total:null;
  const latestPreAttempt=state.preAttempts.at(-1),latestPostAttempt=state.postAttempts.at(-1);
  const comparisonAttempt=latestPostAttempt?.baselineId?state.preAttempts.find(a=>a.id===latestPostAttempt.baselineId):null;
  const hasComparison=!!hasPost&&!!comparisonAttempt;
  const comparisonScores=hasComparison?comparisonAttempt.scores:state.preScores;
  const baselineLabel=hasComparison?'Pretest pasangan posttest':hasPost?'Pretest terbaru · tanpa pasangan':'Pretest terbaru';
  const baselineIndex=comparisonAttempt?state.preAttempts.findIndex(a=>a.id===comparisonAttempt.id)+1:0;
  const baselineNote=hasPost&&!hasComparison?'<p class="source-note">Posttest terakhir tidak memiliki pretest baseline yang tersimpan sebelum tes. Nilai dicatat terpisah dan tidak digunakan untuk menghitung perubahan belajar.</p>':hasComparison&&latestPreAttempt?.id!==comparisonAttempt.id?`<p class="source-note">Posttest terakhir berpasangan dengan pretest percobaan ${baselineIndex}. Pretest yang lebih baru tetap disimpan sebagai percobaan terpisah.</p>`:'';
  return `<div class="container page-wrap">${pageHeading('Catatan perjalanan','Lihat tumbuhnya nilaimu','Nilai ditampilkan sebagai jumlah soal benar. Percobaan tes tersimpan terpisah.')}${bujiCard(hasPost?(hasComparison?'Setiap langkah belajarmu berharga. Bandingkan jumlah jawaban benar dari tes yang berpasangan.':'Kedua nilai tersimpan sebagai percobaan terpisah. Kita tidak membandingkannya karena pretest baseline tidak mendahului posttest.'):'Laporan akhir akan muncul setelah kamu menuntaskan tiga level dan mengikuti posttest.') }<div class="report-summary"><div class="metric"><strong>${preCorrect}/10</strong><span>Pretest terbaru · benar</span></div><div class="metric"><strong>${hasPost?postCorrect+'/10':'—'}</strong><span>${hasPost?'Posttest terbaru · benar':'Posttest belum dikerjakan'}</span></div><div class="metric"><strong>${totalProgress()}%</strong><span>Materi dipelajari</span></div></div><div class="panel"><div class="page-toolbar"><div><h2 style="font:800 25px var(--display);margin:0">Per kategori</h2><span class="small muted">Benar dari dua soal. Percobaan pretest: ${state.preAttempts.length}; posttest: ${state.postAttempts.length}.</span></div><div class="spacer"></div><span class="tag">${hasPost?(hasComparison?`${baselineLabel} → Posttest`:'Nilai tes terpisah'):'Pretest terbaru'}</span></div><div style="overflow:auto"><table class="score-table"><thead><tr><th>Kategori</th><th>${baselineLabel}</th>${hasPost?`<th>Posttest</th>${hasComparison?'<th>Perubahan</th>':''}`:''}<th>Gambaran</th></tr></thead><tbody>${topics.map(t=>{const a=comparisonScores[t.id].correct,b=hasPost?state.postScores[t.id].correct:null,d=hasComparison?b-a:null;return `<tr><td>${t.icon} ${t.name}</td><td><strong>${a}/2</strong></td>${hasPost?`<td><strong>${b}/2</strong></td>${hasComparison?`<td class="score-delta ${d>0?'delta-up':d<0?'delta-down':'delta-same'}">${d>0?'+':''}${d} soal</td>`:''}`:''}<td><div class="bar-compare"><div title="Pretest"><span style="width:${a*50}%"></span></div>${hasComparison?`<div title="Posttest"><span style="width:${b*50}%"></span></div>`:''}</div></td></tr>`}).join('')}</tbody></table></div><p class="source-note">Grafik menunjukkan banyaknya soal benar dari dua soal per kategori.</p>${baselineNote}</div><div class="page-toolbar" style="margin-top:18px"><button class="ghost-button" data-page="learn">Kembali ke materi</button><div class="spacer"></div><button class="ghost-button" data-action="start-pretest">${draftFor('pre')?'Lanjutkan draf pretest':'Ulangi pretest'}</button>${allLevelsDone()?`<button class="primary-button" data-action="start-posttest">${draftFor('post')?'Lanjutkan draf posttest':state.postScores?'Ulangi posttest':'Mulai posttest'} →</button>`:''}</div></div>`;
}

function initialStudyBoard(){return Array(16).fill(0).map((_,i)=>i===7||i===15?0:7)}
function buildStudyQuestion(pitIndex,topicId,count){
  let prompt='',options=[],answer=0,hint='';
  if(topicId==='addition'){
    const add=3,total=count+add;prompt=`Lubang pilihan berisi ${count} biji. Buji menambah ${add} biji. Berapa jumlahnya?`;options=[String(total-1),String(total),String(total+1)];answer=1;hint='Mulai dari jumlah biji di lubang, lalu hitung maju tiga langkah.';
  }else if(topicId==='subtraction'){
    const take=Math.min(3,count),remain=count-take;prompt=`Lubang pilihan berisi ${count} biji. Pindahkan ${take} biji. Berapa biji yang tersisa?`;options=[String(remain-1),String(remain),String(remain+1)];answer=1;hint='Bayangkan biji yang dipindahkan, lalu hitung yang masih tinggal.';
  }else if(topicId==='multiplication'){
    const groups=2,total=count*groups;prompt=`Bayangkan ${groups} lubang memiliki isi sama seperti lubang pilihan. Setiap lubang berisi ${count} biji. Berapa semuanya?`;options=[String(total-2),String(total),String(total+2)];answer=1;hint='Jumlahkan isi lubang yang sama sebanyak dua kelompok.';
  }else if(topicId==='division'){
    const groups=2,total=count*groups;prompt=`Ada ${total} biji dari dua lubang yang isinya sama. Jika dibagikan rata ke ${groups} lubang, berapa biji tiap lubang?`;options=[String(count-1),String(count),String(count+1)];answer=1;hint='Bagikan biji bergiliran ke dua lubang sampai habis.';
  }else{
    const groups=2,total=count*groups;prompt=`Dua lubang berisi ${count} biji tiap lubang. Jika semua ${total} biji dibagi menjadi dua bagian sama besar, satu bagian ditulis sebagai pecahan apa?`;options=['1/4','1/2','3/4'];answer=1;hint='Cari tahu satu bagian dari dua bagian sama besar.';
  }
  return {pitIndex,topicId,count,prompt,options,answer,hint,selectedAnswer:null};
}
function selectStudyPit(index){
  const board=initialStudyBoard();if(!Number.isInteger(index)||index<0||index>=14||board[index]===0)return;
  studyQuestion=buildStudyQuestion(index,studyTopic,board[index]);focusRestoreKey=`study-pit-${index}`;playEffect('pick');render();
}
function renderStudyQuestion(){
  if(!studyQuestion)return `<section class="study-question study-question-empty" aria-live="polite"><h2>Latihan muncul di sini</h2><p>Pilih jenis soal, lalu ketuk lubang kecil yang berisi angka 7.</p></section>`;
  const q=studyQuestion,topic=topics.find(item=>item.id===q.topicId),correct=q.selectedAnswer===q.answer,answered=q.selectedAnswer!==null;
  const feedback=answered?`<p class="study-feedback ${correct?'is-correct':'is-retry'}" role="status">${correct?'Hebat, jawabanmu tepat! Kamu berhasil memakai isi lubang untuk menghitung.':'Belum tepat—tidak apa-apa. '+esc(q.hint)+' Coba sekali lagi, ya.'}</p>`:'';
  const next=answered?`<button class="ghost-button study-next" data-action="${correct?'study-reset':'study-retry'}">${correct?'Pilih lubang lain':'Coba lagi'}</button>`:'';
  return `<section class="study-question" aria-labelledby="study-question-title"><span class="eyebrow">Latihan dari Lubang ${q.pitIndex<7?q.pitIndex+1:15-q.pitIndex} · ${esc(topic.name)}</span><h2 id="study-question-title">${esc(q.prompt)}</h2><p class="small muted">Jumlah biji di lubang yang dipilih: ${q.count}. Jawaban salah boleh dicoba lagi.</p><div class="study-question-options" role="radiogroup" aria-label="Pilihan jawaban untuk soal ${esc(topic.name)}">${q.options.map((option,i)=>`<button class="study-answer-button ${q.selectedAnswer===i?'selected':''}" role="radio" aria-checked="${q.selectedAnswer===i}" tabindex="${q.selectedAnswer===i||q.selectedAnswer===null&&i===0?0:-1}" data-focus-key="study-answer-${i}" data-study-answer="${i}">${esc(option)}</button>`).join('')}</div>${feedback}${next}</section>`;
}
function selectPlayMode(mode){
  if(!['traditional','learning'].includes(mode)||playMode===mode)return;
  playMode=mode;studyQuestion=null;focusRestoreKey=`play-mode-${mode}`;render();
}
function renderPlay(){
  if(!state.game){state.game=initialGame();save()}
  const learning=playMode==='learning',g=state.game,p=learning?initialStudyBoard():g.pits,top=[14,13,12,11,10,9,8],bottom=[0,1,2,3,4,5,6];
  const turnLabel=g.turn===0?`Giliran ${playerLabel(0)}`:g.mode==='ai'?'Giliran Buji':'Giliran temanmu';
  const pit=(i,own)=>{
    const count=p[i],canUse=learning?count>0:!g.over&&!g.animating&&!g.aiThinking&&g.turn===own&&count>0;
    const focus=learning?`study-pit-${i}`:`pit-${i}`;
    const aria=learning?`Lubang ${own===0?i+1:15-i}, berisi ${count} biji. Pilih untuk membuka latihan soal.`:`Lubang ${own===0?i+1:15-i} ${esc(playerLabel(own))}, berisi ${count} biji`;
    const data=learning?`data-study-pit="${i}"`:`data-pit="${i}"`;
    return `<button class="pit ${canUse?'playable':''} ${!learning&&g.last===i?'last-drop':''}" ${data} data-focus-key="${focus}" ${canUse?'':'disabled'} aria-label="${aria}"><span class="seeds" aria-hidden="true">${seedDots(count)}</span><span class="seed-count">${count}</span></button>`;
  };
  const modes=`<section class="play-mode-picker" aria-labelledby="play-mode-heading"><div class="game-setup-heading"><h2 id="play-mode-heading">Pilih cara bermain</h2></div><div class="game-mode-picker" role="group" aria-label="Pilih cara bermain"><button class="mode-choice ${learning?'':'active'}" data-play-mode="traditional" data-focus-key="play-mode-traditional" aria-pressed="${!learning}"><span aria-hidden="true">🌰</span><b>Tradisional</b><small>Tabur biji dan bermain sesuai giliran</small></button><button class="mode-choice ${learning?'active':''}" data-play-mode="learning" data-focus-key="play-mode-learning" aria-pressed="${learning}"><span aria-hidden="true">📘</span><b>Belajar</b><small>Ketuk lubang untuk membuka latihan interaktif</small></button></div></section>`;
  const traditionalSetup=learning?'':`<section class="game-setup" aria-labelledby="game-mode-heading"><div class="game-setup-heading"><h2 id="game-mode-heading">Pilih lawan main</h2>${effectsButton(true)}</div><div class="game-mode-picker" role="group" aria-label="Pilih lawan"><button class="mode-choice ${g.mode==='two'?'active':''}" data-game-mode="two" aria-pressed="${g.mode==='two'}" ${g.animating||g.aiThinking?'disabled':''}><span aria-hidden="true">👫</span><b>2 pemain</b><small>Main bersama teman</small></button><button class="mode-choice ${g.mode==='ai'?'active':''}" data-game-mode="ai" aria-pressed="${g.mode==='ai'}" ${g.animating||g.aiThinking?'disabled':''}><span aria-hidden="true">🤖</span><b>Buji</b><small>Tantang lawan pintar</small></button></div></section>`;
  const studyPicker=learning?`<section class="study-topic-picker" aria-labelledby="study-topic-heading"><h2 id="study-topic-heading">Pilih jenis soal</h2><div class="study-topic-options" role="group" aria-label="Jenis latihan">${topics.map(topic=>`<button class="study-topic-button ${studyTopic===topic.id?'selected':''}" data-study-topic="${topic.id}" data-focus-key="study-topic-${topic.id}" aria-pressed="${studyTopic===topic.id}">${topic.icon} ${topic.name}</button>`).join('')}</div></section>`:'';
  const turn=learning?'Pilih lubang yang berisi 7 biji untuk melihat soal.':g.over?g.message:g.animating?'Biji sedang ditabur satu per satu…':g.aiThinking?'Buji sedang memilih lubang…':turnLabel;
  const topName=learning?'Baris atas':playerLabel(1),bottomName=learning?'Baris bawah':playerLabel(0),storeTop=learning?0:p[15],storeBottom=learning?0:p[7];
  const actions=learning?`<div class="game-actions"><button class="ghost-button" data-action="study-reset">Bersihkan latihan</button></div>`:`<div class="game-actions"><button class="secondary-button" data-action="new-game" ${g.animating||g.aiThinking?'disabled':''}>↻ Mulai ulang</button><button class="ghost-button" data-action="undo-move" ${!g.undoStack?.length||g.animating||g.aiThinking?'disabled':''}>↶ Urungkan langkah</button><button class="ghost-button" data-action="show-hint" aria-expanded="false">💡 Petunjuk</button><button class="ghost-button" data-action="show-rules">Cara bermain</button></div><p id="game-hint" class="game-hint" hidden>Mulai dari lubang yang berisi biji di barismu. Sebarkan biji satu per satu; panduan lengkap bisa dibuka kapan saja.</p><details class="panel game-rules" id="game-rules"><summary>🌰 Panduan aturan congklak</summary><p class="small muted">Permainan ini memakai aturan ringkas. Ada variasi aturan congklak di berbagai daerah.</p><div class="rules-grid"><div class="rule-step"><b>01 · Ambil</b><p>Pilih lubang di barismu yang masih berisi biji.</p></div><div class="rule-step"><b>02 · Sebar</b><p>Bijinya ditabur satu per satu searah putaran. Lumbung lawan dilewati. Jika biji terakhir jatuh di lubang berisi biji, ambil isinya dan lanjutkan.</p></div><div class="rule-step"><b>03 · Kumpulkan</b><p>Biji terakhir di lumbung sendiri memberi giliran lagi. Jika jatuh di lubang kosongmu, ambil isi lubang seberang. Permainan selesai saat satu sisi kosong.</p></div></div><p class="small muted" style="margin-bottom:0">Pada akhir permainan, biji tersisa masuk ke lumbung pemilik baris.</p></details>`;
  return `<div class="container page-wrap play-page">${pageHeading(learning?'Mode belajar':'Mode tradisional','Ayo main congklak!',learning?'Pilih jenis soal, lalu ketuk lubang yang berisi angka untuk berlatih bersama Buji.':'Bergiliran, hitung bijinya, dan kumpulkan sebanyak-banyaknya di lumbungmu.')}${bujiCard(learning?'Pilih penjumlahan, pengurangan, perkalian, pembagian, atau pecahan. Ketuk lubang bernomor untuk membuka latihan. Jawabanmu tidak mengubah permainan atau nilai tes.':g.mode==='ai'?'Ayo tantang aku! Aku akan memilih lubang dan menabur biji satu per satu. Kamu mulai dulu, ya!':'Kita bisa bermain berdua di satu perangkat. Pemain yang duduk di bawah mulai dulu, ya!')}${modes}${traditionalSetup}${studyPicker}<div class="turn-banner ${!learning&&(g.animating||g.aiThinking)?'is-busy':''}" role="status" tabindex="-1"><span aria-hidden="true"></span><strong>${esc(turn)}</strong></div><div class="board-shell" aria-label="Papan congklak; ${learning?'latihan tanpa mengubah permainan':'jumlah seluruh biji tetap 98'}"><div class="board-labels"><span>Lumbung ${esc(topName)}</span><span>${learning?'Pilih salah satu lubang':'Lubang congklak'}</span><span>Lumbung ${esc(bottomName)}</span></div><div class="board-play-area"><div class="store-pit" data-store="15" aria-label="Lumbung ${esc(topName)}, berisi ${storeTop} biji"><span class="store-count">${storeTop}</span><small>${esc(topName.toUpperCase())}</small></div><div class="pits"><div class="pit-row" aria-label="Lubang ${esc(topName)}">${top.map(i=>pit(i,1)).join('')}</div><div class="pit-row" aria-label="Lubang ${esc(bottomName)}">${bottom.map(i=>pit(i,0)).join('')}</div></div><div class="store-pit" data-store="7" aria-label="Lumbung ${esc(bottomName)}, berisi ${storeBottom} biji"><span class="store-count">${storeBottom}</span><small>${esc(bottomName.toUpperCase())}</small></div></div></div><div class="game-feedback"><span class="game-message-label">${learning?'Petunjuk belajar':'Catatan giliran'}</span><p class="game-message" aria-live="polite">${learning?'Pilih salah satu dari 14 lubang kecil. Biji tetap di tempat saat kamu belajar.':esc(g.message)}</p></div>${learning?renderStudyQuestion():''}${actions}</div>`;
}
function initialGame(mode='two'){return {pits:Array(16).fill(0).map((_,i)=>i===7||i===15?0:7),turn:0,over:false,mode,animating:false,aiThinking:false,undoStack:[],message:'Pilih lubang yang berisi biji untuk memulai.'}}
function playerLabel(side){if(side===0)return state.name||'Kamu';return state.game?.mode==='ai'?'Buji':'Temanmu'}
function gameNode(index){return index===7||index===15?document.querySelector(`[data-store="${index}"]`):document.querySelector(`[data-pit="${index}"]`)}
function syncPit(index){
  const g=state.game,p=g.pits[index],node=gameNode(index);if(!node)return;
  if(index===7||index===15){const count=$('.store-count',node);if(count)count.textContent=String(p);node.setAttribute('aria-label',`Lumbung ${playerLabel(index===7?0:1)}, berisi ${p} biji`);return}
  const count=$('.seed-count',node),seeds=$('.seeds',node);if(count)count.textContent=String(p);if(seeds)seeds.innerHTML=seedDots(p);node.setAttribute('aria-label',`Lubang ${index<7?index+1:15-index} ${esc(playerLabel(index<7?0:1))}, berisi ${p} biji`);
}
function cancelInFlightMove(){
  if(!state.game?.animating)return;
  moveGeneration++;$$('.seed-flight').forEach(x=>x.remove());
  if(activeMoveSnapshot)state.game={...activeMoveSnapshot,pits:activeMoveSnapshot.pits.slice(),undoStack:activeMoveSnapshot.undoStack.slice(),animating:false,aiThinking:false};
  else state.game={...state.game,animating:false,aiThinking:false};
  activeMoveSnapshot=null;state.game.message='Langkah dibatalkan saat meninggalkan papan; semua biji tetap aman.';save();
}
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function animateSeed(from,to,generation){
  const source=gameNode(from),target=gameNode(to);let flight=null;
  if(source&&target&&!reducedMotion()){
    const a=source.getBoundingClientRect(),b=target.getBoundingClientRect();flight=document.createElement('i');flight.className='seed-flight';flight.style.left=`${a.left+a.width/2-5}px`;flight.style.top=`${a.top+a.height/2-5}px`;document.body.append(flight);requestAnimationFrame(()=>{if(flight?.isConnected)flight.style.transform=`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.72)`});
  }
  await wait(150);
  if(generation!==moveGeneration||!state.game?.animating){flight?.remove();return false}
  flight?.remove();state.game.pits[to]++;syncPit(to);const node=gameNode(to);node?.classList.add('drop-flash');setTimeout(()=>node?.classList.remove('drop-flash'),380);playTone(590+(to%7)*32,.075);return true;
}
function endGame(g,p){
  const bottomEmpty=p.slice(0,7).every(x=>x===0),topEmpty=p.slice(8,15).every(x=>x===0);
  if(!bottomEmpty&&!topEmpty)return false;
  if(!bottomEmpty){p[7]+=p.slice(0,7).reduce((a,b)=>a+b,0);for(let i=0;i<7;i++)p[i]=0}
  if(!topEmpty){p[15]+=p.slice(8,15).reduce((a,b)=>a+b,0);for(let i=8;i<15;i++)p[i]=0}
  g.over=true;g.message=p[7]===p[15]?'Seri! Jumlah biji kalian sama.':p[7]>p[15]?`${playerLabel(0)} menang dengan ${p[7]} biji!`:`${playerLabel(1)} menang dengan ${p[15]} biji!`;
  playTone(840,.2);setTimeout(()=>playTone(1060,.2),180);popConfetti();return true;
}
async function movePit(index,automated=false){
  const g=state.game;if(!g||g.over||g.animating)return;
  const p=g.pits,player=g.turn,isOwn=i=>player===0?i>=0&&i<=6:i>=8&&i<=14;
  if(!isOwn(index)||p[index]===0||(!automated&&player===1&&g.mode==='ai'))return;
  playEffect('pick');
  const ownStore=player===0?7:15,oppStore=player===0?15:7;
  activeMoveSnapshot={...g,pits:g.pits.slice(),undoStack:(g.undoStack||[]).map(x=>({...x,pits:x.pits.slice()})),animating:false,aiThinking:false};
  const generation=++moveGeneration;
  // Persist the last complete, 98-seed board before the first animated drop.
  save();
  g.undoStack=Array.isArray(g.undoStack)?g.undoStack:[];g.undoStack.push({pits:g.pits.slice(),turn:g.turn,over:g.over,message:g.message});if(g.undoStack.length>40)g.undoStack.shift();
  g.animating=true;g.aiThinking=false;g.message=`${player===0?playerLabel(0):playerLabel(1)} mengambil biji…`;g.last=index;render();
  let seeds=p[index],pos=index,from=index,extraTurn=false,relays=0,message='';p[index]=0;syncPit(index);
  while(true){
    while(seeds>0){pos=(pos+1)%16;if(pos===oppStore)continue;const placed=await animateSeed(from,pos,generation);if(!placed)return;seeds--;from=pos}
    if(generation!==moveGeneration||state.game!==g)return;
    if(pos===ownStore){extraTurn=true;message='Biji terakhir jatuh di lumbung sendiri. Dapat giliran lagi!';break}
    if(p[pos]>1){await wait(170);if(generation!==moveGeneration||state.game!==g)return;seeds=p[pos];p[pos]=0;syncPit(pos);from=pos;relays++;continue}
    if(isOwn(pos)&&p[14-pos]>0){const captured=p[14-pos]+p[pos];p[ownStore]+=captured;p[14-pos]=0;p[pos]=0;syncPit(14-pos);syncPit(pos);syncPit(ownStore);message=`Tangkap! ${captured} biji masuk ke lumbung.`}
    else message='Biji terakhir jatuh di lubang kosong. Giliran selesai.';
    break;
  }
  g.last=pos;const finished=endGame(g,p);
  if(!finished){if(!extraTurn)g.turn=1-player;g.message=(relays?`Biji disebar lanjut ${relays} kali. `:'')+message+(extraTurn?'':` Sekarang giliran ${playerLabel(g.turn)}.`)}
  g.animating=false;activeMoveSnapshot=null;save();render();
  if(!g.over&&g.mode==='ai'&&g.turn===1)setTimeout(runAiTurn,650);
}
function undoGameMove(){
  const g=state.game;if(!g||g.animating||g.aiThinking||!g.undoStack?.length){toast('Belum ada langkah yang bisa diurungkan.');return}
  const history=g.undoStack.slice();let snapshot=history.pop();
  if(g.mode==='ai'&&snapshot?.turn===1){while(snapshot&&snapshot.turn!==0&&history.length)snapshot=history.pop()}
  if(!snapshot){toast('Langkah sebelumnya tidak ditemukan.');return}
  g.pits=snapshot.pits.slice();g.turn=snapshot.turn;g.over=false;g.animating=false;g.aiThinking=false;g.last=null;g.undoStack=history;g.message='Langkah terakhir diurungkan. Silakan coba pilihan lain.';save();render();toast('Langkah terakhir diurungkan!');
}
function simulateMove(source,index,player){
  const p=source.slice(),ownStore=player===0?7:15,oppStore=player===0?15:7,isOwn=i=>player===0?i>=0&&i<=6:i>=8&&i<=14;
  let seeds=p[index],pos=index,extra=false,capture=0,loops=0;p[index]=0;
  while(loops++<120){while(seeds>0){pos=(pos+1)%16;if(pos===oppStore)continue;p[pos]++;seeds--}if(pos===ownStore){extra=true;break}if(p[pos]>1){seeds=p[pos];p[pos]=0;continue}if(isOwn(pos)&&p[14-pos]>0){capture=p[14-pos]+p[pos];p[ownStore]+=capture;p[14-pos]=0;p[pos]=0}break}
  return {board:p,extra,capture,gain:p[ownStore]-source[ownStore],last:pos};
}
function chooseAiMove(){
  const legal=[8,9,10,11,12,13,14].filter(i=>state.game.pits[i]>0);if(!legal.length)return -1;
  return legal.map(i=>{const r=simulateMove(state.game.pits,i,1);const opponentOptions=[0,1,2,3,4,5,6].filter(j=>r.board[j]>0);const danger=opponentOptions.reduce((n,j)=>{const move=simulateMove(r.board,j,0);return n+Math.max(0,move.capture)},0);return {i,score:r.gain*3+r.capture*1.6+(r.extra?12:0)-danger*.22+Math.random()*1.8}}).sort((a,b)=>b.score-a.score)[0].i;
}
async function runAiTurn(){
  const g=state.game;if(!g||g.over||g.turn!==1||g.mode!=='ai'||g.animating||g.aiThinking||state.page!=='play')return;
  const request=++aiGeneration;g.aiThinking=true;g.message='Buji sedang memilih lubang…';save();render();await wait(550);
  if(request!==aiGeneration||state.game!==g||state.page!=='play')return;
  const choice=chooseAiMove();g.aiThinking=false;
  if(choice<0){g.over=true;g.message='Permainan selesai. Yuk, mulai lagi!';save();render();return}
  await movePit(choice,true);
}
function selectGameMode(mode){if(!['two','ai'].includes(mode))return;if(state.game?.animating||state.game?.aiThinking)return;state.game=initialGame(mode);save();render();toast(mode==='ai'?'Buji siap ditantang!':'Papan dua pemain sudah siap!')}

function renderHistory(){return `<div class="container page-wrap">${pageHeading('Cerita di balik biji','Dari mana congklak berasal?','Permainan ini punya banyak nama dan jejak lintas budaya. Inilah beberapa hal yang kita ketahui—serta bagian yang masih berupa perkiraan.')}${bujiCard('Sejarah panjang sering punya beberapa cerita. Kita bedakan fakta yang terdokumentasi dan asal-usul yang masih diperkirakan, ya!')}<div class="history-layout"><article class="panel history-card"><span class="eyebrow">Jejak perjalanan</span><div class="timeline"><div class="timeline-item"><h3>Permainan dari keluarga mancala</h3><p>Congklak termasuk keluarga permainan mancala, yakni permainan papan atau lubang tempat biji dipindahkan dan dihitung. Bentuk serupa dijumpai di berbagai kawasan dunia.</p></div><div class="timeline-item"><h3>Asal-usulnya diperkirakan</h3><p>Sejumlah sumber mengaitkan keluarga mancala dengan Timur Tengah. Namun, asal tepat dan waktu masuknya congklak ke Indonesia tidak dapat dipastikan hanya dengan satu cerita.</p></div><div class="timeline-item"><h3>Menyebar lewat pertemuan budaya</h3><p>Permainan ini diyakini menyebar ke Asia Tenggara melalui jalur perdagangan dan persinggahan. Masyarakat setempat kemudian membuat bentuk, nama, dan kebiasaan bermainnya sendiri.</p></div><div class="timeline-item"><h3>Nama dan papan yang beragam</h3><p>Di sejumlah daerah permainan ini dikenal sebagai congklak atau dakon. Papan yang umum punya dua baris lubang kecil dan dua lumbung besar.</p></div></div></article><aside class="lesson-aside"><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">Apa yang dilatih?</h3><ul class="fact-list"><li>Berhitung dan memperkirakan jumlah</li><li>Strategi serta mengambil keputusan</li><li>Kesabaran dan bergiliran</li><li>Belajar menghargai aturan bersama</li></ul></div><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">Tahukah kamu?</h3><p class="small muted">Congklak punya variasi aturan. Tanya keluarga atau teman tentang versi yang dimainkan di daerahmu!</p></div><div class="panel"><h3 style="font:800 21px var(--display);margin:0 0 8px">Sumber bacaan</h3><p class="small"><a href="https://disdikpora.bulelengkab.go.id/informasi/detail/artikel/62_mengenal-kembali-permainan-tradisional-nusantara-asal-usul-dan-nilainya" target="_blank" rel="noopener noreferrer">Dinas Pendidikan, Pemuda dan Olahraga Kabupaten Buleleng — Congklak</a></p><p class="small"><a href="https://www.nlb.gov.sg/main/article-detail?cmsuuid=7bedd52d-ff96-472d-b423-4dc6790e98c8" target="_blank" rel="noopener noreferrer">Singapore National Library Board — Congkak</a></p><p class="source-note">Asal-usul ditulis sebagai perkiraan karena sejarah permainan berkembang lintas wilayah.</p></div></aside></div><div class="band" style="margin-top:22px"><div class="band-emoji">🪵</div><div><h2>Mau coba main?</h2><p>Gunakan papan virtual untuk latihan berhitung dan strategi bersama teman atau komputer.</p></div><button class="primary-button" data-page="play">Main sekarang →</button></div></div>`}
function renderTeam(){
  const members=[
    {name:'Dimas Yuli Rakasiwi',nim:'26011140011',image:'team-dimas-optimized.webp'},
    {name:'Alfi Syahrin',nim:'26011140019',image:'team-alfi-optimized.webp'},
    {name:'Muhammad Faisal',nim:'26011140007',image:'team-faisal-optimized.webp'},
    {name:'Putri Ayu Diah Lestari',nim:'26011140015',image:'team-putri-optimized.webp'}
  ];
  return `<section class="container page-wrap team-page"><header class="team-heading"><h1 class="team-title">Tim Pengembang</h1><p class="team-class">RPL 26 S2 Teknologi Pembelajaran UNY</p></header><div class="team-grid team-roster">${members.map(member=>`<article class="team-card team-member"><div class="team-avatar-wrap"><img class="team-avatar" src="./${member.image}" alt="Ilustrasi karakter ${member.name}" width="480" height="480" loading="lazy" decoding="async"></div><h2 class="team-member-name">${member.name}</h2><p class="team-member-id">NIM ${member.nim}</p></article>`).join('')}</div></section>`;
}
function renderProfile(){
  const first=!state.profileSaved;
  return `<div class="container page-wrap">${pageHeading('Profil pemain',first?'Boleh kenalan dengan Buji?':'Atur profilmu',first?'Nama panggilan ini boleh diisi atau dilewati. Kamu tetap bisa langsung belajar.':'Ubah nama panggilanmu kapan saja.')}${bujiCard('Profil dan progres hanya tersimpan di browser pada perangkat ini. Tidak ada akun atau sinkronisasi ke server.') }<div class="profile-layout"><div class="panel profile-card"><div class="profile-avatar">${first?'🙂':'🌟'}</div><h2>${state.name?esc(state.name):'Petualang baru'}</h2><p class="muted">${first?'Siap bertemu Buji?':'Petualanganmu sudah berjalan!'}</p><span class="tag">🌱 Progres belajar ${totalProgress()}%</span><div class="divider"></div>${first?'<span class="small muted">Profil boleh dilewati. Tidak perlu email atau kata sandi.</span>':'<button class="primary-button" data-action="start">Lanjutkan belajar →</button>'}</div><div class="panel"><h2 style="font:800 25px var(--display);margin:0 0 4px">${first?'Atur nama panggilan':'Detail profil'}</h2><p class="small muted">Nama panggilan saja—opsional. Tidak perlu email atau kata sandi.</p><form id="profile-form" class="profile-form"><label class="form-field">Nama panggilan<input name="name" value="${esc(state.name)}" maxlength="24" placeholder="Contoh: Dira" autocomplete="nickname"></label><button class="primary-button" type="submit">${first?'Simpan nama':'Simpan profil'}</button>${first?'<button class="ghost-button" type="button" data-action="skip-profile">Lanjut tanpa nama</button>':''}</form><p class="source-note">Profil, nilai, dan progres disimpan hanya di browser ini. Orang lain yang memakai browser/perangkat yang sama dapat melihatnya.</p><div class="profile-data-actions"><button class="ghost-button" data-action="export-data">Unduh salinan data</button><button class="ghost-button danger-button" data-action="reset-data">Reset profil &amp; progres</button></div></div></div></div>`;
}
function exportData(){
  try{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='congklatika-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Salinan data berhasil diunduh.')}
  catch(e){toast('Unduhan belum tersedia di browser ini.')}
}
function resetData(){
  if(typeof window.confirm==='function'&&!window.confirm('Hapus nama, nilai, progres, dan permainan yang tersimpan di browser ini?'))return;
  stopNarration();state={...defaultState,levelProgress:emptyLevelProgress()};quiz={kind:null,index:0,answers:[],questions:[]};practiceAnswered={};
  try{localStorage.removeItem(KEY)}catch(e){storageWarning()}
  history.replaceState?.({congklatika:true,page:'home'},'','#home');const persisted=save();render();toast(persisted?'Profil dan progres lokal sudah direset.':'Reset berlaku untuk sesi ini, tetapi data mungkin masih tersimpan karena browser menolak perubahan.');
}
function render(){
  const app=$('#app'),previousFocus=document.activeElement,hadAppFocus=app.contains(previousFocus),keep=focusRestoreKey||previousFocus?.dataset?.focusKey;focusRestoreKey=null;let content='';
  switch(state.page){case'home':content=renderHome();break;case'learn':content=renderLearn();break;case'quiz':content=renderQuiz();break;case'quiz-result':content=renderQuizResult();break;case'play':content=renderPlay();break;case'history':content=renderHistory();break;case'report':content=renderReport();break;case'team':content=renderTeam();break;case'profile':content=renderProfile();break;default:state.page='home';content=renderHome()}
  app.innerHTML=content;updateHeader();$('#year').textContent=new Date().getFullYear();
  if(keep){
    const target=$$('[data-focus-key]',app).find(node=>node.dataset.focusKey===keep);
    if(target&&!target.disabled)target.focus({preventScroll:true});
    else{
      const stepper=keep.match(/^visual-(addition|subtraction|multiplication|division|fraction)-([a-z]+)-(minus|plus)$/);
      if(stepper){const alternate=$$('[data-visual-topic][data-visual-key]',app).find(node=>node.dataset.visualTopic===stepper[1]&&node.dataset.visualKey===stepper[2]&&!node.disabled);alternate?.focus({preventScroll:true})}
      else if(keep.startsWith('pit-'))$('.turn-banner',app)?.focus({preventScroll:true});
    }
  }
  else if(hadAppFocus){const heading=$$('h1,h2',app)[0]||app;if(!heading.hasAttribute('tabindex'))heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true})}
}
function openLogin(){setPage('profile')}
function closeModal(){$('#modal-root').innerHTML=''}
async function availableNarrationVoices(){
  const synth=window.speechSynthesis,available=synth.getVoices();if(available.length)return available;
  return new Promise(resolve=>{let finished=false,timer;const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);synth.removeEventListener?.('voiceschanged',finish);resolve(synth.getVoices())};synth.addEventListener?.('voiceschanged',finish);timer=setTimeout(finish,900)});
}
function chooseNarrationVoice(voices){const idVoice=voices.filter(v=>(v.lang||'').toLowerCase().replace('_','-').startsWith('id'));return idVoice[0]||null}
function setMusicDuck(duck){
  if(!musicMaster||!music.ctx)return;
  try{musicMaster.gain.setTargetAtTime(duck?.18:.78,music.ctx.currentTime,.12)}catch(e){}
}
function stopNarration(){
  narrationRequest++;narrationActive=false;
  try{if('speechSynthesis'in window)window.speechSynthesis.cancel()}catch(e){}
  setMusicDuck(false);
}
function updateNarrationButton(){
  $$('[data-action="read-current"]').forEach(button=>{button.setAttribute('aria-pressed',String(narrationActive));button.textContent=narrationActive?'⏹ Hentikan bacaan':state.page==='quiz'?'🔊 Dengarkan soal':'🔊 Dengarkan Buji'});
}
function currentNarrationText(){
  if(state.page==='quiz'){
    const q=quizQuestionsFor(quiz.kind)[quiz.index];return `Soal ${quiz.index+1}. ${q.q} Pilihannya: ${q.options.map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`).join('. ')}.`;
  }
  const t=currentTopic(),prompt=levelChallenges[t.id][state.activeLevel-1],visual=visualModel[t.id];
  let visualText='';if(t.id==='division')visualText=` Saat ini ${visual.total} biji dibagikan ke ${visual.groups} lubang. Setiap lubang mendapat ${visual.total/visual.groups} biji.`;if(t.id==='multiplication')visualText=` Saat ini ada ${visual.groups} kelompok, masing-masing ${visual.seeds} biji, semuanya ${visual.groups*visual.seeds}.`;if(t.id==='fraction')visualText=` Gambar menunjukkan ${visual.selected} dari ${visual.parts} bagian.`;
  const example=document.querySelector('.worked-example')?.innerText||t.example;
  return `Materi ${t.name}, level ${state.activeLevel}. ${t.lesson} Contoh. ${example}.${visualText} Tantangan aktif: ${prompt[0]}. Pilihan: ${prompt[1].join(', ')}.`;
}
async function readCurrentContent(){
  if(narrationActive){stopNarration();updateNarrationButton();return}
  if(!('speechSynthesis'in window)||typeof window.SpeechSynthesisUtterance!=='function'){toast('Pembaca suara tidak tersedia di browser ini.');return}
  const request=++narrationRequest;let text;
  try{text=currentNarrationText();const voices=await availableNarrationVoices();if(request!==narrationRequest)return;speechVoice=chooseNarrationVoice(voices);const utterance=new SpeechSynthesisUtterance(`Halo, teman! Aku Buji. ${text}`);if(speechVoice)utterance.voice=speechVoice;utterance.lang='id-ID';utterance.rate=.92;utterance.pitch=1.15;utterance.volume=1;
    narrationActive=true;setMusicDuck(true);updateNarrationButton();utterance.onend=()=>{if(request===narrationRequest){narrationActive=false;setMusicDuck(false);updateNarrationButton()}};utterance.onerror=()=>{if(request===narrationRequest){narrationActive=false;setMusicDuck(false);updateNarrationButton();toast('Pembacaan suara gagal. Kamu tetap bisa membaca materi di layar.')}};window.speechSynthesis.speak(utterance);toast('Buji mulai membacakan bagian yang sedang terbuka.');
  }catch(e){narrationActive=false;setMusicDuck(false);updateNarrationButton();toast('Pembacaan suara gagal. Kamu tetap bisa membaca materi di layar.')}
}
function startMusic(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx){toast('Musik tidak didukung di browser ini.');return}
    if(!music.ctx)music.ctx=new AudioCtx();if(!musicMaster){musicMaster=music.ctx.createGain();musicMaster.gain.value=.78;musicMaster.connect(music.ctx.destination)}music.ctx.resume();music.on=true;music.step=0;
    const notes=[523.25,659.25,783.99,659.25,587.33,698.46,880,783.99];
    music.timer=setInterval(()=>{if(!music.on)return;const now=music.ctx.currentTime,osc=music.ctx.createOscillator(),gain=music.ctx.createGain();osc.type='triangle';osc.frequency.value=notes[music.step++%notes.length];gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.078,now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+.34);osc.connect(gain);gain.connect(musicMaster);osc.start(now);osc.stop(now+.36)},370);
    $('#music-toggle').setAttribute('aria-pressed','true');$('#music-toggle').title='Matikan musik';toast('Musik petualangan siap menemani! ♫');
  }catch(e){toast('Musik belum dapat diputar. Coba lagi.')}
}
function stopMusic(){music.on=false;clearInterval(music.timer);$('#music-toggle').setAttribute('aria-pressed','false');$('#music-toggle').title='Nyalakan musik';if(music.ctx)music.ctx.suspend();toast('Musik dijeda')}
function playTone(freq=550,duration=.08,delay=0,volume=.025){
  if(!effects.on||!effects.ctx)return;
  try{
    const c=effects.ctx,now=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();
    c.resume().catch(()=>{});o.type='sine';o.frequency.setValueAtTime(freq,now);
    g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume,now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+duration);
    o.connect(g);g.connect(c.destination);effects.voices.add(o);
    o.onended=()=>{effects.voices.delete(o);o.disconnect();g.disconnect()};o.start(now);o.stop(now+duration+.01);
  }catch(e){}
}
function playEffect(kind){
  switch(kind){
    case'correct':playTone(660,.12,0,.035);playTone(880,.17,.1,.03);break;
    case'retry':playTone(330,.12,0,.025);playTone(294,.14,.09,.02);break;
    case'answer':playTone(620,.09,0,.025);break;
    case'pick':playTone(440,.07,0,.025);break;
    default:playTone(740,.045,0,.018);break;
  }
}
function handleAction(action,el){
  switch(action){
    case'start':beginJourney();break;
    case'start-pretest':startPretest();break;
    case'start-posttest':startPosttest();break;
    case'nav-quiz':openQuizFromBottomNav();break;
    case'complete-topic':{const id=el.dataset.topicId;if(practiceAnswered[id]!==levelChallenges[id][state.activeLevel-1][2]){toast('Jawab tantangan mini dengan benar dulu, ya!');return}if(!topicDone(state.activeLevel,id))state.levelProgress[state.activeLevel].push(id);save();if(levelDone(state.activeLevel)){popConfetti();toast(state.activeLevel<3?`Hebat! Level ${state.activeLevel+1} terbuka!`:'Semua level selesai! Kamu hebat sekali!')}else toast('Materi selesai! Satu langkah hebat.');render();break}
    case'back-topics':state.activeTopic=null;save();render();window.scrollTo({top:0,behavior:motionBehavior()});break;
    case'quiz-next':if(quiz.answers[quiz.index]===null){toast('Pilih satu jawaban dulu, ya!');return}quiz.index++;saveQuizDraft();render();break;
    case'quiz-prev':quiz.index=Math.max(0,quiz.index-1);saveQuizDraft();render();break;
    case'quiz-submit':finishQuiz();break;
    case'result-continue':if(state.resultKind==='pre')setPage('learn');else setPage('report');break;
    case'new-game':state.game=initialGame(state.game?.mode||'two');save();render();toast('Papan baru siap dimainkan!');break;
    case'show-rules':{const rules=$('#game-rules');if(rules){rules.open=true;rules.scrollIntoView({behavior:motionBehavior(),block:'center'})}break}
    case'show-hint':{const hint=$('#game-hint'),button=$('[data-action="show-hint"]');if(hint&&button){hint.hidden=!hint.hidden;button.setAttribute('aria-expanded',String(!hint.hidden))}break}
    case'undo-move':undoGameMove();break;
    case'study-retry':if(studyQuestion){studyQuestion.selectedAnswer=null;focusRestoreKey='study-answer-0';render()}break;
    case'study-reset':studyQuestion=null;focusRestoreKey=`study-topic-${studyTopic}`;render();break;
    case'read-current':readCurrentContent();break;
    case'export-data':exportData();break;
    case'reset-data':resetData();break;
    case'skip-profile':state.name='';state.profileSaved=false;save();setPage('home');toast('Nama dilewati. Kamu tetap bisa belajar!');break;
    case'login':openLogin();break;
    case'close-modal':closeModal();break;
    default:break;
  }
}
document.addEventListener('click',e=>{
  if(e.target.classList.contains('modal-backdrop')){closeModal();return}
  const sfx=e.target.closest('[data-sfx-toggle]');if(sfx){toggleEffects();return}
  const control=e.target.closest('button,a,summary');if(control&&!control.disabled){primeEffects();if(!control.matches('[data-pit],[data-quiz-answer],[data-practice],#music-toggle'))playEffect('click')}
  const page=e.target.closest('[data-page]');if(page){e.preventDefault();setPage(page.dataset.page);return}
  const act=e.target.closest('[data-action]');if(act){handleAction(act.dataset.action,act);return}
  const mode=e.target.closest('[data-game-mode]');if(mode){selectGameMode(mode.dataset.gameMode);return}
  const playModeButton=e.target.closest('[data-play-mode]');if(playModeButton){selectPlayMode(playModeButton.dataset.playMode);return}
  const studyTopicButton=e.target.closest('[data-study-topic]');if(studyTopicButton){studyTopic=studyTopicButton.dataset.studyTopic;studyQuestion=null;focusRestoreKey=studyTopicButton.dataset.focusKey;render();return}
  const studyAnswer=e.target.closest('[data-study-answer]');if(studyAnswer&&studyQuestion){focusRestoreKey=studyAnswer.dataset.focusKey;studyQuestion.selectedAnswer=Number(studyAnswer.dataset.studyAnswer);playEffect(studyQuestion.selectedAnswer===studyQuestion.answer?'correct':'retry');render();return}
  const studyPit=e.target.closest('[data-study-pit]');if(studyPit){selectStudyPit(Number(studyPit.dataset.studyPit));return}
  const level=e.target.closest('[data-level]');if(level){const n=Number(level.dataset.level);if(!levelUnlocked(n)){toast(`Selesaikan Level ${n-1} dulu untuk membuka level ini.`);return}practiceAnswered={};state.activeLevel=n;state.activeTopic=null;save();render();toast(`Level ${n} dipilih. Semangat!`);return}
  const topic=e.target.closest('[data-topic]');if(topic){state.activeTopic=topic.dataset.topic;state.page='learn';save();render();window.scrollTo({top:0,behavior:motionBehavior()});return}
  const opt=e.target.closest('[data-quiz-answer]');if(opt){focusRestoreKey=opt.dataset.focusKey;quiz.answers[quiz.index]=Number(opt.dataset.quizAnswer);saveQuizDraft();playEffect('answer');render();return}
  const practice=e.target.closest('[data-practice]');if(practice){focusRestoreKey=practice.dataset.focusKey;const id=practice.dataset.practice;practiceAnswered[id]=Number(practice.dataset.answer);const key=levelChallenges[id][state.activeLevel-1][2];if(practiceAnswered[id]===key){playEffect('correct');popConfetti()}else playEffect('retry');render();return}
  const visual=e.target.closest('[data-visual-topic]');if(visual){focusRestoreKey=visual.dataset.focusKey;adjustVisual(visual.dataset.visualTopic,visual.dataset.visualKey,Number(visual.dataset.step));return}
  const pit=e.target.closest('[data-pit]');if(pit){focusRestoreKey=pit.dataset.focusKey;movePit(Number(pit.dataset.pit));return}
});
document.addEventListener('submit',e=>{
  if(e.target.id==='profile-form'){
    e.preventDefault();const data=new FormData(e.target),name=String(data.get('name')||'').trim().slice(0,24);
    state.name=name;state.profileSaved=Boolean(name);save();setPage('home');toast(name?`Hai, ${state.name}! Profilmu tersimpan.`:'Nama dilewati. Kamu tetap bisa belajar!');
  }
});
window.addEventListener('popstate',e=>{
  const target=validPage(e.state?.page)?e.state.page:(location.hash||'#home').slice(1);
  if(hasQuizDraft()&&target!=='quiz'&&typeof window.confirm==='function'&&!window.confirm('Tes belum selesai. Draf jawaban tersimpan. Tinggalkan tes sekarang?')){history.pushState({congklatika:true,page:state.page},'',`#${state.page}`);return}
  commitPage(validPage(target)?target:'home',false);
});
window.addEventListener('beforeunload',e=>{if(state.page==='quiz'&&state.quizDraft){e.preventDefault();e.returnValue='Tes belum selesai. Draf jawaban tersimpan.';return e.returnValue}});

$('#music-toggle').addEventListener('click',()=>music.on?stopMusic():startMusic());
$('#menu-toggle').addEventListener('click',()=>{const nav=$('#main-nav'),expanded=$('#menu-toggle').getAttribute('aria-expanded')==='true';nav.classList.toggle('open',!expanded);$('#menu-toggle').setAttribute('aria-expanded',String(!expanded))});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeModal();
  const radio=e.target.closest?.('[data-quiz-answer],[data-practice],[data-study-answer]');
  if(radio&&['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){
    e.preventDefault();const group=radio.closest('[role="radiogroup"]'),items=$$('[role="radio"]',group),at=items.indexOf(radio);
    const next=e.key==='Home'?0:e.key==='End'?items.length-1:(at+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+items.length)%items.length;
    items[next]?.focus();items[next]?.click();return;
  }
  if(e.key==='Enter'&&state.page==='quiz'&&e.target.tagName!=='BUTTON'&&quiz.index<quizQuestionsFor(quiz.kind).length-1)handleAction('quiz-next',{});
});
if(state.quizDraft){quiz={kind:state.quizDraft.kind,index:state.quizDraft.index,answers:state.quizDraft.answers.slice(),questions:state.quizDraft.questions.slice(),baselineId:state.quizDraft.baselineId||null};state.page='quiz'}
render();
if(storageRecoveryNotice)toast('Data sebelumnya rusak atau tidak terbaca. Aplikasi dibuka dengan progres kosong; belajar tetap bisa dilanjutkan.');
if(state.page==='play'&&state.game?.mode==='ai'&&state.game.turn===1&&!state.game.over)setTimeout(runAiTurn,250);
