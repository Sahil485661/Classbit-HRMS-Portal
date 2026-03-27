const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    
    // Listen for all console messages
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('BROWSER ERROR:', msg.text());
        }
    });

    // Listen for thrown exceptions
    page.on('pageerror', error => {
        console.log('UNCAUGHT EXCEPTION:', error.message);
    });

    // Listen for failed network requests
    page.on('requestfailed', request => {
        console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
    });

    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    
    // Login
    await page.type('input[type="email"]', 'admin@classbit.com'); // We will type the likely superadmin
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(console.error);
    
    // Go to employees list
    await page.goto('http://localhost:5173/employees', { waitUntil: 'networkidle0' });

    // Click the first employee link
    try {
        await page.waitForSelector('.group\\/link', { timeout: 3000 });
        await page.click('.group\\/link');
        
        // Wait to see if error logs
        await page.waitForTimeout(2000);
        console.log('Clicked and navigated.');
    } catch(e) {
        console.log('Could not find employee link to click.');
    }
    
  } catch(e) {
    console.log('Puppeteer script error:', e);
  } finally {
    await browser.close();
  }
})();
