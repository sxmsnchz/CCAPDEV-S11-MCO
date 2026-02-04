let userInfo = null;

const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const profileMenu = document.getElementById("profileMenu");

document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
});

function initializeMenu() {
    if (typeof auth !== 'undefined') {
        userInfo = auth.getCurrentUser();
    } else {
        console.warn('Auth system not loaded yet');
        userInfo = { isLoggedIn: false };
    }
    
    renderProfileMenu();
    setupEventListeners();
}

function renderProfileMenu() {
    if (!profileDropdown) return;
    
    profileDropdown.innerHTML = "";
    
    if (typeof auth !== 'undefined') {
        userInfo = auth.getCurrentUser();
    }
    
    if (userInfo.isLoggedIn) {
        const userName = userInfo.user.firstName || userInfo.user.orgName || 'User';
        
        profileDropdown.innerHTML = `
        <li><span class="user-welcome" style="padding: 10px 12px; color: #046307; font-weight: 700;">Hello, ${escapeHtml(userName)}</span></li>
        <li><hr style="margin: 5px 0; border-color: #eee;"></li>
        <li><a href="${getProfileLink()}">📱 My Profile</a></li>
        ${userInfo.userType === 'student' ? '<li><a href="index.html#organizations">🏢 Browse Organizations</a></li>' : ''}
        ${userInfo.userType === 'organization' ? '<li><a href="org1.html">📝 Manage Posts</a></li>' : ''}
        ${userInfo.userType === 'admin' ? '<li><a href="profile-admin.html">🛠️ Admin Panel</a></li>' : ''}
        <li><hr style="margin: 5px 0; border-color: #eee;"></li>
        <li><button type="button" id="signOutBtn">🚪 Sign Out</button></li>
        `;

        document.getElementById("signOutBtn")?.addEventListener("click", () => {
            if (typeof auth !== 'undefined') {
                auth.logout();
                userInfo = { isLoggedIn: false };
                
                closeProfileDropdown();
                
                if (window.location.pathname.includes('profile-') || 
                    window.location.pathname.includes('admin')) {
                    window.location.href = 'index.html';
                }
                
                setTimeout(() => {
                    if (typeof auth !== 'undefined') {
                        userInfo = auth.getCurrentUser();
                        renderProfileMenu();
                    }
                }, 100);
                
                alert('You have been signed out.');
            }
        });
    } else {
        profileDropdown.innerHTML = `
        <li><a href="login.html">🔐 Sign In</a></li>
        <li><a href="register.html">📝 Sign Up</a></li>
        <li><hr style="margin: 5px 0; border-color: #eee;"></li>
        <li><a href="index.html#organizations">🏢 Browse Organizations</a></li>
        <li><a href="#faq">❓ FAQ</a></li>
        `;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getProfileLink() {
    if (!userInfo || !userInfo.isLoggedIn) return 'login.html';
    
    switch(userInfo.userType) {
        case 'student': return 'profile-student.html';
        case 'organization': return 'profile-organization.html';
        case 'admin': return 'profile-admin.html';
        default: return 'login.html';
    }
}

function setupEventListeners() {
    profileBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleProfileDropdown();
    });

    document.addEventListener("click", (e) => {
        if (!profileMenu?.contains(e.target)) {
            closeProfileDropdown();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape")
            closeProfileDropdown();
    });
}

function toggleProfileDropdown() {
    profileDropdown.classList.toggle("open");
}

function closeProfileDropdown() {
    profileDropdown.classList.remove("open");
}

const orgLink = document.querySelector('a[href="#organizations"]');
const orgSection = document.getElementById("organizations");

if (orgLink && orgSection) {
  orgLink.addEventListener("click", (e) => {
    e.preventDefault();
    orgSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}

document.addEventListener('click', (e) => {
    if (e.target && e.target.matches('a[href="#faq"]')) {
        e.preventDefault();
        const faqSection = document.getElementById("faq");
        if (faqSection) {
            faqSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
            closeProfileDropdown();
        }
    }
});