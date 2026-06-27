/**
 * Test API Helper Script
 * 
 * Cara menggunakan:
 * 1. Buka browser console (F12)
 * 2. Copy paste script ini ke console
 * 3. Jalankan fungsi test yang tersedia
 * 
 * Fungsi yang tersedia:
 * - testAPI() : Test koneksi API dasar
 * - testLogin(email, password) : Test login
 * - testWebsites() : Test fetch websites
 * - testPageSpeeds() : Test fetch page speeds
 * - testAll() : Test semua endpoint
 */

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000/api'
    : 'https://api.itmsci.com/api';

console.log('🚀 API Test Helper loaded!');
console.log('📍 API Base URL:', API_BASE_URL);
console.log('');
console.log('Available commands:');
console.log('  testAPI() - Test basic API connection');
console.log('  testLogin(email, password) - Test login');
console.log('  testWebsites() - Test fetch websites');
console.log('  testPageSpeeds() - Test fetch page speeds');
console.log('  testAll() - Test all endpoints');
console.log('  clearToken() - Clear auth token');
console.log('');

// Helper untuk fetch dengan headers
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');
    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    
    if (token && !options.skipAuth) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        },
        credentials: 'include'
    };
    
    console.log(`📤 Request: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    console.log('📋 Headers:', config.headers);
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        console.log(`📥 Response [${response.status}]:`, data);
        
        return {
            ok: response.ok,
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error('❌ Error:', error);
        return {
            ok: false,
            error: error.message
        };
    }
}

// Test 1: Basic API Connection
window.testAPI = async function() {
    console.log('\n🧪 Test 1: Basic API Connection');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const result = await apiFetch('/test', {
        method: 'GET',
        skipAuth: true
    });
    
    if (result.ok) {
        console.log('✅ API is reachable!');
    } else {
        console.log('❌ API test failed');
    }
    
    return result;
};

// Test 2: Login
window.testLogin = async function(email, password) {
    console.log('\n🧪 Test 2: Login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    
    const result = await apiFetch('/login', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ email, password })
    });
    
    if (result.ok && result.data.token) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        console.log('✅ Login successful! Token saved.');
        console.log('👤 User:', result.data.user);
    } else {
        console.log('❌ Login failed');
    }
    
    return result;
};

// Test 3: Fetch Websites
window.testWebsites = async function() {
    console.log('\n🧪 Test 3: Fetch Websites');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.log('⚠️  No auth token found. Please login first.');
        console.log('   Usage: testLogin("your@email.com", "yourpassword")');
        return;
    }
    
    const result = await apiFetch('/websites', {
        method: 'GET'
    });
    
    if (result.ok) {
        const count = result.data?.length || 0;
        console.log(`✅ Fetched ${count} websites`);
        
        if (count > 0) {
            console.log('📋 Sample data (first 3):');
            result.data.slice(0, 3).forEach((w, i) => {
                console.log(`   ${i + 1}. [${w.id}] ${w.url} (${w.holding})`);
            });
        } else {
            console.log('⚠️  No websites found in database');
        }
    } else {
        console.log('❌ Failed to fetch websites');
        if (result.status === 401) {
            console.log('   Token might be expired. Try login again.');
        }
    }
    
    return result;
};

// Test 4: Fetch PageSpeeds
window.testPageSpeeds = async function() {
    console.log('\n🧪 Test 4: Fetch PageSpeeds');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.log('⚠️  No auth token found. Please login first.');
        console.log('   Usage: testLogin("your@email.com", "yourpassword")');
        return;
    }
    
    const result = await apiFetch('/page-speeds', {
        method: 'GET'
    });
    
    if (result.ok) {
        const count = result.data?.length || 0;
        console.log(`✅ Fetched ${count} page speeds`);
        
        if (count > 0) {
            console.log('📋 Sample data (first 3):');
            result.data.slice(0, 3).forEach((ps, i) => {
                console.log(`   ${i + 1}. Website ID ${ps.website_id}: Desktop ${ps.desktop_performance_score}, Mobile ${ps.mobile_performance_score}`);
            });
        } else {
            console.log('⚠️  No page speed data found');
            console.log('   Mungkin belum ada website yang di-check');
        }
    } else {
        console.log('❌ Failed to fetch page speeds');
        if (result.status === 401) {
            console.log('   Token might be expired. Try login again.');
        }
    }
    
    return result;
};

// Test All
window.testAll = async function(email, password) {
    console.log('\n🧪 Running All Tests');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Test 1: Basic API
    await testAPI();
    
    // Test 2: Login (if credentials provided)
    if (email && password) {
        await testLogin(email, password);
    } else if (!localStorage.getItem('auth_token')) {
        console.log('\n⚠️  Skipping authenticated tests (no token)');
        console.log('   To test with login: testAll("email@example.com", "password")');
        return;
    }
    
    // Test 3: Websites
    await testWebsites();
    
    // Test 4: PageSpeeds
    await testPageSpeeds();
    
    console.log('\n✅ All tests completed!');
};

// Clear Token
window.clearToken = function() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    console.log('🗑️  Token cleared');
};

// Show current token status
const token = localStorage.getItem('auth_token');
if (token) {
    console.log('🔐 Auth token found:', token.substring(0, 30) + '...');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('👤 User:', user.name || 'Unknown', `(${user.role || 'no role'})`);
} else {
    console.log('🔓 No auth token found');
}

console.log('\n💡 Quick start:');
console.log('   1. testAPI() - Test if API is reachable');
console.log('   2. testLogin("your@email.com", "password") - Login');
console.log('   3. testWebsites() - Check if websites data exists');
console.log('   4. testPageSpeeds() - Check if page speeds data exists');
console.log('');
