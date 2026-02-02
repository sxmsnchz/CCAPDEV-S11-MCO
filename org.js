// login simulation to test (replace w hardcoded values later)
const isLoggedIn = true;
const userRole = "org"; // "student" "org" "admin"
const currentUser = "org-au";

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
