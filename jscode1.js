const productDetails = document.getElementById("productDetails");
const productDetail = document.getElementById("productDetail");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");

const product = JSON.parse(localStorage.getItem("productDetail")) || {};

// Show loading spinner
function showLoading() {
  loadingSpinner.style.display = "block";
  errorMessage.style.display = "none";
  productDetails.innerHTML = "";
  productDetail.innerHTML = "";
}

// Hide loading spinner
function hideLoading() {
  loadingSpinner.style.display = "none";
}

// Show error message
function showError() {
  errorMessage.style.display = "block";
  productDetails.innerHTML = "";
  productDetail.innerHTML = "";
}

async function fetchProductDetails() {
  showLoading();
  try {
    // Simulate API fetch delay (useful for testing)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!product || !product.title) {
      throw new Error("Product data not found");
    }

    // Display product image
    productDetails.innerHTML = `
      <div>
        <img src="${product.image}" alt="${product.title}">
      </div>
    `;

    // Display product details
    productDetail.innerHTML = `
      <div>
        <h2>${product.title}</h2>
        <p><b>Price:</b> $${product.price}</p>
        <p><b>Description:</b> ${product.description}</p>
        <div class="cart-buttons">
          <button onclick="alert('added to cart')">Add to Cart</button>
          <button>
            <a href="index.html" style="text-decoration:none;color:white;">Back</a>
          </button>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching product details:", error);
    showError();
  } finally {
    hideLoading();
  }
}

// Like button functionality
let likeCount = 0;
document.getElementById("like-button").addEventListener("click", () => {
  likeCount++;
  document.getElementById("like-count").textContent = likeCount;
});

// Review functionality
const reviewForm = document.getElementById("review-form");
const reviewInput = document.getElementById("review-input");
const reviewsList = document.getElementById("reviews-list");

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const reviewText = reviewInput.value.trim();
  if (reviewText) {
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";
    reviewItem.textContent = reviewText;
    reviewsList.appendChild(reviewItem);
    reviewInput.value = "";
  }
});

// Initialize the app
fetchProductDetails();
