/**
 * Complete Professional Images Optimization Script
 * Requires: npm install sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceDir = path.join(__dirname, 'assets', 'professional-images');
const outputDir = path.join(__dirname, 'client', 'src', 'assets', 'professional-images');

// Create output directories
const dirs = {
  optimized: path.join(outputDir, 'optimized'),
  original: path.join(outputDir, 'original'),
  thumbnail: path.join(outputDir, 'optimized', 'thumbnail'),
  medium: path.join(outputDir, 'optimized', 'medium'),
  large: path.join(outputDir, 'optimized', 'large')
};

Object.values(dirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Duplicate detection and removal
function getUniqueImages() {
  const files = fs.readdirSync(sourceDir);
  const images = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  
  const seen = new Map();
  const unique = [];
  const duplicates = [];
  
  images.forEach(file => {
    const baseName = file.replace(/\(\d+\)/g, '').replace(/\s+/g, '').toLowerCase();
    
    if (seen.has(baseName)) {
      duplicates.push(file);
      // Keep the first occurrence, mark others as duplicates
      console.log(`  Duplicate found: ${file} (keeping: ${seen.get(baseName)})`);
    } else {
      seen.set(baseName, file);
      unique.push(file);
    }
  });
  
  return { unique, duplicates };
}

// Optimize single image
async function optimizeImage(filename, sizes = { thumbnail: 300, medium: 800, large: 1200 }) {
  const inputPath = path.join(sourceDir, filename);
  const baseName = path.parse(filename).name;
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    const results = {};
    
    // Generate WebP versions at different sizes
    for (const [sizeName, width] of Object.entries(sizes)) {
      const outputPath = path.join(dirs[sizeName], `${baseName}.webp`);
      
      await image
        .clone()
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      results[sizeName] = {
        path: outputPath,
        sizeKB: (stats.size / 1024).toFixed(2),
        width: width
      };
    }
    
    // Also create a high-quality original backup
    const originalPath = path.join(dirs.original, filename);
    fs.copyFileSync(inputPath, originalPath);
    
    return {
      filename,
      originalSizeMB: (metadata.size / (1024 * 1024)).toFixed(2),
      optimized: results,
      success: true
    };
  } catch (error) {
    console.error(`Error optimizing ${filename}:`, error.message);
    return { filename, success: false, error: error.message };
  }
}

// Generate index file for easy imports
function generateIndexFile(images) {
  const indexContent = `/**
 * Professional Images Index
 * Auto-generated from optimized images
 * 
 * Usage:
 * import { professionalImages } from './assets/professional-images';
 * 
 * <img src={professionalImages.thumbnail['IMG_0005']} />
 */

export const professionalImages = {
  thumbnail: {
${images.map(img => `    '${path.parse(img).name}': require('./optimized/thumbnail/${path.parse(img).name}.webp').default,`).join('\n')}
  },
  medium: {
${images.map(img => `    '${path.parse(img).name}': require('./optimized/medium/${path.parse(img).name}.webp').default,`).join('\n')}
  },
  large: {
${images.map(img => `    '${path.parse(img).name}': require('./optimized/large/${path.parse(img).name}.webp').default,`).join('\n')}
  }
};

// Helper function to get image by name
export const getProfessionalImage = (name, size = 'medium') => {
  return professionalImages[size]?.[name] || professionalImages.medium[name];
};

// List of all available images
export const imageList = [
${images.map(img => `  '${path.parse(img).name}'`).join(',\n')}
];
`;

  fs.writeFileSync(path.join(outputDir, 'index.js'), indexContent);
  console.log('\n✅ Index file generated: client/src/assets/professional-images/index.js');
}

// Main optimization process
async function optimizeAll() {
  console.log('🚀 Starting image optimization...\n');
  
  const { unique, duplicates } = getUniqueImages();
  
  console.log(`📊 Found ${unique.length} unique images`);
  console.log(`🗑️  Found ${duplicates.length} duplicates (will be skipped)\n`);
  
  if (duplicates.length > 0) {
    console.log('Duplicates to skip:');
    duplicates.forEach(dup => console.log(`  - ${dup}`));
    console.log('');
  }
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (let i = 0; i < unique.length; i++) {
    const filename = unique[i];
    process.stdout.write(`\r⏳ Processing ${i + 1}/${unique.length}: ${filename}...`);
    
    const result = await optimizeImage(filename);
    results.push(result);
    
    if (result.success) {
      successCount++;
      totalOriginalSize += parseFloat(result.originalSizeMB);
      
      // Calculate optimized size (use medium as reference)
      const mediumPath = result.optimized.medium.path;
      if (fs.existsSync(mediumPath)) {
        const stats = fs.statSync(mediumPath);
        totalOptimizedSize += stats.size / (1024 * 1024);
      }
    } else {
      failCount++;
    }
  }
  
  console.log('\n\n✅ Optimization complete!');
  console.log(`\n📈 Results:`);
  console.log(`   Success: ${successCount} images`);
  console.log(`   Failed: ${failCount} images`);
  console.log(`   Original Size: ${totalOriginalSize.toFixed(2)} MB`);
  console.log(`   Optimized Size: ${totalOptimizedSize.toFixed(2)} MB`);
  console.log(`   Savings: ${(totalOriginalSize - totalOptimizedSize).toFixed(2)} MB (${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}% reduction)`);
  
  // Generate index file
  generateIndexFile(unique);
  
  // Save results report
  const report = {
    summary: {
      total: unique.length,
      success: successCount,
      failed: failCount,
      duplicates: duplicates.length,
      originalSizeMB: totalOriginalSize.toFixed(2),
      optimizedSizeMB: totalOptimizedSize.toFixed(2),
      savingsMB: (totalOriginalSize - totalOptimizedSize).toFixed(2),
      savingsPercent: ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)
    },
    results: results.filter(r => r.success),
    duplicates: duplicates
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'PROFESSIONAL_IMAGES_OPTIMIZATION_REPORT.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log(`\n📄 Report saved: PROFESSIONAL_IMAGES_OPTIMIZATION_REPORT.json`);
}

// Check if sharp is installed
try {
  require.resolve('sharp');
  optimizeAll().catch(console.error);
} catch (e) {
  console.error('\n❌ Error: sharp package not found!');
  console.log('\n📦 Please install dependencies first:');
  console.log('   npm install sharp');
  console.log('\nThen run: npm run optimize-images');
  process.exit(1);
}
