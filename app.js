const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const KEY = 'congklatika.v1';

const topics = [
  {id:'addition',name:'Penjumlahan',icon:'➕',tag:'Menggabungkan',desc:'Gabungkan dua kelompok benda.',lesson:'Penjumlahan membantu kita menggabungkan dua kelompok. Tanda tambahnya adalah +. Yuk, hitung semua bijinya bersama-sama!',example:'Ada 6 biji di satu lubang dan 4 biji di lubang lain. Semuanya ada 6 + 4 = 10 biji.',tip:'Mulai dari angka yang lebih besar, lalu hitung maju pelan-pelan.'},
  {id:'subtraction',name:'Pengurangan',icon:'➖',tag:'Mengambil sebagian',desc:'Cari tahu berapa yang masih ada.',lesson:'Pengurangan dipakai saat ada benda yang diambil atau berpindah. Tanda kurangnya adalah −. Hitung berapa biji yang masih tersisa, ya!',example:'Buji punya 9 biji. Lalu 4 biji dipindahkan. Sekarang tersisa 9 − 4 = 5 biji.',tip:'Kamu bisa menghitung mundur, satu angka setiap kali.'},
  {id:'multiplication',name:'Perkalian',icon:'✖️',tag:'Kelompok sama banyak',desc:'Penjumlahan berulang jadi lebih cepat.',lesson:'Perkalian adalah cara cepat untuk menghitung beberapa kelompok yang isinya sama banyak. Tanda kalinya adalah ×.',example:'Ada 3 lubang. Setiap lubang berisi 4 biji. Jadi 4 + 4 + 4 sama dengan 3 × 4 = 12 biji.',tip:'Pastikan tiap kelompok isinya sama, lalu hitung jumlah semua kelompok.'},
  {id:'division',name:'Pembagian',icon:'➗',tag:'Berbagi rata',desc:'Bagikan benda sama banyak.',lesson:'Pembagian membantu kita membagi benda dengan adil. Setiap kelompok mendapat jumlah yang sama. Tanda baginya adalah ÷.',example:'12 biji dibagikan rata ke 3 lubang. Setiap lubang mendapat 12 ÷ 3 = 4 biji.',tip:'Bagikan satu biji ke tiap kelompok bergiliran sampai bijinya habis.'},
  {id:'fraction',name:'Pecahan',icon:'½',tag:'Bagian dari satu utuh',desc:'Lihat bagian yang sama besar.',lesson:'Pecahan menunjukkan bagian dari satu benda utuh. Pada ½, angka di bawah menunjukkan berapa bagian sama besar. Angka di atas menunjukkan berapa bagian yang kita ambil.',example:'Satu kue dipotong menjadi 4 bagian sama besar. Satu potong dari kue itu ditulis ¼.',tip:'Bagian-bagiannya harus sama besar supaya adil.'}
];

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
function quizQuestionsFor(kind=quiz.kind){const bank=quizBanks[kind==='post'?'post':'pre'];return topics.flatMap(t=>bank[t.id])}

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
const defaultState={page:'home',name:'',profileSaved:false,activeLevel:1,preScores:null,postScores:null,levelProgress:emptyLevelProgress(),practice:{},game:null};
let state=loadState();
let quiz={kind:null,index:0,answers:[]};
let visualModel={multiplication:{groups:3,seeds:4},division:{groups:3,total:12},fraction:{parts:4,selected:1}};
let practiceAnswered={};
let music={on:false,ctx:null,timer:null,step:0};
let speechVoice=null;
let narrationRequest=0;

function cleanUndoStack(value){if(!Array.isArray(value))return [];return value.slice(-40).filter(item=>item&&Array.isArray(item.pits)&&item.pits.length===16&&item.pits.every(n=>Number.isInteger(n)&&n>=0)&&item.pits.reduce((a,b)=>a+b,0)===98&&[0,1].includes(item.turn)).map(item=>({pits:item.pits.slice(),turn:item.turn,over:Boolean(item.over),message:String(item.message||'')}))}
function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(KEY)||'{}');
    const next={...defaultState,...saved};
    next.name=typeof saved.name==='string'?saved.name.trim().slice(0,24):'';
    next.profileSaved=Boolean(next.name);
    if(!saved.levelProgress){
      const oldDone=Object.keys(saved.learned||{}).filter(id=>saved.learned[id]);
      next.levelProgress=emptyLevelProgress();
      next.levelProgress[1]=oldDone;
      next.activeLevel=1;
    }else{
      next.levelProgress={...emptyLevelProgress(),...saved.levelProgress};
      next.activeLevel=Math.min(3,Math.max(1,Math.trunc(Number(saved.activeLevel)||1)));
    }
    const allowed=new Set(topics.map(t=>t.id)),clean=emptyLevelProgress();
    for(const level of [1,2,3]){
      const raw=next.levelProgress[level];
      clean[level]=Array.isArray(raw)?[...new Set(raw.filter(id=>allowed.has(id)))]:[];
      if(level>1&&clean[level-1].length!==topics.length)clean[level]=[];
    }
    next.levelProgress=clean;
    const highest=clean[1].length===topics.length?(clean[2].length===topics.length?3:2):1;
    next.activeLevel=Math.min(next.activeLevel,highest);
    const g=saved.game;
    next.game=g&&Array.isArray(g.pits)&&g.pits.length===16&&g.pits.every(n=>Number.isInteger(n)&&n>=0)&&g.pits.reduce((a,b)=>a+b,0)===98&&[0,1].includes(g.turn)?{...g,mode:g.mode==='ai'?'ai':'two',animating:false,aiThinking:false,undoStack:cleanUndoStack(g.undoStack)}:null;
    delete next.grade;delete next.gradeDone;delete next.learned;
    if(!next.profileSaved&&next.page==='profile')next.page='home';
    if(next.page==='quiz')next.page='home';
    return next;
  }catch(e){return {...defaultState,levelProgress:emptyLevelProgress()}}
}
function save(){localStorage.setItem(KEY,JSON.stringify(state));updateHeader()}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function currentTopic(){return topics.find(t=>t.id===state.activeTopic)||topics[0]}
function topicDone(level,id){return (state.levelProgress[level]||[]).includes(id)}
function levelDone(level){return topics.every(t=>topicDone(level,t.id))}
function levelUnlocked(level){return level===1||levelDone(level-1)}
function allLevelsDone(){return [1,2,3].every(levelDone)}
function updateHeader(){const av=$('#header-avatar'),lb=$('#login-button');if(av)av.textContent=state.name?state.name.trim().charAt(0).toUpperCase():'☺';if(lb)lb.textContent='Profil';$$('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.page===state.page))}
function setPage(page){
  narrationRequest++;
  if('speechSynthesis'in window)window.speechSynthesis.cancel();
  if(page==='learn')state.activeTopic=null;
  state.page=page;save();render();window.scrollTo({top:0,behavior:'smooth'});$('#main-nav')?.classList.remove('open');$('#menu-toggle')?.setAttribute('aria-expanded','false');
  if(page==='play'&&state.game?.mode==='ai'&&state.game.turn===1&&!state.game.over)setTimeout(runAiTurn,650);
}
function toast(message){const box=$('#toast-region');const el=document.createElement('div');el.className='toast';el.textContent=message;box.append(el);setTimeout(()=>el.remove(),2800)}
function popConfetti(){const colors=['#eab348','#62a46f','#e07758','#6a9fc0','#f4d67b'];for(let i=0;i<42;i++){const p=document.createElement('i');p.className='confetti';p.style.left=Math.random()*100+'vw';p.style.background=colors[i%colors.length];p.style.animationDelay=(Math.random()*.45)+'s';p.style.transform=`rotate(${Math.random()*180}deg)`;document.body.append(p);setTimeout(()=>p.remove(),2100)}}
function startPretest(){if(!state.preScores&&totalProgress()>0){toast('Pretest awal sebaiknya sebelum belajar. Tidak apa-apa—kamu tetap bisa lanjut tanpa membandingkan nilai!');setPage('learn');return}quiz={kind:'pre',index:0,answers:Array(quizQuestionsFor('pre').length).fill(null)};setPage('quiz')}
function startPosttest(){if(!state.preScores){toast('Posttest hanya untuk membandingkan hasil. Karena pretest awal dilewati, kamu boleh lanjut belajar tanpa tes akhir.');return}if(!allLevelsDone()){toast('Selesaikan semua materi di ketiga level dulu, ya!');setPage('learn');return}quiz={kind:'post',index:0,answers:Array(quizQuestionsFor('post').length).fill(null)};setPage('quiz')}
function beginJourney(){setPage('learn')}
function totalProgress(){const total=[1,2,3].reduce((n,l)=>n+(state.levelProgress[l]||[]).length,0);return Math.round(total/(topics.length*3)*100)}
function bujiCard(message='Hai, teman! Aku Buji. Yuk, belajar sedikit demi sedikit dan jangan takut mencoba!'){return `<div class="buji-card"><img src="./buji-avatar.webp" alt="Buji, pemandu CongklaTika"><div class="buji-bubble"><b>Buji berbisik:</b> ${message}</div></div>`}
function pageHeading(kicker,title,sub,withBuji=true){return `<div class="page-heading ${withBuji?'with-buji':''}"><div><span class="eyebrow">${kicker}</span><h1>${title}</h1><p>${sub}</p></div>${withBuji?'<img src="./buji-avatar.webp" alt="">':''}</div>`}
function topicCard(t){return `<button class="topic-card" data-topic="${t.id}"><div class="topic-top"><span class="topic-icon">${t.icon}</span></div><h3>${t.name}</h3><p>${t.desc}</p><span class="topic-status">Lihat materi <span>→</span></span></button>`}
function renderHome(){
  const startLabel=state.preScores||totalProgress()>0?'Lanjutkan belajar':'Mulai belajar';
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow"><span class="dot"></span> Petualangan matematika bersama Buji</span><h1 class="display">Belajar asyik,<br><em>main congklak!</em></h1><p class="lead">Berhitung dan bermain bersama Buji. Kamu boleh langsung belajar tanpa tes—pelan-pelan saja, tak perlu takut salah.</p><div class="hero-actions"><button class="primary-button large" data-action="start">${startLabel} <span aria-hidden="true">→</span></button><button class="secondary-button large" data-page="play">Coba main congklak <span aria-hidden="true">⌁</span></button></div><div class="hero-note"><div class="tiny-avatars"><span>🌱</span><span>🔢</span><span>🌟</span></div><span>Belajar kapan saja · pretest hanya pilihan</span></div></div><div class="seed-bubble">Psst… ada misi baru! ✨</div><div class="hero-sticker"><img src="./buji-avatar.webp" alt="Buji melambaikan tangan"></div></section>
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
    html+=`<div class="page-toolbar" style="margin-top:25px"><span class="eyebrow">Pilih misi belajar · Level ${state.activeLevel}</span><div class="spacer"></div>${state.preScores?`<span class="tag">Cek awal: ${state.preScores.total}/10</span>`:totalProgress()===0?`<button class="ghost-button" data-action="start-pretest">Pretest awal · opsional</button>`:`<span class="tag">Langsung belajar · tetap hebat!</span>`}</div><div class="topic-grid">${topics.map(t=>{const completed=topicDone(state.activeLevel,t.id);return `<button class="topic-card ${completed?'topic-complete':''}" data-topic="${t.id}"><div class="topic-top"><span class="topic-icon">${t.icon}</span>${completed?'<span class="completion-mark">✓</span>':''}</div><h3>${t.name}</h3><p>${t.desc}</p><span class="topic-status ${completed?'done':''}">${completed?'Selesai di level ini ✓':'Mulai tantangan →'}</span></button>`}).join('')}</div>`;
    if(levelDone(state.activeLevel)&&state.activeLevel<3)html+=`<div class="band level-unlock" style="margin-top:20px"><div class="band-emoji">🔓</div><div><h2>Level ${state.activeLevel+1} terbuka!</h2><p>Kerja bagus! Semua materi level ini sudah kamu selesaikan.</p></div><button class="primary-button" data-level="${state.activeLevel+1}">Lanjut ke level ${state.activeLevel+1} →</button></div>`;
    const ready=allLevelsDone();
    if(ready&&!state.preScores)html+=`<div class="panel" style="margin-top:20px"><h2 style="font:800 24px var(--display);margin:0 0 5px">Semua materi selesai! 🌟</h2><p class="small muted" style="margin:0">Hebat sudah belajar sampai akhir. Tes hanya diperlukan jika ingin membandingkan nilai; pretest awal yang dilewati tidak perlu dikejar lagi.</p></div>`;
    else html+=`<div class="panel" style="margin-top:20px"><div class="page-toolbar" style="margin:0"><div><h2 style="margin:0 0 4px;font:800 24px var(--display)">Evaluasi akhir · opsional</h2><span class="small muted">${ready?'Semua level selesai. Jika mau, lihat perubahan nilaimu!':'Selesaikan semua materi di tiga level dahulu.'}</span></div><div class="spacer"></div><button class="primary-button" data-action="start-posttest" ${ready?'':'disabled title="Selesaikan semua level dulu"'}>${state.postScores?'Ulangi posttest':'Mulai posttest'} →</button></div></div>`;
  }
  return html+'</div>';
}
function visualStepper(topic,key,value,label,min,max){return `<div class="visual-control"><span>${label}</span><div><button class="stepper-button" data-visual-topic="${topic}" data-visual-key="${key}" data-step="-1" ${value<=min?'disabled':''} aria-label="Kurangi ${label.toLowerCase()}">−</button><strong>${value}</strong><button class="stepper-button" data-visual-topic="${topic}" data-visual-key="${key}" data-step="1" ${value>=max?'disabled':''} aria-label="Tambah ${label.toLowerCase()}">+</button></div></div>`}
function seedDots(count){return Array.from({length:count},()=>'<i aria-hidden="true">●</i>').join('')}
function renderVisualPractice(t){
  const m=visualModel[t.id];if(!m)return '';
  let title='',controls='',picture='',equation='';
  if(t.id==='multiplication'){
    title='Buat kelompok biji yang sama banyak';
    controls=visualStepper(t.id,'groups',m.groups,'Kelompok',2,5)+visualStepper(t.id,'seeds',m.seeds,'Biji tiap kelompok',1,6);
    picture=`<div class="visual-groups">${Array.from({length:m.groups},(_,i)=>`<div class="visual-group" aria-label="Kelompok ${i+1}, ${m.seeds} biji"><span>${seedDots(m.seeds)}</span></div>`).join('')}</div>`;
    equation=`${m.groups} kelompok × ${m.seeds} biji = <strong>${m.groups*m.seeds} biji</strong>`;
  }else if(t.id==='division'){
    const each=m.total/m.groups;
    title='Bagikan biji sama rata';
    controls=`<div class="visual-control"><span>Lubang tujuan</span><div><button class="stepper-button" data-visual-topic="division" data-visual-key="groups" data-step="-1" aria-label="Kurangi jumlah lubang">−</button><strong>${m.groups}</strong><button class="stepper-button" data-visual-topic="division" data-visual-key="groups" data-step="1" aria-label="Tambah jumlah lubang">+</button></div></div><span class="visual-note">Jumlah biji tetap ${m.total}</span>`;
    picture=`<div class="visual-groups">${Array.from({length:m.groups},(_,i)=>`<div class="visual-group" aria-label="Lubang ${i+1}, ${each} biji"><span>${seedDots(each)}</span></div>`).join('')}</div>`;
    equation=`${m.total} biji ÷ ${m.groups} lubang = <strong>${each} biji tiap lubang</strong>`;
  }else{
    title='Lihat bagian dari satu utuh';
    controls=visualStepper(t.id,'parts',m.parts,'Bagian sama besar',2,4)+visualStepper(t.id,'selected',m.selected,'Bagian yang diambil',1,m.parts);
    picture=`<div class="fraction-bar" role="img" aria-label="${m.selected} dari ${m.parts} bagian diwarnai">${Array.from({length:m.parts},(_,i)=>`<span class="fraction-part ${i<m.selected?'chosen':''}"></span>`).join('')}</div>`;
    equation=`${m.selected} dari ${m.parts} bagian sama besar = <strong>${m.selected}/${m.parts}</strong>`;
  }
  return `<section class="visual-practice" aria-label="Latihan visual ${t.name}"><div class="visual-heading"><span class="eyebrow">Coba sendiri · latihan visual</span><h3>${title}</h3><p>Tekan + atau −, lalu amati perubahan gambar dan hitungannya.</p></div><div class="visual-controls">${controls}</div>${picture}<div class="visual-equation" aria-live="polite">${equation}</div></section>`;
}
function renderLesson(t){
  const practiced=practiceAnswered[t.id];
  const prompt=levelChallenges[t.id][state.activeLevel-1];
  const solved=practiced===prompt[2];
  const completed=topicDone(state.activeLevel,t.id);
  return `<div class="lesson-layout" style="margin-top:22px"><article class="lesson-card"><div class="page-toolbar"><span class="topic-icon">${t.icon}</span><span class="tag">${t.tag} · Level ${state.activeLevel}</span><div class="spacer"></div><button class="ghost-button audio-toggle" data-action="read-lesson">🔊 Dengarkan Buji</button></div><h2>${t.name}</h2><p>${t.lesson}</p><div class="example-box"><strong>Contoh dari papan congklak</strong>${t.example}</div>${renderVisualPractice(t)}<div class="mini-question"><strong>🎯 Tantangan mini</strong><p style="margin:5px 0 0">${prompt[0]}</p><div class="answer-row">${prompt[1].map((a,i)=>`<button class="answer-chip ${practiced===i?'selected':''}" data-practice="${t.id}" data-answer="${i}">${a}</button>`).join('')}</div>${practiced!==undefined?`<p class="inline-message ${solved?'':'error'}" aria-live="polite">${solved?'Hebat, jawabanmu tepat! 🌟':`Belum cocok—tidak apa-apa! ${challengeHints[t.id][state.activeLevel-1]} Coba pilih lagi, ya.`}</p>`:''}</div><div class="page-toolbar" style="margin-top:20px"><button class="ghost-button" data-action="back-topics">← Semua materi</button><div class="spacer"></div><button class="primary-button" data-action="complete-topic" data-topic-id="${t.id}" ${solved||completed?'':'disabled'}>${completed?'Selesai di level ini ✓':'Tandai materi selesai'}</button></div></article><aside class="lesson-aside"><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">💡 Tips dari Buji</h3><p class="muted small" style="margin:0">${t.tip}</p></div><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">🗺️ Jalur 3 level</h3><p class="muted small">Selesaikan semua lima materi di satu level untuk membuka level berikutnya. Soal makin menantang, tetapi semua angka tetap di bawah 100.</p><span class="tag">Sekarang: Level ${state.activeLevel}</span></div><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">🎧 Dengarkan</h3><p class="muted small" style="margin:0">Tekan tombol suara untuk mendengar Buji membacakan materi dengan gaya ceria dan jelas.</p></div></aside></div>`;
}
function renderQuiz(){
  const questions=quizQuestionsFor(quiz.kind),q=questions[quiz.index],isPre=quiz.kind==='pre',label=isPre?'Pretest awal':'Posttest akhir',ans=quiz.answers[quiz.index];
  return `<div class="container page-wrap">${pageHeading(isPre?'Sebelum petualangan':'Akhir petualangan',isPre?'Cek bekal awalmu!':'Tunjukkan yang kamu pelajari!','Ini latihan, bukan ujian sekolah. Baca pelan-pelan dan pilih jawaban yang menurutmu tepat.')}${bujiCard(isPre?'Tidak apa-apa kalau belum tahu semuanya. Kita mulai dari sini, ya!':'Kamu sudah berlatih. Tarik napas, baca soal pelan-pelan, dan lakukan yang terbaik!')}<div class="quiz-card"><div class="quiz-top"><span class="quiz-category">${label} · ${topics.find(t=>t.id===q.cat).name}</span><span>Soal ${quiz.index+1} dari ${questions.length}</span></div><div class="progress-track"><div class="progress-fill" style="width:${(quiz.index+1)/questions.length*100}%"></div></div><div class="progress-row"><span>Langkah ${quiz.index+1}</span><span>${Math.round((quiz.index+1)/questions.length*100)}%</span></div><h2>${q.q}</h2><div class="quiz-options">${q.options.map((o,i)=>`<button class="quiz-option ${ans===i?'selected':''}" data-quiz-answer="${i}"><span class="option-letter">${String.fromCharCode(65+i)}</span>${o}</button>`).join('')}</div><div class="quiz-footer"><button class="ghost-button" data-action="quiz-prev" ${quiz.index===0?'disabled':''}>← Kembali</button><span class="small muted">${quiz.answers.filter(x=>x!==null).length}/${questions.length} terjawab</span>${quiz.index===questions.length-1?'<button class="primary-button" data-action="quiz-submit">Lihat hasil ✨</button>':'<button class="primary-button" data-action="quiz-next">Berikutnya →</button>'}</div></div></div>`;
}
function scoresByCategory(answers,questions=quizQuestionsFor(quiz.kind)){const scores={};topics.forEach(t=>{const indexes=questions.map((q,i)=>q.cat===t.id?i:-1).filter(i=>i>=0);scores[t.id]=Math.round(indexes.filter(i=>answers[i]===questions[i].answer).length/indexes.length*100)});scores.total=answers.filter((a,i)=>a===questions[i].answer).length;return scores}
function finishQuiz(){const questions=quizQuestionsFor(quiz.kind);if(quiz.answers.some(a=>a===null)){toast('Jawab semua soal dulu agar hasilnya lengkap.');return}const result=scoresByCategory(quiz.answers,questions);if(quiz.kind==='pre'){state.preScores=result;state.postScores=null;state.page='quiz-result';state.resultKind='pre'}else{state.postScores=result;state.page='quiz-result';state.resultKind='post'}save();popConfetti();render();window.scrollTo({top:0,behavior:'smooth'})}
function adjustVisual(topic,key,step){
  const model=visualModel[topic];if(!model)return;
  if(topic==='division'){const choices=[2,3,4,6],at=choices.indexOf(model.groups);model.groups=choices[(at+step+choices.length)%choices.length]}
  else if(topic==='fraction'&&key==='parts'){model.parts=Math.max(2,Math.min(4,model.parts+step));model.selected=Math.min(model.selected,model.parts)}
  else{const limits=topic==='multiplication'?(key==='groups'?[2,5]:[1,6]):(key==='selected'?[1,model.parts]:[2,4]);model[key]=Math.max(limits[0],Math.min(limits[1],model[key]+step))}
  render();
}
function renderQuizResult(){const pre=state.resultKind==='pre',scores=pre?state.preScores:state.postScores;return `<div class="container page-wrap"><div class="quiz-card"><div class="result-hero"><div class="result-star">${pre?'🌱':'🏆'}</div><span class="eyebrow">${pre?'Pretest selesai':'Posttest selesai'}</span><h2>${pre?'Ini titik awal petualanganmu!':'Lihat seberapa jauh kamu tumbuh!'}</h2><div class="score-big">${scores.total}<span style="font-size:24px;color:var(--muted)"> / 10</span></div><p class="muted">${pre?'Hasil ini jadi pembanding. Ayo belajar dan coba lagi nanti!':'Kamu sudah menyelesaikan evaluasi akhir. Hebat sekali!'}</p></div><div class="panel" style="box-shadow:none"><h3 style="font:800 23px var(--display);margin-bottom:4px">Nilai per kategori</h3><p class="small muted" style="margin-top:0">Setiap kategori berisi dua soal.</p><div style="overflow:auto"><table class="score-table"><thead><tr><th>Kategori</th><th>Nilai</th><th>Progres nilai</th></tr></thead><tbody>${topics.map(t=>`<tr><td>${t.icon} ${t.name}</td><td><strong>${scores[t.id]}%</strong></td><td><div class="bar-compare"><div><span style="width:${scores[t.id]}%"></span></div></div></td></tr>`).join('')}</tbody></table></div></div><div class="quiz-footer"><button class="ghost-button" data-page="report">Lihat laporan</button><button class="primary-button" data-action="result-continue">${pre?'Pilih materi belajar':'Lihat perjalananku'} →</button></div></div></div>`}
function renderReport(){
  if(!state.preScores)return `<div class="container page-wrap">${pageHeading('Catatan pilihan','Perjalanan belajarmu','Laporan nilai tersedia jika kamu memilih pretest sebelum mulai belajar.')}${bujiCard('Tidak mengerjakan tes juga tidak apa-apa. Yang penting kamu mencoba, berlatih, dan menikmati proses belajar!')}<div class="empty-state"><div class="empty-emoji">🌱</div><h2>Belum ada nilai untuk dibandingkan</h2><p>Pretest dan posttest hanya pilihan. Kamu tetap bisa belajar semua materi tanpa mengerjakan keduanya.</p><button class="primary-button" data-page="learn">Kembali belajar →</button></div></div>`;
  const hasPost=!!state.postScores,preAvg=Math.round(topics.reduce((sum,t)=>sum+state.preScores[t.id],0)/topics.length),postAvg=hasPost?Math.round(topics.reduce((sum,t)=>sum+state.postScores[t.id],0)/topics.length):null;
  return `<div class="container page-wrap">${pageHeading('Catatan perjalanan','Lihat tumbuhnya nilaimu','Perbandingan hasil awal dan akhir di tiap kategori. Terus berlatih dengan riang!')}${bujiCard(hasPost?'Setiap langkah belajarmu berharga. Lihat kategori yang makin kuat dan rayakan usahamu!':'Laporan akhir akan muncul setelah kamu menuntaskan tiga level dan mengikuti posttest.')}<div class="report-summary"><div class="metric"><strong>${preAvg}%</strong><span>Rata-rata pretest</span></div><div class="metric"><strong>${hasPost?postAvg+'%':'—'}</strong><span>${hasPost?'Rata-rata posttest':'Posttest belum dikerjakan'}</span></div><div class="metric"><strong>${totalProgress()}%</strong><span>Materi dipelajari</span></div></div><div class="panel"><div class="page-toolbar"><div><h2 style="font:800 25px var(--display);margin:0">Per kategori</h2><span class="small muted">Nilai dihitung dari dua soal pada tiap kategori.</span></div><div class="spacer"></div><span class="tag">${hasPost?'Pretest → Posttest':'Pretest'}</span></div><div style="overflow:auto"><table class="score-table"><thead><tr><th>Kategori</th><th>Pretest</th>${hasPost?'<th>Posttest</th><th>Perubahan</th>':''}<th>Grafik</th></tr></thead><tbody>${topics.map(t=>{const a=state.preScores[t.id],b=hasPost?state.postScores[t.id]:null,d=b===null?null:b-a;return `<tr><td>${t.icon} ${t.name}</td><td><strong>${a}%</strong></td>${hasPost?`<td><strong>${b}%</strong></td><td class="score-delta ${d>0?'delta-up':d<0?'delta-down':'delta-same'}">${d>0?'▲ +':d<0?'▼ ':'• '}${d}%</td>`:''}<td><div class="bar-compare"><div title="Pretest"><span style="width:${a}%"></span></div>${hasPost?`<div title="Posttest"><span style="width:${b}%"></span></div>`:''}</div></td></tr>`}).join('')}</tbody></table></div><p class="source-note">Grafik hijau menunjukkan pretest; grafik emas menunjukkan posttest. Coba latihan lagi agar konsep makin melekat.</p></div><div class="page-toolbar" style="margin-top:18px"><button class="ghost-button" data-page="learn">Kembali ke materi</button><div class="spacer"></div><button class="ghost-button" data-action="start-pretest">Ulangi pretest</button>${state.postScores?'<button class="primary-button" data-action="start-posttest">Ulangi posttest →</button>':`<button class="primary-button" ${allLevelsDone()?'data-action="start-posttest"':'data-page="learn"'}>${allLevelsDone()?'Mulai posttest':'Lanjut belajar'} →</button>`}</div></div>`;
}

function initialGame(mode='two'){return {pits:Array(16).fill(0).map((_,i)=>i===7||i===15?0:7),turn:0,over:false,mode,animating:false,aiThinking:false,undoStack:[],message:'Pilih lubang yang berisi biji untuk memulai.'}}
function playerLabel(side){if(side===0)return state.name||'Kamu';return state.game?.mode==='ai'?'Buji / komputer':'Temanmu'}
function renderPlay(){
  if(!state.game)state.game=initialGame();
  const g=state.game,p=g.pits,top=[14,13,12,11,10,9,8],bottom=[0,1,2,3,4,5,6];
  const turnLabel=g.turn===0?`Giliran ${playerLabel(0)}`:g.mode==='ai'?'Giliran Buji / komputer':'Giliran temanmu';
  const pit=(i,own)=>`<button class="pit ${!g.over&&!g.animating&&!g.aiThinking&&g.turn===own&&p[i]>0?'playable':''} ${g.last===i?'last-drop':''}" data-pit="${i}" ${g.over||g.animating||g.aiThinking||g.turn!==own||p[i]===0?'disabled':''} aria-label="Lubang ${own===0?i+1:15-i} ${playerLabel(own)}, berisi ${p[i]} biji"><span class="seeds">${Array.from({length:Math.min(p[i],12)},()=>'<i class="seed"></i>').join('')}</span><span class="seed-count">${p[i]}</span></button>`;
  return `<div class="container page-wrap">${pageHeading('Mode tradisional','Ayo main congklak!','Bergiliran, hitung bijinya, dan kumpulkan sebanyak-banyaknya di lumbungmu.')}${bujiCard(g.mode==='ai'?'Ayo tantang aku! Aku akan memilih lubang dan menabur biji satu per satu. Kamu mulai dulu, ya!':'Kita bisa bermain berdua di satu perangkat. Pemain yang duduk di bawah mulai dulu, ya!')}<div class="game-mode-picker" role="group" aria-label="Pilih lawan"><button class="mode-choice ${g.mode==='two'?'active':''}" data-game-mode="two" ${g.animating||g.aiThinking?'disabled':''}><span>👫</span><b>2 pemain</b><small>Main bersama teman</small></button><button class="mode-choice ${g.mode==='ai'?'active':''}" data-game-mode="ai" ${g.animating||g.aiThinking?'disabled':''}><span>🤖</span><b>Vs Buji / komputer</b><small>Tantang lawan pintar</small></button></div><div class="turn-banner" role="status"><span></span>${g.over?g.message:g.animating?'Biji sedang ditabur satu per satu…':g.aiThinking?'Buji sedang memilih lubang…':turnLabel}</div><div class="board-shell"><div class="board-labels"><span>Lumbung ${esc(playerLabel(1))}</span><span>Lubang congklak</span><span>Lumbung ${esc(playerLabel(0))}</span></div><div class="board-play-area"><div class="store-pit" data-store="15" aria-label="Lumbung ${esc(playerLabel(1))}"><span class="store-count">${p[15]}</span><small>${esc(playerLabel(1).toUpperCase())}</small></div><div class="pits"><div class="pit-row" aria-label="Lubang ${esc(playerLabel(1))}">${top.map(i=>pit(i,1)).join('')}</div><div class="pit-row" aria-label="Lubang ${esc(playerLabel(0))}">${bottom.map(i=>pit(i,0)).join('')}</div></div><div class="store-pit" data-store="7" aria-label="Lumbung ${esc(playerLabel(0))}"><span class="store-count">${p[7]}</span><small>${esc(playerLabel(0).toUpperCase())}</small></div></div></div><p class="small muted game-message" style="text-align:center;margin:0 0 17px" aria-live="polite">${esc(g.message)}</p><div class="game-actions"><button class="secondary-button" data-action="new-game" ${g.animating||g.aiThinking?'disabled':''}>↻ Mulai ulang</button><button class="ghost-button" data-action="undo-move" ${!g.undoStack?.length||g.animating||g.aiThinking?'disabled':''}>↶ Urungkan langkah</button><button class="ghost-button" data-action="show-hint" aria-expanded="false">💡 Petunjuk</button><button class="ghost-button" data-action="show-rules">Cara bermain</button></div><p id="game-hint" class="game-hint" hidden>Mulai dari lubang yang berisi biji di barismu. Sebarkan biji satu per satu; panduan lengkap bisa dibuka kapan saja.</p><details class="panel game-rules" id="game-rules"><summary>🌰 Panduan aturan congklak</summary><p class="small muted">Permainan ini memakai aturan ringkas. Ada variasi aturan congklak di berbagai daerah.</p><div class="rules-grid"><div class="rule-step"><b>01 · Ambil</b><p>Pilih lubang di barismu yang masih berisi biji.</p></div><div class="rule-step"><b>02 · Sebar</b><p>Bijinya ditabur satu per satu searah putaran. Lumbung lawan dilewati. Jika biji terakhir jatuh di lubang berisi biji, ambil isinya dan lanjutkan.</p></div><div class="rule-step"><b>03 · Kumpulkan</b><p>Biji terakhir di lumbung sendiri memberi giliran lagi. Jika jatuh di lubang kosongmu, ambil isi lubang seberang. Permainan selesai saat satu sisi kosong.</p></div></div><p class="small muted" style="margin-bottom:0">Pada akhir permainan, biji tersisa masuk ke lumbung pemilik baris.</p></details></div>`;
}
function gameNode(index){return index===7||index===15?document.querySelector(`[data-store="${index}"]`):document.querySelector(`[data-pit="${index}"]`)}
function syncPit(index){
  const g=state.game,p=g.pits[index],node=gameNode(index);if(!node)return;
  if(index===7||index===15){const count=$('.store-count',node);if(count)count.textContent=String(p);return}
  const count=$('.seed-count',node),seeds=$('.seeds',node);
  if(count)count.textContent=String(p);
  if(seeds)seeds.innerHTML=Array.from({length:Math.min(p,12)},()=>'<i class="seed"></i>').join('');
}
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function animateSeed(from,to){
  const source=gameNode(from),target=gameNode(to);
  if(source&&target){
    const a=source.getBoundingClientRect(),b=target.getBoundingClientRect(),flight=document.createElement('i');
    flight.className='seed-flight';flight.style.left=`${a.left+a.width/2-5}px`;flight.style.top=`${a.top+a.height/2-5}px`;document.body.append(flight);
    requestAnimationFrame(()=>{flight.style.transform=`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.72)`});
    await wait(150);flight.remove();
  }else await wait(150);
  state.game.pits[to]++;syncPit(to);
  const node=gameNode(to);node?.classList.add('drop-flash');setTimeout(()=>node?.classList.remove('drop-flash'),380);
  playTone(590+(to%7)*32,.075);
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
  const ownStore=player===0?7:15,oppStore=player===0?15:7;
  g.undoStack=Array.isArray(g.undoStack)?g.undoStack:[];g.undoStack.push({pits:g.pits.slice(),turn:g.turn,over:g.over,message:g.message});if(g.undoStack.length>40)g.undoStack.shift();g.animating=true;g.aiThinking=false;g.message=`${player===0?playerLabel(0):playerLabel(1)} mengambil biji…`;g.last=index;render();
  let seeds=p[index],pos=index,from=index,extraTurn=false,relays=0,message='';p[index]=0;syncPit(index);
  while(true){
    while(seeds>0){pos=(pos+1)%16;if(pos===oppStore)continue;await animateSeed(from,pos);seeds--;from=pos}
    if(pos===ownStore){extraTurn=true;message='Biji terakhir jatuh di lumbung sendiri. Dapat giliran lagi!';break}
    if(p[pos]>1){await wait(170);seeds=p[pos];p[pos]=0;syncPit(pos);from=pos;relays++;continue}
    if(isOwn(pos)&&p[14-pos]>0){const captured=p[14-pos]+p[pos];p[ownStore]+=captured;p[14-pos]=0;p[pos]=0;syncPit(14-pos);syncPit(pos);syncPit(ownStore);message=`Tangkap! ${captured} biji masuk ke lumbung.`}
    else message='Biji terakhir jatuh di lubang kosong. Giliran selesai.';
    break;
  }
  g.last=pos;
  const finished=endGame(g,p);
  if(!finished){if(!extraTurn)g.turn=1-player;g.message=(relays?`Biji disebar lanjut ${relays} kali. `:'')+message+(extraTurn?'':` Sekarang giliran ${playerLabel(g.turn)}.`)}
  g.animating=false;save();render();
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
  const g=state.game;if(!g||g.over||g.turn!==1||g.mode!=='ai'||g.animating||g.aiThinking)return;
  g.aiThinking=true;g.message='Buji sedang memilih lubang…';render();await wait(550);
  const choice=chooseAiMove();g.aiThinking=false;
  if(choice<0){g.over=true;g.message='Permainan selesai. Yuk, mulai lagi!';save();render();return}
  await movePit(choice,true);
}
function selectGameMode(mode){if(!['two','ai'].includes(mode))return;if(state.game?.animating||state.game?.aiThinking)return;state.game=initialGame(mode);save();render();toast(mode==='ai'?'Buji siap ditantang!':'Papan dua pemain sudah siap!')}

function renderHistory(){return `<div class="container page-wrap">${pageHeading('Cerita di balik biji','Dari mana congklak berasal?','Permainan ini punya banyak nama dan jejak lintas budaya. Inilah beberapa hal yang kita ketahui—serta bagian yang masih berupa perkiraan.')}${bujiCard('Sejarah panjang sering punya beberapa cerita. Kita bedakan fakta yang terdokumentasi dan asal-usul yang masih diperkirakan, ya!')}<div class="history-layout"><article class="panel history-card"><span class="eyebrow">Jejak perjalanan</span><div class="timeline"><div class="timeline-item"><h3>Permainan dari keluarga mancala</h3><p>Congklak termasuk keluarga permainan mancala, yakni permainan papan atau lubang tempat biji dipindahkan dan dihitung. Bentuk serupa dijumpai di berbagai kawasan dunia.</p></div><div class="timeline-item"><h3>Asal-usulnya diperkirakan</h3><p>Sejumlah sumber mengaitkan keluarga mancala dengan Timur Tengah. Namun, asal tepat dan waktu masuknya congklak ke Indonesia tidak dapat dipastikan hanya dengan satu cerita.</p></div><div class="timeline-item"><h3>Menyebar lewat pertemuan budaya</h3><p>Permainan ini diyakini menyebar ke Asia Tenggara melalui jalur perdagangan dan persinggahan. Masyarakat setempat kemudian membuat bentuk, nama, dan kebiasaan bermainnya sendiri.</p></div><div class="timeline-item"><h3>Nama dan papan yang beragam</h3><p>Di sejumlah daerah permainan ini dikenal sebagai congklak atau dakon. Papan yang umum punya dua baris lubang kecil dan dua lumbung besar.</p></div></div></article><aside class="lesson-aside"><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">Apa yang dilatih?</h3><ul class="fact-list"><li>Berhitung dan memperkirakan jumlah</li><li>Strategi serta mengambil keputusan</li><li>Kesabaran dan bergiliran</li><li>Belajar menghargai aturan bersama</li></ul></div><div class="panel"><h3 style="font:800 22px var(--display);margin:0 0 8px">Tahukah kamu?</h3><p class="small muted">Congklak punya variasi aturan. Tanya keluarga atau teman tentang versi yang dimainkan di daerahmu!</p></div><div class="panel"><h3 style="font:800 21px var(--display);margin:0 0 8px">Sumber bacaan</h3><p class="small"><a href="https://disdikpora.bulelengkab.go.id/informasi/detail/artikel/62_mengenal-kembali-permainan-tradisional-nusantara-asal-usul-dan-nilainya" target="_blank" rel="noopener noreferrer">Dinas Pendidikan, Pemuda dan Olahraga Kabupaten Buleleng — Congklak</a></p><p class="small"><a href="https://www.nlb.gov.sg/main/article-detail?cmsuuid=7bedd52d-ff96-472d-b423-4dc6790e98c8" target="_blank" rel="noopener noreferrer">Singapore National Library Board — Congkak</a></p><p class="source-note">Asal-usul ditulis sebagai perkiraan karena sejarah permainan berkembang lintas wilayah.</p></div></aside></div><div class="band" style="margin-top:22px"><div class="band-emoji">🪵</div><div><h2>Mau coba main?</h2><p>Gunakan papan virtual untuk latihan berhitung dan strategi bersama teman atau komputer.</p></div><button class="primary-button" data-page="play">Main sekarang →</button></div></div>`}
function renderTeam(){return `<div class="container page-wrap">${pageHeading('Di balik petualangan','Tim pengembang','CongklaTika memadukan matematika dasar dan permainan tradisional.')}${bujiCard('Banyak tangan dan ide bisa membuat permainan makin seru. Yuk, kenali peran yang membentuk petualangan ini!')}<div class="team-grid"><article class="team-card"><div class="team-icon">📚</div><h3>Tim materi</h3><p>Menyusun penjelasan matematika sederhana, contoh, dan latihan yang ramah anak.</p></article><article class="team-card"><div class="team-icon">🧩</div><h3>Tim permainan</h3><p>Merancang tiga level tantangan, kuis awal dan akhir, serta mode congklak digital.</p></article><article class="team-card"><div class="team-icon">🎨</div><h3>Tim visual</h3><p>Membangun dunia ceria dengan papan congklak, warna hangat, dan Buji sebagai teman belajar.</p></article><article class="team-card"><div class="team-icon">💻</div><h3>Tim teknologi</h3><p>Membuat antarmuka responsif dengan progres lokal, suara, dan animasi interaktif.</p></article></div><div class="panel" style="margin-top:18px"><h2 style="font:800 25px var(--display);margin:0 0 6px">Tentang prototipe ini</h2><p class="muted" style="margin:0">Nama pemain, progres, dan skor disimpan di penyimpanan lokal browser pada perangkat yang digunakan. Belum ada akun daring atau sinkronisasi antarperangkat.</p></div></div>`}
function renderProfile(){
  const first=!state.profileSaved;
  return `<div class="container page-wrap">${pageHeading(first?'Profil pemain':'Profil pemain',first?'Boleh kenalan dengan Buji?':'Atur profilmu',first?'Nama panggilan ini boleh diisi atau dilewati. Kamu tetap bisa langsung belajar.':'Ubah nama panggilanmu kapan saja.')}${bujiCard(first?'Hai, teman! Aku Buji. Kalau mau, tulis nama panggilanmu supaya aku bisa menyapamu.':'Progresmu tersimpan di browser perangkat ini.')}<div class="profile-layout"><div class="panel profile-card"><div class="profile-avatar">${first?'🙂':'🌟'}</div><h2>${state.name?esc(state.name):'Petualang baru'}</h2><p class="muted">${first?'Siap bertemu Buji?':'Petualanganmu sudah berjalan!'}</p><span class="tag">🌱 Progres belajar ${totalProgress()}%</span><div class="divider"></div>${first?'<span class="small muted">Profil boleh dilewati. Tidak perlu email atau kata sandi.</span>':'<button class="primary-button" data-action="start">Lanjutkan belajar →</button>'}</div><div class="panel"><h2 style="font:800 25px var(--display);margin:0 0 4px">${first?'Atur nama panggilan':'Detail profil'}</h2><p class="small muted">Nama panggilan saja—opsional. Tidak perlu email atau kata sandi.</p><form id="profile-form" class="profile-form"><label class="form-field">Nama panggilan<input name="name" value="${esc(state.name)}" maxlength="24" placeholder="Contoh: Dira" required autocomplete="nickname"></label><button class="primary-button" type="submit">${first?'Simpan nama':'Simpan profil'}</button></form><p class="source-note">Profil dan progres disimpan hanya di browser ini. Data tidak dikirim ke server.</p></div></div></div>`;
}
function render(){
  const app=$('#app');let content='';
  switch(state.page){case'home':content=renderHome();break;case'learn':content=renderLearn();break;case'quiz':content=renderQuiz();break;case'quiz-result':content=renderQuizResult();break;case'play':content=renderPlay();break;case'history':content=renderHistory();break;case'report':content=renderReport();break;case'team':content=renderTeam();break;case'profile':content=renderProfile();break;default:state.page='home';content=renderHome()}
  app.innerHTML=content;updateHeader();$('#year').textContent=new Date().getFullYear();
}
function openLogin(){setPage('profile')}
function closeModal(){$('#modal-root').innerHTML=''}
async function availableNarrationVoices(){
  const synth=window.speechSynthesis,available=synth.getVoices();
  if(available.length)return available;
  return new Promise(resolve=>{
    let finished=false,timer;
    const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);synth.removeEventListener?.('voiceschanged',finish);resolve(synth.getVoices())};
    synth.addEventListener?.('voiceschanged',finish);
    timer=setTimeout(finish,900);
  });
}
function chooseNarrationVoice(voices){
  const indonesian=voices.filter(v=>(v.lang||'').toLowerCase().replace('_','-').startsWith('id'));
  const boyishName=/\b(?:male|masculine|pria|laki[- ]laki|boy|andika|dimas|ardhi)\b/i;
  return indonesian.find(v=>boyishName.test(v.name||''))||indonesian[0]||null;
}
async function readLesson(){
  if(!('speechSynthesis'in window)){toast('Fitur pembacaan belum tersedia di browser ini.');return}
  const request=++narrationRequest;window.speechSynthesis.cancel();const t=currentTopic();
  const stories={
    addition:'Penjumlahan artinya menggabungkan. Ada enam biji di satu lubang, lalu empat biji lagi di lubang sebelah. Yuk, kita hitung semuanya. Mulai dari enam: tujuh, delapan, sembilan, sepuluh. Jadi, enam ditambah empat sama dengan sepuluh.',
    subtraction:'Pengurangan membantu kita tahu berapa yang tersisa. Buji punya sembilan biji. Empat biji dipindahkan. Kita hitung mundur dari sembilan: delapan, tujuh, enam, lima. Jadi, sembilan dikurangi empat sama dengan lima.',
    multiplication:'Perkalian adalah cara cepat menghitung kelompok yang sama banyak. Ada tiga lubang. Setiap lubang berisi empat biji. Kita hitung empat, lalu empat lagi, lalu empat lagi. Semuanya ada dua belas biji. Jadi, tiga kali empat sama dengan dua belas.',
    division:'Pembagian artinya berbagi sama rata. Ada dua belas biji untuk dibagikan ke tiga lubang. Kita bagikan satu per satu, bergiliran. Setelah semua biji habis, tiap lubang mendapat empat biji. Jadi, dua belas dibagi tiga sama dengan empat. Adil, kan?',
    fraction:'Pecahan menunjukkan bagian dari satu benda utuh. Bayangkan satu kue dipotong menjadi empat bagian yang sama besar. Kalau kita mengambil satu potong, namanya satu per empat. Empat berarti jumlah semua bagiannya. Satu berarti bagian yang kita ambil. Semua potongannya harus sama besar, ya!'
  };
  const voices=await availableNarrationVoices();
  if(request!==narrationRequest||state.page!=='learn'||state.activeTopic!==t.id)return;
  speechVoice=chooseNarrationVoice(voices);
  const utterance=new SpeechSynthesisUtterance(`Halo, teman! Aku Buji. Yuk, kita belajar ${t.name.toLowerCase()}. ${stories[t.id]} Sekarang, giliranmu mencoba tantangan. Pelan-pelan saja. Kamu pasti bisa!`);
  if(speechVoice)utterance.voice=speechVoice;utterance.lang='id-ID';utterance.rate=.92;utterance.pitch=1.2;utterance.volume=1;window.speechSynthesis.speak(utterance);toast('Buji membacakan materi dengan semangat! 🔊');
}
function startMusic(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx){toast('Musik tidak didukung di browser ini.');return}
    if(!music.ctx)music.ctx=new AudioCtx();music.ctx.resume();music.on=true;music.step=0;
    const notes=[523.25,659.25,783.99,659.25,587.33,698.46,880,783.99];
    music.timer=setInterval(()=>{if(!music.on)return;const now=music.ctx.currentTime,osc=music.ctx.createOscillator(),gain=music.ctx.createGain();osc.type='triangle';osc.frequency.value=notes[music.step++%notes.length];gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.078,now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+.34);osc.connect(gain);gain.connect(music.ctx.destination);osc.start(now);osc.stop(now+.36)},370);
    $('#music-toggle').setAttribute('aria-pressed','true');$('#music-toggle').title='Matikan musik';toast('Musik petualangan siap menemani! ♫');
  }catch(e){toast('Musik belum dapat diputar. Coba lagi.')}
}
function stopMusic(){music.on=false;clearInterval(music.timer);$('#music-toggle').setAttribute('aria-pressed','false');$('#music-toggle').title='Nyalakan musik';if(music.ctx)music.ctx.suspend();toast('Musik dijeda')}
function playTone(freq=550,duration=.1){try{if(!music.ctx)music.ctx=new (window.AudioContext||window.webkitAudioContext)();const c=music.ctx;c.resume();const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(freq,c.currentTime);g.gain.setValueAtTime(.055,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+duration)}catch(e){}}
function handleAction(action,el){
  switch(action){
    case'start':beginJourney();break;
    case'start-pretest':startPretest();break;
    case'start-posttest':startPosttest();break;
    case'complete-topic':{const id=el.dataset.topicId;if(practiceAnswered[id]!==levelChallenges[id][state.activeLevel-1][2]){toast('Jawab tantangan mini dengan benar dulu, ya!');return}if(!topicDone(state.activeLevel,id))state.levelProgress[state.activeLevel].push(id);save();if(levelDone(state.activeLevel)){popConfetti();toast(state.activeLevel<3?`Hebat! Level ${state.activeLevel+1} terbuka! 🔓`:'Semua level selesai! Kamu hebat sekali! 🌟')}else toast('Materi selesai! Satu langkah hebat 🌟');render();break}
    case'back-topics':state.activeTopic=null;save();render();window.scrollTo({top:0,behavior:'smooth'});break;
    case'quiz-next':if(quiz.answers[quiz.index]===null){toast('Pilih satu jawaban dulu, ya!');return}quiz.index++;render();break;
    case'quiz-prev':quiz.index=Math.max(0,quiz.index-1);render();break;
    case'quiz-submit':finishQuiz();break;
    case'result-continue':if(state.resultKind==='pre')setPage('learn');else setPage('report');break;
    case'new-game':state.game=initialGame(state.game?.mode||'two');save();render();toast('Papan baru siap dimainkan!');break;
    case'show-rules':{const rules=$('#game-rules');if(rules){rules.open=true;rules.scrollIntoView({behavior:'smooth',block:'center'})}break}
    case'show-hint':{const hint=$('#game-hint'),button=$('[data-action=\"show-hint\"]');if(hint&&button){hint.hidden=!hint.hidden;button.setAttribute('aria-expanded',String(!hint.hidden))}break}
    case'undo-move':undoGameMove();break;
    case'read-lesson':readLesson();break;
    case'login':openLogin();break;
    case'close-modal':closeModal();break;
    default:break;
  }
}
document.addEventListener('click',e=>{
  if(e.target.classList.contains('modal-backdrop')){closeModal();return}
  const page=e.target.closest('[data-page]');if(page){e.preventDefault();setPage(page.dataset.page);return}
  const act=e.target.closest('[data-action]');if(act){handleAction(act.dataset.action,act);return}
  const mode=e.target.closest('[data-game-mode]');if(mode){selectGameMode(mode.dataset.gameMode);return}
  const level=e.target.closest('[data-level]');if(level){const n=Number(level.dataset.level);if(!levelUnlocked(n)){toast(`Selesaikan Level ${n-1} dulu untuk membuka level ini.`);return}practiceAnswered={};state.activeLevel=n;state.activeTopic=null;save();render();toast(`Level ${n} dipilih. Semangat!`);return}
  const topic=e.target.closest('[data-topic]');if(topic){state.activeTopic=topic.dataset.topic;state.page='learn';save();render();window.scrollTo({top:0,behavior:'smooth'});return}
  const opt=e.target.closest('[data-quiz-answer]');if(opt){quiz.answers[quiz.index]=Number(opt.dataset.quizAnswer);playTone(500,.07);render();return}
  const practice=e.target.closest('[data-practice]');if(practice){const id=practice.dataset.practice;practiceAnswered[id]=Number(practice.dataset.answer);const key=levelChallenges[id][state.activeLevel-1][2];if(practiceAnswered[id]===key){playTone(760,.15);popConfetti()}else playTone(240,.12);render();return}
  const visual=e.target.closest('[data-visual-topic]');if(visual){adjustVisual(visual.dataset.visualTopic,visual.dataset.visualKey,Number(visual.dataset.step));return}
  const pit=e.target.closest('[data-pit]');if(pit){movePit(Number(pit.dataset.pit));return}
});
document.addEventListener('submit',e=>{
  if(e.target.id==='profile-form'){
    e.preventDefault();const data=new FormData(e.target),name=String(data.get('name')||'').trim().slice(0,24);
    if(!name){toast('Tulis nama panggilanmu dulu, ya!');return}
    state.name=name;state.profileSaved=true;state.page='home';save();render();toast(`Hai, ${state.name}! Profilmu tersimpan.`);
  }
});
$('#music-toggle').addEventListener('click',()=>music.on?stopMusic():startMusic());
$('#menu-toggle').addEventListener('click',()=>{const nav=$('#main-nav'),expanded=$('#menu-toggle').getAttribute('aria-expanded')==='true';nav.classList.toggle('open',!expanded);$('#menu-toggle').setAttribute('aria-expanded',String(!expanded))});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if(e.key==='Enter'&&state.page==='quiz'&&e.target.tagName!=='BUTTON'&&quiz.index<quizQuestionsFor(quiz.kind).length-1)handleAction('quiz-next',{})});
if(state.page==='quiz')state.page='home';render();
if(state.page==='play'&&state.game?.mode==='ai'&&state.game.turn===1&&!state.game.over)setTimeout(runAiTurn,650);
