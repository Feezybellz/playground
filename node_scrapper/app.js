// app.js

// npm install puppeteer
// sudo apt-get install libnss3-dev
// sudo apt-get install libatk-bridge2.0-0
// sudo apt-get install libcups2
// sudo apt-get install libxcomposite1
// sudo apt-get install libxdamage1

// sudo apt-get install \
//     gconf-service \
//     libasound2 \
//     libatk1.0-0 \
//     libcups2 \
//     libdbus-1-3 \
//     libfontconfig1 \
//     libfreetype6 \
//     libgbm1 \
//     libgdk-pixbuf2.0-0 \
//     libglib2.0-0 \
//     libgtk-3-0 \
//     libnspr4 \
//     libnss3 \
//     libpango-1.0-0 \
//     libxcomposite1 \
//     libxdamage1 \
//     libx11-xcb1 \
//     libxext6 \
//     libxfixes3 \
//     libxi6 \
//     libxrandr2 \
//     libxrender1 \
//     libxss1 \
//     libxtst6 \
//     xdg-utils

const scrapper = require("./scrapper.js");

async function main() {
  const url = "https://comety-template.webflow.io/";
  const data = await scrapper(url);
  console.log(data); // Output the scraped data
}

main();
