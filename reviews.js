// -- Static user (temp, replace with real login)
const currentUser = {
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
        user: currentUser.name,
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
