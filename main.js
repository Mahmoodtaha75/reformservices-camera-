// Security Features
document.addEventListener("keydown", (event) => {
  if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73)) {
    event.preventDefault();
  }
});

document.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("dragstart", (event) => event.preventDefault());
document.addEventListener("copy", (event) => event.preventDefault());

// Service Form Functions
let selectedservice = '';

function openServiceForm(servicename) {
  selectedservice = servicename;
  document.getElementById("serviceFormModal").style.display = "block";
  document.body.classList.add("modal-open");

  let extraField = "";
  if (servicename === "other services" || servicename === "Camera repair") {
    extraField = `
    <label for="otherService">Issue description/Service:</label>
    <textarea name="otherService" id="otherService" required></textarea>
  `;
  }

  document.getElementById("serviceFormContainer").innerHTML = `
  <div class="form-wrapper">
    <h3>Service Request Form: ${servicename}</h3>
    <form id="serviceForm" onsubmit="sendServiceRequestToWhatsApp(event)">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>

      <label for="phone">Phone:</label>
      <input type="tel" id="phone" name="phone" required>

      <label for="address">Address:</label>
      <input type="text" id="address" name="address" required>

      ${extraField}

      <div class="form-buttons">
        <button type="submit" class="btn">Send Service Request</button>
        <button type="button" class="btn" onclick="closeServiceForm()">Close</button>
      </div>
    </form>
  </div>
`;
}

function closeServiceForm() {
  document.getElementById("serviceFormModal").style.display = "none";
  document.body.classList.remove("modal-open");
}

function sendServiceRequestToWhatsApp(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const otherService = document.getElementById("otherService") ?
    document.getElementById("otherService").value : "";

  let message = `*New Service Request*\n\n` +
    `Service Type: ${selectedservice}\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Email: ${email}\n` +
    `Address: ${address}`;

  if (otherService) {
    message += `\n\nIssue Description: ${otherService}`;
  }

  const whatsappURL = `https://wa.me/917204584680?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
  closeServiceForm();
}

// Shopping Cart Functions
const cart = [];
let total = 0;

function addToCart(name, price, installation) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ name, price, installation, qty: 1 });
  }
  total += price + installation;
  updateCart();
  showCartMessage(`${name} added to cart!`);
}

function showCartMessage(text) {
  const cartMessage = document.getElementById("cart-message");
  cartMessage.textContent = text;
  cartMessage.classList.add("show");
  setTimeout(() => cartMessage.classList.remove("show"), 1000);
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const mobileCartItems = document.getElementById("mobile-cart-items");
  const cartTotal = document.getElementById("cart-total");
  const mobileCartTotal = document.getElementById("mobile-cart-total");

  const cartHTML = cart.map(item => `
  <div class="cart-item">
    <div class="cart-item-info">
      <span>${item.name}</span><br>
      <span>Price: ₹${item.price * item.qty}</span><br>
      <span>Installation: ₹${item.installation * item.qty}</span><br>
      <span>Total: ₹${(item.price + item.installation) * item.qty}</span>
    </div>
    <div class="cart-item-controls">
      <button class="qty-btn cart-exception" onclick="decreaseQty('${item.name}')">-</button>
      <span>${item.qty}</span>
      <button class="qty-btn cart-exception" onclick="increaseQty('${item.name}')">+</button>
      <button class="remove-btn" onclick="removeFromCart('${item.name}')">×</button>
    </div>
  </div>
`).join("");

  if (cartItems) cartItems.innerHTML = cartHTML;
  if (mobileCartItems) mobileCartItems.innerHTML = cartHTML;
  if (cartTotal) cartTotal.textContent = `Total: ₹${total}`;
  if (mobileCartTotal) mobileCartTotal.textContent = `Total: ₹${total}`;
}

function sendCartToWhatsApp() {
  if (cart.length === 0) {
    alert("Please add items to cart first");
    return;
  }

  const message = `*New Order Request*\n\n` +
    cart.map(item =>
      `*${item.name}*\n` +
      `Quantity: ${item.qty}\n` +
      `Price: ₹${item.price * item.qty}\n` +
      `Installation: ₹${item.installation * item.qty}\n` +
      `Item Total: ₹${(item.price + item.installation) * item.qty}`
    ).join("\n\n") +
    `\n\n*Grand Total: ₹${total}*`;

  const whatsappUrl = `https://wa.me/917204584680?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
}

function removeFromCart(name) {
  const index = cart.findIndex(item => item.name === name);
  if (index !== -1) {
    total -= (cart[index].price + cart[index].installation) * cart[index].qty;
    cart.splice(index, 1);
    updateCart();
  }
}

function increaseQty(name) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.qty++;
    total += item.price + item.installation;
    updateCart();
  }
}

function decreaseQty(name) {
  const item = cart.find(item => item.name === name);
  if (item && item.qty > 1) {
    item.qty--;
    total -= item.price + item.installation;
    updateCart();
  }
}

// Mobile Cart Panel
document.addEventListener("DOMContentLoaded", () => {
  const slidePage = document.getElementById("slide-page");
  const buyNowButton = document.querySelector(".servicebuynow");
  const closePageButton = document.getElementById("close-page-btn");
  const mobileCartBtn = document.getElementById("mobile-cart-btn");
  const mobileCartPanel = document.getElementById("mobile-cart-panel");

  buyNowButton.addEventListener("click", () => {
    slidePage.classList.add("open");
    document.body.classList.add("modal-open");
    mobileCartBtn.style.display = "flex";
  });

  closePageButton.addEventListener("click", () => {
    slidePage.classList.remove("open");
    document.body.classList.remove("modal-open");
    mobileCartBtn.style.display = "none";
    mobileCartPanel.classList.remove("open"); // Add this line
  });

  mobileCartBtn.addEventListener("click", () => {
    mobileCartPanel.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!mobileCartPanel.contains(e.target) &&
      !mobileCartBtn.contains(e.target) &&
      e.target !== mobileCartBtn &&
      !e.target.classList.contains("cart-exception") &&
      !slidePage.contains(e.target) &&
      !e.target.classList.contains("remove-btn")) {
      mobileCartPanel.classList.remove("open");
    }
  });

  // Initialize add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach(button => {
    button.addEventListener("click", function () {
      const productInfo = this.closest(".product-info");
      const name = productInfo.querySelector("h3").textContent;
      const priceText = productInfo.querySelector(".price").textContent;
      const price = parseInt(priceText.replace(/[^\d]/g, ""));
      const installation = parseInt(this.getAttribute("data-installation-charge"));
      addToCart(name, price, installation);
    });
  });
});


function cartform() {
  if (cart.length === 0) {
    alert("Please add items to cart first");
    return;
  } else {
    const form = `
<div class="product-form">
  <h3>Details</h3>
  <form id="serviceForm" onsubmit="sendCartToWhatsApp(event)">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <label for="phone">Phone:</label>
    <input type="tel" id="phone" name="phone" required>

    <label for="address">Address:</label>
    <input type="text" id="address" name="address" required>

    <label for="selectedItems">Selected Items:</label>
    <textarea id="selectedItems" name="selectedItems" readonly></textarea>

    <div class="form-buttons">
      <button type="submit" class="btn">Place order</button>
      <button type="button" class="btn" onclick="closeServiceFormSlide()">Close</button>
    </div>
  </form>
</div>
`;

    // Append the form to the slide page
    const slidePage = document.getElementById("slide-page");
    const formContainer = document.createElement("div");
    formContainer.innerHTML = form;
    formContainer.classList.add("form-container");
    slidePage.appendChild(formContainer);

    // Populate the selected items field
    const selectedItems = document.getElementById("selectedItems");
    const cartItems = cart.map(item => `${item.name} x ${item.qty}`).join("\n");
    selectedItems.value = cartItems;
    // Show the form
    formContainer.style.display = "block";
  }

}

function closeServiceFormSlide() {
  const formContainer = document.querySelector(".form-container");
  formContainer.style.display = "none";
  formContainer.remove();
}

// Close the form when the slide page is closed
document.getElementById("close-page-btn").addEventListener("click", closeServiceForm);

document.querySelector('.servicebuynow').addEventListener('click', function () {
  document.getElementById('slide-page').classList.add('open');
  document.body.classList.add("modal-open");
  document.getElementById("mobile-cart-btn").style.display = "flex";
});