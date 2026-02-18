// Simple product catalog
const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Over-ear headphones with noise cancelling.",
    price: 1499,
    category: "electronics",
    image: "images/Headphone.jpg"
  },
  {
    id: 2,
    name: "Smartphone Case",
    description: "Slim protective case for modern phones.",
    price: 199,
    category: "electronics",
    image: "images/phone-case.jpg"
  },
  {
    id: 3,
    name: "Casual T‑Shirt",
    description: "Soft cotton shirt for everyday wear.",
    price: 624,
    category: "fashion",
    image: "images/t-shirt.jpg"
  },
  {
    id: 4,
    name: "Running Sneakers",
    description: "Comfortable sneakers for daily use.",
    price: 1079,
    category: "fashion",
    image: "images/sneakers.jpg"
  },
  {
    id: 5,
    name: "Table Lamp",
    description: "Warm light lamp for your desk.",
    price: 739,
    category: "home",
    image: "images/table-lamp.jpg"
  },
  {
    id: 6,
    name: "Throw Blanket",
    description: "Soft blanket for your sofa or bed.",
    price: 335,
    category: "home",
    image: "images/blanket.jpg"
  },
   {
    id: 7,
    name: "Rolex",
    description: "Precision-crafted watch that defines timeless elegance.",
    price: 500039,
    category: "analog Watch",
    image: "images/Rolex.jpg"
  },
   {
    id: 8,
    name: "Marshall Speaker",
    description:"Powerful sound that brings your music to life.",
    price: 24999,
    category: "electronics",
    image: "images/marshall.jpg"
  },
   {
    id: 9,
    name: "Helmet",
    description: "Reliable protection designed for every ride.",
    price:839,
    category: "automotive",
    image: "images/helmet.jpg"
  },
   {
    id: 10,
    name: "RC-Car",
    description: "High-speed fun packed into a compact machine.",
    price:1039,
    category: "electronics",
    image: "images/rccar.jpg"
  }
];

// State
let filters = {
  search: "",
  category: "all",
  priceMin: 0,
  priceMax: 99999999,
  sortBy: "default"
};

let cart = [];

// Currency formatter for Indian Rupees
const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function getFilteredProducts() {
  return PRODUCTS.filter((p) => {
    if (filters.category !== "all" && p.category !== filters.category) return false;
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const text = (p.name + " " + p.description).toLowerCase();
      if (!text.includes(q)) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === "price-asc") return a.price - b.price;
    if (filters.sortBy === "price-desc") return b.price - a.price;
    return 0;
  });
}

function formatCurrency(value) {
  return INR_FORMATTER.format(value);
}

function getCartTotals() {
  let subtotal = 0;
  cart.forEach((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (product) subtotal += product.price * item.qty;
  });
  return {
    subtotal,
    total: subtotal
  };
}

function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = count;
}

document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("productsGrid");
  const resultsSummary = document.getElementById("resultsSummary");

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const categoryFilter = document.getElementById("categoryFilter");
  const priceMinInput = document.getElementById("priceMin");
  const priceMaxInput = document.getElementById("priceMax");
  const sortSelect = document.getElementById("sortSelect");
  const clearFiltersBtn = document.getElementById("clearFilters");

  const cartButton = document.getElementById("cartButton");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartPanel = document.getElementById("cartPanel");
  const closeCart = document.getElementById("closeCart");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutButton = document.getElementById("checkoutButton");

  const checkoutOverlay = document.getElementById("checkoutOverlay");
  const checkoutModal = document.getElementById("checkoutModal");
  const closeCheckout = document.getElementById("closeCheckout");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutSubtotal = document.getElementById("checkoutSubtotal");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutMessage = document.getElementById("checkoutMessage");

  const heroShopNow = document.getElementById("heroShopNow");
  const yearSpan = document.getElementById("year");

  const contactForm = document.getElementById("contactForm");
  const contactMessage = document.getElementById("contactMessage");

  // Footer year
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Contact form (simple front-end only)
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !message) {
        contactMessage.textContent = "Please fill in all fields.";
        contactMessage.style.color = "#b91c1c";
        return;
      }

      contactMessage.textContent = "Message sent! (demo only)";
      contactMessage.style.color = "#15803d";
      contactForm.reset();
    });
  }

  // Cart helpers bound to this page instance
  function updateCartBadge() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function addToCart(id) {
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, qty: 1 });
    }
    renderCart();
    updateCartBadge();
  }

  function updateCartQty(id, qty) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, qty);
    renderCart();
    updateCartBadge();
  }

  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    renderCart();
    updateCartBadge();
  }

  // Filters
  searchInput.addEventListener("input", () => {
    filters.search = searchInput.value;
    renderProducts();
  });

  searchButton.addEventListener("click", () => {
    searchInput.focus();
  });

  categoryFilter.addEventListener("change", () => {
    filters.category = categoryFilter.value;
    renderProducts();
  });

  priceMinInput.addEventListener("change", () => {
    filters.priceMin = Number(priceMinInput.value) || 0;
    renderProducts();
  });

  priceMaxInput.addEventListener("change", () => {
    filters.priceMax = Number(priceMaxInput.value) || 9999;
    renderProducts();
  });

  sortSelect.addEventListener("change", () => {
    filters.sortBy = sortSelect.value;
    renderProducts();
  });

  clearFiltersBtn.addEventListener("click", () => {
    filters = {
      search: "",
      category: "all",
      priceMin: 0,
      priceMax: 500,
      sortBy: "default"
    };

    searchInput.value = "";
    categoryFilter.value = "all";
    priceMinInput.value = 0;
    priceMaxInput.value = 500;
    sortSelect.value = "default";

    renderProducts();
  });

  // Hero scroll
  heroShopNow.addEventListener("click", () => {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  });

  // Cart open/close
  cartButton.addEventListener("click", () => {
    cartOverlay.classList.remove("hidden");
    cartPanel.classList.remove("hidden");
  });

  closeCart.addEventListener("click", () => {
    cartOverlay.classList.add("hidden");
    cartPanel.classList.add("hidden");
  });

  cartOverlay.addEventListener("click", () => {
    cartOverlay.classList.add("hidden");
    cartPanel.classList.add("hidden");
  });

  // Checkout open/close
  checkoutButton.addEventListener("click", () => {
    if (!cart.length) return;
    cartOverlay.classList.add("hidden");
    cartPanel.classList.add("hidden");
    openCheckout();
  });

  closeCheckout.addEventListener("click", closeCheckoutModal);
  checkoutOverlay.addEventListener("click", closeCheckoutModal);

  function closeCheckoutModal() {
    checkoutOverlay.classList.add("hidden");
    checkoutModal.classList.add("hidden");
    checkoutMessage.textContent = "";
  }

  function openCheckout() {
    checkoutOverlay.classList.remove("hidden");
    checkoutModal.classList.remove("hidden");
    populateCheckoutSummary();
  }

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cart.length) return;

    const formData = new FormData(checkoutForm);
    const name = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const city = String(formData.get("city") || "").trim();

    if (!name || !email || !address || !city) {
      checkoutMessage.textContent = "Please fill in all fields.";
      checkoutMessage.style.color = "#b91c1c";
      return;
    }

    checkoutMessage.textContent = "Order placed successfully!";
    checkoutMessage.style.color = "#15803d";

    cart = [];
    renderCart();
    populateCheckoutSummary();
  });

  // Render products
  function renderProducts() {
    const list = getFilteredProducts();
    productsGrid.innerHTML = "";

    if (!list.length) {
      resultsSummary.textContent = "No products match these filters.";
      return;
    }

    list.forEach((p) => {
      const card = document.createElement("article");
      card.className = "product-card";

      if (p.image) {
        const img = document.createElement("img");
        img.className = "product-image";
        img.src = p.image;
        img.alt = p.name;
        card.appendChild(img);
      }

      const title = document.createElement("h3");
      title.textContent = p.name;
      const category = document.createElement("div");
      category.className = "product-category";
      category.textContent = p.category.charAt(0).toUpperCase() + p.category.slice(1);
      const desc = document.createElement("p");
      desc.className = "product-description";
      desc.textContent = p.description;

      const footer = document.createElement("div");
      footer.className = "product-footer";

      const price = document.createElement("span");
      price.className = "product-price";
      price.textContent = formatCurrency(p.price);

      const addBtn = document.createElement("button");
      addBtn.className = "btn btn-outline btn-icon";
      addBtn.textContent = "Add";
      addBtn.addEventListener("click", () => {
        addToCart(p.id);
        // Show cart so the user sees the item was added
        cartOverlay.classList.remove("hidden");
        cartPanel.classList.remove("hidden");
      });

      footer.appendChild(price);
      footer.appendChild(addBtn);

      card.appendChild(title);
      card.appendChild(category);
      card.appendChild(desc);
      card.appendChild(footer);

      productsGrid.appendChild(card);
    });

    resultsSummary.textContent = `Showing ${list.length} of ${PRODUCTS.length} products`;
  }

  // Render cart
  function renderCart() {
    cartItems.innerHTML = "";

    if (!cart.length) {
      const empty = document.createElement("p");
      empty.className = "muted small";
      empty.textContent = "Your cart is empty.";
      cartItems.appendChild(empty);
    } else {
      cart.forEach((item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        if (!product) return;

        const row = document.createElement("div");
        row.className = "cart-item";

        const info = document.createElement("div");
        info.className = "cart-item-info";
        const nameEl = document.createElement("p");
        nameEl.className = "cart-item-name";
        nameEl.textContent = product.name;
        const details = document.createElement("p");
        details.className = "cart-item-details";
        details.textContent = formatCurrency(product.price);
        info.appendChild(nameEl);
        info.appendChild(details);

        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const qtyControls = document.createElement("div");
        qtyControls.className = "qty-controls";

        const minusBtn = document.createElement("button");
        minusBtn.className = "qty-button";
        minusBtn.textContent = "−";
        minusBtn.addEventListener("click", () => {
          if (item.qty > 1) {
            updateCartQty(item.id, item.qty - 1);
          }
        });

        const qtyValue = document.createElement("span");
        qtyValue.className = "qty-value";
        qtyValue.textContent = String(item.qty);

        const plusBtn = document.createElement("button");
        plusBtn.className = "qty-button";
        plusBtn.textContent = "+";
        plusBtn.addEventListener("click", () => {
          updateCartQty(item.id, item.qty + 1);
        });

        qtyControls.appendChild(minusBtn);
        qtyControls.appendChild(qtyValue);
        qtyControls.appendChild(plusBtn);

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-link";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => removeFromCart(item.id));

        const lineTotal = document.createElement("span");
        lineTotal.textContent = formatCurrency(product.price * item.qty);

        actions.appendChild(qtyControls);
        actions.appendChild(removeBtn);
        actions.appendChild(lineTotal);

        row.appendChild(info);
        row.appendChild(actions);
        cartItems.appendChild(row);
      });
    }

    const totals = getCartTotals();
    cartSubtotal.textContent = formatCurrency(totals.subtotal);
    cartTotal.textContent = formatCurrency(totals.total);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function populateCheckoutSummary() {
    checkoutItems.innerHTML = "";
    if (!cart.length) {
      const msg = document.createElement("p");
      msg.className = "muted small";
      msg.textContent = "Your cart is empty.";
      checkoutItems.appendChild(msg);
    } else {
      cart.forEach((item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        if (!product) return;
        const row = document.createElement("div");
        row.className = "checkout-item-row";
        row.innerHTML = `<span>${product.name} × ${item.qty}</span><span>${formatCurrency(
          product.price * item.qty
        )}</span>`;
        checkoutItems.appendChild(row);
      });
    }

    const totals = getCartTotals();
    checkoutSubtotal.textContent = formatCurrency(totals.subtotal);
    checkoutTotal.textContent = formatCurrency(totals.total);
  }

  // Initial render
  renderProducts();
  renderCart();
});

