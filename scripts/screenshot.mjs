import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
await p.setViewportSize({ width: 1280, height: 900 });
await p.goto('http://localhost:3002', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.screenshot({ path: '/tmp/light-theme.png' });
await b.close();
console.log('done');
