const fs = require('fs');
const path = require('path');
const { homepage: BASE_URL } = require('./package.json')

const DIST_DIR = path.join(__dirname, '/dist');
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml')

function walkDir(currentPath, urls = []) {
  const files = fs.readdirSync(currentPath);

  for (const file of files) {
    const fullPath = path.join(currentPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDir(fullPath, urls);
    } else if (file === 'index.html') {
      const urlPath = fullPath.replace(DIST_DIR, '').replace(/\/index\.html$/, '');
      const url = `${BASE_URL}${urlPath}`;
      urls.push(`  <url><loc>${url}</loc></url>`)
    }
  }

  return urls
}

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${walkDir(DIST_DIR).join('\n')}
</urlset>`;

fs.writeFileSync(SITEMAP_PATH, sitemapContent);
console.log('Sitemap generated at', SITEMAP_PATH);
