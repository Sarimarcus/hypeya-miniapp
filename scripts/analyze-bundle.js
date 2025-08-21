#!/usr/bin/env node
// Bundle size analyzer for Next.js application
// Analyzes webpack bundle size and provides optimization suggestions

const fs = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');

class BundleAnalyzer {
  constructor(buildDir = '.next') {
    this.buildDir = buildDir;
    this.bundleStats = new Map();
    this.recommendations = [];
  }

  async analyze() {
    console.log('🔍 Analyzing bundle size...\n');

    try {
      await this.analyzeBuildManifest();
      await this.analyzeStaticFiles();
      await this.analyzePages();
      
      this.generateReport();
      this.generateRecommendations();
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      process.exit(1);
    }
  }

  async analyzeBuildManifest() {
    const manifestPath = path.join(this.buildDir, 'build-manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error('Build manifest not found. Run `npm run build` first.');
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Analyze main bundles
    for (const [page, files] of Object.entries(manifest.pages)) {
      const pageSize = await this.calculatePageSize(files);
      this.bundleStats.set(page, pageSize);
    }
  }

  async calculatePageSize(files) {
    let totalSize = 0;
    let gzippedSize = 0;
    const details = [];

    for (const file of files) {
      const filePath = path.join(this.buildDir, 'static', file);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        const size = content.length;
        const gzipped = await gzipSize(content);
        
        totalSize += size;
        gzippedSize += gzipped;
        
        details.push({
          file,
          size: this.formatSize(size),
          gzipped: this.formatSize(gzipped)
        });
      }
    }

    return {
      totalSize,
      gzippedSize,
      details,
      formatted: {
        total: this.formatSize(totalSize),
        gzipped: this.formatSize(gzippedSize)
      }
    };
  }

  async analyzeStaticFiles() {
    const staticDir = path.join(this.buildDir, 'static');
    
    if (!fs.existsSync(staticDir)) return;

    const chunks = path.join(staticDir, 'chunks');
    if (fs.existsSync(chunks)) {
      await this.analyzeChunks(chunks);
    }
  }

  async analyzeChunks(chunksDir) {
    const files = fs.readdirSync(chunksDir, { withFileTypes: true });
    
    for (const file of files) {
      if (file.isFile() && file.name.endsWith('.js')) {
        const filePath = path.join(chunksDir, file.name);
        const content = fs.readFileSync(filePath);
        const size = content.length;
        const gzipped = await gzipSize(content);
        
        this.bundleStats.set(`chunk:${file.name}`, {
          totalSize: size,
          gzippedSize: gzipped,
          formatted: {
            total: this.formatSize(size),
            gzipped: this.formatSize(gzipped)
          }
        });
      }
    }
  }

  async analyzePages() {
    const pagesDir = path.join(this.buildDir, 'server', 'pages');
    
    if (!fs.existsSync(pagesDir)) return;

    // Get static analysis data
    this.analyzePageSizes();
  }

  analyzePageSizes() {
    // Sort pages by size
    const sortedPages = Array.from(this.bundleStats.entries())
      .filter(([key]) => !key.startsWith('chunk:'))
      .sort(([,a], [,b]) => b.gzippedSize - a.gzippedSize);

    console.log('📊 Page Bundle Sizes (gzipped):');
    console.log('═'.repeat(60));

    for (const [page, stats] of sortedPages.slice(0, 10)) {
      const bar = this.createProgressBar(stats.gzippedSize, 250000); // 250KB target
      console.log(`${page.padEnd(30)} ${stats.formatted.gzipped.padStart(8)} ${bar}`);
    }
    console.log();
  }

  generateReport() {
    const totalSize = Array.from(this.bundleStats.values())
      .reduce((sum, stat) => sum + stat.gzippedSize, 0);

    console.log('📈 Bundle Analysis Report');
    console.log('═'.repeat(60));
    console.log(`Total bundle size (gzipped): ${this.formatSize(totalSize)}`);
    console.log(`Number of chunks: ${this.bundleStats.size}`);
    
    // Find largest bundles
    const largest = Array.from(this.bundleStats.entries())
      .sort(([,a], [,b]) => b.gzippedSize - a.gzippedSize)
      .slice(0, 5);

    console.log('\n🔍 Largest bundles:');
    for (const [name, stats] of largest) {
      console.log(`  ${name}: ${stats.formatted.gzipped}`);
    }
    console.log();
  }

  generateRecommendations() {
    console.log('💡 Optimization Recommendations');
    console.log('═'.repeat(60));

    // Check for large pages
    const largePages = Array.from(this.bundleStats.entries())
      .filter(([key, stats]) => !key.startsWith('chunk:') && stats.gzippedSize > 250000);

    if (largePages.length > 0) {
      console.log('⚠️  Large page bundles detected (>250KB gzipped):');
      for (const [page] of largePages) {
        console.log(`  - ${page}: Consider code splitting or lazy loading`);
      }
      console.log();
    }

    // Check for duplicate dependencies
    this.checkDuplicateDependencies();

    // General recommendations
    console.log('🎯 General recommendations:');
    console.log('  - Use dynamic imports for large components');
    console.log('  - Implement route-based code splitting');
    console.log('  - Optimize images with next/image');
    console.log('  - Remove unused dependencies');
    console.log('  - Use tree shaking for libraries');
    console.log('  - Consider using @next/bundle-analyzer for detailed analysis');
    console.log();

    // Performance budget
    this.checkPerformanceBudget();
  }

  checkDuplicateDependencies() {
    // This would require more sophisticated analysis
    // For now, just provide general guidance
    console.log('📦 Dependency optimization:');
    console.log('  - Run `npm ls --depth=0` to check for duplicate packages');
    console.log('  - Consider using webpack-bundle-analyzer for detailed analysis');
    console.log();
  }

  checkPerformanceBudget() {
    const totalSize = Array.from(this.bundleStats.values())
      .reduce((sum, stat) => sum + stat.gzippedSize, 0);

    console.log('🎯 Performance Budget Check:');
    
    const budgets = [
      { name: 'Excellent', limit: 100000, emoji: '🟢' },
      { name: 'Good', limit: 250000, emoji: '🟡' },
      { name: 'Needs Work', limit: 500000, emoji: '🟠' },
      { name: 'Poor', limit: Infinity, emoji: '🔴' }
    ];

    for (const budget of budgets) {
      if (totalSize <= budget.limit) {
        console.log(`  ${budget.emoji} ${budget.name}: ${this.formatSize(totalSize)} / ${this.formatSize(budget.limit)}`);
        break;
      }
    }
    console.log();
  }

  createProgressBar(value, max, width = 20) {
    const percentage = Math.min(value / max, 1);
    const filled = Math.round(percentage * width);
    const empty = width - filled;
    
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const percent = Math.round(percentage * 100);
    
    return `[${bar}] ${percent}%`;
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
}

// CLI usage
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = BundleAnalyzer;
