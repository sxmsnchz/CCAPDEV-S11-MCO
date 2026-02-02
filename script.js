// MOCK LOGIN STATE (FOR TESTING)
const isLoggedIn = true;
const userRole = "student"; // "student" | "org" | "admin"
const currentUser = "student1";

document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.getElementById("js-lightbox");
    const lightboxImg = lightbox?.querySelector("img");
    const closeLightbox = lightbox?.querySelector(".js-lightbox-close");

    document.querySelectorAll(".lightbox-trigger").forEach(img => {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightbox.classList.remove("hidden");
        });
    });

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

    document.querySelectorAll(".org-post").forEach(post => {
        const actions = post.querySelector(".post-actions");

        if (!actions) return;

        actions.classList.add("hidden");

        if (isLoggedIn && (userRole === "org" || userRole === "admin")) {
            actions.classList.remove("hidden");
        }
    });
    document.querySelectorAll(".edit-post-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const post = btn.closest(".org-post");
            const content = post.querySelector(".post-content");

            const editing = content.isContentEditable;

            if (!editing) {
                content.contentEditable = "true";
                content.focus();
                btn.textContent = "Save";
                content.classList.add("editing");
            } else {
                content.contentEditable = "false";
                btn.textContent = "Edit";
                content.classList.remove("editing");
            }
        });
    });

    document.querySelectorAll(".comment-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
            const comments = btn.nextElementSibling;

            if (!comments) return;

            comments.classList.toggle("hidden");

            btn.textContent = comments.classList.contains("hidden")
                ? "View comments"
                : "Hide comments";
        });
    });

    function applyCommentPermissions(comment) {
        const owner = comment.dataset.owner;
        const actions = comment.querySelector(".comment-actions");

        if (!actions) return;

        actions.classList.add("hidden");

        if (
            isLoggedIn &&
            (owner === currentUser || userRole === "admin")
        ) {
            actions.classList.remove("hidden");
        }

        const editBtn = comment.querySelector(".edit-comment-btn");
        const deleteBtn = comment.querySelector(".delete-comment-btn");
        const text = comment.querySelector(".comment-text");

        editBtn?.addEventListener("click", () => {
            const editing = text.isContentEditable;

            if (!editing) {
                text.contentEditable = "true";
                text.focus();
                editBtn.textContent = "Save";
                text.classList.add("editing");
            } else {
                text.contentEditable = "false";
                editBtn.textContent = "Edit";
                text.classList.remove("editing");
            }
        });

        deleteBtn?.addEventListener("click", () => {
            if (confirm("Delete this comment?")) {
                comment.remove();
            }
        });
    }

    document.querySelectorAll(".comment").forEach(comment => {
        applyCommentPermissions(comment);
    });

});
