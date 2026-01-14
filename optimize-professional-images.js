/**
 * Professional Images Optimization Script
 * Analyzes, organizes, and optimizes professional images for website use
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'assets', 'professional-images');
const outputDir = path.join(__dirname, 'client', 'src', 'assets', 'professional-images');
const optimizedDir = path.join(outputDir, 'optimized');
const originalDir = path.join(outputDir, 'original');

// Create output directories
[optimizedDir, originalDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Image analysis
function analyzeImages() {
  const files = fs.readdirSync(sourceDir);
  const images = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  
  const analysis = {
    total: images.length,
    duplicates: [],
    sizes: [],
    totalSizeMB: 0,
    categories: {
      headshots: [],
      team: [],
      office: [],
      events: [],
      other: []
    }
  };

  images.forEach(file => {
    const filePath = path.join(sourceDir, file);
    const stats = fs.statSync(filePath);
    const sizeMB = stats.size / (1024 * 1024);
    
    analysis.sizes.push({
      file,
      sizeMB: sizeMB.toFixed(2),
      sizeBytes: stats.size
    });
    
    analysis.totalSizeMB += sizeMB;
    
    // Detect duplicates (same base name)
    const baseName = file.replace(/\(\d+\)/g, '').replace(/\s+/g, '');
    if (analysis.duplicates.find(d => d.base === baseName)) {
      const dup = analysis.duplicates.find(d => d.base === baseName);
      dup.files.push(file);
    } else {
      analysis.duplicates.push({
        base: baseName,
        files: [file]
      });
    }
    
    // Categorize (basic heuristics - can be improved)
    const lowerFile = file.toLowerCase();
    if (lowerFile.includes('headshot') || lowerFile.includes('portrait')) {
      analysis.categories.headshots.push(file);
    } else if (lowerFile.includes('team') || lowerFile.includes('group')) {
      analysis.categories.team.push(file);
    } else if (lowerFile.includes('office') || lowerFile.includes('workspace')) {
      analysis.categories.office.push(file);
    } else if (lowerFile.includes('event') || lowerFile.includes('meeting')) {
      analysis.categories.events.push(file);
    } else {
      analysis.categories.other.push(file);
    }
  });

  return analysis;
}

// Generate optimization report
function generateReport(analysis) {
  const report = {
    summary: {
      totalImages: analysis.total,
      totalSizeMB: analysis.totalSizeMB.toFixed(2),
      averageSizeMB: (analysis.totalSizeMB / analysis.total).toFixed(2),
      duplicatesFound: analysis.duplicates.filter(d => d.files.length > 1).length,
      estimatedOptimizedSizeMB: (analysis.totalSizeMB * 0.2).toFixed(2), // ~80% reduction
      estimatedSavingsMB: (analysis.totalSizeMB * 0.8).toFixed(2)
    },
    duplicates: analysis.duplicates.filter(d => d.files.length > 1),
    categories: analysis.categories,
    recommendations: [
      'Remove duplicate images',
      'Optimize all images to WebP format (80% quality)',
      'Create multiple sizes: thumbnail (300px), medium (800px), large (1200px)',
      'Organize by category for easier management',
      'Use lazy loading for better performance'
    ]
  };

  fs.writeFileSync(
    path.join(__dirname, 'PROFESSIONAL_IMAGES_ANALYSIS.md'),
    `# Professional Images Analysis Report

## Summary
- **Total Images:** ${report.summary.totalImages}
- **Total Size:** ${report.summary.totalSizeMB} MB
- **Average Size:** ${report.summary.averageSizeMB} MB per image
- **Duplicates Found:** ${report.summary.duplicatesFound}
- **Estimated Optimized Size:** ${report.summary.estimatedOptimizedSizeMB} MB (~80% reduction)
- **Estimated Savings:** ${report.summary.estimatedSavingsMB} MB

## Duplicates
${report.duplicates.map(d => `- **${d.base}**: ${d.files.join(', ')}`).join('\n')}

## Categories
- **Headshots:** ${report.categories.headshots.length} images
- **Team Photos:** ${report.categories.team.length} images
- **Office:** ${report.categories.office.length} images
- **Events:** ${report.categories.events.length} images
- **Other:** ${report.categories.other.length} images

## Recommendations
${report.recommendations.map(r => `- ${r}`).join('\n')}

## Next Steps
1. Run image optimization script
2. Remove duplicates
3. Organize into categories
4. Integrate into website components
`
  );

  return report;
}

// Main execution
console.log('Analyzing professional images...');
const analysis = analyzeImages();
const report = generateReport(analysis);

console.log('\n=== Analysis Complete ===');
console.log(`Total Images: ${report.summary.totalImages}`);
console.log(`Total Size: ${report.summary.totalSizeMB} MB`);
console.log(`Duplicates: ${report.summary.duplicatesFound}`);
console.log(`Estimated Optimized Size: ${report.summary.estimatedOptimizedSizeMB} MB`);
console.log('\nReport saved to: PROFESSIONAL_IMAGES_ANALYSIS.md');
