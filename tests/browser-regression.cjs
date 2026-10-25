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
async function goto(page,url) { await page.goto(url,{waitUntil:'domcontentloaded'}); await page.locator('#app').waitFor(); }
async function nav(page,id) {
  if(id==='home'){await page.locator('.brand[data-page="home"]').first().click();return}
  const link=page.locator(`.nav-link[data-page="${id}"]`);
  if (!(await link.isVisible())) { const toggle=page.locator('#menu-toggle'); if (await toggle.isVisible()) await toggle.click(); }
  await link.click();
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
    let backPrompt=false; page.on('dialog',async d=>{if(d.type()==='confirm'&&d.message().includes('Draf'))backPrompt=true;await d.accept()});
    await page.goBack(); await page.waitForFunction(()=>state.page==='learn');
    ok(backPrompt && await page.evaluate(()=>state.page==='learn'&&state.quizDraft?.kind==='pre'), 'browser Back memperingatkan, lalu mempertahankan draf tes');
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
    await page.locator('[data-action="new-game"]').click();
    await page.locator('[data-pit="0"]').click(); await page.waitForFunction(()=>state.game?.animating===true);
    await nav(page,'home');
    const persisted=await page.evaluate(()=>({sum:state.game.pits.reduce((a,b)=>a+b,0),animating:state.game.animating,stored:JSON.parse(localStorage.getItem('congklatika.v1')).game.pits.reduce((a,b)=>a+b,0)}));
    ok(persisted.sum===98&&!persisted.animating&&persisted.stored===98, 'navigasi saat tabur membatalkan animasi tanpa kehilangan biji');
    await nav(page,'play'); await page.reload();
    ok(await page.evaluate(()=>state.game.pits.reduce((a,b)=>a+b,0)===98&&!state.game.animating), 'refresh memulihkan papan valid dengan jumlah 98');
    await c.close();

    const skip=await newContext(browser),skipPage=await skip.newPage();skipPage.setDefaultTimeout(5000);skipPage.on('pageerror',e=>pageErrors.push(e.message));await goto(skipPage,url);
    await skipPage.evaluate(()=>{state.levelProgress={1:topics.map(t=>t.id),2:topics.map(t=>t.id),3:topics.map(t=>t.id)};state.activeLevel=3;state.page='report';save();render()});
    ok((await skipPage.locator('.report-materials').innerText()).includes('Pretest awal dilewati') && (await skipPage.locator('.level-report li').count())===3, 'laporan tanpa pretest tetap menampilkan progres materi per level');
    await skipPage.close();

    for(const width of [390,375,360,320]){
      const mc=await newContext(browser,{viewport:{width,height:800},isMobile:true,hasTouch:true}),mp=await mc.newPage();mp.setDefaultTimeout(5000);mp.on('pageerror',e=>pageErrors.push(e.message));await goto(mp,url);
      const before=await mp.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,header:[...document.querySelectorAll('.site-header>* , .header-actions>*')].filter(e=>getComputedStyle(e).display!=='none').map(e=>{const r=e.getBoundingClientRect();return [r.left,r.right]} )}));
      ok(before.overflow===0&&before.header.every(([l,r])=>l>=-1&&r<=width+1), `${width}px: header muat dan tidak ada overflow horizontal`);
      await mp.locator('#menu-toggle').click(); await mp.locator('.nav-link[data-page="play"]').click();
      const layout=await mp.evaluate(()=>{const r=document.querySelector('.board-shell').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth-innerWidth,left:r.left,right:r.right,pit:document.querySelector('[data-pit]').getBoundingClientRect().width}});
      ok(layout.overflow===0&&layout.left>=-1&&layout.right<=width+1&&layout.pit>=31, `${width}px: papan dan target lubang tetap terlihat serta dapat disentuh`);
      await mc.close();
    }

    const broken=await newContext(browser),brokenPage=await broken.newPage();brokenPage.setDefaultTimeout(5000);brokenPage.on('pageerror',e=>pageErrors.push(e.message));await brokenPage.addInitScript(()=>localStorage.setItem('congklatika.v1','{broken'));await goto(brokenPage,url);
    ok(await brokenPage.locator('.hero').count()===1&&await brokenPage.getByText(/Data sebelumnya rusak/).count()===1, 'data JSON rusak pulih ke aplikasi yang dapat dipakai dengan pemberitahuan');await broken.close();

    const quota=await newContext(browser),quotaPage=await quota.newPage();quotaPage.setDefaultTimeout(5000);quotaPage.on('pageerror',e=>pageErrors.push(e.message));await quotaPage.addInitScript(()=>Object.defineProperty(Storage.prototype,'setItem',{value(){throw new DOMException('quota','QuotaExceededError')}}));await goto(quotaPage,url);await nav(quotaPage,'learn');
    ok(await quotaPage.locator('.topic-grid').count()===1&&await quotaPage.getByText(/Penyimpanan browser tidak tersedia/).count()===1, 'kegagalan/kuota localStorage menampilkan peringatan tanpa menghentikan belajar');await quota.close();

    const profile=await newContext(browser,{acceptDownloads:true}),profilePage=await profile.newPage();profilePage.setDefaultTimeout(5000);profilePage.on('pageerror',e=>pageErrors.push(e.message));await goto(profilePage,url);
    await profilePage.locator('[data-action="login"]').click();
    ok(await profilePage.locator('[data-action="skip-profile"]').count()===1, 'profil baru menjelaskan bahwa nama boleh dilewati');
    await profilePage.locator('[data-action="skip-profile"]').click();
    ok(await profilePage.evaluate(()=>state.page==='home'&&state.name===''&&!state.profileSaved), 'belajar dapat dimulai tanpa membuat profil bernama');
    await profilePage.locator('[data-action="login"]').click();
    const [download]=await Promise.all([profilePage.waitForEvent('download'),profilePage.locator('[data-action="export-data"]').click()]);
    ok(download.suggestedFilename()==='congklatika-data.json', 'profil menyediakan ekspor salinan data lokal');
    let resetConfirmed=false;profilePage.on('dialog',async d=>{resetConfirmed=d.type()==='confirm';await d.accept()});
    await profilePage.locator('[data-action="reset-data"]').click();await profilePage.waitForFunction(()=>state.page==='home');
    ok(resetConfirmed&&await profilePage.evaluate(()=>state.name===''&&totalProgress()===0&&state.game===null), 'reset mengonfirmasi penghapusan profil, progres, dan permainan lokal');await profile.close();

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
