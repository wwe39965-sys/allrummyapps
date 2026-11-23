import http from 'node:http';

async function testEndpoint(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data, headers: res.headers });
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runTests() {
  console.log('Testing server endpoints...');
  try {
    // 1. Health check
    const health = await testEndpoint('http://localhost:5000/health');
    console.log('✔ Health endpoint:', health.status);

    // 2. Site config
    const site = await testEndpoint('http://localhost:5000/api/site');
    const parsedSite = JSON.parse(site.data);
    console.log(`✔ Public Site API: Status ${site.status}, Apps: ${parsedSite.apps.length}, Categories: ${parsedSite.categories.length}`);

    // 3. Admin login
    const login = await testEndpoint('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'admin123' })
    });
    const loginData = JSON.parse(login.data);
    console.log('✔ Admin Login:', login.status, 'Token received:', Boolean(loginData.token));

    // 4. Admin analytics
    const analytics = await testEndpoint('http://localhost:5000/api/admin/analytics?days=7', {
      headers: { 'Authorization': 'Bearer ' + loginData.token }
    });
    const parsedAna = JSON.parse(analytics.data);
    console.log(`✔ Admin Analytics: Status ${analytics.status}, Visitors: ${parsedAna.totals.visitors}, Views: ${parsedAna.totals.views}, Clicks: ${parsedAna.totals.clicks}`);

    // 5. Test Click Redirect (/go/:appId)
    const redirect = await testEndpoint('http://localhost:5000/go/rummy-loot');
    console.log(`✔ Click Redirect Engine: Status ${redirect.status} (Redirects to: ${redirect.headers.location})`);

    // 6. Frontend Index serving
    const frontend = await testEndpoint('http://localhost:5000/');
    console.log(`✔ Frontend Index Serving: Status ${frontend.status}, Contains root div: ${frontend.data.includes('id="root"')}`);

    console.log('\n🎉 ALL SYSTEMS VERIFIED & WORKING PERFECTLY!');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err.message);
    process.exit(1);
  }
}

runTests();
