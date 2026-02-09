// login simulation to test (replace w hardcoded values later)
const isLoggedIn = true;
const userRole = "org"; // "student" "org" "admin"
const currentUser = "org-au";

//FOR ORG PAGE
document.addEventListener("DOMContentLoaded", () => {

    
    //lightbox
    const lightbox = document.getElementById("js-lightbox");
    const lightboxImg = lightbox?.querySelector("img");
    const closeLightbox = lightbox?.querySelector(".js-lightbox-close");

    function attachLightbox(img) {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightbox.classList.remove("hidden");
        });
    }

    document.querySelectorAll(".lightbox-trigger").forEach(attachLightbox);

    closeLightbox?.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        lightboxImg.src = "";
    });

    lightbox?.addEventListener("click", e => {
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
            lightboxImg.src = "";
        }
    });

    // post visibility
    document.querySelectorAll(".org-post").forEach(post => {
        const actions = post.querySelector(".post-actions");
        if (!actions) return;

        actions.classList.add("hidden");

        if (isLoggedIn && (userRole === "org" || userRole === "admin")) {
            actions.classList.remove("hidden");
        }
    });
    

    //edit/delete post
    function applyPostLogic(post) {
        const editBtn = post.querySelector(".edit-post-btn");
        const deleteBtn = post.querySelector(".delete-post-btn");
        const content = post.querySelector(".post-content");
        const actions = post.querySelector(".post-actions");

        // enforce permissions
        if (!(isLoggedIn && (userRole === "org" || userRole === "admin"))) {
            actions?.classList.add("hidden");
        }

        editBtn?.addEventListener("click", () => {
            const editing = content.isContentEditable;
            content.contentEditable = !editing;
            editBtn.textContent = editing ? "Edit" : "Save";
            content.classList.toggle("editing");
        });

        deleteBtn?.addEventListener("click", () => {
            if (confirm("Delete this post?")) {
                post.remove();
            }
        });

        // comment toggle
        const toggle = post.querySelector(".comment-toggle");
        const comments = post.querySelector(".comments");

        toggle?.addEventListener("click", () => {
            comments.classList.toggle("hidden");
            toggle.textContent = comments.classList.contains("hidden")
                ? "View comments"
                : "Hide comments";
        });
    }

    document.querySelectorAll(".org-post").forEach(applyPostLogic);

    //comment permissions
    function applyCommentPermissions(comment) {
        const owner = comment.dataset.owner;
        const actions = comment.querySelector(".comment-actions");
        const editBtn = comment.querySelector(".edit-comment-btn");
        const deleteBtn = comment.querySelector(".delete-comment-btn");
        const text = comment.querySelector(".comment-text");

        if (!actions) return;

        actions.classList.add("hidden");

        if (isLoggedIn && (owner === currentUser || userRole === "admin")) {
            actions.classList.remove("hidden");
        }
        
        editBtn?.addEventListener("click", () => {
            const editing = text.isContentEditable;
            text.contentEditable = !editing;
            editBtn.textContent = editing ? "Edit" : "Save";
            text.classList.toggle("editing");
        });

        deleteBtn?.addEventListener("click", () => {
            if (confirm("Delete this comment?")) {
                comment.remove();
            }
        });
    }

    document.querySelectorAll(".comment").forEach(applyCommentPermissions);
    
    document.querySelectorAll(".org-post").forEach(post => {
        const addCommentBox = post.querySelector(".add-comment");
        const warning = post.querySelector(".login-warning");
        const submitBtn = post.querySelector(".submit-comment");
        const textarea = post.querySelector(".comment-input");
        const commentsContainer = post.querySelector(".comments");

        // visibility
        if (isLoggedIn) {
            addCommentBox?.classList.remove("hidden");
            warning?.classList.add("hidden");
        } else {
            addCommentBox?.classList.add("hidden");
            warning?.classList.remove("hidden");
        }

        // submit comment
        submitBtn?.addEventListener("click", () => {
            const text = textarea.value.trim();
            if (!text) return;

            const comment = document.createElement("div");
            comment.className = "comment";
            comment.dataset.owner = currentUser;

            comment.innerHTML = `
                <strong>${currentUser}</strong>
                <p class="comment-text">${text}</p>
                <div class="comment-actions hidden">
                    <button class="edit-comment-btn">Edit</button>
                    <button class="delete-comment-btn">Delete</button>
                </div>
            `;

            commentsContainer.appendChild(comment);
            textarea.value = "";

            applyCommentPermissions(comment);
        });
    });

    //create post
    const createBtn = document.getElementById("create-post-btn");
    const modal = document.getElementById("create-post-modal");
    const submitPost = document.getElementById("submit-post");
    const cancelPost = document.getElementById("cancel-post");

    const titleInput = document.getElementById("new-post-title");
    const contentInput = document.getElementById("new-post-content");
    const imageInput = document.getElementById("new-post-image");

    const postsContainer = document.querySelector(".org-posts");

    if (isLoggedIn && (userRole === "org" || userRole === "admin")) {
        createBtn?.classList.remove("hidden");
    }

    createBtn?.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    cancelPost?.addEventListener("click", () => {
        modal.classList.add("hidden");
        titleInput.value = "";
        contentInput.value = "";
        imageInput.value = "";
    });

    submitPost?.addEventListener("click", () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const image = imageInput.value.trim();

        if (!title || !content) {
            alert("Title and content are required.");
            return;
        }

        const post = document.createElement("article");
        post.className = "org-post";

        post.innerHTML = `
            ${image ? `<img src="${image}" class="post-image lightbox-trigger">` : ""}

            <div class="post-header">
                <h3>${title}</h3>
                <div class="post-actions">
                    <button class="edit-post-btn">Edit</button>
                    <button class="delete-post-btn">Delete</button>
                </div>
            </div>

            <span class="post-date">Just now</span>

            <p class="post-content">${content}</p>

            <button class="comment-toggle">View comments</button>
            <div class="comments hidden"></div>
        `;

        postsContainer.prepend(post);

        // attach logic
        applyPostLogic(post);

        // attach lightbox to new image
        post.querySelectorAll(".lightbox-trigger").forEach(attachLightbox);

        modal.classList.add("hidden");
        titleInput.value = "";
        contentInput.value = "";
        imageInput.value = "";
    });

});

// END OF ORG PAGE

// FOR MENU


const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const profileMenu = document.getElementById("profileMenu");

function renderProfileMenu() {
    profileDropdown.innerHTML = "";

    if (isLoggedIn) {
        profileDropdown.innerHTML= `
        <li><button type="button" id="profBtn">Profile</button></li>
        <li><button type="button" id="signOutBtn">Sign Out</button></li>
        `;

        document.getElementById("profBtn").addEventListener("click", () => {
            window.location.href="profile.html";
        });

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
// END OF MENU

//------ START OF REVIEWS PAGE JS PORTION ------

// -- Static user (temp, replace with real login)
const currentUserStudent = {
    id: 1,
    name: "Juan Dela Cruz"
};

let selectedRating = 0;     // user star selection
let reviews = [];           // all submitted reviews
let currentFilter = "all";  // current star filter 

const stars = document.querySelectorAll("#starRating span");  // list of stars
const reviewText = document.getElementById("reviewText");     // user review textbox
const reviewsList = document.getElementById("reviewsList");   // display wall of reviews

// -- Handle star clicks
stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = star.dataset.value;
        updateStars(selectedRating);
    });
});

// -- Fill effect for stars
function updateStars(rating) {
    stars.forEach(star => {
        star.classList.toggle("active", star.dataset.value <= rating);
    });
}

// -- Submit review
document.getElementById("submitReview").addEventListener("click", () => {

    // validation for empty review
    if (!selectedRating || reviewText.value.trim() === "") {
        alert("You cannot leave a review empty. Please provide a review.");
        return;
    }

    // review object format
    const review = {
        user: currentUserStudent.name,
        rating: Number(selectedRating),
        comment: reviewText.value,
        date: new Date().toLocaleDateString()
    };

    // add review to list and update 
    reviews.push(review);
    renderReviews();

    // reset review form
    selectedRating = 0;
    updateStars(0);
    reviewText.value = "";
});

// -- Render review
function renderReviews() {

    // erase all reviews
    reviewsList.innerHTML = "";

    // show all reviews or filtered reviews by stars
    let filteredReviews;
    if (currentFilter === "all") {
        filteredReviews = reviews;
    } else {
        filteredReviews = reviews.filter(function (review) {
            return review.rating === Number(currentFilter);
        });
    }

    // add each review into page
    filteredReviews.forEach(review => {
        const div = document.createElement("div");
        div.className = "review-item";

        div.innerHTML = `
            <strong>${review.user}</strong> • <span>${review.date}</span>
            <div class="review-stars">${"★".repeat(review.rating)}</div>
            <p>${review.comment}</p>
        `;

        reviewsList.appendChild(div);
    });

    updateAverageRating();
}

// -- Average Rating Calculation
function updateAverageRating() {
    const avgEl = document.getElementById("averageRating");    // avg num of stars
    const starsEl = document.getElementById("averageStars");   // star icons 
    const totalEl = document.getElementById("totalReviews");   // total reviews

    // validation if no reviews
    if (reviews.length === 0) {
        avgEl.textContent = "0.0";
        starsEl.innerHTML = "";
        totalEl.textContent = "(0 reviews)";
        return;
    }

    // total stars of all reviews
    let total = 0;
    for (let i = 0; i < reviews.length; i++) {
        total = total + reviews[i].rating;
    }

    // get stars average of all reviews
    const average = (total / reviews.length).toFixed(1);

    // update ui 
    avgEl.textContent = average;
    starsEl.innerHTML = "★".repeat(Math.round(average));
    totalEl.textContent = `(${reviews.length} reviews)`;
}

// -- Star Filter Buttons
const filterButtons = document.querySelectorAll(".rating-filters button");   // all filter buttons
for (let i = 0; i < filterButtons.length; i++) {

    const button = filterButtons[i]; // each single filter button

    button.addEventListener("click", function () {

        // remove active on all buttons
        for (let j = 0; j < filterButtons.length; j++) {
            filterButtons[j].classList.remove("active");
        }

        // add active on clicked button and update reviews based on filter
        button.classList.add("active");
        currentFilter = button.getAttribute("data-filter");
        renderReviews();
    });
}

//------ END OF REVIEWS PAGE JS PORTION ------