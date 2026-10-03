let items = [
  {
    id: 1,
    name: "Casio Calculator",
    category: "Electronics",
    description: "Scientific calculator useful for engineering students.",
    condition: "Good",
    price: 20,
    owner: "Rahul",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6e620?w=600"
  },
  {
    id: 2,
    name: "Engineering Drawing Kit",
    category: "Study Materials",
    description: "Complete drawing kit for engineering drawing.",
    condition: "Like New",
    price: 30,
    owner: "Ananya",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600"
  },
  {
    id: 3,
    name: "Laptop",
    category: "Electronics",
    description: "Laptop available for short-term student use.",
    condition: "Good",
    price: 150,
    owner: "Rahul",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
  },
  {
    id: 4,
    name: "Lab Coat",
    category: "Laboratory",
    description: "Clean laboratory coat for college practicals.",
    condition: "Good",
    price: 15,
    owner: "Rahul",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
  },
  {
    id: 5,
    name: "Travel Bag",
    category: "Travel",
    description: "Useful travel bag for short trips.",
    condition: "Used",
    price: 25,
    owner: "Ananya",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
  }
];

let wishlist = JSON.parse(localStorage.getItem("rrrWishlist")) || [];
let requests = JSON.parse(localStorage.getItem("rrrRequests")) || [];
let myItems = JSON.parse(localStorage.getItem("rrrMyItems")) || [];

let selectedItem = null;


/* PAGE NAVIGATION */

function showPage(pageId) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  if (pageId === "home") {
    displayItems(items);
  }

  if (pageId === "wishlist") {
    displayWishlist();
  }

  if (pageId === "requests") {
    displayRequests();
  }

  if (pageId === "items") {
    displayMyItems();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* DISPLAY ITEMS */

function displayItems(list) {

  const container = document.getElementById("itemsContainer");

  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="card">
        <h3>No items found</h3>
        <p>Try another search or category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => {

    const saved = wishlist.includes(item.id);

    return `
      <div class="item-card">

        <img
          src="${item.image}"
          alt="${item.name}"
          onerror="this.src='https://via.placeholder.com/600x400?text=RRR+Item'"
        >

        <div class="item-content">

          <h3>${item.name}</h3>

          <p>
            <b>Category:</b>
            ${item.category}
          </p>

          <p>
            <b>Condition:</b>
            ${item.condition}
          </p>

          <p>
            <b>Owner:</b>
            ${item.owner}
            <span class="verified">✓</span>
          </p>

          <p class="price">
            ₹${item.price}/day
          </p>

          <button
            class="primary"
            onclick="openItem(${item.id})"
          >
            View
          </button>

          <button
            class="secondary"
            onclick="toggleWishlist(${item.id})"
          >
            ${saved ? "♥ Saved" : "♡ Wishlist"}
          </button>

        </div>
      </div>
    `;

  }).join("");
}


/* SEARCH */

function searchItems() {

  const input = document.getElementById("searchInput");

  if (!input) return;

  const query = input.value.toLowerCase().trim();

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    item.owner.toLowerCase().includes(query)
  );

  displayItems(filtered);
}


/* CATEGORY FILTER */

function filterCategory(category) {

  showPage("home");

  const filtered = items.filter(
    item => item.category === category
  );

  displayItems(filtered);
}


/* OPEN ITEM */

function openItem(id) {

  selectedItem = items.find(item => item.id === id);

  if (!selectedItem) return;

  document.getElementById("modalTitle").textContent =
    selectedItem.name;

  document.getElementById("modalDescription").textContent =
    selectedItem.description;

  document.getElementById("modalCategory").textContent =
    selectedItem.category;

  document.getElementById("modalCondition").textContent =
    selectedItem.condition;

  document.getElementById("modalPrice").textContent =
    selectedItem.price;

  document.getElementById("itemModal").classList.add("show");
}


/* CLOSE ITEM MODAL */

function closeModal() {
  document.getElementById("itemModal").classList.remove("show");
}


/* REQUEST ITEM */

function requestItem(type) {

  if (!selectedItem) return;

  const verified =
    localStorage.getItem("rrrVerified") === "true";

  if (!verified) {

    const confirmVerification = confirm(
      "College ID verification is required before making a Rent/Borrow request.\n\nVerify now?"
    );

    if (confirmVerification) {
      closeModal();
      verifyStudent();
    }

    return;
  }

  const request = {

    id: "RRR-" +
      Date.now().toString().slice(-6),

    itemId: selectedItem.id,

    item: selectedItem.name,

    type: type,

    owner: selectedItem.owner,

    price: selectedItem.price,

    status: "Pending",

    date: new Date().toLocaleString()

  };

  requests.push(request);

  localStorage.setItem(
    "rrrRequests",
    JSON.stringify(requests)
  );

  closeModal();

  alert(
    "Request Submitted Successfully ✓\n\nRequest ID: " +
    request.id
  );

  showPage("requests");
}


/* WISHLIST */

function toggleWishlist(id) {

  if (wishlist.includes(id)) {

    wishlist = wishlist.filter(
      itemId => itemId !== id
    );

  } else {

    wishlist.push(id);

  }

  localStorage.setItem(
    "rrrWishlist",
    JSON.stringify(wishlist)
  );

  displayItems(items);
}


/* DISPLAY WISHLIST */

function displayWishlist() {

  const container =
    document.getElementById("wishlistContainer");

  if (!container) return;

  const savedItems =
    items.filter(item => wishlist.includes(item.id));

  if (savedItems.length === 0) {

    container.innerHTML = `
      <div class="card">
        <h3>Your wishlist is empty ♡</h3>
        <p>Add items you want to rent or borrow.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = savedItems.map(item => `

    <div class="item-card">

      <img
        src="${item.image}"
        alt="${item.name}"
      >

      <div class="item-content">

        <h3>${item.name}</h3>

        <p>${item.category}</p>

        <p class="price">
          ₹${item.price}/day
        </p>

        <button
          class="primary"
          onclick="openItem(${item.id})"
        >
          View
        </button>

        <button
          class="secondary"
          onclick="toggleWishlist(${item.id})"
        >
          Remove ♥
        </button>

      </div>

    </div>

  `).join("");
}


/* DISPLAY REQUESTS */

function displayRequests() {

  const container =
    document.getElementById("requestsContainer");

  if (!container) return;

  if (requests.length === 0) {

    container.innerHTML = `
      <div class="card">
        <h3>No requests yet</h3>
        <p>Your Rent and Borrow requests will appear here.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = requests.map(request => `

    <div class="request-card">

      <h3>${request.item}</h3>

      <p>
        <b>Request ID:</b>
        ${request.id}
      </p>

      <p>
        <b>Type:</b>
        ${request.type}
      </p>

      <p>
        <b>Owner:</b>
        ${request.owner}
      </p>

      <p>
        <b>Status:</b>
        ${request.status}
      </p>

      <p>
        <b>Date:</b>
        ${request.date}
      </p>

    </div>

  `).join("");
}


/* POST ITEM */

function openPostItem() {

  document.getElementById("postModal")
    .classList.add("show");
}


function closePostItem() {

  document.getElementById("postModal")
    .classList.remove("show");
}


function postItem() {

  const name =
    document.getElementById("itemName").value.trim();

  const category =
    document.getElementById("itemCategory").value;

  const description =
    document.getElementById("itemDescription").value.trim();

  const condition =
    document.getElementById("itemCondition").value;

  const price =
    Number(document.getElementById("itemPrice").value);

  const image =
    document.getElementById("itemImage").value.trim();

  if (!name || !description || !price) {

    alert("Please fill all required fields.");

    return;
  }

  const newItem = {

    id: Date.now(),

    name: name,

    category: category,

    description: description,

    condition: condition,

    price: price,

    owner: "You",

    image:
      image ||
      "https://via.placeholder.com/600x400?text=RRR+Item"

  };

  items.unshift(newItem);

  myItems.push(newItem);

  localStorage.setItem(
    "rrrMyItems",
    JSON.stringify(myItems)
  );

  closePostItem();

  document.getElementById("itemName").value = "";
  document.getElementById("itemDescription").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemImage").value = "";

  alert("Item posted successfully ✓");

  showPage("items");
}


/* MY ITEMS */

function displayMyItems() {

  const container =
    document.getElementById("myItems");

  if (!container) return;

  if (myItems.length === 0) {

    container.innerHTML = `
      <div class="card">
        <h3>You haven't posted any items.</h3>
        <p>Click "Post New Item" to share something with students.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = myItems.map(item => `

    <div class="item-card">

      <img
        src="${item.image}"
        alt="${item.name}"
      >

      <div class="item-content">

        <h3>${item.name}</h3>

        <p>${item.category}</p>

        <p class="price">
          ₹${item.price}/day
        </p>

        <p>
          <span class="verified">
            ✓ Your Item
          </span>
        </p>

      </div>

    </div>

  `).join("");
}


/* COLLEGE VERIFICATION */

function verifyStudent() {

  const verified =
    localStorage.getItem("rrrVerified") === "true";

  if (verified) {

    alert(
      "✓ RGUKT Student Verified\n\nYou can now Rent and Borrow items."
    );

    return;
  }

  const studentId = prompt(
    "Enter your RGUKT Student ID / Roll Number:"
  );

  if (!studentId || studentId.trim() === "") {

    alert("Verification cancelled.");

    return;
  }

  const collegeEmail = prompt(
    "Enter your RGUKT college email:"
  );

  if (!collegeEmail || collegeEmail.trim() === "") {

    alert("Verification failed.");

    return;
  }

  if (
    collegeEmail.toLowerCase().includes("@rgukt")
  ) {

    localStorage.setItem(
      "rrrVerified",
      "true"
    );

    alert(
      "✓ RGUKT Student Verified Successfully!"
    );

  } else {

    alert(
      "Verification failed.\nPlease use your RGUKT college email."
    );

  }
}


/* INITIAL LOAD */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    displayItems(items);

    displayWishlist();

    displayRequests();

    displayMyItems();

  }
);
