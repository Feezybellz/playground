// scrape.js
const puppeteer = require('puppeteer');
async function scrapeWebsite(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const gotoPage = await page.goto(url);

    // Wait for JavaScript to render the content, increase timeout to 60 seconds
    const elementHandle = await page.waitForSelector('#jm', { timeout: 60000 });

    // Get the content of the element
    const elementContent = await page.evaluate(element => Array.from(element.querySelectorAll('a.core')).map(d=>d.href), elementHandle);

    console.log(elementContent);
    await browser.close();
    return elementContent;
}

module.exports = scrapeWebsite;
