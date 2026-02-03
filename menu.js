let isLoggedIn = false; //temporary

const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const profileMenu = document.getElementById("profileMenu");

function renderProfileMenu() {
    profileDropdown.innerHTML = "";

    if (isLoggedIn) {
        profileDropdown.innerHTML= `
        <li><a href="profile.html">Profile</a></li>
        <li><button type="button" id="signOutBtn">Sign Out</button></li>
        `;

        document.getElementById("signOutBtn").addEventListener("click", () => {
            isLoggedIn = false;
            closeProfileDropdown();
            renderProfileMenu();
        });
    } else {
        profileDropdown.innerHTML = `
        <li><a href="signin.html">Sign In</a></li>
        `;
    }
}

function toggleProfileDropdown() {
    profileDropdown.classList.toggle("open");
}

function closeProfileDropdown() {
    profileDropdown.classList.remove("open");
}

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

renderProfileMenu();

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