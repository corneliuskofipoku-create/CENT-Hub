const whatsappNumber = "233240440655";

function chatOnWhatsApp(productName) {
  const message = encodeURIComponent(`Hello, I'm interested in the ${productName} from CENT Store. Is it available?`);
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}

document.querySelectorAll(".filter").forEach(link => {
  link.addEventListener("click", function() {
    document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
    this.classList.add("active");
  });
});
