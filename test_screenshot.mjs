import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('ERROR:', msg.text());
    }
  });

  console.log("Navigating...");
  await page.goto('http://localhost:8080/admin', { waitUntil: 'networkidle2' });
  
  console.log("Clicking...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('so sánh'));
    if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Checking active section...");
  const text = await page.evaluate(() => document.body.innerText);
  if (text.includes('Bảng so sánh AI')) {
    console.log("Comparison section IS VISIBLE!");
  } else {
    console.log("Comparison section IS NOT VISIBLE!");
    console.log("Body text starts with:", text.substring(0, 200).replace(/\n/g, ' '));
  }
  
  await page.screenshot({ path: 'test_admin.png' });
  await browser.close();
})();
