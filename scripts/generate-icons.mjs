// Simple PNG icon generator for PWA
// Creates solid color PNG icons with text

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [192, 512];
const iconDir = path.join(__dirname, '../public/icons');

// Ensure directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// For now, copy the SVG as a fallback
const svgPath = path.join(__dirname, '../public/icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');

sizes.forEach(size => {
  const targetPath = path.join(iconDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(targetPath, svgContent);
  console.log(`Created ${size}x${size} icon (SVG)`);
});

console.log('Icons generated successfully!');
console.log('Note: For production, convert SVG to PNG using imagemagick or sharp');
