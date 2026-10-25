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
async function goto(page, url) { await page.goto(url, {waitUntil:'domcontentloaded'}); await page.locator('#app').waitFor(); }
async function navClick(page, route) { await page.locator(`[data-bottom-route="${route}"]`).click(); }
(async()=>{
  const url = await startServer();
  const launchOptions = {headless:true,args:process.platform==='linux'?['--no-sandbox']:[]};
  if (process.env.CHROMIUM_PATH) launchOptions.executablePath = process.env.CHROMIUM_PATH;
  else if (fs.existsSync('/usr/bin/chromium')) launchOptions.executablePath = '/usr/bin/chromium';
  const browser = await chromium.launch(launchOptions);
  const pageErrors = [];
  try {
    const desktop = await browser.newContext({viewport:{width:1280,height:900}});
    const page = await desktop.newPage(); page.setDefaultTimeout(6000); page.on('pageerror', e=>pageErrors.push(e.message));
    await goto(page, url);
    ok(await page.locator('.bottom-nav').isHidden(), 'desktop: navigasi bawah tidak menggantikan navigasi desktop');
    await page.locator('.nav-link[data-page="learn"]').click();
    const topics = ['addition','subtraction','multiplication','division','fraction'];
    for (const level of [1,2,3]) {
      for (let i=0; i<topics.length; i++) {
        const id = topics[i];
        await page.evaluate(({id,level})=>{state.page='learn';state.activeLevel=level;state.activeTopic=id;render()}, {id,level});
        const bar = page.locator(`[data-material-progress="${id}"] [role="progressbar"]`);
        ok(Number(await bar.getAttribute('aria-valuenow'))===i+1 && Number(await bar.getAttribute('aria-valuemax'))===5, `level ${level}: progress ${id} menunjuk materi ${i+1} dari 5`);
        ok((await bar.getAttribute('aria-valuetext'))===`Materi ${i+1} dari 5, Level ${level}`, `level ${level}: pembaca layar mendapat posisi materi ${id}`);
        ok((await page.locator(`[data-material-progress="${id}"]`).innerText()).includes(`Materi ${i+1} dari 5 · Level ${level}`), `level ${level}: label visual materi ${id} mengikuti level aktif`);
      }
    }

    await page.evaluate(()=>startPretest());
    const questionTopics = await page.evaluate(()=>[...new Set(quiz.questions.map(q=>q.cat))]);
    ok(questionTopics.length===5, 'kuis aktif mencakup seluruh lima jenis soal');
    for (let i=0; i<10; i++) {
      const status = await page.evaluate(()=>({index:quiz.index,answered:quiz.answers.filter(a=>a!==null).length,total:quiz.questions.length}));
      ok(status.index===i && status.answered===i && status.total===10, `soal ${i+1}: indeks dan jumlah jawaban tersimpan akurat`);
      ok((await page.locator('.quiz-top').innerText()).includes(`Soal ${i+1} dari 10`), `soal ${i+1}: nomor dan total terlihat`);
      const bar = page.locator('.quiz-answer-progress[role="progressbar"]');
      ok(Number(await bar.getAttribute('aria-valuenow'))===i && Number(await bar.getAttribute('aria-valuemax'))===10, `soal ${i+1}: progress aksesibel menyatakan ${i} jawaban terisi`);
      ok((await bar.getAttribute('aria-valuetext')).includes(`sedang melihat soal ${i+1}`), `soal ${i+1}: progress aksesibel menyebut posisi aktif`);
      const answer = await page.evaluate(()=>quiz.questions[quiz.index].answer);
      await page.locator(`[data-quiz-answer="${answer}"]`).click();
      ok(Number(await bar.getAttribute('aria-valuenow'))===i+1, `jawaban soal ${i+1}: progress bergerak tepat satu`);
      if (i<9) {
        await page.locator('[data-action="quiz-next"]').click();
        ok(Number(await page.locator('.quiz-answer-progress').getAttribute('aria-valuenow'))===i+1, `navigasi ke soal ${i+2}: progress jawaban tetap akurat`);
      }
    }
    await desktop.close();

    for (const width of [320,360,390]) {
      const context = await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
      const mobile = await context.newPage(); mobile.setDefaultTimeout(6000); mobile.on('pageerror', e=>pageErrors.push(e.message));
      await goto(mobile, url);
      const layout = await mobile.evaluate(()=>{
        const nav=document.querySelector('.bottom-nav'),rect=nav.getBoundingClientRect();
        return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,display:getComputedStyle(nav).display,position:getComputedStyle(nav).position,bottom:rect.bottom,height:rect.height,bodyPadding:parseFloat(getComputedStyle(document.body).paddingBottom),labels:[...nav.querySelectorAll('a span')].map(x=>x.textContent.trim())};
      });
      ok(layout.scrollWidth===width, `${width}px: tidak ada overflow horizontal`);
      ok(layout.display==='grid'&&layout.position==='fixed'&&Math.abs(layout.bottom-820)<1, `${width}px: navigasi bawah tetap di dasar viewport`);
      ok(layout.bodyPadding>=layout.height, `${width}px: ruang scroll halaman melindungi konten dari nav/safe-area`);
      ok(layout.labels.join('|')==='Beranda|Belajar|Bermain|Kuis|Info', `${width}px: kelima tab dan labelnya tersedia`);
      ok(await mobile.locator('.bottom-nav [aria-current="page"]').getAttribute('data-bottom-route')==='home', `${width}px: tab aktif Beranda diumumkan`);

      await mobile.locator('[data-bottom-route="learn"]').focus();
      await mobile.keyboard.press('Enter');
      ok(await mobile.evaluate(()=>state.page==='learn') && await mobile.locator('[data-bottom-route="learn"]').getAttribute('aria-current')==='page', `${width}px: Belajar dapat dibuka dengan keyboard dan menandai tab aktif`);
      await mobile.locator('[data-topic="fraction"]').click();
      const materialBar=mobile.locator('[data-material-progress="fraction"] [role="progressbar"]');
      ok(Number(await materialBar.getAttribute('aria-valuenow'))===5, `${width}px: progress materi tetap tampak pada layar kecil`);
      await mobile.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
      const clearance=await mobile.evaluate(()=>{
        const nav=document.querySelector('.bottom-nav').getBoundingClientRect();
        const cta=document.querySelector('.lesson-card .page-toolbar:last-child').getBoundingClientRect();
        return {navTop:nav.top,ctaBottom:cta.bottom,navPaddingBottom:parseFloat(getComputedStyle(document.querySelector('.bottom-nav')).paddingBottom)};
      });
      ok(clearance.ctaBottom<=clearance.navTop+1, `${width}px: tombol terakhir materi dapat digulir ke atas nav tetap`);
      ok(clearance.navPaddingBottom>=6, `${width}px: nav menyediakan bantalan bawah untuk safe-area`);

      await navClick(mobile,'play');
      ok(await mobile.evaluate(()=>state.page==='play') && await mobile.locator('[data-bottom-route="play"]').getAttribute('aria-current')==='page', `${width}px: tab Bermain menuju papan dan statusnya aktif`);
      await navClick(mobile,'info');
      ok(await mobile.evaluate(()=>state.page==='history') && await mobile.locator('.history-layout').count()===1, `${width}px: tab Info menuju kisah/informasi congklak`);
      await navClick(mobile,'home');
      ok(await mobile.evaluate(()=>state.page==='home'), `${width}px: tab Beranda kembali ke halaman utama`);
      await navClick(mobile,'quiz');
      ok(await mobile.evaluate(()=>state.page==='quiz'&&quiz.kind==='pre'), `${width}px: tab Kuis membuka tes yang sah, bukan halaman kosong`);
      const firstBar=mobile.locator('.quiz-answer-progress');
      ok(Number(await firstBar.getAttribute('aria-valuenow'))===0 && (await mobile.locator('.quiz-top').innerText()).includes('Soal 1 dari 10'), `${width}px: Kuis menampilkan nomor soal serta progress jawaban awal`);
      await mobile.locator('[data-quiz-answer]').first().focus();
      await mobile.keyboard.press('ArrowRight');
      ok(await mobile.locator('[data-quiz-answer][aria-checked="true"]').count()===1 && Number(await firstBar.getAttribute('aria-valuenow'))===1, `${width}px: pilihan soal dapat diakses dengan panah keyboard dan progress terbarui`);
      await context.close();
    }
    ok(pageErrors.length===0, `tidak ada JavaScript page error (${pageErrors.join('; ')})`);
    console.log(`PASS navigation/progress regression (${checks} checks)`);
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(`FAIL navigation/progress regression: ${error.stack||error}`);process.exitCode=1;server.close();});
