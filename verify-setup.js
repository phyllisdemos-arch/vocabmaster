// Verification script for VocabMaster testing setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying VocabMaster Testing Setup...\n');

const checks = {
  testFiles: [
    'components/__tests__/ClayButton.test.tsx',
    'components/__tests__/Navigation.test.tsx',
    'app/__tests__/page.test.tsx',
  ],
  configFiles: [
    'vitest.config.ts',
    'vitest.setup.ts',
    'jest.config.js',
    'jest.setup.js',
  ],
  packageJson: {
    scripts: ['test', 'test:watch', 'test:coverage', 'test:ui'],
    devDependencies: [
      '@testing-library/react',
      '@testing-library/jest-dom',
      'vitest'
    ]
  }
};

let passed = 0;
let failed = 0;

// Check test files
console.log('📁 Checking test files...');
checks.testFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  if (exists) {
    console.log(`  ✅ ${file}`);
    passed++;
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
    failed++;
  }
});

// Check config files
console.log('\n⚙️  Checking config files...');
checks.configFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  if (exists) {
    console.log(`  ✅ ${file}`);
    passed++;
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
    failed++;
  }
});

// Check package.json
console.log('\n📦 Checking package.json...');
try {
  const pkgPath = path.join(__dirname, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  // Check scripts
  console.log('  Scripts:');
  checks.packageJson.scripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`    ✅ ${script}: ${pkg.scripts[script]}`);
      passed++;
    } else {
      console.log(`    ❌ ${script} - NOT FOUND`);
      failed++;
    }
  });

  // Check devDependencies
  console.log('  Dependencies:');
  const devDeps = pkg.devDependencies || {};
  checks.packageJson.devDependencies.forEach(dep => {
    if (devDeps[dep]) {
      console.log(`    ✅ ${dep}: ${devDeps[dep]}`);
      passed++;
    } else {
      console.log(`    ⚠️  ${dep} - NOT INSTALLED (run npm install)`);
      failed++;
    }
  });
} catch (error) {
  console.log(`  ❌ Error reading package.json: ${error.message}`);
  failed++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n⚠️  Some checks failed. Please run:');
  console.log('   npm install');
  console.log('   npm test');
} else {
  console.log('\n✅ All checks passed! You can now run:');
  console.log('   npm test');
}

console.log('\n📚 For detailed instructions, see TESTING.md\n');
