const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:8080/admin');
  
  try {
    await page.waitForSelector('button:has-text("Bảng so sánh AI")');
    await page.click('button:has-text("Bảng so sánh AI")');
    await page.waitForTimeout(2000);
  } catch (err) {
    console.log("Could not click:", err);
  }

  await browser.close();
})();
