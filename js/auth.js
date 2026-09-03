// ==========================================================================
// SUPABASE CLIENT INITIALIZATION
// ==========================================================================
const SUPABASE_URL = "https://hywlfxlvwqnqbsmrmcbl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1rkSNVU_Dl2j4l2jHgD7aA_3LGqEPbd";

let supabaseClient;
if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error("Supabase SDK CDN failed to load properly. Check your script tag order.");
}

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    // 1. SIGNUP PAGE LOGIC
    if (signupForm) {
        signupForm.addEventListener('submit', handleDirectSignUp);
    }

    // 2. LOGIN PAGE AUTO-FILL & AUTH LOGIC
    if (loginForm) {
        const savedPhone = sessionStorage.getItem('temp_phone');
        const savedPassword = sessionStorage.getItem('temp_password');

        if (savedPhone && savedPassword) {
            const loginPhoneInput = document.getElementById('loginPhoneInput');
            const loginPasswordInput = document.getElementById('loginPasswordInput');

            if (loginPhoneInput) loginPhoneInput.value = savedPhone;
            if (loginPasswordInput) loginPasswordInput.value = savedPassword;

            // Clean up session storage after pre-filling
            sessionStorage.removeItem('temp_phone');
            sessionStorage.removeItem('temp_password');
        }

        loginForm.addEventListener('submit', handleDirectLogin);
    }
});

// Helper Function: Normalize Kenyan Phone numbers (e.g. 0712345678 -> +254712345678)
function normalizePhoneNumber(phone) {
    let clean = phone.replace(/\s+/g, '').replace(/-/g, '');
    if (clean.startsWith('0')) {
        clean = '+254' + clean.slice(1);
    } else if (clean.startsWith('254')) {
        clean = '+' + clean;
    }
    return clean;
}

// Toast Notification Function
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        alert(message);
        return;
    }

    toast.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================================================
// DIRECT SIGNUP (Stores ALL details into 'profiles' table)
// ==========================================================================
async function handleDirectSignUp(e) {
    e.preventDefault();

    if (!supabaseClient) {
        alert("Supabase SDK is not initialized. Please refresh or check CDN connection.");
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const rawName = document.getElementById('nameInput').value;
    const rawPhone = document.getElementById('phoneInput').value;
    const rawPassword = document.getElementById('passwordInput').value;
    const roleElement = document.querySelector('input[name="role"]:checked');

    const name = rawName ? rawName.trim() : '';
    const phone = rawPhone ? normalizePhoneNumber(rawPhone.trim()) : '';
    const password = rawPassword ? rawPassword : '';
    const role = roleElement ? roleElement.value : 'Youth';

    if (!name || !phone || !password) {
        alert("Please fill in all required fields.");
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Creating Account...';
    }

    try {
        // Insert complete profile payload directly into the profiles table
        const { data, error } = await supabaseClient
            .from('profiles')
            .insert([
                {
                    full_name: name,
                    phone: phone,
                    password: password,
                    role: role
                }
            ])
            .select();

        if (error) throw error;

        // Pass credentials via sessionStorage to pre-fill login inputs
        sessionStorage.setItem('temp_phone', phone);
        sessionStorage.setItem('temp_password', password);

        // Redirect user to login page
        window.location.href = 'login.html';

    } catch (err) {
        alert(err.message || 'Error signing up. This phone number might already be registered.');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'CREATE ACCOUNT';
        }
    }
}

// ==========================================================================
// DIRECT LOGIN (Verifies 'phone' and 'password' in 'profiles' table)
// ==========================================================================
async function handleDirectLogin(e) {
    e.preventDefault();

    if (!supabaseClient) {
        alert("Supabase SDK is not initialized.");
        return;
    }

    const loginBtn = document.getElementById('loginBtn');
    const loginPhoneInput = document.getElementById('loginPhoneInput');
    const loginPasswordInput = document.getElementById('loginPasswordInput');

    const phone = loginPhoneInput ? normalizePhoneNumber(loginPhoneInput.value.trim()) : '';
    const password = loginPasswordInput ? loginPasswordInput.value : '';

    if (!phone || !password) {
        alert("Please enter both phone number and password.");
        return;
    }

    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerText = 'Logging in...';
    }

    try {
        // Search table for matching phone and password
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('phone', phone)
            .eq('password', password);

        if (error) throw error;

        // Check if matching account was found
        if (data && data.length > 0) {
            const userProfile = data[0];

            // Persist logged-in user profile details to localStorage for session use
            localStorage.setItem('sda_currentUser', JSON.stringify(userProfile));

            showToast("Successfully logged in!");

            // Redirect to homepage after brief toast animation
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1800);

        } else {
            alert('Invalid phone number or password. Please check your credentials.');
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerText = 'LOG IN';
            }
        }

    } catch (err) {
        alert(err.message || 'Error executing login query.');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerText = 'LOG IN';
        }
    }
}