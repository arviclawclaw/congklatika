#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
let checks = 0;
function ok(value, label) { assert.ok(value, label); checks++; console.log(`PASS ${label}`); }
function mime(file) { return ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.json':'application/json'})[path.extname(file)] || 'application/octet-stream'; }
const server = http.createServer((req, res) => {
  const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(ROOT, `.${requested === '/' ? '/index.html' : requested}`);
  if (!file.startsWith(ROOT + path.sep) && file !== path.join(ROOT, 'index.html')) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => { if (error) { res.writeHead(404).end('Not found'); return; } res.writeHead(200, {'content-type':mime(file),'cache-control':'no-store'}).end(data); });
});
async function startServer() { await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); return `http://127.0.0.1:${server.address().port}/`; }
async function newContext(browser, options={}) { return browser.newContext({viewport:{width:1280,height:900},...options}); }
async function goto(page,url,{onboard=true}={}) { await page.goto(url,{waitUntil:'domcontentloaded'}); await page.locator('#app').waitFor(); if(onboard&&await page.locator('.profile-modal').count()){await page.locator('#profile-name').fill('Teman');await page.locator('[data-profile-character=\"buji\"]').click();await page.locator('#profile-form [type=\"submit\"]').click();await page.locator('.profile-modal').waitFor({state:'detached'})} }
async function nav(page,id) {
  if(id==='home'){await page.locator('.brand[data-page="home"]').first().click();return}
  const link=page.locator(`.nav-link[data-page="${id}"]`);
  if (!(await link.isVisible())) { const toggle=page.locator('#menu-toggle'); if (await toggle.isVisible()) await toggle.click(); }
  await link.click();
  const leave=page.locator('.quiz-leave-modal [data-action="quiz-leave-confirm"]');
  if(await leave.count())await leave.click();
}
async function answerCurrent(page, answerCorrect=true) {
  for (let i=0;i<10;i++) {
    const q=await page.evaluate(()=>quiz.questions[quiz.index]);
    const answer=answerCorrect?q.answer:0;
    await page.locator(`[data-quiz-answer="${answer}"]`).click();
    if(i<9) await page.locator('[data-action="quiz-next"]').click();
  }
  await page.locator('[data-action="quiz-submit"]').click();
}
(async()=>{
  const url=await startServer();
  const launchOptions={headless:true,args:process.platform==='linux'?['--no-sandbox']:[]};
  if(process.env.CHROMIUM_PATH)launchOptions.executablePath=process.env.CHROMIUM_PATH;
  else if(fs.existsSync('/usr/bin/chromium'))launchOptions.executablePath='/usr/bin/chromium';
  const browser=await chromium.launch(launchOptions);
  const pageErrors=[];
  try {
    const welcome=await newContext(browser),welcomePage=await welcome.newPage();welcomePage.setDefaultTimeout(5000);welcomePage.on('pageerror',e=>pageErrors.push(e.message));await goto(welcomePage,url,{onboard:false});
    const welcomeDialog=welcomePage.locator('.profile-modal[role=\"dialog\"][aria-modal=\"true\"]');
    ok(await welcomeDialog.count()===1&&await welcomePage.locator('#profile-name[required]').count()===1&&await welcomePage.locator('[data-profile-character]').count()===4,'pengunjung baru mendapat popup wajib untuk nama panggilan dan empat pilihan karakter');
    await welcomePage.keyboard.press('Escape');await welcomePage.locator('.profile-modal-backdrop').click({position:{x:3,y:3}});
    ok(await welcomeDialog.count()===1,'popup onboarding tidak tertutup tanpa profil valid');
    await welcomePage.locator('#profile-name').fill('Dira');await welcomePage.locator('[data-profile-character=\"bintang\"]').click();
    ok(await welcomePage.locator('[data-profile-character=\"bintang\"]').getAttribute('aria-checked')==='true','pilihan karakter mengumumkan status terpilih');
    await welcomePage.locator('#profile-form [type=\"submit\"]').click();await welcomeDialog.waitFor({state:'detached'});
    ok(await welcomePage.evaluate(()=>state.name==='Dira'&&state.character==='bintang'&&state.profileSaved&&JSON.parse(localStorage.getItem(KEY)).character==='bintang'),'nama dan karakter tersimpan pada profil lokal');
    await welcomePage.reload();await welcomePage.locator('.hero').waitFor();
    ok(await welcomePage.locator('.profile-modal').count()===0,'popup tidak muncul lagi setelah profil valid disimpan');
    await welcomePage.evaluate(()=>{state.levelProgress[1]=['addition','subtraction'];state.preScores={total:7,addition:{correct:2,total:2},subtraction:{correct:1,total:2},multiplication:{correct:1,total:2},division:{correct:1,total:2},fraction:{correct:2,total:2}};save()});
    await welcomePage.locator('[data-page=\"profile\"]').first().click();await welcomePage.locator('[data-action=\"edit-profile\"]').click();
    ok(await welcomePage.locator('.profile-modal').count()===1,'anak dapat membuka kembali popup untuk mengedit profil');
    await welcomePage.locator('#profile-name').fill('Dira Baru');await welcomePage.locator('[data-profile-character=\"kupu\"]').click();await welcomePage.locator('#profile-form [type=\"submit\"]').click();
    ok(await welcomePage.evaluate(()=>state.name==='Dira Baru'&&state.character==='kupu'&&state.levelProgress[1].length===2&&state.preScores.total===7),'edit profil mempertahankan progres dan nilai tes tersimpan');await welcome.close();

    const legacyProfile=await newContext(browser),legacyProfilePage=await legacyProfile.newPage();legacyProfilePage.setDefaultTimeout(5000);legacyProfilePage.on('pageerror',e=>pageErrors.push(e.message));
    await legacyProfilePage.addInitScript(()=>{const ids=['addition','subtraction','multiplication','division','fraction'];localStorage.setItem('congklatika.v1',JSON.stringify({page:'home',name:'Pemain Lama',activeLevel:3,levelProgress:{1:ids,2:ids,3:ids},preScores:{total:7,addition:100,subtraction:50,multiplication:50,division:50,fraction:100},postScores:{total:6,addition:50,subtraction:100,multiplication:50,division:50,fraction:50}}))});await goto(legacyProfilePage,url);
    const migrated=await legacyProfilePage.evaluate(()=>({name:state.name,active:state.activeLevel,levels:[1,2,3].map(l=>state.levelProgress[l].length),unlocks:state.legacyUnlockedLevels.slice().sort(),pre:state.preScores.total,post:state.postScores.total,pct:totalProgress()}));
    ok(migrated.name==='Pemain Lama'&&migrated.active===3&&migrated.levels.join('|')==='5|5|5'&&migrated.unlocks.join('|')==='2|3'&&migrated.pre===7&&migrated.post===6&&migrated.pct===83,'profil dan progres lama tetap terbaca; level lama tetap terbuka dan skor tes tidak berubah');
    await legacyProfilePage.locator('[data-page=\"profile\"]').first().click();await legacyProfilePage.locator('[data-action=\"edit-profile\"]').click();await legacyProfilePage.locator('[data-profile-character=\"tunas\"]').click();await legacyProfilePage.locator('#profile-form [type=\"submit\"]').click();
    ok(await legacyProfilePage.evaluate(()=>state.activeLevel===3&&state.levelProgress[1].length===5&&state.preScores.total===7&&state.postScores.total===6&&state.character==='tunas'),'mengedit profil lama tidak mereset progres, level aktif, atau nilai tes');await legacyProfile.close();

    const c=await newContext(browser),page=await c.newPage(); page.setDefaultTimeout(5000); page.on('pageerror',e=>pageErrors.push(e.message)); await goto(page,url);
    await nav(page,'learn'); await page.locator('[data-topic="division"]').click();
    ok(await page.evaluate(()=>document.activeElement.matches('h1[data-focus-key="page-heading"]')), 'fokus keyboard berpindah ke judul materi setelah kartu merender ulang');
    ok((await page.locator('.visual-equation').innerText()).includes('÷ 3 lubang'), 'visual pembagian dimulai dengan pembagian bulat');
    await page.locator('[data-visual-key="groups"][data-step="-1"]').click();
    ok((await page.locator('.visual-equation').innerText()).includes('÷ 2 lubang') && await page.locator('[data-visual-key="groups"][data-step="-1"]').isDisabled() && await page.evaluate(()=>document.activeElement.dataset.focusKey==='visual-division-groups-plus'), 'stepper berhenti pada batas bawah tanpa berputar');
    await page.locator('[data-visual-key="groups"][data-step="1"]').click();
    ok((await page.locator('.visual-equation').innerText()).includes('÷ 3 lubang'), 'stepper kembali satu langkah secara teratur');
    await page.locator('[data-visual-key="groups"][data-step="1"]').click(); await page.locator('[data-visual-key="groups"][data-step="1"]').click();
    ok((await page.locator('.visual-equation').innerText()).includes('÷ 6 lubang') && await page.locator('[data-visual-key="groups"][data-step="1"]').isDisabled(), 'stepper berhenti pada batas atas tanpa menghasilkan pembagian pecahan');
    const visualSpeech=await page.evaluate(()=>currentNarrationText());
    ok(visualSpeech.includes('12 biji dibagikan ke 6 lubang')&&visualSpeech.includes('Tantangan aktif'), 'narasi memakai isi latihan visual dan soal mini yang aktif');
    await page.evaluate(()=>{
      window.__spokenText='';window.__speechCancelled=false;window.__musicGain=0;
      Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:function(text){this.text=text}});
      Object.defineProperty(window.speechSynthesis,'getVoices',{configurable:true,value:()=>[{lang:'id-ID'}]});
      Object.defineProperty(window.speechSynthesis,'cancel',{configurable:true,value:()=>{window.__speechCancelled=true}});
      Object.defineProperty(window.speechSynthesis,'speak',{configurable:true,value:()=>{throw new Error('synthetic speech failure')}});
      musicMaster={gain:{setTargetAtTime:value=>{window.__musicGain=value}}};music.ctx={currentTime:0};
    });
    await page.locator('[data-action="read-current"]').click();
    await page.locator('#toast-region').getByText(/Pembacaan suara gagal/).waitFor();
    ok(await page.evaluate(()=>!narrationActive), 'kegagalan TTS ditangani tanpa menghentikan materi');
    await page.evaluate(()=>{Object.defineProperty(window.speechSynthesis,'speak',{configurable:true,value:utterance=>{window.__spokenText=utterance.text}})});
    await page.locator('[data-action="read-current"]').click(); await page.waitForFunction(()=>narrationActive);
    const spokenText=await page.evaluate(()=>window.__spokenText);
    ok(spokenText.includes('12 biji dibagikan ke 6 lubang')&&await page.evaluate(()=>window.__musicGain===.18), 'Buji membacakan visual aktif dan meredupkan musik');
    await page.locator('[data-action="read-current"]').click(); await page.waitForFunction(()=>!narrationActive);
    ok(await page.evaluate(()=>window.__speechCancelled&&window.__musicGain===.78), 'tombol berhenti membatalkan ucapan dan memulihkan volume musik');
    await page.locator('[data-action="read-current"]').click(); await page.waitForFunction(()=>narrationActive); await nav(page,'history');
    await page.waitForFunction(()=>state.page==='history'&&!narrationActive);
    ok(await page.evaluate(()=>window.__speechCancelled), 'navigasi membatalkan narasi yang sedang dibaca');
    await nav(page,'learn');

    await page.evaluate(()=>{state.levelProgress[1]=topics.map(t=>t.id);state.levelProgress[2]=topics.map(t=>t.id);state.activeLevel=2;state.activeTopic='addition';save();render()});
    ok((await page.locator('.worked-example').innerText()).includes('puluhan dan satuan'), 'contoh level 2 memecah penjumlahan menjadi puluhan dan satuan');
     await page.evaluate(()=>{state.activeLevel=3;state.activeTopic='subtraction';render()});
     ok((await page.locator('.worked-example').innerText()).includes('kurangi bertahap'), 'contoh level 3 menjelaskan pengurangan bertahap');
     await page.evaluate(()=>{state.activeTopic='fraction';render()});
     ok((await page.locator('.worked-example').innerText()).includes('samakan ukuran bagian'), 'contoh level 3 menyamakan ukuran bagian pecahan');

    const lessonIllustrations=[
      {topic:'addition',level:3,operation:'56 biji + 37 biji'},
      {topic:'subtraction',level:2,operation:'42 biji − 17 biji'},
      {topic:'multiplication',level:3,operation:'12 lubang × 8 biji'},
      {topic:'division',level:3,operation:'96 biji ÷ 12 lubang'},
      {topic:'fraction',level:3,operation:'1/2 + 1/4'},
    ];
    for(const item of lessonIllustrations){
      await page.evaluate(({topic,level})=>{state.activeLevel=level;state.activeTopic=topic;render()},item);
      ok(await page.locator(`[data-question-illustration="${item.topic}-${item.level}"]`).count()===1&&(await page.locator('.question-operation').innerText()).includes(item.operation), `desktop: ilustrasi ${item.topic} mengikuti tantangan level ${item.level}`);
    }
    const preservedQuestions=await page.evaluate(()=>['pre','post'].map(kind=>{const questions=createQuiz(kind);const categories=questions.reduce((counts,q)=>(counts[q.cat]=(counts[q.cat]||0)+1,counts),{});return {length:questions.length,categories}}));
    ok(preservedQuestions.every(result=>result.length===10&&['addition','subtraction','multiplication','division','fraction'].every(id=>result.categories[id]===2)), 'ilustrasi tidak mengubah jumlah tes: 10 soal dan dua soal per kategori');

     const slots=await page.evaluate(()=>{const q=createQuiz('pre');return {n:q.length,cats:q.reduce((a,x)=>(a[x.cat]=(a[x.cat]||0)+1,a),{}),positions:q.reduce((a,x)=>(a[x.answer]=(a[x.answer]||0)+1,a),{})}});
    ok(slots.n===10 && Object.values(slots.cats).every(n=>n===2), 'setiap percobaan tes memilih dua soal per kategori');
    ok(Object.keys(slots.positions).length===3 && Object.values(slots.positions).every(n=>n>=2&&n<=4), 'kunci jawaban tersebar pada tiga posisi dengan sebaran berimbang');

    await page.evaluate(()=>{state.levelProgress={1:[],2:[],3:[]};state.activeLevel=1;state.activeTopic=null;save();render()});
    await nav(page,'learn'); await page.locator('[data-action="start-pretest"]').click();
    ok(await page.evaluate(()=>currentNarrationText().includes(quiz.questions[quiz.index].q)), 'narasi tes membaca pertanyaan dan pilihan yang sedang aktif');
    const firstRadio=page.locator('[data-quiz-answer]').first(); await firstRadio.focus(); await firstRadio.press('ArrowRight');
    ok(await page.evaluate(()=>document.activeElement.getAttribute('role')==='radio'&&document.activeElement.getAttribute('aria-checked')==='true'), 'fokus keyboard dan status radio bertahan setelah render jawaban');
    await page.locator('[data-quiz-answer]').first().click();
    const savedQuestion=await page.locator('.quiz-card h2').innerText();
    await page.reload();
    ok(await page.locator('.quiz-card h2').innerText()===savedQuestion && await page.evaluate(()=>state.quizDraft?.answers.some(x=>x!==null)), 'draf jawaban dan posisi soal pulih setelah refresh');
    let nativeConfirm=false;page.on('dialog',async d=>{nativeConfirm=true;await d.dismiss()});
    await page.goBack();const leaveDialog=page.locator('.quiz-leave-modal[role="dialog"][aria-modal="true"]');await leaveDialog.waitFor();
    ok(await leaveDialog.getByRole('heading',{name:'Tes belum selesai'}).count()===1&&await leaveDialog.getByRole('button',{name:'Lanjut tes'}).count()===1&&await leaveDialog.getByRole('button',{name:'Tinggalkan tes'}).count()===1&&!nativeConfirm,'browser Back membuka dialog CongklaTika dengan dua pilihan, bukan confirm bawaan browser');
    await leaveDialog.getByRole('button',{name:'Lanjut tes'}).focus();await page.keyboard.press('Tab');
    ok(await page.evaluate(()=>document.activeElement.textContent.includes('Tinggalkan tes')),'fokus keyboard bergerak ke pilihan dialog berikutnya');
    await page.keyboard.press('Tab');ok(await page.evaluate(()=>document.activeElement.textContent.includes('Lanjut tes')),'fokus keyboard dialog berputar kembali tanpa keluar dari popup');
    await leaveDialog.getByRole('button',{name:'Lanjut tes'}).click();
    ok(await page.evaluate(()=>state.page==='quiz'&&state.quizDraft?.kind==='pre'),'tombol Lanjut tes menutup dialog dan mempertahankan kuis aktif');
    await page.locator('.nav-link[data-page="learn"]').click();await leaveDialog.waitFor();
    await leaveDialog.getByRole('button',{name:'Tinggalkan tes'}).click();await page.waitForFunction(()=>state.page==='learn');
    ok(await page.evaluate(()=>state.page==='learn'&&state.quizDraft?.kind==='pre'&&state.quizDraft.answers.some(x=>x!==null)),'Tinggalkan tes membuka materi tetapi mempertahankan draf jawaban tersimpan');
    await page.locator('[data-action="start-pretest"]').click();await answerCurrent(page,true);
    ok(await page.evaluate(()=>state.preScores.total===10&&state.preAttempts.length===1), 'hasil pretest disimpan sebagai percobaan pertama');
    await page.locator('[data-action="result-continue"]').click();await nav(page,'report');
    await page.locator('[data-action="start-pretest"]').click();await page.locator('[data-quiz-answer="1"]').click();await nav(page,'learn');
    await page.evaluate(()=>{state.levelProgress={1:topics.map(t=>t.id),2:topics.map(t=>t.id),3:topics.map(t=>t.id)};state.activeLevel=3;save();render()});
    await page.locator('[data-action="start-posttest"]').click();
    const firstPreId=await page.evaluate(()=>state.preAttempts[0].id);
    ok(await page.evaluate(()=>quiz.kind==='post'&&state.quizDrafts.pre?.kind==='pre'&&state.quizDrafts.post?.kind==='post'&&quiz.baselineId===state.preAttempts[0].id), 'memulai posttest tidak menimpa draf pretest dan mengikat baseline saat tes dimulai');
    await nav(page,'learn');
    ok(await page.locator('[data-action="start-pretest"]').innerText().then(x=>x.includes('Lanjutkan draf pretest'))&&await page.locator('[data-action="start-posttest"]').innerText().then(x=>x.includes('Lanjutkan draf posttest')), 'kedua draf tetap tersedia untuk dilanjutkan secara terpisah');
    await page.reload();await page.waitForFunction(()=>state.page==='quiz'&&state.quizDrafts.pre?.kind==='pre'&&state.quizDrafts.post?.kind==='post');
    ok(await page.evaluate(()=>quiz.kind==='post'&&quiz.baselineId===state.preAttempts[0].id&&state.quizDrafts.pre?.kind==='pre'), 'refresh memulihkan tes aktif sekaligus kedua draf dan baseline');
    await nav(page,'learn');await page.locator('[data-action="start-pretest"]').click();
    ok(await page.evaluate(()=>quiz.kind==='pre'&&quiz.answers.some(x=>x!==null)&&state.quizDrafts.post?.kind==='post'), 'beralih kembali memulihkan jawaban pretest tanpa menghapus draf posttest');
    await answerCurrent(page,false);
    ok(await page.evaluate(()=>state.preAttempts.length===2&&!state.quizDrafts.pre&&state.quizDrafts.post?.kind==='post'), 'retake pretest selesai sebagai percobaan kedua sementara draf posttest tetap ada');
    await page.locator('[data-action="result-continue"]').click();
    ok(await page.locator('[data-action="start-posttest"]').innerText().then(x=>x.includes('Lanjutkan draf posttest')), 'draf posttest tetap dapat dilanjutkan setelah pretest selesai');
    await page.locator('[data-action="start-posttest"]').click();
    ok(await page.evaluate(()=>quiz.kind==='post'&&quiz.baselineId===state.preAttempts[0].id&&state.quizDrafts.post?.kind==='post'), 'posttest melanjutkan draf dengan baseline awal yang tidak berubah');
    await answerCurrent(page,true);
    const postBefore=await page.evaluate(()=>({score:state.postScores.total,count:state.postAttempts.length,baseline:state.postAttempts.at(-1).baselineId}));
    ok(postBefore.score===10&&postBefore.count===1&&postBefore.baseline===firstPreId, 'posttest selesai dan tetap berpasangan dengan pretest yang mendahuluinya');
    await page.locator('[data-action="result-continue"]').click();await nav(page,'report');
    await page.locator('[data-action="start-pretest"]').click();await answerCurrent(page,false);
    const afterRetake=await page.evaluate(()=>({pre:state.preAttempts.length,post:state.postScores.total,posts:state.postAttempts.length,baseline:state.postAttempts.at(-1).baselineId,firstPre:state.preAttempts[0].id}));
    ok(afterRetake.pre===3&&afterRetake.post===postBefore.score&&afterRetake.posts===postBefore.count, 'retake pretest menambah percobaan tanpa menghapus posttest');
    ok(afterRetake.baseline===afterRetake.firstPre, 'posttest mempertahankan tautan baseline semula sesudah retake');
    await page.locator('[data-action="result-continue"]').click();await nav(page,'report');
    const reportTable=await page.locator('.score-table').innerText();
    ok(reportTable.toLowerCase().includes('pretest pasangan posttest')&&reportTable.includes('/2')&&!reportTable.includes('%')&&await page.locator('.source-note').filter({hasText:/Pretest yang lebih baru tetap disimpan/}).count()===1, 'laporan menampilkan baseline berpasangan, jumlah benar, dan retake lebih baru secara terpisah');

     await page.evaluate(()=>{setPage('play');state.game=initialGame('two');state.game.pits[0]=13;state.game.pits[1]=1;render();save()});
     ok(await page.locator('[data-pit="0"] .seed-count').innerText()==='13' && await page.locator('[data-pit="0"] .seed-overflow').innerText()==='+1' && (await page.locator('[data-pit="0"] .seed').count())===12, 'lubang 13 biji menunjukkan 12 butir plus sisa +1 secara tepat');
     ok((await page.locator('[data-pit="0"]').getAttribute('aria-label')).includes('13 biji'), 'pembaca layar mendapat jumlah lubang yang sebenarnya');
    const desktopStoreCenters=await page.evaluate(()=>[...document.querySelectorAll('.store-pit')].map(store=>{const count=store.querySelector('.store-count').getBoundingClientRect(),label=store.querySelector('small').getBoundingClientRect();return Math.abs((count.left+count.width/2)-(label.left+label.width/2))}));
    ok(desktopStoreCenters.every(delta=>delta<2), 'desktop: label nama pemain tepat di tengah angka lumbung');
     await page.locator('[data-action="new-game"]').click();
    await page.locator('[data-pit="0"]').click(); await page.waitForFunction(()=>state.game?.animating===true);
    await nav(page,'home');
    const persisted=await page.evaluate(()=>({sum:state.game.pits.reduce((a,b)=>a+b,0),animating:state.game.animating,stored:JSON.parse(localStorage.getItem('congklatika.v1')).game.pits.reduce((a,b)=>a+b,0)}));
    ok(persisted.sum===98&&!persisted.animating&&persisted.stored===98, 'navigasi saat tabur membatalkan animasi tanpa kehilangan biji');
    await nav(page,'play'); await page.reload();
    ok(await page.evaluate(()=>state.game.pits.reduce((a,b)=>a+b,0)===98&&!state.game.animating), 'refresh memulihkan papan valid dengan jumlah 98');
    await c.close();

    const audio=await newContext(browser,{reducedMotion:'reduce'}),audioPage=await audio.newPage();audioPage.setDefaultTimeout(6000);audioPage.on('pageerror',e=>pageErrors.push(e.message));await goto(audioPage,url);await nav(audioPage,'play');
    await audioPage.evaluate(()=>{window.__toneFrequencies=[];effects.on=true;effects.ctx={currentTime:0,destination:{},resume:()=>Promise.resolve(),createOscillator:()=>({frequency:{setValueAtTime:value=>window.__toneFrequencies.push(value)},connect(){},start(){},stop(){},disconnect(){}}),createGain:()=>({gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}})}});
    await audioPage.locator('[data-play-mode="learning"]').click();await audioPage.locator('[data-study-topic="addition"]').click();await audioPage.locator('[data-study-pit="0"]').click();
    await audioPage.locator('[data-study-answer="0"]').click();
    const wrongFeedback=await audioPage.evaluate(()=>({frequencies:window.__toneFrequencies.slice(),animation:getComputedStyle(document.querySelector('.study-question-modal')).animationName,className:document.querySelector('.study-question-modal').className}));
    ok(wrongFeedback.frequencies.includes(330)&&wrongFeedback.frequencies.includes(294)&&wrongFeedback.className.includes('answer-wrong')&&wrongFeedback.animation==='none','jawaban salah memakai nada turun dan animasi lembut tunduk pada reduced-motion');
    await audioPage.locator('.study-question-modal').waitFor({state:'detached'});await audioPage.locator('[data-study-pit="1"]').click();await audioPage.locator('[data-study-answer="1"]').click();
    const rightFeedback=await audioPage.evaluate(()=>({frequencies:window.__toneFrequencies.slice(),className:document.querySelector('.study-question-modal')?.className||''}));
    ok(rightFeedback.frequencies.includes(660)&&rightFeedback.frequencies.includes(880)&&rightFeedback.className.includes('answer-correct'),'jawaban benar memakai pasangan nada naik yang berbeda dari jawaban salah');
    await audioPage.locator('.study-question-modal').waitFor({state:'detached'});await audioPage.locator('[data-sfx-toggle]').click();const mutedBefore=await audioPage.evaluate(()=>window.__toneFrequencies.length);await audioPage.locator('[data-study-pit="2"]').click();await audioPage.locator('[data-study-answer="1"]').click();await audioPage.locator('.study-question-modal').waitFor({state:'detached'});
    ok(await audioPage.evaluate(n=>!effects.on&&window.__toneFrequencies.length===n,mutedBefore),'tombol efek suara membisukan feedback jawaban');await audio.close();

    const outcomes=await newContext(browser,{reducedMotion:'reduce'}),outcomePage=await outcomes.newPage();outcomePage.setDefaultTimeout(7000);outcomePage.on('pageerror',e=>pageErrors.push(e.message));await goto(outcomePage,url);await nav(outcomePage,'play');
    await outcomePage.evaluate(()=>{animateSeed=async(from,to)=>{state.game.pits[to]++;syncPit(to);return true};window.__toneFrequencies=[];effects.on=true;effects.ctx={currentTime:0,destination:{},resume:()=>Promise.resolve(),createOscillator:()=>({frequency:{setValueAtTime:value=>window.__toneFrequencies.push(value)},connect(){},start(){},stop(){},disconnect(){}}),createGain:()=>({gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}})};const pits=Array(16).fill(0);pits[0]=90;pits[2]=1;pits[10]=3;pits[11]=4;state.game={...initialGame('two'),pits,turn:0,undoStack:[]};render();save()});
    await outcomePage.locator('[data-pit="2"]').click();await outcomePage.waitForFunction(()=>state.game&&!state.game.animating&&state.game.pits[7]===5);await outcomePage.locator('#toast-region').getByText(/Tangkap! 5 biji/).waitFor();
    const captured=await outcomePage.evaluate(()=>({sum:state.game.pits.reduce((a,b)=>a+b,0),opposite:state.game.pits[11],own:state.game.pits[3],store:state.game.pits[7],className:document.querySelector('[data-store="7"]')?.className,animation:getComputedStyle(document.querySelector('[data-store="7"]')).animationName,tones:window.__toneFrequencies.slice()}));
    ok(captured.sum===98&&captured.opposite===0&&captured.own===0&&captured.store===5&&captured.className.includes('capture-pop')&&captured.animation==='none'&&captured.tones.includes(740)&&captured.tones.includes(990),'capture memakai outcome aktual, mempertahankan 98 biji, memberi animasi/bunyi lembut, dan menghormati reduced-motion');
    await outcomePage.evaluate(()=>{const pits=Array(16).fill(0);pits[0]=92;pits[1]=1;pits[2]=2;pits[8]=3;state.game={...initialGame('two'),pits,turn:0,undoStack:[]};render();save()});await outcomePage.locator('[data-pit="1"]').click();await outcomePage.waitForFunction(()=>state.game&&!state.game.animating&&state.game.turn===1);await outcomePage.locator('#toast-region').getByText(/Kombo! Biji berantai 1 kali/).waitFor();
    const combo=await outcomePage.evaluate(()=>({sum:state.game.pits.reduce((a,b)=>a+b,0),message:state.game.message,classes:document.querySelector('.board-shell')?.className,animation:getComputedStyle(document.querySelector('.board-shell')).animationName,tones:window.__toneFrequencies.slice()}));
    ok(combo.sum===98&&combo.message.includes('Biji disebar lanjut 1 kali')&&combo.classes.includes('combo-glow')&&combo.animation==='none'&&combo.tones.includes(520)&&combo.tones.includes(700)&&combo.tones.includes(880),'relay/kombo dikenali dari langkah nyata, dinotifikasi, dianimasikan, berbunyi, dan tetap konservatif');
    await outcomePage.evaluate(()=>{const pits=Array(16).fill(0);pits[0]=1;pits[6]=90;pits[8]=7;state.game={...initialGame('ai'),pits,turn:0,undoStack:[]};render();save()});await outcomePage.locator('[data-pit="0"]').click();await outcomePage.locator('#toast-region').getByText(/Giliran Buji!/).waitFor();await outcomePage.locator('#toast-region').getByText(/Buji mengambil \d+ biji dan mulai menabur/).waitFor({timeout:7000});await outcomePage.waitForFunction(()=>state.game&&!state.game.animating,{},{timeout:7000});
    ok(await outcomePage.evaluate(()=>state.game.pits.reduce((a,b)=>a+b,0)===98),'giliran Buji menampilkan pemberitahuan saat mulai memilih dan mengambil biji tanpa mengubah total papan');await outcomes.close();

    const skip=await newContext(browser),skipPage=await skip.newPage();skipPage.setDefaultTimeout(5000);skipPage.on('pageerror',e=>pageErrors.push(e.message));await goto(skipPage,url);
    await skipPage.evaluate(()=>{state.levelProgress={1:topics.map(t=>t.id),2:topics.map(t=>t.id),3:topics.map(t=>t.id)};state.activeLevel=3;state.page='report';save();render()});
    ok((await skipPage.locator('.report-materials').innerText()).includes('Pretest awal dilewati') && (await skipPage.locator('.level-report li').count())===3, 'laporan tanpa pretest tetap menampilkan progres materi per level');
    await skipPage.close();

    for(const width of [390,375,360,320]){
      const mc=await newContext(browser,{viewport:{width,height:800},isMobile:true,hasTouch:true}),mp=await mc.newPage();mp.setDefaultTimeout(5000);mp.on('pageerror',e=>pageErrors.push(e.message));await goto(mp,url);
      const before=await mp.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,header:[...document.querySelectorAll('.site-header>* , .header-actions>*')].filter(e=>getComputedStyle(e).display!=='none').map(e=>{const r=e.getBoundingClientRect();return [r.left,r.right]} )}));
      ok(before.overflow===0&&before.header.every(([l,r])=>l>=-1&&r<=width+1), `${width}px: header muat dan tidak ada overflow horizontal`);
      const missionLayout=await mp.evaluate(()=>{const n=document.querySelector('.mission-note'),h=document.querySelector('.hero .display'),b=[...document.querySelectorAll('.hero .hero-actions button')],nr=n.getBoundingClientRect(),hr=h.getBoundingClientRect();return {present:!!n,legacy:!!document.querySelector('.seed-bubble'),touchesTitle:!(nr.bottom<hr.top||nr.top>hr.bottom),touchesButton:b.some(x=>{const r=x.getBoundingClientRect();return !(nr.right<r.left||nr.left>r.right||nr.bottom<r.top||nr.top>r.bottom)})}});
      ok(missionLayout.present&&!missionLayout.legacy&&!missionLayout.touchesTitle&&!missionLayout.touchesButton, `${width}px: pesan misi tetap terbaca tanpa menutupi judul atau tombol`);
       await mp.locator('#menu-toggle').click(); await mp.locator('.nav-link[data-page="play"]').click();
       const layout=await mp.evaluate(()=>{const r=document.querySelector('.board-shell').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth-innerWidth,left:r.left,right:r.right,pit:document.querySelector('[data-pit]').getBoundingClientRect().width}});
       ok(layout.overflow===0&&layout.left>=-1&&layout.right<=width+1&&layout.pit>=31, `${width}px: papan dan target lubang tetap terlihat serta dapat disentuh`);
      if(width===390){
        const centers=await mp.evaluate(()=>[...document.querySelectorAll('.store-pit')].map(store=>{const count=store.querySelector('.store-count').getBoundingClientRect(),label=store.querySelector('small').getBoundingClientRect();return Math.abs((count.left+count.width/2)-(label.left+label.width/2))}));
        ok(centers.every(delta=>delta<2), '390px: label Buji/Kamu tepat di tengah angka lumbung');
        const lessonLayouts=await mp.evaluate(topics=>topics.map(topic=>{state.page='learn';state.activeLevel=3;state.activeTopic=topic;render();const item=document.querySelector('.question-illustration'),rect=item.getBoundingClientRect();return {topic:item?.dataset.questionIllustration,inside:rect.left>=-1&&rect.right<=innerWidth+1,overflow:document.documentElement.scrollWidth-innerWidth}}),['addition','multiplication','division','fraction']);
        ok(lessonLayouts.every(item=>item.topic&&item.inside&&item.overflow===0), '390px: ilustrasi tambah, kali, bagi, pecahan muat tanpa overflow');
      }
       await mc.close();
    }

    const broken=await newContext(browser),brokenPage=await broken.newPage();brokenPage.setDefaultTimeout(5000);brokenPage.on('pageerror',e=>pageErrors.push(e.message));await brokenPage.addInitScript(()=>localStorage.setItem('congklatika.v1','{broken'));await goto(brokenPage,url);
    ok(await brokenPage.locator('.hero').count()===1&&await brokenPage.getByText(/Data sebelumnya rusak/).count()===1, 'data JSON rusak pulih ke aplikasi yang dapat dipakai dengan pemberitahuan');await broken.close();

    const quota=await newContext(browser),quotaPage=await quota.newPage();quotaPage.setDefaultTimeout(5000);quotaPage.on('pageerror',e=>pageErrors.push(e.message));await quotaPage.addInitScript(()=>Object.defineProperty(Storage.prototype,'setItem',{value(){throw new DOMException('quota','QuotaExceededError')}}));await goto(quotaPage,url);await nav(quotaPage,'learn');
    ok(await quotaPage.locator('.topic-grid').count()===1&&await quotaPage.getByText(/Penyimpanan browser tidak tersedia/).count()===1, 'kegagalan/kuota localStorage menampilkan peringatan tanpa menghentikan belajar');await quota.close();

    const profile=await newContext(browser,{acceptDownloads:true}),profilePage=await profile.newPage();profilePage.setDefaultTimeout(5000);profilePage.on('pageerror',e=>pageErrors.push(e.message));await goto(profilePage,url,{onboard:false});
    await profilePage.locator('#profile-name').fill('Ayu');await profilePage.locator('[data-profile-character=\"buji\"]').click();await profilePage.locator('#profile-form [type=\"submit\"]').click();
    await profilePage.locator('[data-page=\"profile\"]').first().click();
    const [download]=await Promise.all([profilePage.waitForEvent('download'),profilePage.locator('[data-action=\"export-data\"]').click()]);
    ok(download.suggestedFilename()==='congklatika-data.json', 'profil menyediakan ekspor salinan data lokal');
    let resetConfirmed=false;profilePage.on('dialog',async d=>{resetConfirmed=d.type()==='confirm';await d.accept()});
    await profilePage.locator('[data-action=\"reset-data\"]').click();await profilePage.waitForFunction(()=>state.page==='home');
    ok(resetConfirmed&&await profilePage.evaluate(()=>state.name===''&&totalProgress()===0&&state.game===null)&&await profilePage.locator('.profile-modal').count()===1, 'reset menghapus data setelah konfirmasi lalu meminta profil baru');await profile.close();

    const late=await newContext(browser),latePage=await late.newPage();latePage.setDefaultTimeout(5000);latePage.on('pageerror',e=>pageErrors.push(e.message));await goto(latePage,url);
    await latePage.evaluate(()=>{state.levelProgress={1:topics.map(t=>t.id),2:topics.map(t=>t.id),3:topics.map(t=>t.id)};state.activeLevel=3;save();render()});await nav(latePage,'learn');
    await latePage.locator('[data-action="start-posttest"]').click();await answerCurrent(latePage,true);await latePage.locator('[data-action="result-continue"]').click();
    await latePage.evaluate(()=>{const scores={total:0};topics.forEach(t=>scores[t.id]={correct:0,total:2});state.preScores=scores;state.preAttempts.push({id:'late-pre',kind:'pre',at:new Date().toISOString(),scores,questions:[],answers:[],baselineId:null});save();setPage('report')});await latePage.reload();
    const lateTable=(await latePage.locator('.score-table').innerText()).toLowerCase();
    ok(lateTable.includes('tanpa pasangan')&&!lateTable.includes('perubahan')&&await latePage.locator('.source-note').filter({hasText:/tidak memiliki pretest baseline/}).count()===1, 'posttest tanpa pretest terdahulu tetap dipisah dari pretest yang dikerjakan belakangan');await late.close();

    const legacy=await newContext(browser),legacyPage=await legacy.newPage();legacyPage.setDefaultTimeout(5000);legacyPage.on('pageerror',e=>pageErrors.push(e.message));await goto(legacyPage,url);
    await legacyPage.evaluate(()=>{state.preScores={total:7,addition:100,subtraction:50,multiplication:100,division:50,fraction:50};state.postScores={total:6,addition:50,subtraction:100,multiplication:100,division:0,fraction:50};state.preAttempts=[];state.postAttempts=[];state.quizDraft=null;state.page='report';save();const old=JSON.parse(localStorage.getItem(KEY));delete old.preAttempts;delete old.postAttempts;delete old.quizDraft;delete old.quizDrafts;localStorage.setItem(KEY,JSON.stringify(old))});await legacyPage.reload();
    ok(await legacyPage.evaluate(()=>state.preAttempts.length===1&&state.postAttempts.length===1&&state.postAttempts[0].baselineId===state.preAttempts[0].id)&&(await legacyPage.locator('.score-table').innerText()).toLowerCase().includes('pretest pasangan posttest'), 'skor lama tetap dipasangkan secara aman saat dimigrasikan ke riwayat percobaan');await legacy.close();

    ok(pageErrors.length===0, `tidak ada JavaScript page error (${pageErrors.join('; ')})`);
    console.log(`PASS congklatika browser regression (${checks} checks)`);
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(`FAIL browser regression: ${error.stack||error}`);process.exitCode=1;server.close();});
