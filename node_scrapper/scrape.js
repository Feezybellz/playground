const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const url = "https://comety-template.webflow.io/";
  const outputDir = "downloaded_website"; // Directory to save the website
  const visitedUrls = new Set(); // Track visited URLs to avoid duplicates

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Launch the browser
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Function to sanitize file paths
  const sanitizeFilePath = (urlPath, resourceType) => {
    // Remove query parameters and hash
    let filePath = urlPath.split("?")[0].split("#")[0];

    // Replace invalid characters with underscores
    filePath = filePath.replace(/[^a-zA-Z0-9\-_./]/g, "_");

    // Ensure the path starts with a valid directory name
    if (!filePath.startsWith("/")) {
      filePath = "/" + filePath;
    }

    // Add .html extension only for pages (HTML documents)
    if (
      resourceType === "document" &&
      !filePath.endsWith(".html") &&
      !filePath.endsWith("/")
    ) {
      filePath += ".html";
    }

    return filePath;
  };

  // Function to save assets
  const saveAsset = async (response) => {
    const request = response.request();
    const resourceType = request.resourceType();
    const url = new URL(request.url());

    // Skip unsupported resources (e.g., base64-encoded data)
    if (url.protocol === "data:") {
      return;
    }

    // Sanitize the file path
    let filePath = sanitizeFilePath(url.pathname, resourceType);

    // If the path ends with a slash, treat it as an index file
    if (filePath.endsWith("/")) {
      filePath = path.join(filePath, "index.html");
    }

    // Create the full path
    const fullPath = path.join(outputDir, filePath);

    // Create directories if they don't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save the file
    if (
      resourceType === "document" ||
      resourceType === "stylesheet" ||
      resourceType === "script" ||
      resourceType === "image" ||
      resourceType === "font"
    ) {
      try {
        const buffer = await response.buffer();
        fs.writeFileSync(fullPath, buffer);
        console.log(`Saved: ${fullPath}`);
      } catch (error) {
        console.error(`Failed to save ${fullPath}:`, error.message);
      }
    }
  };

  // Function to extract and visit all links on the page
  const crawlPage = async (pageUrl) => {
    if (visitedUrls.has(pageUrl)) return; // Skip if already visited
    visitedUrls.add(pageUrl);

    console.log(`Crawling: ${pageUrl}`);
    await page.goto(pageUrl, { waitUntil: "networkidle2" });

    // Save the rendered HTML
    const content = await page.content();
    const urlObj = new URL(pageUrl);
    let filePath = sanitizeFilePath(urlObj.pathname, "document");
    if (filePath.endsWith("/")) {
      filePath = path.join(filePath, "index.html");
    }

    const fullPath = path.join(outputDir, filePath);

    // Create directories if they don't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content);
    console.log(`Saved: ${fullPath}`);

    // Extract all links on the page
    const links = await page.$$eval("a", (anchors) =>
      anchors.map((a) => a.href)
    );

    // Filter and normalize links
    const baseUrl = new URL(pageUrl).origin;
    const relativeLinks = links
      .filter((link) => link.startsWith(baseUrl)) // Keep only same-origin links
      .map((link) => new URL(link).href); // Normalize URLs

    // Recursively crawl each link
    for (const link of relativeLinks) {
      await crawlPage(link);
    }
  };

  // Intercept network requests to save assets
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    request.continue();
  });
  page.on("response", saveAsset);

  // Start crawling from the initial URL
  await crawlPage(url);

  // Close the browser
  await browser.close();

  console.log(`Website downloaded to: ${outputDir}`);
})();
