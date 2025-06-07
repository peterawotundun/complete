// Utility: Show message in a form
function showMsg(id, text, type = "error") {
    const box = document.getElementById(id);
    box.textContent = text;
    box.className = "msg " + type;
    box.style.display = "block";
}

// Utility: Hide message
function hideMsg(id) {
    const box = document.getElementById(id);
    box.textContent = "";
    box.style.display = "none";
}

// Register
document.getElementById('registerForm').onsubmit = async function(e) {
    e.preventDefault();
    hideMsg('registerMsg');
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        showMsg('registerMsg', "All fields are required.");
        return;
    }

    showMsg('registerMsg', "Registering...", "success");
    try {
        const res = await fetch('register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (data.success) {
            showMsg('registerMsg', "Registration successful! Redirecting...", "success");
            setTimeout(() => window.location = "index.html", 1200);
        } else {
            showMsg('registerMsg', data.error || "Registration failed.");
        }
    } catch (err) {
        showMsg('registerMsg', "Network error. Try again.");
    }
};

// Login
document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault();
    hideMsg('loginMsg');
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMsg('loginMsg', "Both fields are required.");
        return;
    }

    showMsg('loginMsg', "Logging in...", "success");
    try {
        const res = await fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
    showMsg('loginMsg', "Login successful! Redirecting...", "success");
    setTimeout(() => {
        if (data.user && data.user.is_admin == 1) {
            window.location = "admin.html";
        } else {
            window.location = "index.html";
        }
    }, 1200);
} else {
    showMsg('loginMsg', data.error || "Login failed.");
}
    } catch (err) {
        showMsg('loginMsg', "Network error. Try again.");
    }
};

// Logout utility (call from any page with a logout button)
async function logout() {
    await fetch('logout.php', { method: 'POST' });
    window.location = "auth.html";
}

// Check session (use on other pages to verify login)
async function isLoggedIn() {
    const res = await fetch('auth_check.php');
    const data = await res.json();
    return data.loggedIn;
}

// Get current user (use on other pages if you want user info)
async function getCurrentUser() {
    const res = await fetch('auth_check.php');
    const data = await res.json();
    return data.loggedIn ? data.user : null;
}