const apiURL = "https://fakestoreapi.com/products";

const productsContainer = document.getElementById("productsContainer");
const loadMoreBtn = document.getElementById("loadMore");
const categoryContainer = document.getElementById("categoryContainer");
const searchInput = document.getElementById("search");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const sortPrice = document.getElementById("sortPrice");
const homeLink = document.getElementById("homeLink");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");

let allProducts = [];
let filteredProducts = [];
let displayedCount = 0;
const productsPerPage = 10;

// Show loading spinner
function showLoading() {
  loadingSpinner.style.display = "block";
  errorMessage.style.display = "none";
  productsContainer.innerHTML = "";
}

// Hide loading spinner
function hideLoading() {
  loadingSpinner.style.display = "none";
}

// Show error message
function showError() {
  errorMessage.style.display = "block";
  productsContainer.innerHTML = "";
}

// Fetch products from the API
async function fetchProducts() {
  showLoading();
  try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("Network response was not ok");
    allProducts = await response.json();
    populateCategories();
    applyFilters();
  } catch (error) {
    console.error("Error fetching products:", error);
    showError();
  } finally {
    hideLoading();
  }
}

// Populate checkboxes for categories
function populateCategories() {
  const categories = [...new Set(allProducts.map((p) => p.category))];
  categories.forEach((category) => {
    const checkbox = document.createElement("div");
    checkbox.className = "category-checkbox";
    checkbox.innerHTML = `
          <input type="checkbox" class="category-checkbox-input" value="${category}">
          <span>${category}</span>
        `;
    categoryContainer.appendChild(checkbox);
  });

  document.querySelectorAll(".category-checkbox-input").forEach((cb) => {
    cb.addEventListener("change", applyFilters);
  });
}

// Apply filters and update product display
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategories = [
    ...document.querySelectorAll(".category-checkbox-input:checked"),
  ].map((cb) => cb.value);
  const maxPrice = parseFloat(priceRange.value);

  filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategories.length > 0
        ? selectedCategories.includes(product.category)
        : true;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (sortPrice.value === "lowToHigh")
    filteredProducts.sort((a, b) => a.price - b.price);
  if (sortPrice.value === "highToLow")
    filteredProducts.sort((a, b) => b.price - a.price);

  displayedCount = 0;
  displayProducts();
}

// Display products with pagination
function displayProducts() {
  productsContainer.innerHTML = "";

  const slice = filteredProducts.slice(0, displayedCount + productsPerPage);
  slice.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>$${product.price}</p>
        `;

    card.addEventListener("click", () => {
      localStorage.setItem("productDetail", JSON.stringify(product));
      window.location.href = "product.html";
    });

    productsContainer.appendChild(card);
  });

  displayedCount += productsPerPage;
  loadMoreBtn.style.display =
    displayedCount < filteredProducts.length ? "block" : "none";
}

// Reset to home page
homeLink.addEventListener("click", (e) => {
  e.preventDefault();
  fetchProducts();
});

// Event listeners for filters and inputs
loadMoreBtn.addEventListener("click", displayProducts);
searchInput.addEventListener("input", applyFilters);
priceRange.addEventListener("input", () => {
  priceValue.textContent = `$${priceRange.value}`;
  applyFilters();
});
sortPrice.addEventListener("change", applyFilters);

// Initialize the app
fetchProducts();
