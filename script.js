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
  { name: "Comic Boom Hoodie", category: "Hoodies", color: "White / Black / Orange", image: "images/hoodies/comic-boom-hoodie.jpg" },
  { name: "Classic Black Belt", category: "Accessories", color: "Black", image: "images/accessories/classic-black-belt.jpg" },
  { name: "Flower Link Bracelet", category: "Accessories", color: "Gold / White", image: "images/accessories/flower-link-bracelet.jpg" },
  { name: "Gold Chronograph Watch", category: "Accessories", color: "Gold / Black", image: "images/accessories/gold-chronograph-watch.jpg" }
];

const categories = ["Caps & Hats", "Shoes", "T-Shirts", "Hoodies", "Accessories"];

const searchAliases = {
  shoe: "shoes",
  shoes: "shoes",
  sneaker: "shoes",
  sneakers: "shoes",
  shirt: "t-shirts",
  tshirt: "t-shirts",
  "t shirt": "t-shirts",
  tee: "t-shirts",
  cap: "caps hats",
  caps: "caps hats",
  hat: "caps hats",
  hats: "caps hats",
  hoodie: "hoodies",
  hoodies: "hoodies",
  watch: "accessories",
watches: "accessories",
accessory: "accessories",
accessories: "accessories",
bracelet: "accessories",
belt: "accessories",
};
let activeCategory = "All";

function chatOnWhatsApp(productName) {
  const message = encodeURIComponent(`Hello, I'm interested in the ${productName} from CENT Store. Is it available?`);
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function makeCard(product) {
  const card = document.createElement("article");
  card.className = "product";
  card.dataset.search = `${product.name} ${product.category} ${product.color} ${product.category === "T-Shirts" ? "tee tshirt t shirt" : ""} ${product.category === "Hoodies" ? "hoodie jacket" : ""}`.toLowerCase();
  card.innerHTML = `
    <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>
    <div class="product-info">
      <span class="tag">${product.category}</span>
      <h3>${product.name}</h3>
      <p>${product.color}</p>
      <button class="chat-btn" type="button">Chat on WhatsApp</button>
    </div>`;
  card.querySelector(".chat-btn").addEventListener("click", () => chatOnWhatsApp(product.name));
  return card;
}

function renderStore() {
  const container = document.getElementById("productSections");
  let query = document.getElementById("searchInput").value.trim().toLowerCase();

Object.keys(searchAliases).forEach(word => {
  if (query === word) {
    query = searchAliases[word];
  }
});
  container.innerHTML = "";
  let visibleTotal = 0;

  const groups = activeCategory === "All" ? ["All", ...categories] : [activeCategory];

  groups.forEach(group => {
    const items = group === "All" ? products : products.filter(p => p.category === group);
    const matches = items.filter(p => !query || `${p.name} ${p.category} ${p.color} ${p.category === "T-Shirts" ? "tee tshirt t shirt" : ""} ${p.category === "Hoodies" ? "hoodie jacket" : ""}`.toLowerCase().includes(query));
    if (!matches.length) return;

    const section = document.createElement("section");
    section.className = "category-section";
    section.id = group === "All" ? "all-products" : slug(group);
    const title = group === "All" ? "All Products" : group;
    section.innerHTML = `<div class="section-title"><div><p class="eyebrow">CENT COLLECTION</p><h2>${title}</h2></div><span>${matches.length} product${matches.length === 1 ? "" : "s"}</span></div>`;
    const grid = document.createElement("div");
    grid.className = "grid";
    matches.forEach(product => grid.appendChild(makeCard(product)));
    section.appendChild(grid);
    container.appendChild(section);
    visibleTotal += matches.length;
  });

  document.getElementById("resultCount").textContent = query
    ? `${visibleTotal} matching product${visibleTotal === 1 ? "" : "s"}`
    : `${products.length} products`;
  document.getElementById("noResults").hidden = visibleTotal !== 0;
}

function selectCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".filter").forEach(button => button.classList.toggle("active", button.dataset.category === category));
  document.getElementById("searchInput").value = "";
  renderStore();
  const target = category === "All" ? document.getElementById("shop") : document.getElementById(slug(category));
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderStore();
  document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => selectCategory(button.dataset.category)));
  const input = document.getElementById("searchInput");
  input.addEventListener("input", () => { activeCategory = "All"; document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.category === "All")); renderStore(); });
  document.getElementById("clearSearch").addEventListener("click", () => { input.value = ""; renderStore(); input.focus(); });
});
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 400 ? "block" : "none";
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

backToTop.style.display = "none";
