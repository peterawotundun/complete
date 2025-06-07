document.addEventListener('DOMContentLoaded', () => {
    // Login handler
    document.querySelector('.login .submit-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.querySelector('.login input[type="email"]').value.trim();
        const password = document.querySelector('.login input[type="password"]').value.trim();

        try {
            const res = await fetch('login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                showInfoBox('Logged in successfully!', "success");
                setTimeout(() => {
                    // REDIRECTION LOGIC BASED ON ROLE
                    if (data.role === "admin") {
                        window.location.href = "admin.html"; // Change this to your admin panel page
                    } else {
                        window.location.href = "index.html"; // Change this to your normal user page
                    }
                }, 1200);
            } else {
                showInfoBox(data.error || "Login failed.", "error");
            }
        } catch (error) {
            showInfoBox("Network error. Try again.", "error");
        }
    });
});

// Simple info box display function for feedback
function showInfoBox(message, type = "info") {
    const existing = document.querySelector('.info-box');
    if (existing) existing.remove();

    const box = document.createElement('div');
    box.className = `info-box ${type}`;
    box.textContent = message;
    document.body.appendChild(box);
    setTimeout(() => { box.classList.add('visible'); }, 10);
    setTimeout(() => {
        box.classList.remove('visible');
        setTimeout(() => box.remove(), 400);
    }, 1800);
}