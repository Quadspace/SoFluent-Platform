/**
 * Create Favicon from So Fluent Logo
 * Crops the logo to include only the icon part (left side) without text
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createFavicon() {
  try {
    // Source logo file (Cherry version - red logo)
    const sourceLogo = path.join(__dirname, 'client/src/assets/branding/logos/PNG/Cherry@3x.png');
    
    if (!fs.existsSync(sourceLogo)) {
      console.error('Logo file not found:', sourceLogo);
      return;
    }

    // Get image metadata to determine dimensions
    const metadata = await sharp(sourceLogo).metadata();
    console.log('Original image dimensions:', metadata.width, 'x', metadata.height);

    // For favicon, we want to crop the left portion (icon only, no text)
    // The icon is typically on the left 1/3 to 1/2 of the image
    // Based on the logo structure, we'll crop to get just the icon portion
    // Taking approximately 30-35% of width to get only the icon (without "SoFluent" text)
    const cropWidth = Math.floor(metadata.width * 0.35); // Take left 35% to get icon only
    const cropHeight = metadata.height; // Full height to maintain aspect ratio
    
    // Create square favicon (32x32, 64x64, 128x128, 256x256)
    const sizes = [32, 64, 128, 256];
    const publicDir = path.join(__dirname, 'client/public');

    for (const size of sizes) {
      await sharp(sourceLogo)
        .extract({
          left: 0,
          top: 0,
          width: Math.floor(cropWidth),
          height: Math.floor(cropHeight)
        })
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
      
      console.log(`Created favicon-${size}x${size}.png`);
    }

    // Create main favicon.png (32x32)
    await sharp(sourceLogo)
      .extract({
        left: 0,
        top: 0,
        width: Math.floor(cropWidth),
        height: Math.floor(cropHeight)
      })
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));

    // Create sofluent-icon.png (192x192 for app icons)
    await sharp(sourceLogo)
      .extract({
        left: 0,
        top: 0,
        width: Math.floor(cropWidth),
        height: Math.floor(cropHeight)
      })
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'sofluent-icon.png'));

    console.log('✅ Favicon files created successfully!');
    console.log('Files created:');
    console.log('  - favicon.png (32x32)');
    console.log('  - sofluent-icon.png (192x192)');
    console.log('  - favicon-32x32.png');
    console.log('  - favicon-64x64.png');
    console.log('  - favicon-128x128.png');
    console.log('  - favicon-256x256.png');
    
  } catch (error) {
    console.error('Error creating favicon:', error);
  }
}

createFavicon();
