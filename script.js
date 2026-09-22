const whatsappNumber = "233240440655";

const products = [
  { name: "Cross Detail Cap", category: "Caps & Hats", color: "Black", image: "images/caps-hats/cross-detail-cap.jpg" },
  { name: "Classic Bulls Cap", category: "Caps & Hats", color: "Black / Red", image: "images/caps-hats/classic-bulls-cap.jpg" },
  { name: "Color Stack Cap", category: "Caps & Hats", color: "Blue / Red / Green", image: "images/caps-hats/color-stack-cap.jpg" },
  { name: "Essential Trucker Cap", category: "Caps & Hats", color: "Black", image: "images/caps-hats/essential-trucker-cap.jpg" },
  { name: "KING Beanie", category: "Caps & Hats", color: "Black / White / Grey", image: "images/caps-hats/king-beanie.jpg" },
  { name: "Retro Runner Sneakers", category: "Shoes", color: "White / Black", image: "images/shoes/retro-runner-sneakers.jpg" },
  { name: "Red Edge Sneakers", category: "Shoes", color: "White / Red", image: "images/shoes/red-edge-sneakers.jpg" },
  { name: "Urban Motion Sneakers", category: "Shoes", color: "Black / White / Green", image: "images/shoes/urban-motion-sneakers.jpg" },
  { name: "Minimal Smile Tee", category: "T-Shirts", color: "White", image: "images/t-shirts/minimal-smile-tee.jpg" },
  { name: "Graphic Street Tee", category: "T-Shirts", color: "Black", image: "images/t-shirts/graphic-street-tee.jpg" },
  { name: "Cross Graphic Tee", category: "T-Shirts", color: "White", image: "images/t-shirts/cross-graphic-tee.jpg" },
  { name: "Classic Black Belt", category: "Accessories", color: "Black", image: "images/accessories/classic-black-belt.jpg" },
  { name: "Flower Link Bracelet", category: "Accessories", color: "Gold / White", image: "images/accessories/flower-link-bracelet.jpg" },
  { name: "Gold Chronograph Watch", category: "Accessories", color: "Gold / Black", image: "images/accessories/gold-chronograph-watch.jpg" },
  { name: "Comic Boom Hoodie", category: "Hoodies", color: "White / Black / Orange", image: "images/hoodies/comic-boom-hoodie.jpg" }
];

const categories = ["Caps & Hats", "Shoes", "T-Shirts", "Hoodies", "Accessories"];
let activeCategory = "All";

function chatOnWhatsApp(productName) {
  const message = encodeURIComponent(`Hello, I'm interested in the ${productName} from CENT Store. Is it available?`);
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}

function makeCard(product) {
  const card = document.createElement("article");
  card.className = "product";
  card.dataset.category = product.category;
  card.dataset.search = `${product.name} ${product.category} ${product.color}`.toLowerCase();
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
    </div>
    <div class="product-info">
      <span class="tag">${product.category}</span>
      <h3>${product.name}</h3>
      <p>${product.color}</p>
      <button class="chat-btn" type="button">Chat on WhatsApp</button>
    </div>`;
  card.querySelector(".chat-btn").addEventListener("click", () => chatOnWhatsApp(product.name));
  return card;
}

function buildSections() {
  const container = document.getElementById("productSections");
  container.innerHTML = "";

  const allSection = document.createElement("section");
  allSection.id = "all-products";
  allSection.className = "category-section";
  allSection.dataset.category = "All";
  allSection.innerHTML = `<div class="section-title"><div><p class="eyebrow">CENT COLLECTION</p><h2>All Products</h2></div><span>15 products</span></div>`;
  const allGrid = document.createElement("div");
  allGrid.className = "grid";
  products.forEach(p => allGrid.appendChild(makeCard(p)));
  allSection.appendChild(allGrid);
  container.appendChild(allSection);

  categories.forEach(category => {
    const items = products.filter(p => p.category === category);
    const section = document.createElement("section");
    section.id = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
    section.className = "category-section";
    section.dataset.category = category;
    section.innerHTML = `<div class="section-title"><div><p class="eyebrow">CENT COLLECTION</p><h2>${category}</h2></div><span>${items.length} products</span></div>`;
    const grid = document.createElement("div");
    grid.className = "grid";
    items.forEach(p => grid.appendChild(makeCard(p)));
    section.appendChild(grid);
    container.appendChild(section);
  });
}

function updateStore() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const sections = document.querySelectorAll(".category-section");
  let totalVisible = 0;

  sections.forEach(section => {
    const sectionCategory = section.dataset.category;
    const categoryAllowed = activeCategory === "All" || sectionCategory === activeCategory;
    let sectionVisible = 0;

    section.querySelectorAll(".product").forEach(card => {
      const matchesSearch = !query || card.dataset.search.includes(query);
      const show = categoryAllowed && matchesSearch;
      card.hidden = !show;
      if (show) sectionVisible++;
    });

    section.hidden = sectionVisible === 0;
    if (sectionVisible > 0) totalVisible += sectionVisible;
  });

  // Only show the All Products section when All is selected and there is no search.
  const allSection = document.getElementById("all-products");
  if (activeCategory === "All" && !query) {
    allSection.hidden = false;
    document.querySelectorAll('.category-section:not(#all-products)').forEach(s => s.hidden = true);
  } else if (activeCategory === "All" && query) {
    allSection.hidden = true;
    categories.forEach(category => {
      const section = [...sections].find(s => s.dataset.category === category);
      if (section) section.hidden = ![...section.querySelectorAll('.product')].some(card => !card.hidden);
    });
  }

  const resultCount = document.getElementById("resultCount");
  resultCount.textContent = query
    ? `${totalVisible} matching product${totalVisible === 1 ? "" : "s"}`
    : activeCategory === "All"
      ? "15 products"
      : `${products.filter(p => p.category === activeCategory).length} products`;

  document.getElementById("noResults").hidden = totalVisible !== 0;
}

function selectCategory(category, shouldScroll = true) {
  activeCategory = category;
  document.querySelectorAll(".filter").forEach(button => {
    button.classList.toggle("active", button.dataset.category === category);
  });
  document.getElementById("searchInput").value = "";
  updateStore();

  if (shouldScroll) {
    const targetId = category === "All"
      ? "shop"
      : category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  buildSections();
  updateStore();

  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => selectCategory(button.dataset.category));
  });

  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");

  searchInput.addEventListener("input", () => {
    // Searching the store searches across every category.
    if (searchInput.value.trim()) {
      activeCategory = "All";
      document.querySelectorAll(".filter").forEach(button => {
        button.classList.toggle("active", button.dataset.category === "All");
      });
    }
    updateStore();
  });

  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    updateStore();
    searchInput.focus();
  });
});
