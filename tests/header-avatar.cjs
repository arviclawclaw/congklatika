#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const mime = file => ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp'})[path.extname(file)] || 'application/octet-stream';
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(ROOT, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(ROOT + path.sep) && file !== path.join(ROOT, 'index.html')) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => error ? res.writeHead(404).end('Not found') : res.writeHead(200, {'content-type':mime(file),'cache-control':'no-store'}).end(data));
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const launchOptions = {headless:true,args:process.platform === 'linux' ? ['--no-sandbox'] : []};
  if (process.env.CHROMIUM_PATH) launchOptions.executablePath = process.env.CHROMIUM_PATH;
  else if (fs.existsSync('/usr/bin/chromium')) launchOptions.executablePath = '/usr/bin/chromium';
  const browser = await chromium.launch(launchOptions);
  try {
    for (const testCase of [
      {name:'desktop',width:1280,height:900,mobile:false},
      {name:'ponsel 390px',width:390,height:844,mobile:true},
      {name:'ponsel 320px',width:320,height:800,mobile:true},
    ]) {
      const context = await browser.newContext({viewport:{width:testCase.width,height:testCase.height},isMobile:testCase.mobile,hasTouch:testCase.mobile});
      const page = await context.newPage();
      await page.goto(url, {waitUntil:'domcontentloaded'});
      await page.locator('#header-avatar').waitFor();
      const state = await page.evaluate(() => {
        const button = document.querySelector('.avatar-button');
        const music = document.querySelector('#music-toggle');
        const style = getComputedStyle(button);
        const rect = button.getBoundingClientRect();
        return {
          display:style.display,
          width:rect.width,
          height:rect.height,
          background:style.backgroundColor,
          musicBackground:getComputedStyle(music).backgroundColor,
          resetRadius:getComputedStyle(document.querySelector('#reset-toggle')).borderRadius,
          border:style.borderStyle,
          borderWidth:style.borderWidth,
          borderRadius:style.borderRadius,
          boxShadow:style.boxShadow,
          character:document.querySelector('#header-avatar').textContent.trim(),
          left:rect.left,
          right:rect.right,
          pageWidth:document.documentElement.scrollWidth,
          viewport:innerWidth,
        };
      });
      assert.notEqual(state.display, 'none', `${testCase.name}: avatar header terlihat`);
      assert.equal(state.width, 44, `${testCase.name}: avatar lebarnya 44px`);
      assert.equal(state.height, 44, `${testCase.name}: avatar tingginya 44px dan kotak`);
      assert.equal(state.borderRadius, state.resetRadius, `${testCase.name}: sudut membulat sama persis dengan tombol Reset di sebelahnya`);
      assert.equal(state.background, state.musicBackground, `${testCase.name}: latar menyamai tema dasar tombol Musik`);
      assert.notEqual(state.background, 'rgb(246, 217, 144)', `${testCase.name}: latar kuning lama sudah hilang`);
      assert.equal(state.border, 'solid', `${testCase.name}: batas tombol rapi`);
      assert.equal(state.borderWidth, '1px', `${testCase.name}: tidak ada bingkai tebal/halo`);
      assert.equal(state.boxShadow, 'none', `${testCase.name}: tidak ada ring atau halo bayangan`);
      assert.ok(state.character.length > 0, `${testCase.name}: wajah/karakter tetap tampil`);
      assert.ok(state.left >= -1 && state.right <= testCase.width + 1 && state.pageWidth <= state.viewport, `${testCase.name}: header muat tanpa overflow`);
      console.log(`PASS ${testCase.name}: ${state.width}×${state.height}, bg=${state.background}, radius=${state.borderRadius}, karakter=${state.character}`);
      await context.close();
    }
    console.log('Lulus: avatar header sesuai spesifikasi di desktop dan ponsel.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
