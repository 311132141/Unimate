const fs = require('fs');
const path = require('path');

const componentsToCheck = [
    'components/ui/Button',
    'components/ui/Card',
    'components/ui/Modal',
    'components/ui/Input',
    'components/ui/Badge',
    'components/ui/LoadingSpinner',
    'components/ui/StatusMessage',
    'components/layout/Header',
    'components/layout/Sidebar',
    'components/layout/SearchBar',
    'components/features/auth/LoginForm',
    'components/features/auth/LoginModal',
    'components/features/auth/RFIDIndicator',
    'components/features/timetable/TimetableItem',
    'components/features/timetable/EventDetailsModal',
    'components/features/common/EventCard',
];

console.log('🔍 Checking component files...\n');

let allExist = true;
let foundComponents = 0;
let missingComponents = [];

componentsToCheck.forEach((component) => {
    const componentPath = path.join(__dirname, '..', 'src', component);
    const indexPath = `${componentPath}/index.ts`;
    const componentFilePath = `${componentPath}/${path.basename(component)}.tsx`;

    if (fs.existsSync(indexPath) && fs.existsSync(componentFilePath)) {
        console.log(`✅ ${component}`);
        foundComponents++;
    } else {
        console.log(`❌ ${component}`);
        missingComponents.push(component);
        allExist = false;
    }
});

console.log('\n' + '='.repeat(50));
console.log(`📊 COMPONENT VERIFICATION RESULTS:`);
console.log(`✅ Found: ${foundComponents}/${componentsToCheck.length} components`);
console.log(`❌ Missing: ${missingComponents.length} components`);

if (missingComponents.length > 0) {
    console.log('\n🚨 Missing Components:');
    missingComponents.forEach(component => {
        console.log(`   - ${component}`);
    });
}

console.log('\n' + (allExist ? '🎉 All components created successfully!' : '⚠️  Some components are missing - check the list above'));

// Additional checks
console.log('\n🔍 Additional File Checks:');

// Check for essential configuration files
const configFiles = [
    'next.config.ts',
    'tailwind.config.ts',
    'tsconfig.json',
    'package.json',
    '.env.local'
];

configFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file}`);
    }
});

// Check for essential directories
console.log('\n📁 Directory Structure Check:');
const directories = [
    'src/app',
    'src/components',
    'src/lib',
    'src/types',
    'public'
];

directories.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(dirPath)) {
        console.log(`✅ ${dir}/`);
    } else {
        console.log(`❌ ${dir}/`);
    }
});

console.log('\n' + '='.repeat(50));
console.log('🚀 Run "npm run dev" to start the development server');
console.log('🌐 Then test the following pages:');
console.log('   • Login: http://localhost:3004/login');
console.log('   • Dashboard: http://localhost:3004/dashboard');
console.log('   • Kiosk: http://localhost:3004/');
console.log('   • Test Pages: http://localhost:3004/test-step9');
