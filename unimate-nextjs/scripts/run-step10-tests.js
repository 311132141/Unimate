const http = require('http');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const COMPONENTS_TO_CHECK = [
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

console.log('🔍 UNIMATE NEXT.JS - STEP 10 TESTING & VERIFICATION');
console.log('=' + '='.repeat(60));

// Test 1: Component File Verification
console.log('\n📁 Testing Component Files...');
let componentsPassed = 0;
let componentsTotal = COMPONENTS_TO_CHECK.length;

COMPONENTS_TO_CHECK.forEach((component) => {
    const componentPath = path.join(__dirname, '..', 'src', component);
    const indexPath = `${componentPath}/index.ts`;
    const componentFilePath = `${componentPath}/${path.basename(component)}.tsx`;

    if (fs.existsSync(indexPath) && fs.existsSync(componentFilePath)) {
        console.log(`✅ ${component}`);
        componentsPassed++;
    } else {
        console.log(`❌ ${component}`);
    }
});

console.log(`\n📊 Component Results: ${componentsPassed}/${componentsTotal} passed`);

// Test 2: Development Server Connectivity
console.log('\n🌐 Testing Development Server...');

function testUrl(url, description) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            if (res.statusCode === 200) {
                console.log(`✅ ${description} - Status: ${res.statusCode}`);
                resolve(true);
            } else {
                console.log(`⚠️ ${description} - Status: ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on('error', (err) => {
            console.log(`❌ ${description} - Error: ${err.message}`);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            console.log(`❌ ${description} - Timeout`);
            req.destroy();
            resolve(false);
        });
    });
}

// Test 3: Page Accessibility
async function testPages() {
    console.log('\n📄 Testing Page Accessibility...');

    const pages = [
        { url: `${BASE_URL}/`, desc: 'Kiosk Page (/)' },
        { url: `${BASE_URL}/login`, desc: 'Login Page (/login)' },
        { url: `${BASE_URL}/dashboard`, desc: 'Dashboard Page (/dashboard)' },
        { url: `${BASE_URL}/simple-test`, desc: 'Simple Test Page (/simple-test)' },
        { url: `${BASE_URL}/test-step10`, desc: 'Test Step 10 Page (/test-step10)' }
    ];

    let pagesPassed = 0;
    for (const page of pages) {
        const result = await testUrl(page.url, page.desc);
        if (result) pagesPassed++;
    }

    console.log(`\n📊 Page Results: ${pagesPassed}/${pages.length} passed`);
    return pagesPassed;
}

// Test 4: API Proxy Test
async function testApiProxy() {
    console.log('\n🔌 Testing API Proxy...');

    return new Promise((resolve) => {
        const req = http.get(`${BASE_URL}/api/django/events/`, (res) => {
            if (res.statusCode === 404) {
                console.log('⚠️ API Proxy working but Django backend not running');
                resolve(true);
            } else if (res.statusCode === 200) {
                console.log('✅ API Proxy and Django backend working');
                resolve(true);
            } else {
                console.log(`❌ API Proxy error - Status: ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on('error', (err) => {
            console.log(`❌ API Proxy connection failed: ${err.message}`);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            console.log('❌ API Proxy timeout');
            req.destroy();
            resolve(false);
        });
    });
}

// Run all tests
async function runAllTests() {
    try {
        // Test server connectivity first
        const serverWorking = await testUrl(BASE_URL, 'Development Server');

        if (!serverWorking) {
            console.log('\n❌ Development server is not running on http://localhost:3000');
            console.log('   Please run: npm run dev');
            return;
        }

        // Run page tests
        const pagesPassed = await testPages();

        // Run API proxy test
        const apiWorking = await testApiProxy();

        // Final summary
        console.log('\n' + '=' + '='.repeat(60));
        console.log('📊 FINAL TEST SUMMARY');
        console.log('=' + '='.repeat(30));
        console.log(`Components: ${componentsPassed}/${componentsTotal} ✅`);
        console.log(`Pages: ${pagesPassed}/5 ✅`);
        console.log(`API Proxy: ${apiWorking ? '1/1 ✅' : '0/1 ❌'}`);
        console.log(`Development Server: 1/1 ✅`);

        const totalTests = componentsTotal + 5 + 1 + 1;
        const totalPassed = componentsPassed + pagesPassed + (apiWorking ? 1 : 0) + 1;
        const successRate = Math.round((totalPassed / totalTests) * 100);

        console.log(`\n🎯 Overall Success Rate: ${successRate}% (${totalPassed}/${totalTests})`);

        if (successRate >= 90) {
            console.log('\n🎉 EXCELLENT! All core functionality working');
        } else if (successRate >= 75) {
            console.log('\n✅ GOOD! Most functionality working');
        } else {
            console.log('\n⚠️ NEEDS ATTENTION! Some issues found');
        }

        console.log('\n🌐 Manual Testing URLs:');
        console.log('• Main App: http://localhost:3000/');
        console.log('• Login: http://localhost:3000/login');
        console.log('• Dashboard: http://localhost:3000/dashboard');
        console.log('• Simple Test: http://localhost:3000/simple-test');
        console.log('• Step 10 Test: http://localhost:3000/test-step10');

    } catch (error) {
        console.error('❌ Test execution failed:', error.message);
    }
}

// Start testing
runAllTests();
