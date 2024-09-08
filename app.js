// Local storage for users and products
let users = JSON.parse(localStorage.getItem("users")) || {};
let products = JSON.parse(localStorage.getItem("products")) || [];
let currentUser = null;

// Register a user
function registerUser() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("user-role").value;
    
    if (!users[username]) {
        users[username] = { password, role, coins: role === "consumer" ? 100 : 0, products: [] };
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful!");
        closeModal("register-modal");
    } else {
        alert("Username already exists!");
    }
}

// Login user
function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    
    if (users[username] && users[username].password === password) {
        currentUser = username;
        alert("Login successful!");
        closeModal("login-modal");
        if (users[username].role === "farmer") {
            showFarmerPage();
        } else {
            showConsumerPage();
        }
    } else {
        alert("Invalid credentials!");
    }
}

// Show Farmer Home Page
function showFarmerPage() {
    document.getElementById("farmer-home").style.display = "block";
    document.getElementById("consumer-home").style.display = "none";
    displayFarmerProducts();
    displayFarmerCoins();
}

// Show Consumer Home Page
function showConsumerPage() {
    document.getElementById("consumer-home").style.display = "block";
    document.getElementById("farmer-home").style.display = "none";
    document.getElementById("consumer-coins").innerText = users[currentUser].coins;
    displayProductsForSale();
}

// Add Product (Farmer)
function addProduct() {
    const productName = document.getElementById("product-name").value;
    const productPrice = document.getElementById("product-price").value;
    const productImage = document.getElementById("product-image").files[0];
    
    if (!productName || !productPrice || !productImage) {
        alert("All fields are required!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const product = {
            name: productName,
            price: Number(productPrice),
            farmer: currentUser,
            image: event.target.result
        };
        products.push(product);
        users[currentUser].products.push(product);
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("users", JSON.stringify(users));
        displayFarmerProducts();
        closeModal("add-product-modal");
    };
    reader.readAsDataURL(productImage);
}

// Display Farmer's Products
function displayFarmerProducts() {
    const farmerProducts = users[currentUser].products;
    const productContainer = document.getElementById("farmer-products");
    productContainer.innerHTML = '';
    
    farmerProducts.forEach((product) => {
        productContainer.innerHTML += `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p>Price: ${product.price} coins</p>
                <img src="${product.image}" alt="${product.name}">
            </div>
        `;
    });
}

// Display Farmer Coins
function displayFarmerCoins() {
    const farmer = users[currentUser];
    document.getElementById("farmer-coins").innerText = farmer.coins;
}

// Display Products for Consumer to Buy
function displayProductsForSale() {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = '';
    
    products.forEach((product, index) => {
        productContainer.innerHTML += `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p>Price: ${product.price} coins</p>
                <p>Farmer: ${product.farmer}</p>
                <img src="${product.image}" alt="${product.name}">
                <button onclick="buyProduct(${index})">Buy</button>
            </div>
        `;
    });
}

// Buy Product
// Buy Product
function buyProduct(index) {
  const product = products[index];
  const consumer = users[currentUser];
  const farmer = users[product.farmer];

  if (consumer.coins >= product.price) {
      // Deduct coins from consumer and add to farmer
      consumer.coins -= product.price;
      farmer.coins += product.price;

      // Update users array with new coin balances
      users[currentUser] = consumer;
      users[product.farmer] = farmer;

      // Save updated users to localStorage
      localStorage.setItem("users", JSON.stringify(users));

      // Update UI to reflect the new coin balance for the consumer
      document.getElementById("consumer-coins").innerText = consumer.coins;

      // If the farmer is logged in, update their coin balance as well
      if (product.farmer === currentUser) {
          document.getElementById("farmer-coins").innerText = farmer.coins;
      }

      alert("Product purchased successfully!");
  } else {
      alert("Not enough coins to purchase this product.");
  }
}

// Modal Functions
function showRegisterModal() {
  document.getElementById("register-modal").style.display = "block";
}

function showLoginModal() {
  document.getElementById("login-modal").style.display = "block";
}

function showProductModal() {
  document.getElementById("add-product-modal").style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}
