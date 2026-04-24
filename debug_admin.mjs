import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
    }
  });
  page.on('pageerror', error => console.log('PAGE ERROR EVENT:', error.message));

  console.log("Navigating to admin...");
  await page.goto('http://localhost:8080/admin', { waitUntil: 'networkidle2' });
  
  try {
    console.log("Waiting for comparison tab button...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('so sánh'));
      if (btn) btn.click();
      else console.log("Button not found!");
    });
    
    console.log("Clicked! Waiting 3 seconds to capture errors...");
    await new Promise(r => setTimeout(r, 3000));
  } catch (err) {
    console.log("Could not click:", err.message);
  }

  await browser.close();
  console.log("Done.");
})();
